<template >
    <div class="upload-home">
        <div>
            <el-image-viewer v-if="payVoucherDialog" @close="closeViewer" :url-list="imagesList.map(item => item.url)"
                :initial-index="imageViewerPosition" />
        </div>

        <div class="flex mb-4 flex justify-center items-center ">
            <el-select v-model="repoID" placeholder="选择仓库" clearable filterable @change="changeRepo" size="small">
                <el-option v-for="item in repoList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </div>

        <el-upload class="" ref="uploadRef" drag action="#" multiple :http-request="handleUpload" accept="image/*"
            :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed" :on-progress="onProgress">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽图片到此上传 或 <em>点击选择图片上传</em>
            </div>
            <div>
                <el-button type="primary" class="mt-4" size="large" text @click.stop="clipBoardUpload">剪切板上传</el-button>
            </div>
        </el-upload>

        <div class="">
            <el-table :data="imagesList" class="w-full" border fit table-layout="auto">

                <el-table-column label="文件名">
                    <template #default="scope">
                        <el-text @click="openViewer(scope.$index)"
                            class="mx-1 text-gray-700 hover:underline cursor-pointer">{{
                                scope.row.name }}</el-text>
                    </template>
                </el-table-column>

                <el-table-column label="上传时间">
                    <template #default="scope">
                        <el-text class="mx-1" type="info" size="small">{{ scope.row.uploadTime }}</el-text>
                    </template>
                </el-table-column>

                <el-table-column label="大小">
                    <template #default="scope">
                        <el-text class="mx-1" type="info" size="small">{{ scope.row.size }}</el-text>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="flex flex-col items-start justify-center">
                            <el-button type="success" text class="!text-green-500 hover:underline"
                                @click="handlerUrlCopy(scope.row)">复制地址</el-button>
                            <el-button type="info" text class=" !text-yellow-500 !m-0 hover:underline"
                                @click="handleOpenInBrowser(scope.row)">浏览器打开</el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <div class="flex items-center justify-center mt-2" v-if="imageLoadCount >= imageTotalCount"><el-text
                    type="info">哦豁，没了~</el-text></div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
import { uploadFile as uploadFileToGitlab } from '~/api/gitlab';
import { uploadFile as uploadFileToGithub } from '~/api/github';
import { getRepoList, getDefaultRepo, setDefaultRepo, getImagesFromGallary, addImageToGallary } from '~/api/localRepo';
import { toast } from '~/utils/notify';
import { formatDateTime, readFileAndConvertToBase64, formatFileSize, writeTextToClipboard, browserOpenExternal } from '~/utils/common';
import { UploadFile, UploadProgressEvent, UploadProps, UploadRawFile, UploadRequestOptions, genFileId, ElMessage } from 'element-plus';

interface Image {
    url: string
    name: string,
    size: number,
    uploadTime: Date
}

const uploadRef = ref()
const repoID = ref()
const repoList = ref()
const currentRepo = ref()
const imagesList = ref<Image[]>([])
const pageIndex = ref(1)
const pageSize = ref(10)
const imageTotalCount = ref(0)
const imageLoadCount = ref(0)
const payVoucherDialog = ref(false)
const imageViewerPosition = ref(0)



const handlerUrlCopy = async (image: Image) => {
    console.log(image)
    await writeTextToClipboard(image.url);
    ElMessage({
        message: `文件【${image.name}】地址已复制到剪切板。`,
        type: 'success',
    })
}

const handleOpenInBrowser = async (image: Image) => {
    await browserOpenExternal(image.url)
}


const openViewer = async (index: number) => {
    payVoucherDialog.value = true
    imageViewerPosition.value = index
    document.documentElement.style.overflowY = 'hidden'
}

const closeViewer = async () => {
    payVoucherDialog.value = false
    document.documentElement.style.overflowY = 'auto'
}

const handleExceed: UploadProps['onExceed'] = (files) => {
    // 自动覆盖前一个上传的文件
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
    uploadRef.value.submit()
}

// 上传前
const beforeUpload = async (rawFile: UploadRawFile) => {
    if (!currentRepo.value) {
        toast("请选择一个存储仓库！", "warning")
        return false
    }
}

// 上传过程中
const onProgress = (evt: UploadProgressEvent, uploadFile: UploadFile) => {
    uploadFile.percentage = evt.percent
}

// 上传
const handleUpload = async (options: UploadRequestOptions) => {

    const onUploadProgress = (event: any) => {
        options.onProgress({
            percent: Math.floor(event.loaded * 100 / event.total),
            total: event.total,
            loaded: event.loaded
        } as UploadProgressEvent)
    }
    console.log(options)
    var file = options.file
    var fileContent = await readFileAndConvertToBase64((file as any).path || (file as any).clipPath)
    if (!fileContent) {
        return toast("文件内容为空", "warning")
    }
    var url = ""
    if(currentRepo.value.type === "GitLab"){
        url = await uploadFileToGitlab(currentRepo.value, fileContent, file.name, undefined, onUploadProgress)
    }else if(currentRepo.value.type === "GitHub"){
        url = await uploadFileToGithub(currentRepo.value, fileContent, file.name, undefined, onUploadProgress)
    }
    await writeTextToClipboard(url);
    toast(`上传文件${file.name}成功，文件地址已复制到剪切板`)

    // 保存图片上传记录
    const dateString = formatDateTime(new Date())
    const newFile = {
        url, uploadTime: dateString, name: file.name, path: (file as any).path, size: formatFileSize(file.size),
        lastModified: file.lastModified, lastModifiedDate: (file as any).lastModifiedDate, type: file.type, uid: (file as any).uid
    }
    await syncDataWhenAddOne(newFile)
}

const syncDataWhenAddOne = async (newFile: any) => {
    await addImageToGallary(newFile)
    imagesList.value.unshift(newFile)
    imageTotalCount.value += 1
    imageLoadCount.value += 1
}


const clipBoardUpload = async () => {
    // 剪切板上传
    const { fileName, filePath, fileType, fileContent, lastModified, size, lastModifiedDate, err } = await (window as any).fileAPI.readClipboardImage()
    if (err) { return toast(err, "warning") }
    uploadRef.value!.clearFiles()
    uploadRef.value.handleStart({ name: fileName, path: filePath, size, lastModified, lastModifiedDate, type: fileType, uid: genFileId() })
    uploadRef.value.submit()
}


const changeRepo = async (sid: string) => {
    // 更改仓库
    console.log(sid)
    await setDefaultRepo(sid)
    currentRepo.value = await getDefaultRepo()
    repoID.value = sid
}

const loadImages = async () => {
    // 加载图片
    const { items, total } = await getImagesFromGallary(pageIndex.value, pageSize.value);
    imagesList.value = [...imagesList.value, ...items]
    imageTotalCount.value = total
    imageLoadCount.value += items.length
    pageIndex.value += 1
}

const scrollTop = async () => {
    let scrollHeight = window.innerHeight + document.documentElement.scrollTop || document.body.scrollTop;
    let allHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)

    if (imageLoadCount.value >= imageTotalCount.value) {
        return
    }
    if (allHeight <= scrollHeight) {
        await loadImages()
        console.log(pageIndex.value, imageLoadCount.value, imageTotalCount.value, "loading more..")
    }
}

onMounted(async () => {
    // 监听滚动条位置
    window.addEventListener('scroll', scrollTop, true)

    repoList.value = await getRepoList()  // 可选仓库列表
    currentRepo.value = await getDefaultRepo()  // 选择的默认仓库
    repoID.value = currentRepo.value.id  // 当前仓库id
    await loadImages()  // 上传的图片记录
})

</script>


<style scoped></style>