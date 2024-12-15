<script setup>
import { ref } from 'vue';
import { Menu as IconMenu, Message, Setting, User } from '@element-plus/icons-vue';

const isCollapse = ref(false);
const activeIndex = ref('1');

const handleSelect = (key) => {
  console.log(key);
};
</script>

<template>
  <div class="common-layout">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
        <div class="logo">
          <!-- 暂时注释掉 logo 图片 -->
          <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
          <span v-show="!isCollapse">灾情数据系统</span>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="menu"
          :collapse="isCollapse"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-icon><IconMenu /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Message /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          <el-menu-item index="3">
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
          </div>
          <div class="header-right">
            <el-input
              placeholder="搜索..."
              prefix-icon="Search"
              class="search-input"
            />
            <el-dropdown>
              <el-avatar :icon="User" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main class="main">
          <router-view></router-view>
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
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
    }

    .menu {
      border-right: none;
      background-color: #304156;
    }
  }

  .header {
    background-color: white;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .header-left {
      .collapse-btn {
        font-size: 20px;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;

      .search-input {
        width: 200px;
      }
    }
  }

  .main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}
</style> 