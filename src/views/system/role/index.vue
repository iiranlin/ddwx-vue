<template>
  <div class="app-container_list">
  <el-row :gutter="20" class="container_h">
     <el-col :span="24" :xs="24" class="container_flex">
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col :span="1.5"  v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
            <button-top
                :item="item"
                :multiple="multiple"
                :single="single"
                @newButton="newButton"
                class="cume-button">
              </button-top>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top:4px; padding-right:20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset">
          </right-toolbar>
      </el-row>  
          <form-data
          :formData="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top:-12px;margin-bottom: 6px;"
        />
          <table-index
        ref="tableIndex"
        style="margin-top:-8px"
        :loading="loading"
        :tableData="dataList"
        :property="property"
        @handleSelectionChange="handleSelectionChange"
        @handleButton="handleButton"
        @selectChange="selectChange"
        @emitAblFilter="emitAblFilter" 
      />
      <pagination
      style="margin-bottom:35px"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
     </el-col>   
  </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess"/>
    <menuDrawer ref="menuDrawer" />
  </div>
</template>

<script>
import {rolePage, roleDeleteBatch} from '@/api/system/role';
import { menuProperty } from '@/api/system/menu'
import operate from "./components/operate";
import menuDrawer from "./components/menuDrawer.vue";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";
export default {
  name: "role",
  mixins: [indexMixin],
  components: { operate, menuDrawer ,tableIndex, formData, buttonTop },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      dataList: [],
      property: {},
      // 日期范围
      dateRange: [],
      // 数据范围选项
      sys_normal_disable: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "停用"
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 30,
      },
      // 表单参数
      formData: {
        roleName: '',
        status: ''
      },
      selectRadioData: null
    };
  },
  created() {
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
    handleButton(id, buttonCode) {
      console.log(id, buttonCode)
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'delete') {
        this.handleDelete(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      } else if (buttonCode === 'assignUser') {
        this.bindMenu(id)
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
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery);
      this.handleQuery();
    },
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    menuProperty () {
      let id = this.$route.meta.id;
      menuProperty(id).then( ({data}) => {
        data.search.forEach((item) => {
          if(item.fieldType == "dict"){
            item.fieldFormat = JSON.parse(item.fieldFormat)
          }
        })
        this.property = data;
        // this.$nextTick( () => {
        //   this.$refs.elTable.doLayout();
        // })
      })
    },
    /** 查询角色列表 */
    getList() {
      // let dateRange = this.dateRange;
      // if(dateRange){
      //   this.formData.startTime = dateRange[0];
      //   this.formData.endTime = dateRange[1];
      // }
      let formData = {}
      for(let key in this.formData){
        if(key!='createTime'){
          formData[key] = this.formData[key]
        }
      }
      this.loading = true;
      rolePage(Object.assign({}, this.listQuery, formData)).then( ({data}) => {
        this.dataList = data.list;
        console.log(this.dataList,'222')
        this.total = data.total;
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
    operateSuccess () {
      this.handleQuery();
    },

    handleCreate () {
      this.$refs.operate.init('create');
    },
    handleUpdate (id) {
      this.$refs.operate.init('update', id);
    },
    handleDelete (ids) {
      this.$modal.confirm('是否确认删除角色?').then(function() {
        return roleDeleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    bindMenu (row) {
      this.$refs.menuDrawer.init(row, 'role');
    }
  }
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>