<template>
    <CommonForm ref="formFrameRef" @submit="onSubmit" confirmText="保存">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">

            <el-form-item prop="projectId" label="项目ID">
                <el-input v-model="form.projectId" placeholder="请输入项目ID">
                </el-input>
            </el-form-item>

            <el-form-item prop="accessToken" label="访问令牌">
                <el-input type="password" v-model="form.accessToken" placeholder="请输入令牌" show-password>
                </el-input>
            </el-form-item>

        </el-form>
    </CommonForm>
</template>


<script setup lang="ts">
import CommonForm from '~/components/CommonForm.vue'
import { useRouter } from 'vue-router'
import { ref, Ref, reactive } from 'vue'
import { ElForm, ElTable } from "element-plus";
import { checkAccessToken } from '~/api/gitlab';

export type ElFormInstance = InstanceType<typeof ElForm>;
export type CommonFormInstance = InstanceType<typeof CommonForm>;


const formRef = ref<ElFormInstance | null>(null)
const formFrameRef = ref<CommonFormInstance | null>(null)

const form = reactive({
    projectId: '',
    accessToken: '',
})

const rules = {
    projectId: [
        { required: true, message: '项目ID不能为空', trigger: 'blur' },
    ],
    accessToken: [
        { required: true, message: '访问令牌不能为空', trigger: 'blur' },
    ]
}

const onSubmit = () => {


    formRef.value && formRef.value.validate((valid?: boolean) => {
        if (valid) {
            formFrameRef.value.showLoading()
            // 请求gitlab，校验有效性然后保存
            checkAccessToken(form.projectId, form.accessToken).then((res) => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                formFrameRef.value.hideLoading()
            })


        }
    })
}
</script>