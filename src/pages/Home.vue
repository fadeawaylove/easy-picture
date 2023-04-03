<template>
    <div class="flex mb-4 flex justify-center items-center">
        <el-select v-model="repoID" placeholder="选择仓库" clearable filterable @change="changeRepo">
            <el-option v-for="item in repoList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
    </div>

    <div>


        <div class="flex flex-col w-full h-full justify-center items-center border-2 border-dashed border-gray-300 p-1 ">

            <div class="flex flex-col justify-center items-center w-full h-full bg-gray-100 rounded-lg p-5">
                <!-- Your content here -->
                <img src="up-bg.png" class="flex w-10 h-10 mb-4">
                <span class="mb-4">拖拽图片到此处上传</span>
                <el-button @click="selectFileUpload">或者选择图片上传</el-button>
            </div>
        </div>


        <el-button>123</el-button>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { uploadFile } from '~/api/gitlab';
import { getRepoList, getDefaultRepo, getRepoByID, setDefaultRepo, getDefaultRepoID } from '~/api/localRepo';
import { toast } from '~/utils/notify';

const repoID = ref()
const repoList = ref()
const currentRepo = ref()

const selectFileUpload = async () => {
    if (!currentRepo.value) {
        return toast("请选择一个可用的仓库", "warning")
    }

    const filePath = await (window.fileAPI as any).showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '选择图片', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'webp', 'svg', 'ico'] }]
    })
    if (!filePath) {
        return
    }
    var repo = currentRepo.value
    console.log(filePath, repo)

    var res = await uploadFile(repo.projectId, repo.branch || "master", filePath, "gg/9.jpg",repo.accessToken)
    console.log(res)

}

const setCurrentRepo = async () => {
    currentRepo.value = await getDefaultRepo()
}

const changeRepo = async (sid: string) => {
    console.log(sid)
    await setDefaultRepo(sid)
    await setCurrentRepo()
}

onMounted(async () => {
    repoList.value = await getRepoList()
    repoID.value = await getDefaultRepoID()
    await setCurrentRepo()
})


</script>



<style scoped></style>