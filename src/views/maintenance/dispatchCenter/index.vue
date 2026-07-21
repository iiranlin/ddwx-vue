<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col
            v-for="item in property.buttonTop"
            :key="item.id"
            :span="1.5"
            style="margin-top: 2px; padding: 0"
          >
            <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              class="cume-button"
              @newButton="newButton"
            />
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            style="margin-top: 4px; padding-right: 20px"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @numberChange="numberChange"
            @clickReset="clickReset"
          />
        </el-row>

        <form-data
          :formData="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          style="margin-top: -12px; margin-bottom: 6px"
          @handleQuery="handleQuery"
        />

        <table-index
          ref="tableIndex"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          :selectShow="false"
          style="margin-top: -8px"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        >
          <template #column-action="scope">
            <el-button
              type="text"
              @click="handleButton(scope.row.id, 'update', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              class="dangerColor"
              @click="handleButton([scope.row.id], 'delete', scope.row)"
            >
              删除
            </el-button>
          </template>
        </table-index>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          style="margin-bottom: 40px"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <operate ref="operate" @success="handleQuery" />
  </div>
</template>

<script>
import { IdentityManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import operate from "./components/operate";

export default {
  name: "dispatchCenter",
  components: { operate },
  mixins: [indexMixin],
  data() {
    return {
      loading: false,
      single: true,
      multiple: true,
      showSearch: true,
      numberShow: false,
      dataList: [],
      property: {},
      formData: {},
      selectionData: [],
      total: 0,
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  methods: {
    /**
     * 根据当前路由菜单标识加载页面字段、搜索项及顶部按钮配置。
     * @returns {void}
     */
    menuProperty() {
      this.$store.dispatch("menuProperty", this.$route.meta.id).then((data) => {
        this.property = data;
      });
    },
    /**
     * 按当前分页和筛选条件查询调度中心人员列表，并维护加载状态。
     * @returns {void}
     */
    getList() {
      this.loading = true;
      IdentityManagement.getDispatchList(
        Object.assign({}, this.listQuery, this.formData)
      )
        .then(({ data }) => {
          this.dataList = data.list;
          this.total = data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 将顶部按钮操作转交给通用表格组件处理。
     * @param {string} buttonCode 按钮业务编码。
     * @param {Object} row 当前操作行数据。
     * @returns {void}
     */
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row);
    },
    /**
     * 处理新增、编辑和删除操作；删除前弹出二次确认并在成功后刷新列表。
     * @param {string|number|Array<string|number>} ids 当前记录主键或主键集合。
     * @param {string} buttonCode 操作类型编码。
     * @param {Object} row 当前操作行数据。
     * @returns {void}
     */
    handleButton(ids, buttonCode, row) {
      if (buttonCode === "create") {
        this.$refs.operate.init();
      } else if (buttonCode === "update") {
        this.$refs.operate.updateInit(row);
      } else if (buttonCode === "delete") {
        this.$confirm("删除人员后无法重新恢复，请确认！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          cancelButtonClass: "cancel-button el-button--text",
          confirmButtonClass: "el-button--text",
        }).then(() => {
          IdentityManagement.deleteBatch(ids).then(() => {
            this.$message.success("删除成功！");
            this.handleQuery();
          });
        });
      }
    },
    /**
     * 将用户勾选的表格列配置应用到通用表格组件。
     * @param {Array<Object>} columns 当前选中的列配置。
     * @returns {void}
     */
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    /**
     * 更新表格序号列的显示状态。
     * @param {boolean} value 是否显示序号列。
     * @returns {void}
     */
    numberChange(value) {
      this.numberShow = value;
    },
    /**
     * 重置页面配置和查询条件，并重新查询第一页数据。
     * @returns {void}
     */
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    /**
     * 响应通用表格的筛选条件变化；监听模式仅合并条件，否则立即发起查询。
     * @param {Object} row 筛选组件返回的表单数据及监听标识。
     * @returns {void}
     */
    selectChange(row) {
      const { formData, isWatch } = row;
      if (isWatch) {
        this.formData = Object.assign({}, this.formData, formData);
      } else {
        this.handleQuery(formData);
      }
    },
    /**
     * 响应表格过滤事件，使用当前条件重新加载列表。
     * @returns {void}
     */
    emitAblFilter() {
      this.getList();
    },
    /**
     * 同步表格选中状态及单选、批量操作按钮的可用状态。
     * @param {Array<string|number>} ids 已选记录的主键集合。
     * @param {boolean} single 单条记录操作是否禁用。
     * @param {boolean} multiple 批量操作是否禁用。
     * @param {Array<Object>} selection 已选中的完整行数据。
     * @returns {void}
     */
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    /**
     * 合并最新查询条件、重置到第一页并刷新人员列表。
     * @param {Object} row 本次新增或变更的查询条件。
     * @returns {void}
     */
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.listQuery.pageNum = 1;
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
