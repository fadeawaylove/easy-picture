<template>
    <CommonForm ref="formFrameRef" @submit="onSubmit" confirmText="保存">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">

            <el-form-item prop="name" label="仓库名称">
                <el-input v-model="form.name" placeholder="请输入仓库名称（自定义的展示名）" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="projectName" label="项目名">
                <el-input v-model="form.projectName" placeholder="请输入项目名" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="accessToken" label="访问令牌">
                <el-input type="password" v-model="form.accessToken" placeholder="请输入令牌" required show-password clearable
                    class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="branch" label="存储分支">
                <el-input v-model="form.branch" placeholder="请输入存储分支，不填则为main" required clearable class="my-1">
                </el-input>
            </el-form-item>

            <el-form-item prop="path" label="存储路径">
                <el-input v-model="form.path" placeholder="请输入存储路径，不填则为img" required clearable class="my-1">
                </el-input>
            </el-form-item>

        </el-form>


    </CommonForm>
    <div class="flex items-center justify-center mt-2">
        <el-link class="flex"
            @click="browserOpenExternal('https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#%E5%88%9B%E5%BB%BA-personal-access-token-classic')"
            type="info">如何生成访问令牌？</el-link>

    </div>
</template>


<script setup lang="ts">
import CommonForm from '~/components/CommonForm.vue'
import { useRouter } from 'vue-router'
import { ref, Ref, reactive, onMounted, toRaw } from 'vue'
import { ElForm } from "element-plus";
import { checkAccessToken, createBranch } from '~/api/github'
import { toast } from '~/utils/notify';
import { browserOpenExternal } from '~/utils/common'
import { genUUID } from '~/utils/id';
import { saveRepo } from '~/api/localRepo';

export type ElFormInstance = InstanceType<typeof ElForm>;
export type CommonFormInstance = InstanceType<typeof CommonForm>;

const router = useRouter()
const formRef = ref<ElFormInstance | null>(null)
const formFrameRef = ref<CommonFormInstance | null>(null)

const props = defineProps({
    repo: {
        type: Object,
        default: {}
    }
})

interface Form {
    name: string;
    projectName: string;
    owner: string
    accessToken: string;
    branch: string;
    path: string;
    type: string;
    id: string;
}

const form: Ref<Form> = ref(reactive({
    name: '',
    owner: '',
    projectName: '',
    accessToken: '',
    branch: '',
    path: '',
    type: 'GitHub',
    id: genUUID()
}))

const rules = {
    name: [
        { required: true, message: '仓库名称不能为空', trigger: 'blur' },
    ],
    projectName: [
        { required: true, message: '项目名称不能为空', trigger: 'blur' },
    ],
    accessToken: [
        { required: true, message: '访问令牌不能为空', trigger: 'blur' },
    ]
}

onMounted(() => {
    var repo = props.repo
    if (repo.id) {
        var formValue = form.value
        Object.assign(formValue, repo);
        console.log("load form data", formValue)
    }
})


const onSubmit = async () => {
    const isValid = await new Promise((resolve) => {
        if (!formRef.value) { return; }
        formRef.value.validate((valid?: boolean) => {
            resolve(valid);
        });
    });
    if (!isValid) { return }

    formFrameRef.value && formFrameRef.value.showLoading()
    // 请求gitlab，校验有效性然后保存
    var formValue = form.value
    checkAccessToken(formValue.accessToken).then(async (res: any) => {
        const owner = res.login as string
        // 创建分支
        await createBranch({ ...toRaw(formValue), owner })
        // 保存配置
        await saveRepo({ ...toRaw(formValue), owner })
        toast("保存成功！")
        router.push("/storage/list")
    }).catch(err => {
        console.error(err)
    }).finally(() => {
        formFrameRef.value && formFrameRef.value.hideLoading()
    })
}
</script>
<style scoped></style>