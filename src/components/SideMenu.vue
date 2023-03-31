<template>
    <el-aside width="100px">
        <div class="f-menu">
            <el-menu :default-active="$route.path" class=" border-0" @select="handleSelect">
                <el-menu-item v-for="(item, index) in menus" :index="item.path">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </el-menu>
        </div>

    </el-aside>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
const router = useRouter()
const route = useRoute()


const menus = [
    {
        name: "上传",
        path: "/",
        icon: "UploadFilled"
    },
    {
        name: "仓库",
        path: "/storage/list",
        icon: "House"
    },
    {
        name: "设置",
        path: "/settings",
        icon: "Setting"
    }
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
</style>