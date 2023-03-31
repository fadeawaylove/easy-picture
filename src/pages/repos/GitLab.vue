<template>
    <CommonForm ref="formFrameRef" @submit="onSubmit" confirmText="保存">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">

            <el-form-item prop="name" label="仓库名称">
                <el-input v-model="form.name" placeholder="请输入仓库名称（自定义的展示名）" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="projectId" label="项目ID">
                <el-input v-model="form.projectId" placeholder="请输入项目ID" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="accessToken" label="访问令牌">
                <el-input type="password" v-model="form.accessToken" placeholder="请输入令牌" required show-password clearable
                    class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="branch" label="存储分支">
                <el-input v-model="form.branch" placeholder="请输入存储分支，不填则为master" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="path" label="存储路径">
                <el-input v-model="form.branch" placeholder="请输入存储路径，不填则为/img" required clearable class="my-1">
                </el-input>
            </el-form-item>

        </el-form>
    </CommonForm>
</template>


<script setup lang="ts">
import CommonForm from '~/components/CommonForm.vue'
import { useRouter } from 'vue-router'
import { ref, Ref, reactive, toRaw } from 'vue'
import { ElForm, ElTable } from "element-plus";
import { checkAccessToken } from '~/api/gitlab'

export type ElFormInstance = InstanceType<typeof ElForm>;
export type CommonFormInstance = InstanceType<typeof CommonForm>;


const formRef = ref<ElFormInstance | null>(null)
const formFrameRef = ref<CommonFormInstance | null>(null)

const form = reactive({
    name: '123',
    projectId: '42641795',
    accessToken: 'glpat-N5dPNBna8B9k9qax-3ZC',
    branch: '',
    path: ''
})

const rules = {
    name: [
        { required: true, message: '仓库名称不能为空', trigger: 'blur' },
    ],
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
            formFrameRef.value && formFrameRef.value.showLoading()
            // 请求gitlab，校验有效性然后保存
            checkAccessToken(form.projectId, form.accessToken).then((res) => {
                // 1.保存配置
                // window.storeApi.storeSet("test.name", form.name)
                // window.storeApi.storeGet("test.name").then(res => {
                //     console.log(res)
                // })
                (window as any).storeApi.storeGet("repo.list", []).then((repoList: Array<Object>) => {
                    console.log(repoList)
                    repoList.push(toRaw(form));
                    (window as any).storeApi.storeSet("repo.list", repoList)
                })
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                formFrameRef.value && formFrameRef.value.hideLoading()
            })

        }
    })
}
</script>
<style scoped></style>