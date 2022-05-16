<template>

  <div class="app-container container_flex">
    <el-row :gutter="10" class="mb8 container_flex_button">
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
        <button-top :item="item" :multiple="multiple" :single="single" @newButton="newButton"></button-top>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" :columns="property.fields" @queryTable="handleQuery" @handleCheckAllChange="handleCheckAllChange" @clickReset="clickReset"></right-toolbar>
    </el-row>
    <form-data :showSearch="showSearch" :searchArr="property.search || []" @handleQuery="handleQuery" />
    <table-index ref="tableIndex" :loading="loading" :tableData="list" :property="property"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
           />
    <pagination
    style="margin-bottom: 35px;"
      v-show="pageInfo.total>0"
      :total="pageInfo.total"
      :page.sync="pageInfo.pageNum"
      :limit.sync="pageInfo.pageSize"
      @pagination="getList"
    />
    <operate ref="operate" @menuSuccess="menuSuccess"/>
  </div>
</template>

<script>
import {menuPage, menuDeleteBatch, menuProperty} from '@/api/system/menu';
import operate from "./components/operate";
import {table_label} from "./components/table-label";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";
export default {
  name: "Menu",
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
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      fields: table_label(),
      property:{},
      buttonRow: [{
          icon: "el-icon-edit",
          buttonCode: "update",
          buttonName: "修改",
        },{ 
          icon: "el-icon-delete",
          buttonCode: "delete",
          buttonName: "删除",
        },
      ],
      // 列信息
      // columns: [
      //   { key: 0, label: `菜单名称`, visible: true },
      //   { key: 1, label: `状态`, visible: true },
      //   { key: 2, label: `创建时间`, visible: true },
      //   { key: 3, label: `更新时间`, visible: true },
      // ],
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
      // 查询参数
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
      // 表单参数
      formData: {
        menuName: '',
        status: '',
      },
      visible: false,
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    menuProperty() {
      let id = this.$route.meta.id;
      menuProperty(id).then(({ data }) => {
        data.search.forEach((item) => {
          if (item.fieldType == "dict") {
            item.fieldFormat = JSON.parse(item.fieldFormat);
          }
          // this.formData[item.fieldCode] = ''
        });
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
    renderHeader(h, {column, $index}, index) {
        return (
            <span>
                问题分类
                <el-popover placement='bottom' width='200' height='200' trigger="click" v-model={this.visible}>
                    <span slot="reference">
                        <i class="el-icon-search" style={this.formData.menuName ? {'color' : 'red'} : {'color': 'blue'}}></i>
                    </span>
                    <el-input size='small' v-model={this.formData.menuName} placeholder='请输入内容'></el-input>
                    <div class='el-table-filter__bottom'>
                        <button class={this.formData.menuName ? '' : 'is-disabled'} on-click={this.handleQuery}>筛选</button>
                        <button on-click={this.clearSearch}>重置</button>
                    </div>
                </el-popover>
            </span>
        );
    },
    clearSearch () {
      this.formData.menuName = '';
      this.getList();
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
    menuSuccess () {
      this.handleQuery();
    },
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      menuPage(Object.assign({}, this.pageInfo, this.formData)).then( ({data}) => {
        this.list = data.list;
        this.pageInfo.total = data.total;
        this.loading = false;
      })
    },
    // 序号
     rowOnlineTableColumIndex({row,rowIndex}){
      row.index=rowIndex+1
    },
    handleCreate () {
      this.$refs.operate.init('create');
    },
    operate(type,row){
      switch(type){
        case "update":
          this.handleUpdate(row)
          break;
        case "delete":
          this.handleDelete(row)
          break;
        default:
          break;
      }
    },
    handleUpdate (id) {
      // let id = '';
      // if(row){
      //   id = row.id;
      // }else{
      //   id = this.ids[0];
      // }
      this.$refs.operate.init('update', id);
    },
    handleDelete (id) {
      // let ids = row.id || this.ids;
      // if(!(ids instanceof Array)){
      //   ids = [ids];
      // }
      this.$modal.confirm('是否确认删除菜单?').then(function() {
        return menuDeleteBatch({ids:id});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    
  }
};
</script>
<style lang="scss" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>