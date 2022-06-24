<template>
    <div class="app-container_tree">
      <el-row :gutter="20" class="container_h">
      <el-col :span="4" :xs="24" class="container_flex_overflow">
        <div class="head-container">
          <el-tree
            class="drawer-tree"
            :indent="0"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            :highlight-current="true"
            :default-expand-all="false"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
        <el-col :span="20" :xs="24" class="container_flex">
          <el-row :gutter="24" class="container_flex-right_tree">
          <el-col :span="1.5"  v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
           <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              @newButton="newButton"
              class="cume-button"
            ></button-top>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top:4px; padding-right:20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
          ></right-toolbar>
        </el-row>
        <form-data
          :formData='formData'
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top:-12px;margin-bottom: 6px;"
        />
        <table-index
          ref="tableIndex"
          style="margin-top:-8px"
          :tableIndexs="tableIndex"
          :loading="loading"
          :tableData="userList"
          :property="property"
          :showMoreButton="true"
          pageName="userPage"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter" 
        />
        <pagination
          v-show="listQuery.total>0"
          :total="listQuery.total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
          style="margin-bottom: 40px;"
        />
        </el-col> 
      </el-row>    
      <operate ref="operate" @operateSuccess="operateSuccess" />    
       <roleDrawer ref="roleDrawer" @userBindRoleSuccess="operateSuccess"/>
    </div>
</template>
<script>
import {userPage, userDeleteBatch, userRoleList, resetPwd,updateGrantStatus} from '@/api/system/user';
import {deptTree} from '@/api/system/dept';
import roleDrawer from "./components/roleDrawer";
import operate from "./components/operate";
import indexMixin from '@/views/mixins';


export default {
  name: "user",
  mixins: [indexMixin],
  components: {roleDrawer, operate},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      selectionData:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 用户表格数据
      userList: [],
      property: {},
      // 日期范围
      dateRange: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
       // 部门列表
      deptOptions: [],
      // 查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        total: 0,
      },
      // 表单参数
      formData: {
        username: "",
        status: "0",
        deptId: "",
      },
    }
  },
  created() {
    this.deptTree();
    this.menuProperty();
    this.getList();
  },
  methods: {
    newButton(buttonCode) {
      if (buttonCode === "bindStoryhouse") {
        this.checkWarehouseState();
      } else {
        this.$refs.tableIndex.newButton(buttonCode);
      }
    },
    handleButton(row, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(row)
      } else if (buttonCode === 'delete') {
        this.handleDelete(row)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      } else if (buttonCode === 'resetPwd') {
        this.handleResetPwd(row)
      } else if (buttonCode === 'authRole') {
        this.handleAuthRole(row)
      }
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    selectChange(type, value) {
      if (type === "createTime") {
        this.dateRange = value;
      } else {
        this.formData[type] = value;
      }
      this.handleQuery();
    },
    deptTree() {
      deptTree().then(({data}) => {
        this.deptOptions = data;
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.formData.deptId = data.id;
      this.handleQuery();
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery);
      this.handleQuery();
    },
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    menuProperty() {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    getList () {
      this.loading = true;
      userPage(Object.assign({}, this.listQuery, this.formData, {status: "0"})).then( ({data}) => {
        this.userList = data.list;
        this.listQuery.total = data.total;
        this.loading = false;
      })
    },
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    operateSuccess() {
      this.handleQuery();
      this.deptTree()
    },
    handleCreate () {
      this.$refs.operate.init('create', this.formData.deptId);
    },
    handleUpdate (id) {
      this.$refs.operate.init('update', id);
    },
    handleDelete (ids) {
      this.$modal.confirm('是否确认删除用户?').then(function() {
        return userDeleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleAuthRole(row) {
      this.$refs.roleDrawer.init(row, 'user');
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      let confirmMessage = '确定重置[' + row.realName + ']的密码?'
      this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd({id: row.id}).then(res => {
          this.$modal.msgSuccess(res.message);
        })
      }).catch(() => {
      })
    },
    // handleStopGrant(ids){
    //   if(this.selectionData[0].cardGrantStatus === '0'){
    //     this.updateGrantStatus(this.selectionData[0].id,'1');
    //   }else{
    //     this.$modal.msgError("当前为停发状态,正常状态可操作停发");
    //   } 
    // },
    // handleRecovery(ids){
    //   if(this.selectionData[0].cardGrantStatus === '1'){
    //     this.updateGrantStatus(this.selectionData[0].id,'0');
    //   }else{
    //      this.$modal.msgError("当前为正常状态,停发状态可操作恢复");
    //   } 
    // },
    // updateGrantStatus(id,status){
    //   updateGrantStatus({id:id,cardGrantStatus:status}).then((res)=>{
    //     this.$modal.msgSuccess(res.message);
    //     this.getList();
    //   })
    // },
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
.custom_button {
  border: none !important;
  background: none !important;
  font-size: 12px;
  color: #000000;
}
</style>