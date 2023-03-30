<template>
    <CommonForm ref="formFrameRef" @submit="onSubmit">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
                </el-input>
            </el-form-item>

            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password>
                </el-input>
            </el-form-item>

        </el-form>
    </CommonForm>
</template>


<script setup lang="ts">
import CommonForm from '~/components/CommonForm.vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

// 修改密码

const form = reactive({
    oldpassword: '',
    password: '',
    repassword: ''
})

const formRef = ref(null)
const formFrameRef = ref(null)

const rules = {
    oldpassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
    ],
    repassword: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
    ]
}

const onSubmit = () => {
    formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formFrameRef.value.showLoading()

            formFrameRef.value.hideLoading()
        })
    }
</script>