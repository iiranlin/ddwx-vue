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
      @clickLink="clickLink"
    />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
      style="margin-bottom: 30px;"
    />
  </div>
</template>

<script>
import { gcywVehicleRequestListVehiclePage, cancelVehicleRequest, confirmVehicleRequest } from "@/api/gcywVehicleRequest";
import indexMixin from "@/views/mixins";
export default {
  name: "myCar",
  mixins: [indexMixin],
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
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 30,
      },
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
      if(buttonCode === 'car'){
        this.$router.push({name:'apply'});
      }else if(buttonCode === 'againCar'){
        let rowObj = null;
        if(Object.keys(row).length == 0){
          rowObj = selectionArr[0];
        }else{
          rowObj = row;
        }
        this.$router.push({name:'apply',query: {row: JSON.stringify(rowObj)}});
      }else if(buttonCode === 'cancel'){
        this.vehicleRequest(id, 'cancelVehicleRequest', '是否取消？');
      }else if(buttonCode === 'confirm'){
        this.vehicleRequest(id, 'confirmVehicleRequest', '是否确认？');
      }
    },
    vehicleRequest (id, url, title) {
      let ids = id.map(item => {
        return {id: item};
      });
      this.$modal.confirm(title).then(() => {
        if(url == 'cancelVehicleRequest'){
          return cancelVehicleRequest(ids);
        }else{
          return confirmVehicleRequest(ids);
        }
      }).then(({message}) => {
        this.$modal.msgSuccess(message);
        this.handleQuery();
      }).catch(() => {});
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
      gcywVehicleRequestListVehiclePage(Object.assign({}, this.listQuery, this.formData)).then(
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
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    clickLink (row, fieldCode, linkText) {
      this.$router.push({name:'carDetail',params: {id: row.id}});
    }
  },
};
</script>