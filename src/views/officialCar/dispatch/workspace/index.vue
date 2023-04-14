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
        <el-form-item label="用车单位" prop="value">
        <el-select v-model="formData.unitCode" placeholder="请选择用车单位" clearable style="width:240px" size="small">
            <el-option v-for="item in unitOptions"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
                @click.native="handleUnitChange(item.unitCode)">
            </el-option>
        </el-select>
        </el-form-item>
    </template>
    <template slot="customItemStar">
      <el-form-item label="使用部门" prop="value">
        <el-select v-model="formData.deptId" placeholder="请选择使用部门" clearable style="width:240px" size="small">
            <el-option v-for="item in deptOptions"
                :key="item.value"
                :label="item.deptName"
                :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
    </template>
    </form-data>
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
import indexMixin from '@/views/mixins'
import operate from './components/operate'
import editAssembly from './components/editAssembly'
import { getDisAvailableUnit } from '@/api/system/unit'
import { getAllAvailableDept } from "@/api/dept"

export default {
  name: 'workspace',
  mixins: [indexMixin],
  components: { operate, editAssembly },
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
      //用车单位数据
      unitOptions:[],
      //使用部门数据
      deptOptions:[],
      // 弹出层标题
      title: '',
      //列表显示字段
      property: {},
      selectionData: [],
      // 查询参数
      formData: {
        parentId: '',
        unitCode:'',
        deptId: '',
        status:'4',
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
  created() {
    this.menuProperty();
    this.getUnitOptions();
    this.getList();
  },
  mounted() {
  },
  methods: {
    //获取用车单位信息
    async getUnitOptions() {
        this.loading = true
        await getDisAvailableUnit().then(({ data }) => {
            this.loading = false
            this.unitOptions = data;
        }).catch((err) => {
            this.loading = false
        })
    },
    //用车单位选择回调
    handleUnitChange(unitCode){
        this.handleQueryDept(unitCode)
    },
    //查询部门数据
    handleQueryDept(unitCode){
        this.formData.deptId = "";
        this.loading = true;
        getAllAvailableDept({unitCode: unitCode}).then( ({ data }) => {
            this.loading = false;
            this.deptOptions = data;
        }).catch((err) => {
            this.loading = false;
        })
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
    },
    clickReset() {
      this.menuProperty()
      this.handleQuery()
    },
    clickLink(row, fieldCode, linkText) {
      this.$router.push({ name: 'carDetail', query: { id: row.id } })
    }
  }
}
</script>
