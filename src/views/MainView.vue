<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Menu as IconMenu, Message, Setting, User, Warning } from '@element-plus/icons-vue';
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const tokenStore = useTokenStore();

const isCollapse = ref(false);
const activeIndex = computed(() => route.path);
const searchQuery = ref('');

// 计算当前路径名称
const currentPath = computed(() => {
  const pathMap = {
    '/main': '仪表盘',
    '/main/analysis': '数据分析',
    '/main/disaster': '灾情管理',
    '/main/settings': '系统设置'
  };
  return pathMap[route.path] || '仪表盘';
});

const handleSelect = (index) => {
  router.push(index);
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实现搜索逻辑
    ElMessage.success(`搜索: ${searchQuery.value}`);
  }
};

const handleCommand = (command) => {
  if (command === 'logout') {
    tokenStore.removeToken();
    router.push('/login');
    ElMessage.success('已退出登录');
  } else if (command === 'profile') {
    router.push('/main/profile');
  }
};
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" v-show="!isCollapse" />
          <span v-show="!isCollapse">灾情数据系统</span>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="menu"
          :collapse="isCollapse"
          @select="handleSelect"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/main">
            <el-icon><IconMenu /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/main/analysis">
            <el-icon><Message /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          <el-menu-item index="/main/disaster">
            <el-icon><Warning /></el-icon>
            <span>灾情管理</span>
          </el-menu-item>
          <el-menu-item index="/main/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-button
              type="text"
              @click="isCollapse = !isCollapse"
              class="collapse-btn"
            >
              <el-icon><IconMenu /></el-icon>
            </el-button>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索..."
              prefix-icon="Search"
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <el-dropdown @command="handleCommand">
              <el-avatar :icon="User" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main class="main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  
  .aside {
    background-color: #304156;
    transition: width 0.3s;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      color: white;
      background-color: #2b3a4d;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
      
      span {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .menu {
      border-right: none;
      
      :deep(.el-menu-item) {
        &:hover {
          background-color: #263445;
        }
        
        &.is-active {
          background-color: #1890ff;
        }
      }
    }
  }

  .header {
    background-color: white;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .collapse-btn {
        font-size: 20px;
        color: #606266;
        
        &:hover {
          color: #409EFF;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;

      .search-input {
        width: 200px;
        transition: width 0.3s;
        
        &:focus {
          width: 250px;
        }
      }
      
      .el-avatar {
        cursor: pointer;
        background-color: #409EFF;
      }
    }
  }

  .main {
    background-color: #f0f2f5;
    padding: 20px;
    
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
</style> 