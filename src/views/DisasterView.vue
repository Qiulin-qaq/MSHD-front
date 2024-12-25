<template>
  <div class="disaster-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索灾情信息"
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" @click="handleSearch" />
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="disasterList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="编码" width="180" />
        <el-table-column prop="category" label="灾害类型" width="120" />
        <el-table-column prop="location" label="地点" width="200" />
        <el-table-column prop="date" label="发生时间" width="160" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="carrier" label="载体" width="100" />
        <el-table-column prop="descriptionText" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="300px"
    >
      <span>确定要删除选中的数据吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑灾情信息"
      width="500px"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="描述" prop="descriptionText">
          <el-input
            v-model="editForm.descriptionText"
            type="textarea"
            rows="3"
            placeholder="请输入描述信息"
          />
        </el-form-item>
        
        <el-form-item label="灾害类型" prop="category">
          <el-input v-model="editForm.category" disabled />
        </el-form-item>
        
        <el-form-item label="子类型" prop="subcategory">
          <el-input v-model="editForm.subcategory" disabled />
        </el-form-item>
        
        <el-form-item label="指标" prop="indicator">
          <el-input v-model="editForm.indicator" disabled />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getDisasterList, deleteDisaster, getDisasterById, updateDisaster } from '@/api/disaster'

// 数据定义
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')
const selectedRows = ref([])
const disasterList = ref([])
const deleteDialogVisible = ref(false)
const deleteId = ref(null)
const editDialogVisible = ref(false)
const editForm = ref({})
const rules = {
  descriptionText: [
    { required: true, message: '请输入描述信息', trigger: 'blur' }
  ]
}

// 获取灾情列表
const fetchDisasterList = async () => {
  try {
    loading.value = true
    const res = await getDisasterList({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value
    })
    if (res.code === 200) {
      disasterList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('Fetch error:', error)
    ElMessage.error('获取灾情列表失败')
  } finally {
    loading.value = false
  }
}

// 处理删除
const handleDelete = (row) => {
  deleteId.value = row.id
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  try {
    const res = await deleteDisaster(deleteId.value)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchDisasterList()
    }
  } catch (error) {
    ElMessage.error('删除失败')
  } finally {
    deleteDialogVisible.value = false
  }
}

// 处理批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    return
  }
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const promises = selectedRows.value.map(row => deleteDisaster(row.id))
      await Promise.all(promises)
      ElMessage.success('批量删除成功')
      fetchDisasterList()
    } catch (error) {
      ElMessage.error('批量删除失败')
    }
  })
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchDisasterList()
}

// 处理页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchDisasterList()
}

// 处理每页条数改变
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchDisasterList()
}

// 处理表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理编辑
const handleEdit = async (row) => {
  try {
    const res = await getDisasterById(row.id)
    if (res.code === 200) {
      editForm.value = { ...res.data }
      editDialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  try {
    const res = await updateDisaster(editForm.value.id, editForm.value)
    if (res.code === 200) {
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      fetchDisasterList()
    }
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// 生命周期钩子
onMounted(() => {
  fetchDisasterList()
})
</script>

<style lang="scss" scoped>
.disaster-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

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