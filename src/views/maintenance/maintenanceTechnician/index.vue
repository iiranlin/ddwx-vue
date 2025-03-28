<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
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
            >
            </button-top>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top: 4px; padding-right: 20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @numberChange="numberChange"
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
          style="margin-top: -12px; margin-bottom: 6px"
        >
          <template #customItem>
            <el-form-item label="归属班组" prop="teamId">
              <el-select
                style="width: 100%"
                v-model="formData.teamId"
                clearable
                filterable
                placeholder="请选择归属班组"
              >
                <el-option
                  v-for="item in teamTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </form-data>
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          style="margin-top: -8px"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
          numberShow
          :selectShow="false"
        >
          <template #column-action="scope" fixed="right">
            <el-button type="text" @click="handleButton(scope.row, 'update')"
              >编辑</el-button
            >
            <!-- <el-button type="text" @click="handleButton(scope.row, 'stop')"
              >{{ scope.row.status == 0 ? "启用" : "停用" }}</el-button
            > -->
            <el-button type="text" @click="handleButton(scope.row, 'delete')"
              >删除</el-button
            >
          </template>
        </table-index>
        <!--分页器-->
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
    <!--新建-->
    <create ref="create" @createSuccess="createSuccess"></create>
  </div>
</template>
<script>
import buttonTop from "@/components/buttonTop";
import formData from "@/components/formData";
import tableIndex from "@/components/tableIndex";
import create from "./components/create";
import { ResourceManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";

export default {
  // 维修人员
  name: "maintenanceTechnician",
  mixins: [indexMixin],
  components: { buttonTop, formData, tableIndex, create },

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
      //数据总数
      total: 0,
      teamTypeOptions: [],
    };
  },
  activated() {
    this.getTeamType();
  },
  created() {
    this.menuProperty();
    this.getList();
    this.getTeamType();
  },
  methods: {
    numberChange(val) {
      this.numberShow = val;
    },
    // 获取班组枚举不分页
    getTeamType() {
      ResourceManagement.getTeamListAll().then(({ data }) => {
        this.teamTypeOptions = data.map((item) => {
          return {
            label: item.teamName,
            value: item.id,
          };
        });
      });
    },
    //获取菜单数据
    menuProperty() {
      let id = this.$route.meta.id;
      this.$store.dispatch("menuProperty", id).then((data) => {
        data.search.forEach((item) => {
          item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
        });
        this.property = data;
      });
    },
    //获取分页数据
    async getList() {
      this.loading = true;

      await ResourceManagement.getRepairList(
        Object.assign({status:-1}, this.listQuery, this.formData)
      )
        .then(({ data }) => {
          this.dataList = data.list;
          this.total = data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row);
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode) {
      if (buttonCode === "create") {
        this.$refs.create.init();
      } else if (buttonCode === "update") {
        this.$refs.create.updateInit(ids["id"]);
      } else if (buttonCode === "delete") {
        this.$confirm("删除人员后无法重新恢复，请确认！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          ResourceManagement.deleteRepair([ids["id"]]).then(() => {
            this.$message.success("删除成功！");
            this.handleQuery();
          });
        });
      } else if (buttonCode === "stop") {
        this.$confirm("确定停用当前维修人员？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          ResourceManagement.updateRepairState({
            id: ids["id"],
            status: ids["status"] == 0 ? 1 : 0,
          }).then(() => {
            this.$message.success("操作成功");
            this.handleQuery();
          });
        });
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
    selectChange(row) {
      let { formData, isWatch } = row;
      if (!isWatch) {
        this.handleQuery(formData);
      } else {
        this.formData = Object.assign({}, this.formData, formData);
      }
    },
    //表格内部排序
    emitAblFilter() {
      this.getList();
    },
    //多选获取行数据
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },

    //新建成功回调
    createSuccess() {
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  },
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
