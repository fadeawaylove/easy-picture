
<template>
    <el-button type="primary" size="default" @click="addStorage">新增</el-button>
    <el-button type="primary" size="default" @click="removeAllStorage">清除全部</el-button>


    <el-table :data="tableData" @row-click="editStorage">
        <el-table-column prop="name" label="仓库名" />
        <el-table-column prop="type" label="存储类型" />
    </el-table>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const tableData = ref<Array<Object>>([])

const addStorage = () => {
    router.push("/storage/addoredit")
}

const editStorage = (row: any, c: any, e: any) => {
    router.push(`/storage/addoredit/${row.id}`)
}


const removeAllStorage = () => {
    (window as any).storeApi.storeDelete("repo.list")
    location.reload()
}


onMounted(() => {
    (window as any).storeApi.storeGet("repo.list", []).then((repoList: Array<Object>) => {
        console.log(repoList);
        tableData.value = repoList;
    })
})


</script>