<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form :model="settings" label-width="120px">
        <el-form-item label="系统名称">
          <el-input v-model="settings.systemName" />
        </el-form-item>
        
        <el-form-item label="数据刷新间隔">
          <el-select v-model="settings.refreshInterval">
            <el-option label="1分钟" value="1" />
            <el-option label="5分钟" value="5" />
            <el-option label="15分钟" value="15" />
            <el-option label="30分钟" value="30" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="通知设置">
          <el-switch
            v-model="settings.enableNotification"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const settings = ref({
  systemName: '灾情数据管理系统',
  refreshInterval: '5',
  enableNotification: true
});

const saveSettings = () => {
  ElMessage.success('设置保存成功');
};
</script>

<style lang="scss" scoped>
.settings-container {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
 