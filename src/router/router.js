import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/LoginView.vue'
import SignUp from '@/views/SignUpView.vue'
import Main from '@/views/MainView.vue'
import DashboardView from '@/views/DashBoardView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: "/signup",
            component: SignUp,
        },
        {
            path: '/main',
            component: Main,
            children: [
                {
                    path: '',
                    component: DashboardView
                }
            ]
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})

export default router