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
          :selectShow="false"
          pageName="notice"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
          @clickLink="clickLink"
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
    <!--通知弹框-->
    <notice-detail ref="noticeDetail"></notice-detail>
  </div>
</template>

<script>
import {noticeUser,noticeReadedAll} from "@/api/system/notice";
import indexMixin from "@/views/mixins";
import noticeDetail from '@/components/NoticeDetail';

export default {
  name: "myMessage",
  mixins: [indexMixin],
  components: {noticeDetail },

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
      numberShow: true,
      // 查询参数
      formData: {},
      // 总条数
      total: 0,
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
      noticeUser(Object.assign({}, this.listQuery, formData)).then(
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
      if (buttonCode === 'readed') {
        this.handleReaded(row)
      }
    },
    //全部标记已读
    handleReaded() {
        this.$modal.confirm("是否全部标记已读?").then(()=>{
            this.loading = true;

            noticeReadedAll().then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.getList();
            }).catch((err) => {
                this.loading = false;
            })
        })
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
      this.listQuery.pageNum = 1;
      this.getList();
    },
    //跳转详情
    clickLink (row, fieldCode, linkText) {
      this.$refs.noticeDetail.init(row);
    }
  },
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
