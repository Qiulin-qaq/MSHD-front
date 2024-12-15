<template>
  <div class="disaster-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button type="primary" @click="handleAdd">
              新增灾情
            </el-button>
            <el-button type="danger" :disabled="!selectedRows.length">
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索灾情信息"
              class="search-input"
            >
              <template #append>
                <el-button :icon="Search" />
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        :data="disasterList"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="灾害类型" width="120" />
        <el-table-column prop="location" label="地点" />
        <el-table-column prop="level" label="灾害等级" width="100" />
        <el-table-column prop="date" label="发生时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增灾情' : '编辑灾情'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="灾害类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择灾害类型">
            <el-option label="地震" value="earthquake" />
            <el-option label="洪水" value="flood" />
            <el-option label="台风" value="typhoon" />
            <el-option label="滑坡" value="landslide" />
          </el-select>
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="灾害等级" prop="level">
          <el-select v-model="form.level" placeholder="请选择灾害等级">
            <el-option label="一般" value="normal" />
            <el-option label="较重" value="moderate" />
            <el-option label="严重" value="severe" />
            <el-option label="特别严重" value="extreme" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间" prop="date">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 表格数据
const disasterList = ref([
  {
    id: 1,
    type: '地震',
    location: '四川成都',
    level: '较重',
    date: '2024-01-15 14:30:00',
    status: 'processing'
  },
  {
    id: 2,
    type: '洪水',
    location: '湖北武汉',
    level: '严重',
    date: '2024-01-14 09:15:00',
    status: 'completed'
  }
]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 搜索相关
const searchQuery = ref('');

// 选择相关
const selectedRows = ref([]);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const formRef = ref(null);
const form = ref({
  type: '',
  location: '',
  level: '',
  date: ''
});

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择灾害类型', trigger: 'change' }],
  location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
  level: [{ required: true, message: '请选择灾害等级', trigger: 'change' }],
  date: [{ required: true, message: '请选择发生时间', trigger: 'change' }]
};

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    processing: 'warning',
    completed: 'success',
    pending: 'info'
  };
  return statusMap[status] || 'info';
};

// 处理表格选择
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val;
  // 重新加载数据
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  // 重新加载数据
};

// 处理新增
const handleAdd = () => {
  dialogType.value = 'add';
  form.value = {
    type: '',
    location: '',
    level: '',
    date: ''
  };
  dialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row) => {
  dialogType.value = 'edit';
  form.value = { ...row };
  dialogVisible.value = true;
};

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.location} 的${row.type}灾情记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 执行删除操作
    const index = disasterList.value.findIndex(item => item.id === row.id);
    if (index > -1) {
      disasterList.value.splice(index, 1);
      ElMessage.success('删除成功');
    }
  }).catch(() => {
    // 取消删除
  });
};

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '修改成功');
      dialogVisible.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
.disaster-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      gap: 10px;
    }

    .search-input {
      width: 300px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 