<template>
    <el-aside width="60px">
        <div class="f-menu">
            <el-menu :default-active="$route.path" class=" border-0 p-0" @select="handleSelect">
                <el-menu-item v-for="(item, index) in menus" :index="item.path" class="!pl-1 !pr-2">
                    <el-icon >
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </el-menu>
        </div>
    </el-aside>
</template>


<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()


const menus = [
    {
        name: "上传",
        path: "/",
        icon: "Upload"
    },
    {
        name: "仓库",
        path: "/storage/list",
        icon: "House"
    },
    // {
    //     name: "设置",
    //     path: "/settings",
    //     icon: "Setting"
    // }
]

const handleSelect = (e: string) => {
    router.push(e)
}

</script>

<style>
.f-menu {
    transition: all 0.2s;
    top: 0px;
    bottom: 0px;
    left: 0px;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;
}

.f-menu::-webkit-scrollbar {
    width: 0px;
}

/* .el-menu-item {
    @apply !p-0;
} */
</style>