import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'

import Login from '@/views/LoginView.vue'
import SignUp from '@/views/SignUpView.vue'
import Main from '@/views/MainView.vue'
import DashboardView from '@/views/DashBoardView.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import DisasterView from '@/views/DisasterView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: Login,
            meta: { requiresAuth: false }
        },
        {
            path: '/signup',
            component: SignUp,
            meta: { requiresAuth: false }
        },
        {
            path: '/main',
            component: Main,
            meta: { requiresAuth: false },
            children: [
                {
                    path: '',
                    component: DashboardView,
                    meta: { requiresAuth: false }
                },
                {
                    path: 'analysis',
                    component: AnalysisView,
                    meta: { requiresAuth: false }
                },
                {
                    path: 'disaster',
                    component: DisasterView,
                    meta: { requiresAuth: false }
                },
                {
                    path: 'settings',
                    component: SettingsView,
                    meta: { requiresAuth: false }
                },
                {
                    path: 'profile',
                    component: ProfileView,
                    meta: { requiresAuth: false }
                }
            ]
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
    const tokenStore = useTokenStore()
    const isAuthenticated = tokenStore.getToken()

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

// 添加路由错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  ElMessage.error('页面加载失败，请重试');
});

export default router