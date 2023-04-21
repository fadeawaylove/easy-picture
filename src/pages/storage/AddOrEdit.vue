<template>
    <div class=" flex-col">
        <div class="top-tip">
            <span class=" flex mb-2 text-green-500">{{ action }}</span>
        </div>

        <div class="flex w-full">
            <el-select v-model="value" :disabled="disabled" class="select-storage" placeholder="选择仓库类型" filterable>
                <el-option class="w-full" v-for="item in options" :key="item" :label="item" :value="item" />
            </el-select>

        </div>
        <el-divider border-style="dashed" />

        <GitLab v-if="value == 'GitLab'" :repo="repo" />
        <Github v-if="value == 'GitHub'" :repo="repo" />
        <span v-if="value == 'Gitee'">Gitee 待完成</span>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { getRepoList, getRepoByID } from '~/api/localRepo';
import GitLab from '~/pages/repos/GitLab.vue'
import Github from '~/pages/repos/Github.vue'

const route = useRoute()

const value = ref()
const disabled = ref(false)
const action = ref("新增仓库")
const options = ["GitLab", "GitHub", "Gitee"]
const repo = ref()

onMounted(async () => {
    var str
    if (Array.isArray(route.params.id)) {
        str = route.params.id[0];
    } else {
        str = route.params.id;
    }
    if (str) {
        var _repo = await getRepoByID(str)
        if (_repo) {
            repo.value = _repo
            value.value = _repo.type
            disabled.value = true
            action.value = "编辑仓库"
        }
    }
})


</script>

<style scoped>
.select-storage {

    @apply flex w-full block !;
}
</style>