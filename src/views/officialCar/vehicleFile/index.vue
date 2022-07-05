<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0;">
            <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              @newButton="newButton"
              class="cume-button"
            >
            </button-top>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top:4px;padding-right:20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @numberChange="numberChange"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
          >
          </right-toolbar>
        </el-row>
        <!--搜索条件按钮-->
        <form-data
          :formDta="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          @handleResetDept="handleResetDept"
          style="margin-top:-12px;margin-bottom:6px"
        >
          <template slot="customItem">
            <el-form-item label="状态" prop="value">
              <el-select v-model="formData.carStatus" placeholder="请选择状态" clearable style="width:240px" size="small">
                <el-option v-for="item in statusOptions"
                           :key="item.value"
                           :label="item.name"
                           :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </form-data>
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          style="margin-top:-8px"
          :tableIndexs="tableIndex"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          :numberShow="numberShow"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        >
        </table-index>
        <!--分页器-->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
          style="margin-bottom:40px"
        />
      </el-col>
    </el-row>
    <!--图片弹出框-->
    <operate ref="operate"></operate>
    <car-model ref="model"></car-model>
  </div>
</template>
<script>
import buttonTop from '@/components/buttonTop'
import formData from '@/components/formData'
import tableIndex from '@/components/tableIndex'
import operate from './components/operate'
import { vehicleInfoListPage, vehicleInfoGetVehicleFile } from '@/api/driver'
import { getListByParentCode } from '@/api/system/dict'
import indexMixin from '@/views/mixins'
import carModel from '@/views/officialCar/vehicleFile/components/carModel'

export default {
  name: 'vehicleFile',
  mixins: [indexMixin],
  components: { buttonTop, formData, tableIndex, operate, carModel },

  data() {
    return {
      //遮罩层
      loading: false,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //显示搜索条件
      showSearch: true,
      //表格数据
      dataList: [],
      //状态数据
      statusOptions: [],
      //日期范围
      dateRange: [],
      //列表显示字段
      property: {},
      //查询参数
      formData: {
        carStatus: ''
      },
      //已选中条目
      selectionData: [],
      //图片名称数据
      fileNames: [],
      //数据总数
      total: 0,
      numberShow: false
    }
  },
  created() {
    this.menuProperty()
    this.getStatusOptions()
    if (this.$route.params) {
      this.formData = this.$route.params
    }
    this.getList()
  },
  methods: {
    numberChange(val) {
      this.numberShow = val
    },
    //获取状态信息
    async getStatusOptions() {
      this.loading = true
      await getListByParentCode('carStatus').then(({ data }) => {
        this.loading = false
        this.statusOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //获取菜单数据
    menuProperty() {
      let id = this.$route.meta.id
      this.$store.dispatch('menuProperty', id).then((data) => {
        data.search.forEach((item) => {
          item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat))
        })
        this.property = data
        console.log(this.property.search)

      })
    },
    //获取分页数据
    async getList() {
      this.loading = true

      await vehicleInfoListPage(Object.assign({}, this.listQuery, this.formData, { type: '1' })).then(({ data }) => {
        this.dataList = data.list
        this.dataList.forEach((item) => {
          if (!item.overStandardTag) {
            item.overStandardTag = 'N'
          }
        })
        this.total = data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row)
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode, row) {
      if (buttonCode === 'detail') {
        this.$router.push({ name: 'vehicleFileDetail', query: { row: JSON.stringify(row) } })
      } else if (buttonCode === 'image') {
        vehicleInfoGetVehicleFile({ vinNumber: row.vinNumber }).then(({ data }) => {
          this.fileNames = data
          if (this.fileNames.length === 0) {
            this.$modal.msgWarning('暂无图片信息!')
          } else {
            this.$refs.operate.init(this.fileNames)
          }
        })
      } else if (buttonCode === 'model') {
        this.$refs.model.init(row.carBrand + row.carSeries)
      }
    },
    //顶部列字段展示
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns)
    },
    //顶部重置按钮
    clickReset() {
      this.menuProperty()
      this.handleQuery()
    },
    //表格内部搜索条件回调
    selectChange(row) {
      let { formData, isWatch } = row
      if (!isWatch) {
        this.handleQuery(formData)
      } else {
        this.formData = Object.assign({}, this.formData, formData)
      }
    },
    //表格内部排序
    emitAblFilter() {
      this.getList()
    },
    //多选获取行数据
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single
      this.multiple = multiple
      this.selectionData = selection
    },
    //新建或修改成功回调
    operateSuccess() {
      this.handleQuery()
    },
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row)
      this.getList()
    },
    //清空状态数据
    handleResetDept() {
      this.formData.carStatus = ''
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1
    }
  }
}
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
