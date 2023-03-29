
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '~/pages/Home.vue'
import StorageList from '~/pages/storage/List.vue'
import StorageAddOrEdit from '~/pages/storage/AddOrEdit.vue'
import Settings from '~/pages/settings/Settings.vue'


const routes = [
    { path: '/', component: Home },
    { path: '/storage/list', component: StorageList },
    { path: '/storage/addoredit/:id', component: StorageAddOrEdit },
    { path: '/storage/addoredit', component: StorageAddOrEdit },
    { path: '/settings', component: Settings },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes

})

