
<template>
    <el-button type="primary" size="default" @click="addStorage">新增</el-button>
    <el-table :data="tableData">
        <el-table-column prop="name" label="仓库名" />
        <el-table-column prop="type" label="存储类型" />
        <el-table-column label="操作">
            <template v-slot="scope">
                <el-button @click="editStorage(scope.row)" type="primary" :icon="Edit" circle />
                <el-button type="danger" @click="deleteStorage(scope.row)" :icon="Delete" circle />
            </template>
        </el-table-column>

    </el-table>
</template>

<script lang="ts" setup>
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { getRepoList, deleteRepoByID, deleteDefaultRepo } from '~/api/localRepo';
import { showModal } from '~/utils/notify';
import { toast } from '../../utils/notify';

const router = useRouter()

const tableData = ref<Array<Object>>([])

const addStorage = () => {
    router.push("/storage/addoredit")
}

const editStorage = (row: any) => {
    router.push(`/storage/addoredit/${row.id}`)
}

const deleteStorage = async (row: any) => {
    showModal(`确定删除仓库【${row.name}】？`).then(async (res) => {
        await deleteRepoByID(row.id)
        await deleteDefaultRepo()
        toast(`删除仓库【${row.name}】成功`)
        tableData.value = await getRepoList();
    }).catch(err => { }).finally()
}


onMounted(async () => {
    tableData.value = await getRepoList();
})


</script>