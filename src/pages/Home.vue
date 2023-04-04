<template>
    <div class="">


        <div class="flex mb-4 flex justify-center items-center ">
            <el-select v-model="repoID" placeholder="选择仓库" clearable filterable @change="changeRepo">
                <el-option v-for="item in repoList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </div>

        <div>
            <div @dragover.prevent @drop="handleDrop"
                class="flex flex-col w-full h-full justify-center items-center border-2 border-dashed border-gray-300 p-1 pb-0">
                <div class="flex flex-col justify-center items-center w-full h-full bg-gray-100 rounded-lg">
                    <img src="up-bg.png" class="flex w-10 h-10 mb-6 mt-4">
                    <span class="mb-6">拖拽图片到此处上传</span>
                    <span class="mb-6">或者</span>

                    <div class="flex">
                        <el-button @click="clipBoardFileUpload" class="mb-2">剪切板上传</el-button>
                        <el-button @click="selectFileUpload" class="mb-2">选择图片上传</el-button>
                    </div>

                </div>
                <el-progress ref="progress" class="w-full mb-1" :text-inside="true" :stroke-width="16"
                    :percentage="percentage" status="success" />
            </div>
        </div>

        <div class="h-380px mt-4 overflow-y-auto">
            <el-scrollbar @scroll="imageScroll" ref="scrollbar">
                <!-- <ul v-infinite-scroll="loadImages" class="infinite-list" style="overflow: auto"> -->
                <el-image class="w-150px h-150px" v-for="{ url } in imagesList" :key="url" :src="url" fit="scale-down" />
                <!-- </ul> -->

            </el-scrollbar>
        </div>


    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { uploadFile, createBranch } from '~/api/gitlab';
import { getRepoList, getDefaultRepo, getRepoByID, setDefaultRepo, getDefaultRepoID, getImagesFromGallary } from '~/api/localRepo';
import { toast } from '~/utils/notify';
import { getFileNameFromPath, readFileAndConvertToBase64 } from '~/utils/common';
import { Callback } from 'element-plus';


const repoID = ref()
const repoList = ref()
const currentRepo = ref()
const progress = ref()
const percentage = ref(0)
const scrollbar = ref()

const imagesList = ref([])
const imageCount = ref(0)
const nowIndex = ref(1)

const isScrollbarAtBottom = (scrollTop, scrollHeight, clientHeight) => {
    const bottomThreshold = 5; // 底部阈值，防止出现误差

    return scrollTop + clientHeight + bottomThreshold >= scrollHeight;
}

const imageScroll = async ({ scrollTop, scrollLeft }: { scrollTop: number, scrollLeft: number }) => {


    // 判断是否滑动到了底部
    const isAtBottom = isScrollbarAtBottom(scrollTop, scrollLeft, 380);
    console.log(isAtBottom)

}

const handleDrop = async (event: DragEvent) => {
    percentage.value = 0
    const files = event.dataTransfer?.files;
    if (!files) {
        return
    }
    const file = files[0]
    const { name: fileName, path: filePath } = file;
    var repo = currentRepo.value
    var fileContent = await readFileAndConvertToBase64(filePath)
    if (!fileContent) {
        return toast("文件内容为空", "warning")
    }
    var res = await uploadFile(repo, fileContent, fileName, undefined, onUploadProgress)
    await navigator.clipboard.writeText(res);
    toast(`上传文件${fileName}成功，文件地址已复制到剪切板`)
    await loadImages()
}

const onUploadProgress = (event: any) => {
    percentage.value = Math.floor(event.loaded * 100 / event.total)
}

const selectFileUpload = async () => {
    percentage.value = 0
    if (!currentRepo.value) {
        return toast("请选择一个可用的仓库", "warning")
    }
    const filePath = await (window as any).fileAPI.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '选择图片', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'webp', 'svg', 'ico'] }]
    })
    if (!filePath) {
        return
    }
    var repo = currentRepo.value
    var fileContent = await readFileAndConvertToBase64(filePath)
    if (!fileContent) {
        return toast("文件内容为空", "warning")
    }
    var fileName = getFileNameFromPath(filePath)
    var res = await uploadFile(repo, fileContent, fileName, undefined, onUploadProgress)
    await navigator.clipboard.writeText(res);
    toast(`上传文件${fileName}成功，文件地址已复制到剪切板`)
    await loadImages()

}

const clipBoardFileUpload = async () => {
    percentage.value = 0
    if (!currentRepo.value) {
        return toast("请选择一个可用的仓库", "warning")
    }
    let a = await (window as any).fileAPI.readClipboardImage()
    console.log(a)

    const { fileName, fileContent } = await (window as any).fileAPI.readClipboardImage()
    if (!fileContent) {
        return toast("文件内容为空", "warning")
    }
    var repo = currentRepo.value
    var res = await uploadFile(repo, fileContent, fileName, undefined, onUploadProgress)
    await navigator.clipboard.writeText(res);
    toast(`上传文件${fileName}成功，文件地址已复制到剪切板`)
    await loadImages()
}

const setCurrentRepo = async () => {
    currentRepo.value = await getDefaultRepo()
}

const changeRepo = async (sid: string) => {
    console.log(sid)
    await setDefaultRepo(sid)
    await setCurrentRepo()
}

const loadImages = async (i = 1) => {
    const { items, total } = await getImagesFromGallary(i);
    imagesList.value = items
    imageCount.value = total
    nowIndex.value = i + 1
}

onMounted(async () => {
    repoList.value = await getRepoList()
    repoID.value = await getDefaultRepoID()
    await setCurrentRepo()
    await loadImages()
})


</script>



<style scoped></style>