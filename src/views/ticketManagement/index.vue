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
        <el-form class="form_data" ref="queryForm" :model="formData">
          <el-row :gutter="24">
            <el-col :sm="8" :xl="6">
              <el-form-item label="工单编号" prop="orderNum">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.orderNum"
                  placeholder="请输入工单编号"
                ></el-input> </el-form-item
            ></el-col>
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
                </el-select> </el-form-item
            ></el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="报修人" prop="contactName">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.contactName"
                  placeholder="请输入报修人"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :sm="8" :xl="6">
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
                </el-select> </el-form-item
            ></el-col>

            <el-col :sm="8" :xl="6">
              <el-form-item label="维修人员" prop="personnelNames">
                <el-input
                  class="w-full"
                  clearable
                  v-model="formData.personnelNames"
                  placeholder="请输入维修人员"
                ></el-input> </el-form-item
            ></el-col>
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
                </el-select> </el-form-item
            ></el-col>
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
                </el-select> </el-form-item
            ></el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item label="提交日期" prop="year">
                <el-date-picker
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="w-full"
                  style=" display: inline"
                  v-model="formData.year"
                  placeholder="请选择提交日期"
                ></el-date-picker> </el-form-item
            ></el-col>
            <el-col :sm="8" :xl="6">
              <el-form-item>
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
              </el-form-item>
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
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        >
          <!-- 自定义状态列 -->
          <template #column-status="scope">
            <svg-icon :icon-class="orderStatus[scope.row.status + '']" />
            {{ workStatus[scope.row.status + ""] }}
          </template>
          <!-- 故障图片 -->
          <template #column-faultFileUrl="scope">
            <div style="display: flex; flex-wrap: wrap; gap: 10px">
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
              v-if="[1].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'update')"
              >修改</el-button
            >
            <el-button
              v-if="[1].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'assignmentTeam')"
              >分配</el-button
            >
            <el-button
              v-if="[2].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'assignmentPerson')"
              >分配</el-button
            >
            <el-button
              v-if="[3].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'assignmentPerson')"
              >转派</el-button
            >
            <el-button
              v-if="[4, 5].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'acceptanceCheck')"
              >验收</el-button
            >

            <el-button
              v-if="[3].includes(scope.row.status)"
              type="text"
              @click="handleButton(scope.row, 'acceptanceSubmit')"
              >提交验收</el-button
            >
            <el-button
              v-if="[1, 2].includes(scope.row.status)"
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
    };
  },
  created() {
    this.menuProperty();
    this.getPlaceList();
    this.getTeamType();
    this.getList();
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_BASE_API;
    },
  },
  watch: {
    "formData.year": {
      handler(newVal) {
        if (!newVal) return;
        this.formData.startDate = dayjs(newVal[0]).format("YYYY-MM-DD");
        this.formData.endDate = dayjs(newVal[1]).format("YYYY-MM-DD");
      },
      deep: true,
    },
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
    handleButton(ids, buttonCode) {
      console.log(ids, buttonCode, "ids, buttonCode");
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
        this.formData[key] = ''
      }
      this.handleQuery()
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    handlePlaceChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.placeOptions.find((item) =>
        selectedValues.includes(item.value)
      );
    },
  },
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
.w-full {
  width: calc(100% - 120px) ;
}
</style>
