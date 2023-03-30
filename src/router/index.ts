
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '~/pages/Home.vue'
import Settings from '~/pages/settings/Settings.vue'


const routes = [
    { path: '/', component: Home },
    { path: '/settings', component: Settings },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes

})

