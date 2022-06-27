<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">

      <!--用户数据-->
      <el-col :span="24" :xs="24" class="container_flex">
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col :span="1.5"  v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
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
            @numberChange="numberChange"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
          ></right-toolbar>
          </el-row>
          <form-data
          :formData="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top:-12px;margin-bottom: 6px;"
        />
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
        @emitAblFilter="emitAblFilter"
      />
        <pagination
          v-show="pageInfo.total>0"
          :total="pageInfo.total"
          :page.sync="pageInfo.pageNum"
          :limit.sync="pageInfo.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess" :deptOptions="deptOptions" />
  </div>
</template>

<script>
import {commonPage,commonTree,commonDeleteBatch} from '@/api/system/dict/common'
import operate from "./components/operate";
import indexMixin from '@/views/mixins';
import tableIndex from "@/components/tableIndex";
import formData from "@/components/formData";
import buttonTop from "@/components/buttonTop";
export default {
  name: "dept",
  mixins: [indexMixin],
  components: { operate,tableIndex, formData, buttonTop },
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
      // 用户表格数据
      dataList: [],
      property:{},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 日期范围
      dateRange: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      // 查询参数
      formData: {
        name: '',
        // status: '',
        // parentId: '',
        // startTime: '',
        // endTime: '',

      },
      pageInfo: {
        total: 0,
        pageNum: 1,
        pageSize: 30,
      },
      statusArr: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "停用"
        },
      ],
      numberShow: false
    };
  },
  watch: {
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    numberChange(val) {
      this.numberShow = val
    },
    newButton(buttonCode) {
      this.$refs.tableIndex.newButton(buttonCode);
    },
     handleButton(row, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(row)
      } else if (buttonCode === 'delete') {
        this.handleDelete(row)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }
    },
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    selectChange(type, value) {
      if (type === "createTime") {
        this.dateRange = value;
      } else {
        this.formData[type] = value;
      }
      this.handleQuery();
    },
    emitAblFilter(listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, listQuery);
      this.handleQuery();
    },
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    menuProperty () {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    getList () {
      this.loading = true;
      commonPage(Object.assign({}, this.pageInfo, this.formData)).then( ({data}) => {
        this.dataList = data.list;
        this.pageInfo.total = data.total;
        this.loading = false;
      })
    },
    commonTree () {
      commonTree().then( ({data}) => {
        this.deptOptions = data;
      })
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
    // 节点单击事件
    // handleNodeClick(data) {
    //   this.formData.parentId = data.id;
    //   this.handleQuery();
    // },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.resetForm("queryForm");
    //   this.formData.parentId = '';
    //   this.dateRange = [];
    //   this.formData.startTime = '';
    //   this.formData.endTime = '';
    //   this.handleQuery();
    // },
    // emitAblFilter () {
    //   this.handleQuery();
    // },
    // handleQuery () {
    //   this.getList();
    // },

    //序号
    // rowOnlineTableColumIndex({row,rowIndex}){
    //   row.index=rowIndex+1
    // },
    // handleSelectionChange (selection) {
    //   this.ids = selection.map(item => item.id)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
    handleCreate () {
      this.commonTree()
      this.$refs.operate.init('create', this.formData.parentId);
    },
    handleUpdate (id) {
      // let id = '';
      // if(row){
      //   id = row.id;
      // }else{
      //   id = this.ids[0];
      // }
      this.commonTree()
      this.$refs.operate.init('update', id);
    },
    handleDelete (ids) {
      // let ids = row.id || this.ids;
      // if(!(ids instanceof Array)){
      //   ids = [ids];
      // }
      this.$modal.confirm('是否确认删除字典?').then(function() {
        return commonDeleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    operateSuccess () {
      this.handleQuery();
    }
  }
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>
