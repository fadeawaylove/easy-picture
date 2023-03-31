
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '~/pages/Home.vue'
import StorageList from '~/pages/storage/List.vue'
import StorageAdd from '~/pages/storage/Add.vue'
import Settings from '~/pages/settings/Settings.vue'


const routes = [
    { path: '/', component: Home },
    { path: '/storage/list', component: StorageList },
    { path: '/storage/add', component: StorageAdd },
    { path: '/settings', component: Settings },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes

})

