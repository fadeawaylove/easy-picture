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
                <el-input v-model="form.path" placeholder="请输入存储路径，不填则为/img" required clearable class="my-1">
                </el-input>
            </el-form-item>

        </el-form>
    </CommonForm>
</template>


<script setup lang="ts">
import CommonForm from '~/components/CommonForm.vue'
import { useRouter } from 'vue-router'
import { ref, Ref, reactive, onMounted, onBeforeMount, toRaw } from 'vue'
import { ElForm, ElTable } from "element-plus";
import { checkAccessToken } from '~/api/gitlab'
import { toast } from '~/utils/notify';
import { genUUID } from '~/utils/id';

export type ElFormInstance = InstanceType<typeof ElForm>;
export type CommonFormInstance = InstanceType<typeof CommonForm>;

const router = useRouter()
const formRef = ref<ElFormInstance | null>(null)
const formFrameRef = ref<CommonFormInstance | null>(null)

const props = defineProps({
    sid: {
        type: String,
        default: ""
    }
})

interface Form {
    name: string;
    projectId: string;
    accessToken: string;
    branch: string;
    path: string;
    type: string;
    id: string;
}

const form: Ref<Form> = ref(reactive({
    name: '',
    projectId: '42641795',
    accessToken: 'glpat-N5dPNBna8B9k9qax-3ZC',
    branch: '',
    path: '',
    type: "GitLab",
    id: genUUID()
}))

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

onMounted(() => {

    if (props.sid) {
        (window as any).storeApi.storeGet("repo.list", []).then((repoList: Array<any>) => {
            console.log(props.sid)
            var x = repoList.find((item: any) => item.id === props.sid)
            if (x) {
                var formValue = form.value
                formValue.name = x.name
                formValue.projectId = x.projectId
                formValue.accessToken = x.accessToken
                formValue.branch = x.branch
                formValue.path = x.path
                formValue.type = x.type
                formValue.id = x.id
            }
        })
    }

})


const onSubmit = () => {
    formRef.value && formRef.value.validate((valid?: boolean) => {
        if (valid) {
            formFrameRef.value && formFrameRef.value.showLoading()
            // 请求gitlab，校验有效性然后保存
            var formValue = form.value
            checkAccessToken(formValue.projectId, formValue.accessToken).then((res) => {

                (window as any).storeApi.storeGet("repo.list", []).then((repoList: Array<Form>) => {

                    // 如果有sid,则为编辑，自动填充
                    const index = repoList.findIndex(item => item.id === formValue.id);
                    console.log("仓库id", formValue.id)
                    if (index >= 0) {
                        repoList.splice(index, 1, toRaw(form.value));
                    } else {
                        repoList.unshift(toRaw(form.value))
                    }
                    (window as any).storeApi.storeSet("repo.list", repoList).then(() => {
                        // 保存成功回到列表页
                        toast("保存成功！")
                        router.push("/storage/list")
                    })

                })
            }).catch(err => {
                console.error(err)
            }).finally(() => {
                formFrameRef.value && formFrameRef.value.hideLoading()
            })

        }
    })
}
</script>
<style scoped></style>