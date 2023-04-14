<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
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
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
            @numberChange="numberChange"
          >
          </right-toolbar>
        </el-row>
        <!--搜索条件按钮-->
        <form-data
          :dateMultiple="true"
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
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
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
import { getMaintenanceRecordByPage,maintenanceRecordSubmit,maintenanceRecordDelete } from '@/api/maintenanceRecord'
import indexMixin from "@/views/mixins"

export default {
  name: 'maintenanceManagement',
  mixins:[indexMixin],
  components: { buttonTop, formData, tableIndex },

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
      // 表格序号是否展示
      numberShow: false,
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
      //已选中条目的id
      ids: [],
      //数据总数
      total: 0
    }
  },
  created() {
    this.menuProperty()
    this.getList()
  },
  activated() {
    this.handleQuery()
  },
  methods: {
    numberChange (val) {
      this.numberShow = val;
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
    async getList() {
      this.loading = true
      await getMaintenanceRecordByPage(Object.assign({}, this.listQuery, this.formData)).then(({ data }) => {
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
    handleButton(ids, buttonCode, row) {
      if (buttonCode === 'create') {
        this.$router.push({ name: 'maintenanceCreate' })
      } else if (buttonCode === 'detail') {
        this.$router.push({ name: 'maintenanceCreate', query: { id: ids } })
      } else if (buttonCode === 'edit') {
        if(this.selectionData[0].status !== '0'){
          this.$modal.msgWarning('已提交数据无法修改，请重新选择!');
          return;
        }
        this.$router.push({ name: 'maintenanceEdit', query: { id: this.selectionData[0].id } })
      } else if(buttonCode === 'delete'){
        this.handleDelete();
      }else if (buttonCode === 'submit') {
        this.handleSubmit();
      }
    },
    //删除
    handleDelete(){
      let obj = this.selectionData.some((item) => {
        return item.status !== '0';
      })
      if(!!obj){
        this.$modal.msgWarning('已提交数据无法删除，请重新选择!');
        return;
      }

      this.$modal.confirm('是否删除所选数据?').then(() => {
        let paramsArr = [];
        this.selectionData.forEach((item) => {
            let obj = {};
            this.$set(obj, 'id', item.id);
            this.$set(obj, 'enableTag', 'N');
            paramsArr.push(obj)
        })
        this.loading = true;
        maintenanceRecordDelete(paramsArr).then(({message}) => {
          this.loading = false;
          this.$modal.msgSuccess(message);
          this.handleQuery();
        }).catch((err) => {
          this.loading = false;
        })
      }).catch(() => {

      });
    },
    //提交
    handleSubmit(){
      let obj = this.selectionData.some((item) => {
        return item.status !== '0';
      })
      if(!!obj){
        this.$modal.msgWarning('已提交数据无法重复提交，请重新选择!');
        return;
      }

      this.$modal.confirm('是否提交所选数据?').then(() => {
        let paramsArr = [];
        this.selectionData.forEach((item) => {
            let obj = {};
            this.$set(obj, 'id', item.id);
            this.$set(obj, 'status', '1');
            this.$set(obj, 'maintainType', item.maintainType);
            this.$set(obj, 'maintainDate', item.maintainDate);
            this.$set(obj, 'maintainMiles', item.maintainMiles);
            this.$set(obj, 'nextMaintainMiles', item.nextMaintainMiles);
            this.$set(obj, 'nextMaintainMiles', item.nextMaintainMiles);
            this.$set(obj, 'carNumber', item.carNumber);
            paramsArr.push(obj)
        })
        this.loading = true;
        maintenanceRecordSubmit(paramsArr).then(({message}) => {
          this.loading = false;
          this.$modal.msgSuccess(message);
          this.handleQuery();
        }).catch((err) => {
          this.loading = false;
        })
      }).catch(() => {

      });
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
      this.ids = selection.map(item => item.divisionId)
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
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    
  }

}
</script>
<style lang="">

</style>
