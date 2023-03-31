<template>
    <div class=" flex-col">
        <div class="top-tip">
        <span class=" flex mb-2 text-green-500">添加仓库</span>
        </div>
        

        <div class="flex w-full">
            <el-select v-model="value" class="select-storage" placeholder="选择仓库类型" filterable>
                <el-option class="w-full" v-for="item in options" :key="item.value" :label="item.label"
                    :value="item.value" />
            </el-select>

        </div>
        <el-divider border-style="dashed" />


        <GitLab v-if="value == 1"/>
        <span v-if="value == 2">GitHub</span>
        <span v-if="value == 3">Gitee</span>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import GitLab from '~/pages/repos/Gitlab.vue'


const value = ref()

const options = [
    {
        value: 1,
        label: 'GitLab',
    },
    {
        value: 2,
        label: 'GitHub',
    },
    {
        value: 3,
        label: 'Gitee',
    }

]


</script>

<style scoped>
.select-storage {

    @apply flex w-full block !;
}
</style>