<template>
    <div class="user-container">
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
                placeholder="按用户名搜索"
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
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="100px" />
          <el-table-column prop="id" label="id" width="200px"/>
          <el-table-column prop="username" label="用户名" width="300px"/>
          <el-table-column prop="password" label="密码" width="300px" >
            <template #default>
              ****** <!-- 将密码列固定为 ****** -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px" fixed="right">
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
        
        <!-- 编辑用户信息的表单 -->
        <el-dialog
          v-model="editDialogVisible"
          title="编辑用户信息"
          width="400px"
        >
          <el-form
            :model="editForm"
            :rules="rules"
            ref="editFormRef"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" />
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleEditSubmit">确定</el-button>
          </template>
        </el-dialog>
        
        <!-- 删除确认对话框 -->
        <el-dialog
          v-model="deleteDialogVisible"
          title="确认删除"
          width="300px"
        >
          <div>确定要删除该用户吗？</div>
          <template #footer>
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="danger" @click="confirmDelete">确定</el-button>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import {  deleteUser } from '@/api/user'
  import { getAllUser } from '@/api/user'
  import {changeUserName} from '@/api/user'
  
  // 数据定义
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const searchQuery = ref('')
  const selectedRows = ref([])
  const userList = ref([])
  const deleteDialogVisible = ref(false)
  const deleteId = ref(null)
  const editDialogVisible = ref(false)
  const editForm = ref({})
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ]
  }
  
  // const { validate: editFormValidate } = useForm()
  
  // 获取用户列表
  const fetchUserList = async () => {
  try {
    loading.value = true;

    // 获取所有用户信息
    const users = await getAllUser();

    // 根据搜索条件过滤用户
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );

    // 计算分页数据
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginatedUsers = filteredUsers.slice(start, end);

    // 更新用户列表和总数
    userList.value = paginatedUsers;
    total.value = filteredUsers.length;

  } catch (error) {
    console.error('Fetch error:', error);
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};
  
  // 处理删除
  const handleDelete = (row) => {
    deleteId.value = row.id
    deleteDialogVisible.value = true
  }
  
  // 确认删除
  const confirmDelete = async () => {
    try {
      const res = await deleteUser(deleteId.value)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUserList()
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
        const promises = selectedRows.value.map(row => deleteUser(row.id))
        await Promise.all(promises)
        ElMessage.success('批量删除成功')
        fetchUserList()
      } catch (error) {
        ElMessage.error('批量删除失败')
      }
    })
  }
  
  // 处理搜索
  const handleSearch = () => {
    currentPage.value = 1
    fetchUserList()
  }
  
  // 处理页码改变
  const handleCurrentChange = (val) => {
    currentPage.value = val
    fetchUserList()
  }
  
  // 处理每页条数改变
  const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    fetchUserList()
  }
  
  // 处理表格选择
  const handleSelectionChange = (selection) => {
    selectedRows.value = selection
  }
  
  // 处理编辑
  const handleEdit = (row) => {
  // 获取选中的用户数据
  const user = userList.value.find(user => user.id === row.id)
  if (user) {
    editForm.value.username = user.username  // 设置表单的用户名
    editForm.value.id = user.id
    editDialogVisible.value = true  // 显示编辑对话框
  }
}

// 提交编辑
const handleEditSubmit = async () => {
  if (editForm.value.username) {
    try {
      // 调用后端接口进行用户名修改
      const res = await changeUserName(editForm.value.username,editForm.value.id)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        editDialogVisible.value = false
        fetchUserList()  // 更新用户列表
      }
    } catch (error) {
      ElMessage.error('更新失败')
    }
  } else {
    ElMessage.warning('用户名不能为空')
  }
}

  
  // 生命周期钩子
  onMounted(() => {
    fetchUserList()
  })
  </script>
  
  <style lang="scss" scoped>
 .user-container {
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

    .el-table__header th {
    text-align: center; /* 居中表头文本 */
    }
  }
  </style>