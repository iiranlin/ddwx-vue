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
        </form-data>
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
              @click="handleButton(scope.row, 'transferTeam')"
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
import { WorkOrderManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import { workStatus } from "@/utils/enum";

import AssignmentTeam from "@/views/ticketDetail/components/assignmentTeam.vue";
import CancelOrder from "@/views/ticketDetail/components/cancelOrder.vue";
import TransferTeam from "@/views/ticketDetail/components/transferTeam.vue";
import AcceptanceCheck from "@/views/ticketDetail/components/acceptanceCheck.vue";
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
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_BASE_API;
    },
  },

  activated() {
    // 每次进入页面时刷新数据列表
    this.getList();
  },
  methods: {
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
        this.$refs.create.updateInit(ids);
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
          status: ids["status"],
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
