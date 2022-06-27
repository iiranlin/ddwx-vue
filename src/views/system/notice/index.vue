<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col
            :span="1.5"
            v-for="item in property.buttonTop"
            :key="item.id"
            style="margin-top: 2px; padding: 0px"
          >
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
            style="margin-top: 4px; padding-right: 20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
            @numberChange="numberChange"
          ></right-toolbar>
        </el-row>
        <!--搜索条件按钮-->
        <form-data
          :formData="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top: -12px; margin-bottom: 6px"
        />
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          style="margin-top: -8px"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          pageName="notice"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        />
        <!--分页-->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
          style="margin-bottom: 40px"
        />
      </el-col>
    </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess" />
    <publish-log ref="publishLog"></publish-log>
  </div>
</template>

<script>
import {
  noticePage,
  noticeDeleteBatch,
  noticePublish,
} from "@/api/system/notice";
import indexMixin from "@/views/mixins";
import operate from "./components/operate";
import publishLog from "./components/publishLog.vue";
export default {
  name: "notice",
  mixins: [indexMixin],
  components: { operate, publishLog},
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
      // 表格序号是否展示
      numberShow: false,
      // 查询参数
      formData: {},
      // 总条数
      total: 0,
      //分页参数
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      // 角色表格数据
      dataList: [],
      // 日期范围
      dateRange: [],
      //列表显示字段
      property: {},
      //已选中条目
      selectionData: [],
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    numberChange(val) {
      this.numberShow = val
    },
    //查询菜单数据
    menuProperty() {
      const id = this.$route.meta.id;
      this.$store.dispatch('menuProperty', id).then( (data) => {
        this.property = data;
      });
    },
    //获取分页数据
    getList() {
      this.loading = true;
      let formData = {}
      for(let key in this.formData){
        if(key!='createTime'){
          formData[key] = this.formData[key]
        }
      }
      noticePage(Object.assign({}, this.listQuery, formData)).then(
        ({ data }) => {
          this.dataList = data.list;
          this.total = data.total;
          this.loading = false;
        }
      );
    },
     //顶部按钮点击
    newButton(buttonCode,row) {
      this.$refs.tableIndex.newButton(buttonCode,row);
    },
    handleButton(row, buttonCode) {
      if (buttonCode === 'update') {
        this.handleUpdate(row)
      } else if (buttonCode === 'delete') {
        this.handleDelete(row)
      } else if (buttonCode === 'create') {
        this.handleCreate()
      }  else if (buttonCode === 'publish') {
        this.handlePublishNotice(row.id)
      } else if (buttonCode === 'publishLog') {
        this.handlePublishLog(row)
      } 
    },
    //新建
    handleCreate() {
      this.$refs.operate.init("create");
    },
    //编辑
    handleUpdate(id) {
      this.$refs.operate.init("update", id);
    },
    //删除
    handleDelete(ids) {
      this.$modal
        .confirm("是否确认删除通知?")
        .then(function () {
          return noticeDeleteBatch(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //发布通知
    handlePublishNotice(id) {
      this.$modal
        .confirm("是否确认发布通知?")
        .then(function () {
          return noticePublish(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("发布成功");
        })
        .catch(() => {});
    },
    //发布日志
    handlePublishLog(row) {
      this.$refs.publishLog.open(row);
    },
    //新建成功回调
    operateSuccess() {
      this.handleQuery();
    },
    //顶部列展示选项
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    //顶部重置按钮
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
     //表格内部搜索条件选择框回调
    selectChange(type,value) {
      if (type === "createTime") {
        this.dateRange = value;
      } else {
        this.formData[type] = value;
      }
      this.handleQuery();
    },
    //表格内部排序
    emitAblFilter() {
      this.getList();
    },
    //多选获取行数据
    handleSelectionChange(ids, single, multiple, selection) {
      this.ids = ids;
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
  },
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>