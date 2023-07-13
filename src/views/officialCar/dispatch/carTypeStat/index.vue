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
            @queryTable="handleQuery"
            @numberChange="numberChange"
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
            <el-form-item label="车辆属性" prop="value">
              <el-select v-model="formData.vehicleProperties" placeholder="请选择车辆属性" clearable style="width:240px" size="small">
                <el-option v-for="item in vehiclePropertiesOptions"
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
          :showSummary='true'
          :getSummaries="getSummaries"
          :selectShow="false"
          @clickLink="clickLink"
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
    <export-dialog ref="export" :page-num="listQuery.pageNum" :page-size="listQuery.pageSize" :total="total" @exportFile="exportFile"/>
  </div>
</template>
<script>
import buttonTop from '@/components/buttonTop'
import formData from '@/components/formData'
import tableIndex from '@/components/tableIndex'
import indexMixin from '@/views/mixins'
import { getCarTypeStatByUnitLevel, VehicleTypeStatExportUrl } from '@/api/vehicleInfo'
import { axiosDownloadExcel } from '@/api/download'
import { getListByParentId } from '@/api/system/dict'
import exportDialog from '@/components/ExportDialog'

export default {
  name: 'searchVehicleInfo',
  components: { buttonTop, formData, tableIndex, exportDialog },
  mixins: [indexMixin],

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
      //日期范围
      dateRange: [],
      //列表显示字段
      property: {},
      //查询参数
      formData: {
        vehicleProperties:'',
      },
      //车辆属性数据
      vehiclePropertiesOptions:[],
      //已选中条目
      selectionData: [],
      //数据总数
      total: 0,
      numberShow: false
    }
  },
  created() {
    this.menuProperty()
    this.getList()
    this.getVehicleProperties();
  },
  activated() {
  },
  methods: {
    numberChange(val) {
      this.numberShow = val
    },
    //获取菜单数据
    menuProperty() {
      let id = this.$route.meta.id
      this.$store.dispatch('menuProperty', id).then((data) => {
        data.search.forEach((item) => {
          item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat))
        })
        this.property = data
      })
    },
    //获取分页数据
    getList() {
      this.loading = true
      getCarTypeStatByUnitLevel(Object.assign({}, this.listQuery, this.formData)).then(({ data }) => {
        this.dataList = data.list
        this.total = data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    //获取车辆属性
    async getVehicleProperties(){
        this.loading = true

        await getListByParentId('1528567883638267904').then(({ data }) => {
          this.loading = false
          this.vehiclePropertiesOptions = data
        }).catch(() => {
          this.loading = false
        })
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row)
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode) {
      if (buttonCode === 'export') {
        this.$refs.export.init()
      }
    },
    // 导出文件
    exportFile(pageInfo) {
      axiosDownloadExcel(VehicleTypeStatExportUrl, Object.assign({}, pageInfo, this.listQuery, this.formData))
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
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row)
      this.getList()
    },
    //清空状态数据
    handleResetDept() {
      this.formData.vehicleProperties = ''
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    //合计显示规则
    getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        let targetColumenIndex = this.numberShow ? 1:0;

        columns.forEach((column, index) => {
            if (index === targetColumenIndex) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));

            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0);
                sums[index] += '';
            } else {
                sums[index] = '';
            }
        });
        return sums;
    },
    // 链接跳转
    clickLink(row, fieldCode, linkText) {
      // console.log(row)
      // console.log(fieldCode)
      // console.log(linkText)
      // console.log(this.property)

      let name = linkText.substring(linkText.indexOf('/') + 1)
      let obj = this.property.fields.find((item) => {
          return item.fieldCode === fieldCode;
      })
      let params = null

      if (fieldCode === 'total') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y'
        }
      } else if (fieldCode === 'passengerCar1') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar2') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar3') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar4') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar5') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar6') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar7') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar8') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar9') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'passengerCar10') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:'客车',
          carType2:obj.fieldName,
        }
      } else if (fieldCode === 'truck') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:obj.fieldName,
        }
      } else if (fieldCode === 'specialCar') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:obj.fieldName,
        }
      } else if (fieldCode === 'pickUpTruck') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y',
          carType:obj.fieldName,
        }
      } else if (fieldCode === 'other') {
        params = {
          unitCode: row.unitCode,
          vehiclePropertiesList:[],
          enableTag:'Y',
          otherType:obj.fieldName,
        }
      }
      if(!!this.formData.vehicleProperties){
        this.$set(params, 'vehiclePropertiesList', [this.formData.vehicleProperties]);
      }
      this.$router.push({
        name: name,
        params
      })
    },
  }
}
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
