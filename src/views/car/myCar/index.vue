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
    <el-dialog title="取消" :visible.sync="openWorkflow" width="600px" :close-on-click-modal="false" append-to-body>
        <el-form ref="elForm" :model="form" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="取消原因:" prop="closeReason">
                <el-input
                  type="textarea"
                  placeholder="请输入取消原因"
                  v-model="form.closeReason"
                  maxlength="100"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cancelVehicleRequest" :loading="loadingCloseReason">确 定</el-button>
          <el-button @click="openWorkflow = false">取 消</el-button>
        </div>
    </el-dialog>
    <!--弹出框-->
    <operate ref="operate" @operateSuccess="operateSuccess"></operate>
  </div>
</template>

<script>
import { gcywVehicleRequestListVehiclePage, cancelVehicleRequest, confirmVehicleRequest } from "@/api/gcywVehicleRequest";
import {gcywVehicleRequestDispatchList} from "@/api/car"
import operate from "./components/operate"
import indexMixin from "@/views/mixins";
export default {
  name: "myCar",
  components:{operate},

  mixins: [indexMixin],
  data() {
    return {
      // 遮罩层
      loading: false,
      loadingCloseReason: false,
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
      form: {
        closeReason: ''
      },
      rules: {
        closeReason:[{required:true,message:"请输入取消原因",trigger:"blur"}]
      },
      total: 0,
      openWorkflow: false,
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
        this.vehicleRequest(id, row, 'cancelVehicleRequest', '是否取消？');
      }else if(buttonCode === 'confirm'){
        this.vehicleRequest(id, row, 'confirmVehicleRequest', '是否确认？');
      }else if(buttonCode === 'evaluate'){
        this.handleEvaluate();
      }
    },
    vehicleRequest (id, row, url, title) {
      if(Object.keys(row).length == 0){
        for (const item of this.selectionData) {
          if(url == 'confirmVehicleRequest'){
            if(item.status != 10){
              this.$modal.msgWarning('该状态不能确认');
              return false;
            }
          }else if(url == 'cancelVehicleRequest') {
            if(item.status >= 5){
              this.$modal.msgWarning('该状态不能取消');
              return false;
            }
          }
        }
      }else{
        if(url == 'confirmVehicleRequest'){
          if(row.status != 10){
            this.$modal.msgWarning('该状态不能确认');
            return false;
          }
        }else if(url == 'cancelVehicleRequest') {
          if(row.status >= 5){
            this.$modal.msgWarning('该状态不能取消');
            return false;
          }
        }
      }
      let ids = [];
      ids = id.map(item => {
        return {id: item};
      });
      if(url == 'cancelVehicleRequest'){
        if(this.$refs.elForm) this.$refs.elForm.resetFields();
        this.openWorkflow = true;
        this.ids = ids;
        return
      }
      this.$modal.confirm(title).then(() => {
          return confirmVehicleRequest(ids);
      }).then(({message}) => {
        this.$modal.msgSuccess(message);
        this.handleQuery();
      }).catch(() => {});
    },
    operateSuccess(){
      this.getList();
    },
    cancelVehicleRequest () {
      this.$refs.elForm.validate(async (result) => {
        if (result) {
          let ids = this.ids.map(item => {
            return {id: item.id, closeReason: this.form.closeReason};
          });
          this.loadingCloseReason = true;
          cancelVehicleRequest(ids).then( ({message}) => {
            this.$modal.msgSuccess(message);
            this.loadingCloseReason = false;
            this.openWorkflow = false;
            this.handleQuery();
          }).finally(() => {
            this.loadingCloseReason = false;
          })
        }
      })
    },
    handleEvaluate(){
      if(this.selectionData[0].status !== 10 && this.selectionData[0].status !== 11){
        this.$modal.msgWarning('该状态不能进行评价');
        return;
      }
      this.loading = true;

      gcywVehicleRequestDispatchList({id:this.selectionData[0].id}).then(({data}) => {
          this.loading = false;

          let carInfo = data.list[0].reqAssignments;
          this.checkEvaluate(carInfo)
      }).catch((err) => {
          this.loading = false;
      })
    },
    checkEvaluate(carInfo){
      let waitArr = carInfo.filter((item) => {
        return !item.evaluateLevel;
      })
      if(waitArr.length === 0){
        this.$modal.msgWarning('此订单已完成评价，无法再次进行评价!')
      }else{
        this.$refs.operate.init(waitArr);
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
      this.$router.push({name:'carDetail',query: {id: row.id}});
    }
  },
};
</script>
