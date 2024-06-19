<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <happy-button :text="'happyui测试按钮'"></happy-button>
    <!-- <HappyButton :text="'happyui'" /> -->
    <!-- table -->
    <happy-table
      :tableData="tableData"
    >
      <el-table-column property="loginName" label="登录名"/>
      <el-table-column property="name" label="姓名"/>
      <el-table-column property="department" label="部门" />
      <el-table-column property="position" label="职位" />
      <el-table-column property="phone" label="电话" />
      <el-table-column label="角色标签" >
        <template #default="scope">
          <div class="column-text">
            {{scope.row.role}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default>
          <div class="column-btns">
            <img class="column-btn" src="//localhost:9100/src/assets/img/sys/edit.png" alt="">
            <img class="column-btn" src="//localhost:9100/src/assets/img/sys/change.png" alt="">
            <img class="column-btn" src="//localhost:9100/src/assets/img/sys/delete.png" alt="">
          </div>
        </template>
      </el-table-column>
    </happy-table>
    <!-- 台账 -->
    <happy-parameter
      class="happyParameter"
      ref="ceTablePaginations"
      :queryList="queryList"
      :tableData="tableData2"
      :tableLoading="tableLoading"
      :tableTitle="tableTitle"
      v-model:currentPage="pageContent.pageNumber"
      v-model:page-size="pageContent.pageSize"
      v-model:total="pageContent.totalRecord"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @search="search"
      @reload="reload"
      >
      <template #headerBtn>
        <el-button round>headerBtn</el-button>
      </template>
      <template #mainBtn>
        <el-button round>mainBtn</el-button>
      </template>
      <template #tableColumn>
        <el-table-column property="loginName" label="登录名"/>
        <el-table-column property="name" label="姓名"/>
        <el-table-column property="department" label="部门" />
        <el-table-column property="position" label="职位" />
        <el-table-column property="phone" label="电话" />
        <el-table-column label="角色标签" >
          <template #default="scope">
            <div class="column-text">
              {{scope.row.role}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <div class="column-btns">
              <img class="column-btn" src="//localhost:9100/src/assets/img/sys/edit.png" alt="">
              <img class="column-btn" src="//localhost:9100/src/assets/img/sys/change.png" alt="">
              <img class="column-btn" src="//localhost:9100/src/assets/img/sys/delete.png" alt="">
            </div>
          </template>
        </el-table-column>
      </template>
    </happy-parameter>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, reactive, defineComponent, onMounted, nextTick } from "vue";
// import HappyButton from "@/package/happy-button/index.vue"; // @ is an alias to /src
// import HappyTable from "@/package/happy-table/index.vue"; // @ is an alias to /src
// import HappyParameter from "@/package/happy-parameter/index.vue"; // @ is an alias to /src

const tableData = ref([
  {
    id: 1,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },
  {
    id: 2,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 3,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  }
])




interface tableDataType {
  id: number|string
  loginName: string
  name: string
  department: string
  position: string
  phone: string
  role: string
}
const tableData2: tableDataType[] = [
  {
    id: 1,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },
  {
    id: 2,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 3,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 4,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 5,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 6,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 7,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 8,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 9,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 10,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  },{
    id: 11,
    loginName: 'eadmin',
    name: '管理员',
    department: '广州市xxx',
    position: '巡检员',
    phone: '13111111111',
    role: '应急调度-管理员',
  }
]
const tableLoading = ref<boolean>(false)
const tableTitle = ref<string>('用户列表')
interface pageContentType {
  pageNumber?: number,
  pageSize?: number,
  pageSizes?: number[],
  totalRecord?: number,
  small?: boolean,
  background?: boolean,
  disabled?: boolean,
  layout?: string,
}
const pageContent = reactive<pageContentType>({
  pageNumber: 1,
  pageSize: 10,
  totalRecord: 11,
})
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  pageContent.pageNumber = 1;
  pageContent.pageSize = val;
  // getList();
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  pageContent.pageNumber = val;
  // getList();
}
const ceTablePaginations:Ref<any> = ref(null)// wrap容器
const changeTableHeight = ()=>{
  ceTablePaginations.value.initHeight()
}
const queryList = reactive([
  {
    label:'姓名',value:'',type:'input', field: 'name1'
  },{
    label:'角色标签',value:'',type:'select',options:[{label:'部门1',value:'部门1'}], field: 'role'
  },{
    label:'日期',value:'',type:'datePicker', field: 'date1'
  },{
    label:'日期',value:[],type:'daterange', field: 'date2'
  },{
    label:'级联',value:'',type:'cascader' ,
    options:[
      {
        label:'部门1',
        value:'部门1', 
        children: [{label:'部门1-1',value:'部门1-1'},{label:'部门1-2',value:'部门1-2'}]
      }
    ], 
    props: {
      emitPath: false, 
      multiple: false, 
    },
    field: 'cascade'
  },{
    label:'姓名',value:'',type:'input', field: 'name2'
  },{
    label:'姓名',value:'',type:'input', field: 'name3'
  }
])
const search = (json: any) => {
  console.log('search-json', json)
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1000);
}
const reload = (json: any) => {
  console.log('search-reload', json)
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1000);
}
onMounted(() => {
  nextTick(()=>{
    setTimeout(() => {
      changeTableHeight();
    }, 300);
  })
})
</script>

<style scoped lang="scss">
  .home{
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0px 6px 4px #E2F2FC66;
    margin-top: 20px;
    .ce-table{
      padding: 20px;
      .el-table{
        transition: height 0.2s ease 0s;
      }
      .column-text{
        cursor: pointer;
      }
      .column-btns{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .column-btn{
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
    .pagination{
      padding: 12px;
      .el-pagination{
        justify-content: center;
      }
    }
    .happyParameter{
      height: 100vh;
    }
  }
</style>
