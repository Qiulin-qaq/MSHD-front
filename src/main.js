

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia';

import piniaPersist from 'pinia-plugin-persist'

import router from '@/router/router';
import ElementPlus from 'element-plus'
import "element-plus/dist/index.css";


const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)

app.use(ElementPlus)
app.use(pinia);//用于管理全局状态
app.use(router);


app.mount('#app')
