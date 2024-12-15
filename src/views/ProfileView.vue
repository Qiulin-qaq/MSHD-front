<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      
      <el-form :model="profile" label-width="100px">
        <el-form-item label="头像">
          <el-avatar :size="100" :src="profile.avatar">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
          </el-avatar>
          <el-button class="ml-2" size="small">更换头像</el-button>
        </el-form-item>
        
        <el-form-item label="用户名">
          <el-input v-model="profile.username" disabled />
        </el-form-item>
        
        <el-form-item label="真实姓名">
          <el-input v-model="profile.realName" />
        </el-form-item>
        
        <el-form-item label="联系电话">
          <el-input v-model="profile.phone" />
        </el-form-item>
        
        <el-form-item label="电子邮箱">
          <el-input v-model="profile.email" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveProfile">保存信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const profile = ref({
  avatar: '',
  username: 'admin',
  realName: '管理员',
  phone: '13800138000',
  email: 'admin@example.com'
});

const saveProfile = () => {
  ElMessage.success('个人信息保存成功');
};
</script>

<style lang="scss" scoped>
.profile-container {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
}
</style>