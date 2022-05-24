<template>
  <div class="app-container container_flex">
    <el-row :gutter="24" class="mb8 container_flex_button" >
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
        <button-top
          :item="item"
          :multiple="multiple"
          :single="single"
          @newButton="newButton"
        ></button-top>
      </el-col>
      <right-toolbar
        style="margin-top:4px; padding-right:20px"
        :showSearch.sync="showSearch"
        :columns="property.fields"
        @queryTable="handleQuery"
        @handleCheckAllChange="handleCheckAllChange"
        @clickReset="clickReset"
        @numberChange="numberChange"
      ></right-toolbar>
    </el-row>
    <form-data
      :formData="formData"
      :showSearch="showSearch"
      :searchArr="property.search || []"
      @handleQuery="handleQuery"
    />
    <table-index
      ref="tableIndex"
      :loading="loading"
      :tableIndexs="tableIndex"
      :numberShow="numberShow"
      :tableData="dataList"
      :property="property"
      @handleSelectionChange="handleSelectionChange"
      @handleButton="handleButton"
      @selectChange="selectChange"
      @emitAblFilter="emitAblFilter"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
      style="margin-bottom: 35px;"
    />
    <workflow ref="workflow" @carSuccess="carSuccess"/>
    <operate ref="operate" @carSuccess="carSuccess"/>
  </div>
</template>

<script>
import { activitiListPage } from "@/api/system/activiti";

import operate from "./components/operate";
import workflow from "./components/workflow";
import indexMixin from "@/views/mixins";
export default {
  name: "examineCar",
  mixins: [indexMixin],
  components: { operate, workflow },
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
      // 表格序号是否展示
      numberShow: false,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      //列表显示字段
      property: {},
      selectionData: [],
      // 查询参数
      formData: {},
      total: 0,
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  mounted() {},
  methods: {
    menuProperty() {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    numberChange (val) {
      this.numberShow = val;
    },
    newButton (buttonCode) {
      this.$refs.tableIndex.newButton(buttonCode)
    },
    handleButton(id, buttonCode, row, selectionArr) {
      if(buttonCode === 'examine'){
        if(selectionArr[0].status == 1 || selectionArr[0].status == 2){
          if(selectionArr[0].workflowId){
            if(selectionArr[0].procInstId){
              if(selectionArr[0].endTimeMe){
                this.$modal.msgWarning('你不是审批人！');
              }else{
                this.$refs.operate.init(selectionArr[0]);
              }
            }else{
              this.$modal.msgWarning('你不是审批人！');
            }
          }else{
            this.$refs.workflow.init(selectionArr[0]);
          }
        }else{
          this.$modal.msgWarning('该单据不能审批！');
        }
      }
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    //选择框回调
    selectChange(row) {
      let {formData, isWatch} = row;
      if(!isWatch){
        this.handleQuery(formData);
      }else{
        this.formData = Object.assign({}, this.formData, formData);
      }
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery);
      this.handleQuery();
    },
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    getList() {
      this.loading = true;
      activitiListPage(Object.assign({}, this.listQuery, this.formData)).then(
        ({ data }) => {
          this.dataList = data.list;
          this.total = data.total;
          this.loading = false;
        }
      );
    },
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    carSuccess() {
      this.handleQuery();
    },
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
  },
};
</script>