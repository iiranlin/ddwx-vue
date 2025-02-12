<template>
  <div class="app-container_tree">
    <el-row :gutter="20" class="container_h">
      <!--菜单数据-->
      <el-col :span="4" :xs="24" class="container_flex_overflow">
        <div class="head-container">
          <el-tree
            class="drawer-tree"
            :indent="0"
            :data="menuOptions"
            :props="defaultPropsMenu"
            :expand-on-click-node="false"
            ref="tree"
            :highlight-current="true"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24" class="container_flex">
        <el-row :gutter="10" class="mb8 container_flex_button container_flex-right_tree">
          <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
            <button-top :item="item" :multiple="multiple" :single="single" @newButton="newButton"></button-top>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch"  @numberChange="numberChange" :columns="property.fields" @queryTable="handleQuery" @handleCheckAllChange="handleCheckAllChange" @clickReset="clickReset"></right-toolbar>
        </el-row>
        <form-data :showSearch="showSearch" :searchArr="property.search || []" @handleQuery="handleQuery" />
        <table-index ref="tableIndex" :loading="loading" :tableData="menuList" :property="property"
              :tableIndexs="tableIndex"
              @handleSelectionChange="handleSelectionChange"
                     :numberShow="numberShow"
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
    <operate ref="operate" :menuId="formData.menuId" @operateSuccess="operateSuccess" />
  </div>
</template>

<script>
import {menuTree} from '@/api/system/menu';
import {menuFieldPage, menuFieldDeleteBatch} from '@/api/system/menu-field';
import operate from "./components/operate";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";
export default {
  name: "MenuField",
  mixins: [indexMixin],
  components: { operate, tableIndex, formData, buttonTop },
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
      // 字段表格数据
      menuList: [],
      // 菜单列表
      menuOptions: [],
      defaultPropsMenu: {
        children: "children",
        label: "menuName"
      },
      // 日期范围
      dateRange: [],
      // 字段信息
      fields:[],
      searchs:[],
      buttons:[],
      align: {
        "left":"居左",
        "center":"居中",
        "right":"居右",
      },
      // 列信息
      columns: [
        { key: 0, label: `字段名称`, visible: true },
        { key: 1, label: `状态`, visible: true },
        { key: 2, label: `创建时间`, visible: true },
        { key: 3, label: `更新时间`, visible: true },
      ],
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
      // 表单参数
      formData: {
        fieldName: '',
        status: '',
        menuId: ''
      },
      visible: false,
      property:{},
      numberShow: false
    };
  },
  created() {
    // 获得菜单树
    this.getMenuTree();
    this.menuProperty();
    this.getList();
  },
  methods: {
    numberChange(val) {
      this.numberShow = val
    },
    menuProperty() {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    newButton(buttonCode) {
        this.$refs.tableIndex.newButton(buttonCode);
    },
    handleButton(id, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'delete') {
        this.handleDelete(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
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
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    handleQuery (row) {
      this.formData = Object.assign({},this.formData,row)
      this.getList();
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    emitAblFilter () {
      this.dateRange = [];
      this.getList();
    },
    operateSuccess () {
      this.handleQuery();
    },
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleNodeClick (data) {
      this.formData.menuId = data.id;
      if(data.id){
        this.handleQuery();
      }
    },
    getMenuTree () {
      menuTree().then( ({data}) => {
        this.menuOptions = data;
      })
    },
    /** 查询字段列表 */
    getList() {
      this.loading = true;
      menuFieldPage(Object.assign({}, this.listQuery, this.formData)).then( ({data}) => {
        this.menuList = data.list;
        this.total = data.total;
        this.loading = false;
      })
    },
     rowOnlineTableColumIndex({row,rowIndex}){
      row.index=rowIndex+1
    },
    handleCreate () {
      this.$refs.operate.init('create');
    },
    handleUpdate (id) {
      this.$refs.operate.init('update', id);
    },
    handleDelete (id) {
      this.$modal.confirm('是否确认删除字段?').then(function() {
        return menuFieldDeleteBatch({ids:id});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>
