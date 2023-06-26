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
          style="margin-top:-12px;margin-bottom:6px"
        >
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
  </div>
</template>
<script>
import buttonTop from '@/components/buttonTop'
import formData from '@/components/formData'
import tableIndex from '@/components/tableIndex'
import indexMixin from '@/views/mixins'
import { getCarStatInfo, VehicleInfoStatExportUrl } from '@/api/vehicleInfo'
import { axiosDownloadExcel } from '@/api/download'

export default {
  name: 'searchVehicleInfo',
  components: { buttonTop, formData, tableIndex },
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
      formData: {},
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
      getCarStatInfo(Object.assign({}, this.listQuery, this.formData)).then(({ data }) => {
        this.dataList = data.list
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
    handleButton(ids, buttonCode) {
      if (buttonCode === 'export') {
        this.exportFile()
      }
    },
    // 导出文件
    exportFile() {
      axiosDownloadExcel(VehicleInfoStatExportUrl, Object.assign({}, this.listQuery, this.formData))
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
    // 链接跳转
    clickLink(row, fieldCode, linkText) {
      let name = linkText.substring(linkText.indexOf('/') + 1)
      let params = null
      if (fieldCode === 'ownCar') {
        params = {
          unitCode: row.unitCode,
          vehiclePropertiesList: ['1'],
          enableTag:'Y'
        }
      } else if (fieldCode === 'leaseCar') {
        params = {
          unitCode: row.unitCode,
          // 后台约定:传4时查询所有租赁车辆,包含短租和长租
          vehiclePropertiesList: ['2', '3'],
          enableTag:'Y'
        }
      } else if (fieldCode === 'overStandardCar') {
        params = {
          unitCode: row.unitCode,
          overStandardTag: 'Y',
          enableTag:'Y'
        }
      } else if (fieldCode === 'specialCar') {
        params = {
          unitCode: row.unitCode,
          carStatus: '0',
          enableTag:'Y'
        }
      } else if (fieldCode === 'mainFuelCard') {
        params = {
          unitCode: row.unitCode,
          isMcard: '0',
          enableTag:'Y'
        }
      } else if (fieldCode === 'childFuelCard') {
        params = {
          unitCode: row.unitCode,
          isMcard: '1',
          enableTag:'Y'
        }
      } else if (fieldCode === 'etcCard') {
        params = {
          unitCode: row.unitCode,
          enableTag:'Y'
        }
      }
      this.$router.push({
        name: name,
        params
      })
    },
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    //合计显示规则
    getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        let targetColumenIndex = this.numberShow ? 2:1;

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
  }
}
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
