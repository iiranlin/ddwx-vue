<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col
            :span="1.5"
            v-for="item in visibleButtonTop"
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
        <el-form class="form_data" ref="queryForm" :model="formData" label-width="80px">
          <el-row :gutter="24">
            <!-- 第一行始终显示 -->
            <el-col :sm="8" :xl="6">
              <el-form-item label="工单编号" prop="orderNum">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.orderNum"
                  placeholder="请输入工单编号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="故障场所" prop="faultSiteId">
                <el-select
                  class="w-full"
                  clearable
                  filterable
                  v-model="formData.faultSiteId"
                  placeholder="请选择故障场所"
                  @change="handlePlaceChange"
                >
                  <el-option
                    v-for="item in placeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="报修人" prop="contactName">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.contactName"
                  placeholder="请输入报修人"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 需要判断响应式 -->
            <el-col :sm="8" :xl="6" v-if="currentBreakpoint === 'xl'">
              <el-form-item label="维修班组" prop="teamId">
                <el-select
                  class="w-full"
                  v-model="formData.teamId"
                  clearable
                  filterable
                  placeholder="请选择维修班组"
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
            </el-col>
          </el-row>

          <!-- 高级搜索选项 - 根据isAdvancedSearchVisible控制显示/隐藏 -->
          <el-row :gutter="24" v-show="isAdvancedSearchVisible">
            <el-col v-if="currentBreakpoint !== 'xl'" :sm="8" :xl="6">
              <el-form-item  label="维修班组" prop="teamId">
                <el-select
                  class="w-full"
                  v-model="formData.teamId"
                  clearable
                  filterable
                  placeholder="请选择维修班组"
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
            </el-col>

            <el-col :sm="8" :xl="6">
              <el-form-item label="维修人员" prop="personnelNames">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.personnelNames"
                  placeholder="请输入维修人员"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="工单状态" prop="status">
                <el-select
                  class="w-full"
                  clearable
                  filterable
                  v-model="formData.status"
                  placeholder="请选择工单状态"
                >
                  <el-option
                    v-for="item in Object.keys(workStatus).map((key) => ({
                      label: workStatus[key],
                      value: key,
                    }))"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="优先级" prop="urgency">
                <el-select
                  class="w-full"
                  clearable
                  filterable
                  v-model="formData.urgency"
                  placeholder="请选择优先级"
                >
                  <el-option
                    v-for="item in priorityLevel"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="提交日期" prop="year">
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="w-full"
                  style="display: inline"
                  v-model="formData.year"
                  placeholder="请选择提交日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 将按钮移到底部单独一行 -->
          <el-row>
            <el-col :span="24">
              <div class="button-group">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery(formData)"
                  >搜索
                </el-button>
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置
                </el-button>
                <el-button
                  type="text"
                  @click="toggleAdvancedSearch"
                  size="mini"
                >
                  {{ isAdvancedSearchVisible ? "收起" : "展开" }}
                  <i
                    :class="
                      isAdvancedSearchVisible
                        ? 'el-icon-arrow-up'
                        : 'el-icon-arrow-down'
                    "
                  ></i>
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          :actionWidth="300"
          :moreButtonThreshold="4"
          style="margin-top: -8px"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          :rowClassName="workOrderRowClassName"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
          numberShow
          :selectShow="false"
        >
          <template #column-urgency="scope">
            <div style="text-align: left">
              <svg-icon :icon-class="scope.row.urgency" />
              {{ scope.row.urgency }}
            </div>
          </template>
          <!-- 自定义状态列 -->
          <template #column-status="scope">
            <div style="text-align: left">
              <svg-icon :icon-class="orderStatus[scope.row.status + '']" />
              {{ workStatus[scope.row.status + ""] }}
            </div>
          </template>
          <!-- 故障图片 -->
          <template #column-faultFileUrl="scope">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px">
              <el-image
                v-for="item in scope.row.faultFileUrl
                  ? scope.row.faultFileUrl
                      .split(',')
                      .map((x) => `${baseUrl}${x}`)
                  : []"
                :src="item"
                :preview-src-list="[item]"
                style="width: 50px; height: 50px"
              ></el-image>
            </div>
          </template>
          <!-- 自定义操作列 -->
          <template #column-action="scope" fixed="right">
            <el-button type="text" @click="handleButton(scope.row, 'view')"
              >查看</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('update', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'update')"
              >修改</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('assignmentTeam', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'assignmentTeam')"
              >分配</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('assignmentPerson', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'assignmentPerson')"
              >分配</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('transferTeam', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'transferTeam')"
              >转派</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('transferPerson', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'assignmentPerson')"
              >转派</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('acceptanceCheck', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'acceptanceCheck')"
              >验收</el-button
            >

            <el-button
              v-if="canShowWorkOrderAction('acceptanceSubmit', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'acceptanceSubmit')"
              >提交验收</el-button
            >
            <el-button
              v-if="canShowWorkOrderAction('cancel', scope.row)"
              type="text"
              @click="handleButton(scope.row, 'cancel')"
              >取消</el-button
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
    <AssignmentTeam ref="assignmentTeamRef" @close="onDialogInit" />
    <CancelOrder ref="cancelOrderRef" @close="onDialogInit" />
    <TransferTeam ref="transferTeamRef" @close="onDialogInit" />
    <AcceptanceCheck ref="acceptanceCheckRef" @close="onDialogInit" />
  </div>
</template>
<script>
import buttonTop from "@/components/buttonTop";
import formData from "@/components/formData";
import tableIndex from "@/components/tableIndex";
import create from "./components/create";
import {
  WorkOrderManagement,
  FacilityManagement,
  ResourceManagement,
} from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import { workStatus, priorityLevel } from "@/utils/enum";
import AssignmentTeam from "@/views/ticketDetail/components/assignmentTeam.vue";
import CancelOrder from "@/views/ticketDetail/components/cancelOrder.vue";
import TransferTeam from "@/views/ticketDetail/components/transferTeam.vue";
import AcceptanceCheck from "@/views/ticketDetail/components/acceptanceCheck.vue";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
export default {
  // 工单列表
  name: "ticketList",
  mixins: [indexMixin],
  components: {
    buttonTop,
    formData,
    tableIndex,
    create,
    AssignmentTeam,
    CancelOrder,
    TransferTeam,
    AcceptanceCheck,
  },

  data() {
    const orderStatus = {
      1: "待分配",
      2: "待分配",
      3: "处理中",
      4: "待验收",
      5: "待验收",
      6: "已完成",
      7: "已取消",
    };

    return {
      priorityLevel,
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
      formData: {
        orderNum: "",
        year: [],
        faultSiteId: "",
        startDate: "",
        endDate: "",
        contactName: "",
        teamId: "",
        personnelNames: "",
        status: "",
        urgency: "",
      },
      //已选中条目
      selectionData: [],
      //数据总数
      total: 0,
      placeOptions: [],
      teamTypeOptions: [],
      isAdvancedSearchVisible: false,
      currentBreakpoint: "",
    };
  },
  created() {
    this.menuProperty();
    this.getPlaceList();
    this.getTeamType();
    this.getList();
  },
  /**
   * 组件挂载后初始化响应式断点监听，并订阅全局新维修工单事件。
   * @returns {void}
   */
  mounted() {
    this.updateBreakpoint();
    window.addEventListener("resize", this.updateBreakpoint);
    this.$root.$on("repair-order-created", this.handleRepairOrderCreated);
  },
  /**
   * 组件销毁前移除窗口和全局事件监听，避免重复订阅及内存泄漏。
   * @returns {void}
   */
  beforeDestroy() {
    window.removeEventListener("resize", this.updateBreakpoint);
    this.$root.$off("repair-order-created", this.handleRepairOrderCreated);
  },
  computed: {
    /**
     * 将当前用户的身份信息统一转换为非空身份编码数组。
     * 同时兼容后端返回字符串数组和身份对象数组两种数据结构。
     * @returns {Array<string>} 当前用户拥有的有效身份编码集合。
     */
    identityCodes() {
      return (this.$store.getters.sysUserIdentitys || [])
        .map((item) =>
          typeof item === "string" ? item : item && item.userIdentity
        )
        .filter(Boolean);
    },
    /**
     * 根据调度、维修及班组长信息确定当前工单操作权限类型。
     * 调度身份优先；维修身份再根据 foreman 标识区分班组长和普通维修人员。
     * @returns {'default'|'foreman'|'repair'} 当前工单页面使用的权限类型。
     */
    workOrderPermissionType() {
      if (this.identityCodes.includes("DISPATCH")) {
        return "default";
      }
      if (this.identityCodes.includes("REPAIR")) {
        const repairPersonnel = this.$store.getters.repairPersonnel;
        return repairPersonnel && Number(repairPersonnel.foreman) === 1
          ? "foreman"
          : "repair";
      }
      return "default";
    },
    /**
     * 根据当前权限类型过滤页面顶部操作按钮。
     * 班组长和普通维修人员仅保留新建按钮，其他身份沿用菜单配置中的全部按钮。
     * @returns {Array<Object>} 当前用户可见的顶部按钮配置集合。
     */
    visibleButtonTop() {
      const buttons = (this.property && this.property.buttonTop) || [];
      if (["foreman", "repair"].includes(this.workOrderPermissionType)) {
        return buttons.filter((item) => item.buttonCode === "create");
      }
      return buttons;
    },
    isOnlyUserIdentity() {
      const identities = this.$store.getters.sysUserIdentitys || [];
      return (
        identities.length === 0 ||
        identities.every((item) => {
          const identity =
            typeof item === "string" ? item : item && item.userIdentity;
          return identity === "USER";
        })
      );
    },
    baseUrl() {
      return process.env.VUE_APP_BASE_API;
    },
  },
  watch: {
    "formData.year": {
      handler(newVal) {
        if (
          !Array.isArray(newVal) ||
          newVal.length !== 2 ||
          !newVal[0] ||
          !newVal[1]
        ) {
          this.formData.startDate = "";
          this.formData.endDate = "";
          return;
        }
        this.formData.startDate = dayjs(newVal[0]).format("YYYY-MM-DD");
        this.formData.endDate = dayjs(newVal[1]).format("YYYY-MM-DD");
      },
      deep: true,
    },
  },
  /**
   * 缓存页面重新激活时刷新工单列表，确保展示最新数据。
   * @returns {void}
   */
  activated() {
    // 每次进入页面时刷新数据列表
    this.getList();
  },
  methods: {
    /**
     * 根据当前用户身份类型和工单状态判断指定行操作是否可见。
     * @param {string} action 待判断的操作编码。
     * @param {Object} row 当前工单行数据。
     * @returns {boolean} 当前用户允许执行该操作时返回 true。
     */
    canShowWorkOrderAction(action, row) {
      const status = row.status;
      if (this.workOrderPermissionType === "foreman") {
        const foremanActions = {
          view: true,
          assignmentTeam: status === 1,
          assignmentPerson: status === 2,
          transferTeam: status === 2,
          transferPerson: status === 3,
        };
        return foremanActions[action] === true;
      }
      if (this.workOrderPermissionType === "repair") {
        return action === "view" || (action === "acceptanceSubmit" && status === 3);
      }
      const defaultActions = {
        view: true,
        update: [1, 2].includes(status),
        assignmentTeam: !this.isOnlyUserIdentity && status === 1,
        assignmentPerson: !this.isOnlyUserIdentity && status === 2,
        transferTeam: !this.isOnlyUserIdentity && status === 2,
        transferPerson: !this.isOnlyUserIdentity && status === 3,
        acceptanceCheck: this.isOnlyUserIdentity
          ? status === 4
          : [4, 5].includes(status),
        acceptanceSubmit: !this.isOnlyUserIdentity && status === 3,
        cancel: [1, 2].includes(status),
      };
      return defaultActions[action] === true;
    },
    /**
     * 接收全局新工单事件并重新查询列表，使页面及时展示最新数据。
     * @returns {void}
     */
    handleRepairOrderCreated() {
      this.getList();
    },
    workOrderRowClassName({ row }) {
      if (row.status === 1) {
        return "work-order-waiting-team";
      }
      if (row.status === 5) {
        return "work-order-waiting-dispatch-acceptance";
      }
      return "";
    },
    updateBreakpoint() {
      const width = window.innerWidth;
      if (width >= 1920) {
        this.currentBreakpoint = "xl";
      } else {
        this.currentBreakpoint = "sm";
      }
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
    // 获取场所枚举不分页
    getPlaceList() {
      FacilityManagement.getSysRepairPlaceList().then(({ data }) => {
        this.placeOptions = data.map((item) => {
          return {
            label: item.houseName,
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
      if (this.formData.year.length === 0) {
        this.formData.startDate = "";
        this.formData.endDate = "";
      }

      await WorkOrderManagement.getWorkOrderList(
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
    async handleButton(ids, buttonCode) {
      if (buttonCode === "create") {
        this.$refs.create.init();
      } else if (buttonCode === "update") {
        this.$refs.create.updateInit(ids["id"]);
      } else if (buttonCode === "assignmentTeam") {
        this.$refs.assignmentTeamRef.init({
          id: ids["id"],
          teamId: ids["teamId"],
          teamName: ids["teamName"],
        });
      } else if (buttonCode === "view") {
        this.$router.push({
          name: "ticketDetail",
          query: { id: ids["id"] },
        });
      } else if (buttonCode === "assignmentPerson") {
        this.$router.push({
          name: "assignmentPerson",
          query: { id: ids["id"] },
        });
      } else if (buttonCode === "transferTeam") {
        this.$refs.transferTeamRef.init({
          id: ids["id"],
          teamName: ids["teamName"],
        });
      } else if (buttonCode === "acceptanceCheck") {
        this.$refs.acceptanceCheckRef.init({
          id: ids["id"],
          orderNum: ids["orderNum"],
          status: ids["status"] + 1,
          title: ids["status"] + 1 === 5 ? "报修人验收" : "调度中心验收",
        });
      } else if (buttonCode === "acceptanceSubmit") {
        this.$router.push({
          name: "acceptanceSubmit",
          query: { id: ids["id"] },
        });
      } else if (buttonCode === "cancel") {
        this.$refs.cancelOrderRef.init({
          id: ids["id"],
          operateDesc: ids["operateDesc"],
        });
      } else if (buttonCode === "export") {
        try {
          this.loading = true;
          const res = await WorkOrderManagement.exportWorkOrderList(
            this.formData
          );
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          saveAs(blob, `工单列表.xlsx`);
        } catch (error) {
          console.error("导出失败:", error);
          this.$message.error("导出失败：" + (error.message || "未知错误"));
        } finally {
          this.loading = false;
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

    //新建成功回调
    createSuccess() {
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
      if (!row.year) {
        row.startDate = "";
        row.endDate = "";
        row.year = [];
      }
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    resetQuery() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      this.handleQuery();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    handlePlaceChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.placeOptions.find((item) =>
        selectedValues == item.value
      );
    },
    toggleAdvancedSearch() {
      this.isAdvancedSearchVisible = !this.isAdvancedSearchVisible;
    },
  },
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
::v-deep .el-table .work-order-waiting-team > td {
  background-color: #fff2a8 !important;
}
::v-deep .el-table .work-order-waiting-team:hover > td {
  background-color: #ffe875 !important;
}
::v-deep .el-table .work-order-waiting-dispatch-acceptance > td {
  background-color: #a8edff !important;
}
::v-deep .el-table .work-order-waiting-dispatch-acceptance:hover > td {
  background-color: #72ddf7 !important;
}
.w-full {
  width: calc(100% - 80px);
}
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
  padding-right: 20px;
}
.search-button-row {
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .w-full {
    width: 100%;
  }
  .button-group {
    justify-content: center;
    padding-right: 0;
  }
}
</style>
