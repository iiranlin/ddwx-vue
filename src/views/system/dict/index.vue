<template>
  <div class="app-container_tree">
      <el-row :gutter="20" class="container_h">
          <el-col :span="4" :xs="24" class="container_flex_overflow">
              <div class="head-container">
                  <el-tree
                    class="drawer-tree"
                    :indent="0"
                    :data="deptOptions"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    ref="tree"
                    :highlight-current="true"
                    :default-expand-all="false"
                    @node-click="handleNodeClick"/>
                </div>
          </el-col>
          <el-col :span="20" :xs="24" class="container_flex">
              <el-row :gutter="24" class="container_flex-right_tree">
              <el-col :span="1.5"  v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
                  <button-top
                      :item="item"
                      :multiple="multiple"
                      :single="single"
                      @newButton="newButton"
                      class="cume-button"/>
              </el-col>
              <right-toolbar
                  ref="rightToolbar"
                  style="margin-top:4px; padding-right:20px"
                  :showSearch.sync="showSearch"
                  :columns="property.fields"
                  @numberChange="numberChange"
                  @queryTable="handleQuery"
                  @handleCheckAllChange="handleCheckAllChange"
                  @clickReset="clickReset"/>
          </el-row>
          <form-data
              :formData='formData'
              :showSearch="showSearch"
              :searchArr="property.search || []"
              @handleQuery="handleQuery"
              style="margin-top:-12px;margin-bottom: 6px;"/>
          <table-index
              ref="tableIndex"
              style="margin-top:-8px"
              pageName="commonDict"
              :tableIndexs="tableIndex"
              :loading="loading"
              :tableData="dataList"
              :property="property"
              :numberShow="numberShow"
              @handleSelectionChange="handleSelectionChange"
              @handleButton="handleButton"
              @selectChange="selectChange"
              @emitAblFilter="emitAblFilter"/>
          <pagination
               v-show="total > 0"
              :total="total"
              :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize"
              @pagination="getList"/>
          </el-col>
      </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess" :deptOptions="deptOptions" />
  </div>
</template>

<script>
import { commonPage, commonTree, commonDeleteBatch } from '@/api/system/dict'
import operate from './components/operate'
import tableIndex from '@/components/tableIndex'
import formData from '@/components/formData'
import buttonTop from '@/components/buttonTop'
import indexMixin from '@/views/mixins'

export default {
  mixins: [indexMixin],
  name: 'dept',
  components: { operate, tableIndex, formData, buttonTop },
  data() {
    return {
      // 遮罩层
      loading: false,
      treeLoading: false,
      treeCurrentKey: '',
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 用户表格数据
      dataList: [],
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 表格序号是否展示
      numberShow: false,
      // 列表字段判断是否可操作
      isButtonObj: { name: 'isSystem', val: 1, type: 'delete, update' },
      // 查询参数
      formData: {
        parentId: ''
      },
      total: 0,
      property: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {},
  created() {
    this.commonTree()
    this.menuProperty()
    this.getList()
  },
  methods: {
    // 节点单击事件
    handleNodeClick(data) {
      if (data.id === this.treeCurrentKey) {
        // 再次点击当前节点取消选中,查询全部
        this.formData.parentId = ''
        this.$refs.tree.setCurrentKey(null)
        this.treeCurrentKey = ''
      } else {
        this.treeCurrentKey = data.id
        this.formData.parentId = data.id
      }
      this.handleQuery()
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
    numberChange(val) {
      this.numberShow = val
    },
    newButton(buttonCode) {
      this.$refs.tableIndex.newButton(buttonCode)
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns)
    },
    clickReset() {
      this.menuProperty()
      this.handleQuery()
    },
    commonTree() {
      commonTree().then(({ data }) => {
        this.deptOptions = data
      })
    },
    menuProperty() {
      let id = this.$route.meta.id
      this.$store.dispatch('menuProperty', id).then((data) => {
        this.property = data
      })
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery)
      this.handleQuery()
    },
    handleQuery(row = {}) {
      this.listQuery.pageNum = 1
      this.formData = Object.assign({}, this.formData, row)
      this.getList()
    },
    getList() {
      this.loading = true
      commonPage(Object.assign({}, this.listQuery, this.formData)).then(res => {
        this.dataList = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    handleSelectionChange(ids, single, multiple) {
      this.single = single
      this.multiple = multiple
    },
    handleCreate() {
      this.$refs.operate.init('create', this.formData.parentId)
    },
    handleUpdate(ids) {
      this.$refs.operate.init('update', ids)
    },
    handleDelete(ids) {
      let count = 0
      this.dataList.forEach(row => {
        ids.forEach(id => {
          if (row.id === id && row.isSystem === 1) {
            count += 1
          }
        })
      })
      if (count > 0) {
        this.$modal.msgWarning('不能删除系统内置字典')
      } else {
        this.$modal.confirm('是否确认删除字典?').then(function() {
          return commonDeleteBatch({ ids })
        }).then(() => {
          this.commonTree()
          this.handleQuery()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      }
    },
    handleButton(id, buttonCode, row) {
      if (buttonCode === 'update') {
        this.handleUpdate(id)
      } else if (buttonCode === 'delete') {
        this.handleDelete(id)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
    operateSuccess() {
      this.commonTree()
      this.handleQuery()
    }
  }
}
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>
