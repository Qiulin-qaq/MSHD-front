<template>
  <div class="disaster-container">
    <el-card>
      <template #header>
        <div class="card-header">

          <div class="left">
            <el-button type="primary" @click="handleAdd">新增灾情</el-button>


            <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
              批量删除
            </el-button>



          </div>

          <el-button style="margin-left: -350px;" @click="handleImport">导入灾情</el-button>

          <div class="right">

            <!-- 刷新按钮 -->
            <el-button type="primary" @click="fetchDisasterList" style="margin-right: 10px;">
              刷新
            </el-button>

            <!-- 新增的搜索字段 -->
            <el-input @input="handleSearch" :icon="Search" v-model="source" placeholder="来源" class="search-input" />
            <el-input @input="handleSearch" v-model="carrier" placeholder="载体" class="search-input" />
            <el-input @input="handleSearch" v-model="category" placeholder="类别" class="search-input" />
            <el-input @input="handleSearch" v-model="subcategory" placeholder="子类别" class="search-input" />
          </div>

        </div>

      </template>

      <el-table v-loading="loading" :data="disasterList" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="location" label="地点" min-width="180" show-overflow-tooltip />
        <el-table-column prop="source" label="来源" />
        <el-table-column prop="date" label="日期" width="120">
          <template #default="scope">
            {{ scope.row.date || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="carrier" label="载体" width="150" show-overflow-tooltip />
        <el-table-column prop="category" label="类别" width="120" />
        <el-table-column prop="subcategory" label="子类别" width="120" />
        <el-table-column prop="indicator" label="指标" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">

            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    

    <!-- 新增对话框 -->
    <el-dialog v-model="addDialogVisible" title="新增灾情信息" width="500px">
      <el-form ref="addFormRef" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item label="编码" prop="code">
          <el-input v-model="addForm.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="灾情描述" prop="description">
          <el-input v-model="addForm.description" placeholder="请输入灾情描述" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>


    <!-- 导入灾情对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入灾情" width="500px">
      <el-form ref="importFormRef" :model="importForm" label-width="100px">
        <el-form-item label="编号" prop="code">
          <el-input v-model="importForm.code" placeholder="请输入编号" />
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <el-upload v-model:file-list="importFileList" :show-file-list="true" :on-change="handleFileChange"
            :file="importForm.file" :auto-upload="false">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadFile">导入</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getSearchService, getDisasterListService, addDisasterService, deleteDisasterService } from '@/api/disaster'
import axios from 'axios'



// 数据定义
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const selectedRows = ref([])
const defaultDisasterList = [
  {
    id: 1,
    location: '北京市海淀区',
    date: '2024-03-20',
    carrier: '图文',
    category: '房屋破坏',
    subcategory: '一般房屋破坏',
    indicator: '轻微损坏'
  },
  {
    id: 2,
    location: '上海市浦东新区',
    date: '2024-03-19',
    carrier: '视频',
    category: '人员伤亡',
    subcategory: '受伤人员',
    indicator: '轻伤'
  },
  {
    id: 3,
    location: '广州市天河区',
    date: '2024-03-18',
    carrier: '文字',
    category: '生命线工程破坏',
    subcategory: '交通设施破坏',
    indicator: '道路损坏'
  },
  {
    id: 4,
    location: '深圳市南山区',
    date: '2024-03-17',
    carrier: '图片',
    category: '次生灾害',
    subcategory: '火灾',
    indicator: '小型火灾'
  },
  {
    id: 5,
    location: '南京市玄武区',
    date: '2024-03-16',
    carrier: '音频',
    category: '房屋破坏',
    subcategory: '重要房屋破坏',
    indicator: '严重损坏'
  }
]
const disasterList = ref(defaultDisasterList)



const rules = ref({
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '灾情描述不能为空', trigger: 'blur' }],
});

// 新的搜索字段
const source = ref('');
const carrier = ref('');
const category = ref('');
const subcategory = ref('');


//search
const handleSearch = async () => {
  try {
    loading.value = true
    const formData = new FormData()


    formData.append('source', source.value);
    formData.append('carrier', carrier.value);
    formData.append('category', category.value);
    formData.append('subcategory', subcategory.value);


    const res = await getSearchService(formData)

    console.log(res)


    if (res.code === 200) {
      disasterList.value = res.data || [];
      total.value = disasterList.value.length
      console.log(disasterList.value)
      ElMessage.success('查询成功');
    } else {
      ElMessage.error(res.msg || '获取数据失败')

    }
  } catch (error) {
    console.error('获取搜索后灾情列表失败:', error)
    ElMessage.error('获取搜索后灾情列表失败')

  } finally {
    loading.value = false
  }
}




// 新增相关的数据
const addDialogVisible = ref(false)
const addForm = ref({
  code: '',
  description: '',
})





// 打开新增对话框
const handleAdd = () => {
  addForm.value = {
    code: '',
    description: '',
  }
  addDialogVisible.value = true
}

const resetAddForm = () => {
  addForm.value = {
    code: '',
    description: '',
  };
};





// 提交新增
const handleAddSubmit = async () => {

  try {

    loading.value = true;
    const formData = new FormData();
    console.log(addForm.value)
    // 将数据逐个添加到 FormData 中
    formData.append('code', addForm.value.code);
    formData.append('description', addForm.value.description);
    console.log(formData.values)
    const res = await addDisasterService(formData)

    if (res.code === 200) {
      ElMessage.success('新增成功')
      addDialogVisible.value = false;
      resetAddForm();
      await fetchDisasterList();



    } else {
      ElMessage.error(res.msg || '新增失败')
    }
  } catch (error) {
    console.error('新增失败:', error)
    ElMessage.error('新增失败')
  } finally {
    loading.value = false;
  }
}

// 获取灾情列表
const fetchDisasterList = async () => {
  try {
    loading.value = true

    const res = await getDisasterListService()

    if (res.code === 200) {

      disasterList.value = res.data.all_data || defaultDisasterList
      total.value = disasterList.value.length

    } else {

      ElMessage.error(res.msg || '获取数据失败')


      disasterList.value = []
      total.value = 0
    }
  } catch (error) {

    console.error('获取灾情列表失败:', error)
    ElMessage.error('获取灾情列表失败')

    disasterList.value = []
    total.value = 0

  } finally {
    loading.value = false
  }
}




// 删除单条数据
const handleDelete = async (row) => {
  try {
    loading.value = true;

    // 删除请求数据
    const requestData = {
      ids: [row.id] // 直接传递当前行的 ID
    };

    // 调用删除接口
    const response = await deleteDisasterService(requestData.ids);
    if (response.code === 200) {
      ElMessage.success('删除成功！');
      await fetchDisasterList(); // 刷新列表
    } else {
      ElMessage.error(response.msg || '删除失败！');
    }
  } catch (error) {
    ElMessage.error('删除失败，请重试！');
  } finally {
    loading.value = false;
  }
};

// 处理批量删除
const handleBatchDelete = async () => {
  try {
    loading.value = true;

    const requestData = {
      ids: selectedRows.value.map((row) => row.id)
    };

    // 调用批量删除接口
    const response = await deleteDisasterService(requestData.ids);
    if (response.code === 200) {
      ElMessage.success('批量删除成功！');
      await fetchDisasterList(); // 刷新列表
    } else {
      ElMessage.error(response.msg || '批量删除失败！');
    }
  } catch (error) {
    ElMessage.error('批量删除失败，请重试！');
  } finally {
    loading.value = false;
  }
};

// 处理表格的多选
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};




// 控制导入对话框的显示
const importDialogVisible = ref(false);

// 用于绑定输入的编号和上传文件
const importForm = ref({
  code: '',
  file: null,
});

const importFileList = ref([]);



// 打开导入对话框
const handleImport = () => {
  importDialogVisible.value = true;
  importForm.value = {
    code: '',
    file: null,
  };
  importFileList.value = [];
};

// 文件选择时触发的事件
const handleFileChange = (file) => {
  importForm.value.file = file.raw;  // 文件对象绑定到 `importForm.file`
  console.log(file.raw);
};

//上传灾情文件
const uploadFile = async () => {


  const formdata = new FormData()
  formdata.append('file', importForm.value.file)
  formdata.append('code', importForm.value.code)
  console.log(formdata)
  try {
    loading.value = true
    const res = await axios.post("http://localhost:8888/v1/decode/media", formdata, {
      headers: {
        "Content-Type": "multipart/form-data",  // 确保 Content-Type 是正确的
      },
    });



    if (res.data.code === 200) {
      ElMessage.success('上传成功')
      importDialogVisible.value = false;
      await fetchDisasterList()
    } else {
      ElMessage.error(res.msg || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  } finally {
    loading.value = false
  }
}


// 生命周期钩子
onMounted(() => {
  fetchDisasterList()

  // handleAddSubmit()
  // uploadFile()
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
      width: 150px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>