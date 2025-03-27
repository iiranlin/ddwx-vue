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
            <el-form-item label="负责班组" prop="teamId">
              <el-select
                size="small"
                style="width: 240px"
                v-model="formData.teamId"
                clearable
                filterable
                placeholder="请选择负责班组"
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
          :actionWidth="300"
          :moreButtonThreshold="4"
          style="margin-top: -8px"
          :tableIndexs="tableIndex"
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
          <!-- 自定义状态列 -->
          <template #column-planningState="scope">
            <svg-icon :icon-class="orderStatus[scope.row.planningState + '']" />
            {{ workStatus[scope.row.planningState - 1 + ""] }}
          </template>

          <!-- 自定义操作列 -->
          <template #column-action="scope" fixed="right">
            <template v-if="scope.row.planningState === '1'">
              <el-button type="text" @click="handleButton(scope.row, 'edit')"
                >修改</el-button
              >
              <el-button type="text" @click="handleButton(scope.row, 'delete')"
                >删除</el-button
              >
            </template>
            <template v-if="scope.row.planningState === '2'">
              <el-button type="text" @click="handleButton(scope.row, 'edit')"
                >修改</el-button
              >
              <el-button
                v-if="dayjs(scope.row.planningYear).year() < dayjs().year()  "
                type="text"
                @click="handleButton(scope.row, 'stop')"
                >结束</el-button
              >
              <el-button
                v-else
                type="text"
                @click="handleButton(scope.row, 'terminate')"
                >终止</el-button
              >
            </template>
            <template v-if="['3', '4'].includes(scope.row.planningState)">
              <el-button type="text" @click="handleButton(scope.row, 'view')"
                >查看</el-button
              >
            </template>
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
  </div>
</template>
<script>
import buttonTop from "@/components/buttonTop";
import formData from "@/components/formData";
import tableIndex from "@/components/tableIndex";
import { MaintenancePlan } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import dayjs from "dayjs";
import { ResourceManagement } from "@/api/maintenance";

export default {
  // 维保计划列表
  name: "maintenancePlanList",
  mixins: [indexMixin],
  components: {
    buttonTop,
    formData,
    tableIndex,
  },

  data() {
    const orderStatus = {
      1: "维保未开始",
      2: "维保进行中",
      3: "维保已结束",
      4: "维保已终止",
    };
    const workStatus = ["未开始", "进行中", "已结束", "已终止"];
    return {
      orderStatus,
      workStatus,
      //遮罩层
      loading: false,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //显示搜索条件
      showSearch: true,
      // 表格序号是否展示
      numberShow: true,
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
  created() {
    this.menuProperty();
    this.getList();
    this.getTeamType();
  },

  activated() {
    // 每次进入页面时刷新数据列表
    this.getList();
  },
  methods: {
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
    numberChange(val) {
      this.numberShow = val;
    },
    //获取菜单数据
    menuProperty() {
      let id = this.$route.meta.id;
      this.$store.dispatch("menuProperty", id).then((data) => {
        data.search.forEach((item) => {
          item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
        });

        // 修改action right
        data.fields.forEach((item) => {
          if (item.fieldCode === "action") {
            item.fixed = "right";
          }
        });

        this.property = data;
      });
    },
    //获取分页数据
    async getList() {
      this.loading = true;

      await MaintenancePlan.getMaintenancePlanList(
        Object.assign({}, this.listQuery, this.formData)
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
    onDialogInit() {
      this.getList();
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row);
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode) {
      switch (buttonCode) {
        case "create": {
          this.$router.push({
            name: "createPlan",
          });
          break;
        }
        case "view": {
          console.log(ids, "ids");
          this.$router.push({
            name: "createPlan",
            query: { id: ids["id"], isView: true },
          });
          break;
        }
        case "edit": {
          this.$router.push({
            name: "createPlan",
            query: { id: ids["id"] },
          });
          break;
        }
        case "delete": {
          this.$confirm("确定删除该维保计划吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => MaintenancePlan.deleteMaintenancePlan([ids["id"]]))
            .then((data) => {
              this.$message.success(data.message);
              this.getList();
            });
          break;
        }
        case "terminate": {
          this.$confirm("确定终止该维保计划吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }).then(() => {
            MaintenancePlan.updateMaintenancePlanState({
              id: ids["id"],
              planningState: 4,
            }).then((data) => {
              this.$message.success(data.message);
              this.getList();
            });
          });
          break;
        }
        case "stop": {
          this.$confirm("确定结束该维保计划吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }).then(() => {
            MaintenancePlan.updateMaintenancePlanState({
              id: ids["id"],
              planningState: 3,
            }).then((data) => {
              this.$message.success(data.message);
              this.getList();
            });
          });
          break;
        }
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
