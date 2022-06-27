<template>
  <div class="app-container_list refueling-record">
    <el-row
      :gutter="20"
      class="container_h"
    >
      <el-col
        :span="24"
        :xs="24"
        class="container_flex"
      >
        <!--顶部按钮-->
        <el-row
          :gutter="24"
          class="container_flex-right_list"
        >
          <el-col
            :span="1.5"
            v-for="item in property.buttonTop"
            :key="item.id"
            style="margin-top:2px;padding:0px;"
          >
            <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              :upload-url="uploadUrl"
              @uploadOnSuccess="uploadOnSuccess"
              @uploadOnError="uploadOnError"
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
          style="margin-top:-12px;margin-bottom:6px"
        >
        </form-data>
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          :tableIndexs="tableIndex"
          style="margin-top:-8px"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          :numberShow="numberShow"
          :selectShow="false"
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

import indexMixin from '@/views/mixins'
import { carContractExportUrl, carContractImportUrl, carContractTemplateUrl, getCarContract } from '@/api/fee'
import { axiosDownloadExcel } from '@/api/download'
import exportDialog from '@/components/ExportDialog'

export default {
  name: 'outsourcingBusiness',
  mixins: [indexMixin],
  components: { exportDialog },
  data() {
    return {
      //遮罩层
      loading: false,
      //非单个禁用
      single: false,
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
      // 按钮类型 增删更新
      buttonCode: '',
      rowId: '',
      uploadUrl: carContractImportUrl,
      numberShow: false,
    }
  },
  computed: {},
  watch: {},
  activated() {
    // this.menuProperty();
    // this.getList()
  },
  created() {
    this.menuProperty()
    this.getList()
  },
  methods: {
    numberChange(val) {
      this.numberShow = val;
    },
    //查询菜单数据
    async menuProperty() {
      let id = this.$route.meta.id
      this.property = await this.$store.dispatch('menuProperty', id)
    },
    //获取分页数据
    async getList() {
      this.loading = true
      try {
        const params = {
          ...this.listQuery,
          ...this.formData
        }
        const { data = {} } = await getCarContract(params)
        this.dataList = data.list
        this.total = data.total
        this.loading = false
      } catch (e) {

      } finally {
        this.loading = false
      }
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row)
    },
    // 上传成功
    uploadOnSuccess(code, data, message) {
      if (code === 0) {
        this.$modal.msgSuccess('导入成功')
        this.handleQuery()
      } else {
        this.$modal.msgError(message)
      }
    },
    uploadOnError() {
      this.$modal.msgError('上传失败, 数据格式有误')
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode) {
      this.rowId = ids
      this.buttonCode = buttonCode
      if (buttonCode === 'create') {
        this.$router.push({
          name: 'editOutsourcingBusiness'
        })
      } else if (buttonCode === 'template') {
        axiosDownloadExcel(carContractTemplateUrl)
      } else if (buttonCode === 'export') {
        this.$refs.export.init()
      }
    },
    // 导出文件
    exportFile(pageInfo) {
      // 整合page信息
      axiosDownloadExcel(carContractExportUrl, Object.assign({}, pageInfo, this.listQuery, this.formData))
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
    selectChange(type, value) {
      if (type === 'createTime') {
        this.dateRange = value
      } else {
        this.formData[type] = value
      }
      this.handleQuery()
    },
    //表格内部排序
    emitAblFilter() {
      this.getList()
    },
    //多选获取行数据
    handleSelectionChange(ids, single, multiple, selection) {
      // this.single = single;
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
