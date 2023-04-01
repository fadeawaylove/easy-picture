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


        <GitLab v-if="value == 'GitLab'" :sid="sid" />
        <span v-if="value == 'GitHub'">GitHub</span>
        <span v-if="value == 'Gitee'">Gitee</span>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import GitLab from '~/pages/repos/GitLab.vue'

const route = useRoute()

const value = ref()
const disabled = ref(false)
const action = ref("新增仓库")

const options = ["GitLab", "GitHub", "Gitee"]
const sid = ref()

onMounted(() => {
    sid.value = route.params.id
    if (sid.value) {
        (window as any).storeApi.storeGet("repo.list", []).then((repoList: Array<Object>) => {
            value.value = "GitLab"
            disabled.value = true
            action.value = "编辑仓库"
        })
    }
})


</script>

<style scoped>
.select-storage {

    @apply flex w-full block !;
}
</style>