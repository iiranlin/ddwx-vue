<template>
<div class="app-container container_flex">
      <!--用户数据-->
    <el-row :gutter="24" class="mb8 container_flex_button" >
      <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id">
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
      style="margin-bottom: 30px;"
    />
    <operate ref="operate" @addressSuccess="addressSuccess"/>
  </div>
</template>

<script>
import { gcjcCommonAddressListPage, gcjcCommonAddressDelAdress } from "@/api/gcjcCommonAddress";

import operate from "./components/operate";
import indexMixin from "@/views/mixins";
export default {
  name: "oftenAddress",
  mixins: [indexMixin],
  components: { operate },
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
      formData: {
        parentId: "",
      },
      total: 0
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
    handleButton(id, buttonCode, row,selection) {
      if (buttonCode === 'update') {
        let rowObj = null;
        if(Object.keys(row).length == 0){
          rowObj = this.selectionData[0];
        }else{
          rowObj = row;
        }
        this.handleUpdate(rowObj)
      } else if (buttonCode === 'delete') {
        this.handleDelete(selection)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
    handleCreate() {
      this.$refs.operate.init("create");
    },
    handleUpdate(row) {
      this.$refs.operate.init("update", row);
    },
    handleDelete(selection) {
      let ids = [];
      selection.forEach((item) => {
        ids.push({id: item.id,deleteTag: 1,userId:item.userId})
      })
      this.$modal.confirm("是否确认删除?").then(function () {
        return gcjcCommonAddressDelAdress(ids);
      }).then(() => {
        this.handleQuery();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleUpdate(id) {
      this.$refs.operate.init("update", id);
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
      gcjcCommonAddressListPage(Object.assign({}, this.listQuery, this.formData)).then(
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
    addressSuccess() {
      this.handleQuery();
    },
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
  },
};
</script>
