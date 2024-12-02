import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/LoginView.vue'
import SignUp from '@/views/SignUpView.vue'
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
    ]
})

export default router