<template>
  <div class='app-container_list refueling-record'>
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

import indexMixin from "@/views/mixins"
import { gcywVehicleRequestDispatchList } from "@/api/car";
export default {
  name: 'supplementDrivingRecord',
  mixins: [indexMixin],
  components: {
  },
  filters: {

  },
  props: {

  },
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
      //分页参数
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
    };
  },
  computed: {

  },
  watch: {

  },
  async created() {
    await this.menuProperty();
    this.getList()
  },
  mounted() {
  },
  methods: {
    //查询菜单数据
    async menuProperty() {
      let id = this.$route.meta.id;
      const res = await this.$store.dispatch('menuProperty', id);
      this.property = res;
    },
    //获取分页数据
    async getList() {
      this.loading = true;
      try {
        const params = {
          ...this.listQuery,
          ...this.formData,
          // 固定参数
          status: '11',
          createType: '2',
        }
        const { data = {} } = await gcywVehicleRequestDispatchList(params);
        this.dataList = data.list;
        this.total = data.total;
        this.loading = false;
      } catch (e) {

      } finally {
        this.loading = false;
      }
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row);
    },
    //页面按钮点击事件
    async handleButton(ids, buttonCode) {
      this.buttonCode = buttonCode
      if (buttonCode === 'create') {
        // 新建
        this.$router.push({ name: 'editDrivingRecord' });
        return;
      }
    },
    //顶部列字段展示
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    //顶部重置按钮
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    //表格内部搜索条件回调
    selectChange(type, value) {
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
      // this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    //新建或修改成功回调
    operateSuccess() {
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = {
        ...this.formData,
        ...row
      }
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
