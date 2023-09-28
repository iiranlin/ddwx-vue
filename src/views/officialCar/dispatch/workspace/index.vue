<template>
  <div class="app-container container_flex">
    <!--用户数据-->
    <el-row :gutter="24" class="mb8 container_flex_button">
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
      :showSearch="showSearch"
      :searchArr="property.search || []"
      @handleQuery="handleQuery"
      @handleResetDept="handleResetDept">
      <template slot="customItemStar">
        <el-form-item label="使用部门" prop="value">
           <select-tree 
              style="width:240px"
              :value="formData.deptId"
              :options="deptOptions"
              @getValue="deptIdChange($event)"/>
        </el-form-item>
      </template>
      <template slot="customItem">
        <el-form-item label="状态" prop="value">
          <el-select v-model="formData.statusList" placeholder="请选择状态" clearable style="width:240px" size="small" multiple>
              <el-option v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.code"
                  @click.native="handleStatusClick(item)">
              </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="customItem">
        <el-form-item label="出发时间" prop="value">
            <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleDateChange"/>
        </el-form-item>
      </template>
    </form-data>
    <div class="auto-refresh">
        <el-checkbox v-model="autoChecked" @change='autoChange'>自动更新</el-checkbox>
        <span>( 开启后每分钟更新一次数据 )</span>
    </div>
    <table-index
      ref="tableIndex"
      :loading="loading"
      :tableIndexs="tableIndex"
      :numberShow="numberShow"
      :tableData="dataList"
      :property="property"
      menuName='workspace'
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
    <operate ref="operate" @unitSuccess="handleQuery"/>
    <edit-assembly ref="editAssembly" @updateSuccess="handleQuery"/>
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
  </div>
</template>

<script>
import { gcywVehicleRequestDispatchList, cancelVehicleRequest, updateRessUnit } from '@/api/gcywVehicleRequest'
import operate from './components/operate'
import editAssembly from './components/editAssembly'
import indexMixin from '@/views/mixins'
import { getDisAvailableUnit } from '@/api/system/unit'
import { getAllAvailableDept } from "@/api/dept"
import { deptTree } from "@/api/system/dept";
import selectTree from "@/components/selectTree";
import {getListByParentId} from "@/api/system/dict"

export default {
  name: 'workspace',
  mixins: [indexMixin],
  components: { operate, editAssembly,selectTree},
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
      //日期范围
      dateRange:[],
      //用车单位数据
      unitOptions:[],
      //使用部门数据
      deptOptions:[],
      //状态数据
      statusOptions:[],
      // 弹出层标题
      title: '',
      //列表显示字段
      property: {},
      //是否开启自动更新
      autoChecked:false,
      //定时器
      timer:null,
      selectionData: [],
      // 查询参数
      formData: {
        parentId: '',
        unitCode:'',
        deptId: '',
        statusList:['4'],
        usageDateStart: this.parseTime(new Date().getTime(),'{y}-{m}-{d}'),
        usageDateEnd: this.parseTime(new Date().getTime(),'{y}-{m}-{d}'),
      },
      form: {
        closeReason: ''
      },
      rules: {
        closeReason: [{ required: true, message: '请输入取消原因', trigger: 'blur' }]
      },
      total: 0,
      openWorkflow: false
    }
  },
  beforeDestroy(){
    clearInterval(this.timer);
    this.timer = null;
  },
  created() {
    this.dateRange = [this.formData.usageDateStart,this.formData.usageDateEnd];

    this.getStatusOptions();
    this.getDeptOptions();
    this.menuProperty();
    this.getList();
  },
  mounted() {
  },
  methods: {
    //查询部门数据
    getDeptOptions(){
        this.loading = true;
        deptTree({unitCode: "cr"}).then( ({ data }) => {
            this.loading = false;
            this.deptOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
    },
    deptIdChange (val) {
        this.formData.deptId = val;
    },
    //获取状态信息
    getStatusOptions(){
        this.loading = true;
        
        getListByParentId("1522830760585670657").then(({data}) => {
           this.statusOptions = data;
           this.statusOptions.unshift({
             name:'全部',
             code:'',
           })
           this.loading = false;
           
        }).catch((err) => {
            this.loading = false;
        })
    },
    //状态选择回调
    handleStatusClick(item){
        if(item.code == ''){
          this.formData.statusList = [''];
        }else{
          let index =  this.formData.statusList.findIndex((statusItem) => {
            return !statusItem;
          })
          if(index !== -1){
            this.formData.statusList.splice(index, 1)
          }
        }
    },
    //自动更新选择回调
    autoChange(val){
      if(val){
          this.timer = setInterval(() => {
            this.handleResetDept();
            this.handleQuery();
          }, 1000*60*1);
      }else{
        clearInterval(this.timer)
      }
    },
    //出发时间回调
    handleDateChange(){
        if(this.dateRange && this.dateRange.length != 0){
          this.formData.usageDateStart = this.dateRange[0];
          this.formData.usageDateEnd = this.dateRange[1];
        }else{
          this.formData.usageDateStart = "";
          this.formData.usageDateEnd = "";
        }
    },
    menuProperty() {
      const id = this.$route.meta.id
      this.$store.dispatch('menuProperty', id).then((data) => {
        this.property = data
      })
    },
    numberChange(val) {
      this.numberShow = val
    },
    newButton(buttonCode) {
      this.$refs.tableIndex.newButton(buttonCode)
    },
    handleButton(id, buttonCode, row, selectionArr) {
      let rowObj = null
      if (Object.keys(row).length == 0) {
        rowObj = selectionArr[0]
      } else {
        rowObj = row
      }
      if (buttonCode === 'sendVehicle') {
        if (('4').indexOf(rowObj.status) == -1 || rowObj.reassignStr == '1') {
          this.$modal.msgWarning('当前状态不能派车！')
          return
        }
        this.$router.push({ name: 'dispatchACar', query: { row: JSON.stringify(rowObj), buttonCode: buttonCode } })
      } else if (buttonCode === 'reassignment') {
        if (('5/7/8').indexOf(rowObj.status) == -1 || rowObj.reassignStr == '1') {
          this.$modal.msgWarning('当前状态不能改派！')
          return
        }
        this.$router.push({ name: 'dispatchACar', query: { row: JSON.stringify(rowObj), buttonCode: buttonCode } })
      } else if (buttonCode === 'edit') {
        if (rowObj.reassignStr == '1') {
          this.$modal.msgWarning('当前状态不能编辑！')
          return
        }
        this.$refs.editAssembly.init(rowObj)
      } else if (buttonCode === 'cancel') {
        this.vehicleRequest(rowObj, '是否取消？')
      } else if (buttonCode === 'turnSingle') {
        if (('4').indexOf(rowObj.status) == -1 || ('0/1').indexOf(rowObj.reassignStr) != -1) {
          this.$modal.msgWarning('当前状态不能转派！')
          return
        }
        this.$refs.operate.init(rowObj)
      } else if (buttonCode === 'reassignReject') {
        console.log(('5').indexOf(rowObj.status))
        if (rowObj.reassignStr != '0' || ('5').indexOf(rowObj.status) != -1) {
          this.$modal.msgWarning('当前状态不能转派拒绝！')
        } else {
          this.$confirm(`确定拒绝转派吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            updateRessUnit([{ id: rowObj.id }]).then(({ message }) => {
              this.$modal.msgSuccess(message)
              this.handleQuery()
            })
          })
        }
      } else if (buttonCode === 'reassignCancel') {
        if (rowObj.reassignStr != '1' || ('5').indexOf(rowObj.status) != -1) {
          this.$modal.msgWarning('当前状态不能转派取消！')
        } else {
          this.$confirm(`确定取消转派吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            updateRessUnit([{ id: rowObj.id }]).then(({ message }) => {
              this.$modal.msgSuccess(message)
              this.handleQuery()
            })
          })
        }
      }
    },
    vehicleRequest(rowObj, title) {
      let ids = []
      let type = [], reassignStr = []
      if (this.selectionData.length <= 1) {
        let driverIds = rowObj.reqAssignments.map(item => {
          return { id: item.id, driverId: item.driverId }
        })
        ids = [{ id: rowObj.id, reqAssignments: driverIds }]
        type.push({ status: rowObj.status, reassignStr: rowObj.reassignStr })
      } else {
        ids = this.selectionData.map(item => {
          let driverIds = item.reqAssignments.map(items => {
            return { id: items.id, driverId: items.driverId }
          })
          type.push({ status: item.status, reassignStr: item.reassignStr })
          return { id: item.id, reqAssignments: driverIds }
        })
      }
      for (let i = 0; i < type.length; i++) {
        if (('4/5/7/8').indexOf(type[i].status) == -1 || ('1').indexOf(type[i].reassignStr) != -1) {
          this.$modal.msgWarning('当前状态不能取消！')
          return
        }
      }
      if (this.$refs.elForm) this.$refs.elForm.resetFields()
      this.openWorkflow = true
      this.ids = ids
    },
    cancelVehicleRequest() {
      this.$refs.elForm.validate(async(result) => {
        if (result) {
          let ids = this.ids.map(item => {
            return { id: item.id, reqAssignments: item.reqAssignments, closeReason: this.form.closeReason }
          })
          this.loadingCloseReason = true
          cancelVehicleRequest(ids).then(({ message }) => {
            this.$modal.msgSuccess(message)
            this.loadingCloseReason = false
            this.openWorkflow = false
            this.handleQuery()
          }).finally(() => {
            this.loadingCloseReason = false
          })
        }
      })
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns)
    },
    //选择框回调
    selectChange(row) {
      let { formData, isWatch } = row
      if (!isWatch) {
        this.handleQuery(formData)
      } else {
        this.formData = Object.assign({}, this.formData, formData)
      }
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery)
      this.handleQuery()
    },
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row)
      this.getList()
    },
    getList() {
      this.loading = true
      gcywVehicleRequestDispatchList(Object.assign({}, this.listQuery, this.formData)).then(
        ({ data }) => {
          this.dataList = data.list
          this.total = data.total
          this.loading = false
        }
      )
    },
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single
      this.multiple = multiple
      this.selectionData = selection
    },
    //清空用车单位数据
    handleResetDept(){
        this.formData.unitCode = "";
        this.formData.deptId = "";
        this.formData.statusList = ['4'];
        this.formData.usageDateStart = this.parseTime(new Date().getTime(),'{y}-{m}-{d}');
        this.formData.usageDateEnd =  this.parseTime(new Date().getTime(),'{y}-{m}-{d}');
        this.dateRange = [this.formData.usageDateStart,this.formData.usageDateEnd];
    },
    clickReset() {
      this.menuProperty()
      this.handleQuery()
    },
    clickLink(row, fieldCode, linkText) {
      this.$router.push({ name: 'carDetail', query: { id: row.id } })
    },
  }
}
</script>
<style lang="scss" scoped>
.auto-refresh {
  height: 30px;
  padding-left: 10px;

  span {
    margin-left: 5px;
    font-size: 12px;
  }

  ::v-deep.el-checkbox__label {
    font-size: 15px;
    font-weight: 600;
}
}
</style>
