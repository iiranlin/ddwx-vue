<template>
  <div class="repair-order-container">
    <!-- 头部标题 -->
    <h2 class="page-title">维修工单</h2>

    <div class="section-title" style="margin-bottom: 20px">
      <el-descriptions
        :column="3"
        border
        :labelStyle="{ width: '200px' }"
        :contentStyle="{ width: '300px' }"
      >
        <!-- 左侧信息 -->
        <el-descriptions-item label="工单编号">{{
          details.orderNum
        }}</el-descriptions-item>
        <el-descriptions-item label="工单状态"
          ><svg-icon :icon-class="orderStatus[details.status + '']" />
          {{ workStatus[details.status + ""] }}</el-descriptions-item
        >
        <el-descriptions-item label="优先级">
          <svg-icon :icon-class="details.urgency" /> {{ details.urgency }}
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <template>
      <!-- 工单信息卡片 -->
      <div>
        <span class="section-title">工单信息</span>
      </div>
      <div class="info-card">
        <el-descriptions
          :column="3"
          border
          :labelStyle="{ width: '200px' }"
          :contentStyle="{ width: '300px' }"
        >
          <!-- 左侧信息 -->

          <el-descriptions-item label="报修人">{{
            details.contactName
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            details.contactPhone
          }}</el-descriptions-item>

          <!-- 右侧信息 -->
          <el-descriptions-item label="提交时间">{{
            details.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="故障场所">{{
            details.faultSiteName
          }}</el-descriptions-item>
          <el-descriptions-item label="故障位置">{{
            details.faultAddr
          }}</el-descriptions-item>
          <el-descriptions-item label="故障描述">
            <div class="description-text">{{ details.remark }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="维修设备">
            <div class="description-text">{{ details.faultEquipmentName }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="故障图片">
            <div style="display: flex; flex-wrap: wrap; gap: 10px">
              <el-image
                v-for="item in details.faultFileUrl
                  ? details.faultFileUrl
                      .split(',')
                      .map((x) => `${baseUrl}${x}`)
                  : []"
                :src="item"
                :preview-src-list="[item]"
                style="width: 100px; height: 100px"
              ></el-image>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </template>

    <template v-if="status >= 2">
      <!-- 维修信息卡片 -->
      <div class="section-title">维修信息</div>
      <div class="info-card">
        <el-descriptions
          :column="3"
          border
          :labelStyle="{ width: '200px' }"
          :contentStyle="{ width: '300px' }"
        >
          <el-descriptions-item label="维修班组">{{
            details.teamName
          }}</el-descriptions-item>
          <el-descriptions-item label="工长电话">
            {{ details.foreman ? details.foreman.phone : "" }} /
            {{ details.foreman ? details.foreman.landline : "" }}
          </el-descriptions-item>
          <el-descriptions-item label="分配时间">{{
            details.assignTime
          }}</el-descriptions-item>
          <template v-if="status >= 3">
            <el-descriptions-item label="维修人员">{{
              details.personnelName
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              details.personnelPhone
            }}</el-descriptions-item>
            <el-descriptions-item label="维修时间"
              >{{ details.startDate }} 至
              {{ details.endDate }}</el-descriptions-item
            >
          </template>
        </el-descriptions>
      </div>
    </template>

    <template v-if="status >= 4">
      <!-- 耗材表格 -->
      <div class="section-title">维修耗材</div>
      <div class="info-card">
        <el-table :data="details.suppliesList || []" border>
          <el-table-column
            prop="suppliesName"
            label="品名"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="suppliesSpecs"
            label="规格"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="suppliesUnit"
            label="单位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="amount"
            label="数量"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </template>

    <AssignmentTeam ref="assignmentTeamRef" @close="onDialogInit" />
    <CancelOrder ref="cancelOrderRef" @close="onDialogInit" />
    <TransferTeam ref="transferTeamRef" @close="onDialogInit" />
    <AcceptanceCheck ref="acceptanceCheckRef" @close="onDialogInit" />

    <!-- 时间轴信息 -->
    <div v-if="status !== 1">
      <div style="margin-bottom: 20px" class="section-title">处理进度</div>

      <TimeLine :details="details" />
    </div>

    <!-- 底部操作按钮 -->

    <div class="action-buttons">
      <!-- 已完成  -->
      <div @click="onCancel" class="action-bg-white">返回</div>
      <!-- 待分配班组 -->
      <template v-if="status === 1">
        <div @click="onAssignmentTeam" class="action-bg-blue">分配班组</div>
        <div @click="onCancelOrder" class="action-bg-white">取消工单</div>
      </template>
      <!-- 待分配人员 -->
      <template v-if="status === 2">
        <div @click="onCancelOrder" class="action-bg-white">取消工单</div>
        <div @click="onTransferTeam" class="action-bg-blue">转派班组</div>
        <div @click="onAssignmentPerson" class="action-bg-blue">分配人员</div>
      </template>

      <!-- 处理中 -->
      <template v-if="status === 3">
        <div @click="onAssignmentPerson" class="action-bg-blue">转派人员</div>
        <div @click="onAcceptanceSubmit" class="action-bg-blue">提交验收</div>
      </template>

      <!-- 待验收 - 报修人 -->
      <template v-if="status === 4">
        <div @click="onAcceptanceCheck(5)" class="action-bg-blue">验收</div>
      </template>
      <!-- 待验收 - 调度中心 -->
      <template v-if="status === 5">
        <div @click="onAcceptanceCheck(6)" class="action-bg-blue">验收</div>
      </template>
    </div>
  </div>
</template>
<script>
import { WorkOrderManagement } from "@/api/maintenance";
import TimeLine from "./components/timeLine.vue";
import AssignmentTeam from "./components/assignmentTeam.vue";
import CancelOrder from "./components/cancelOrder.vue";
import TransferTeam from "./components/transferTeam.vue";
import AcceptanceCheck from "./components/acceptanceCheck.vue";
import { workStatus } from "@/utils/enum";
// 工单详情
/**
 * 1:'待分配-班组',
 * 2:'待分配-维修人员',
 * 3:'处理中',
 * 4:'待验收-创建人',
 * 5:'待验收-调度中心',
 * 6:'已完成',
 * 7:'已取消'
 */
export default {
  components: {
    TimeLine,
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
      details: {},
      orderStatus,
      workStatus,
      // 图片数据示例
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    baseUrl() {
      return process.env.VUE_APP_BASE_API;
    },
    images() {
      if (!this.details.faultFileUrl) return [];
      return (this.details.faultFileUrl.split(",") || []).map(
        (x) => this.baseUrl + x
      );
    },

    operateLogs() {
      return this.details.operateLogs
        ? this.details.operateLogs.filter((x) => x.operateType === "SUBMIT")
        : [];
    },

    status() {
      return this.details.status;
    },
  },
  methods: {
    async init() {
      const { data = {} } = await WorkOrderManagement.getWorkOrderById(this.id);
      console.log(data);
      this.details = data;
      this.$forceUpdate();
    },
    operateFileImg(data) {
      console.log(data, "data");
      return data.operateFile.split(",").map((x) => this.baseUrl + x);
    },
    handleBack() {
      // 关闭当前菜单Tab
      this.$tab.closePage();
      this.$router.go(-1);
    },

    // 取消
    onCancel() {
      this.$router.go(-1);
      this.$tab.closePage();
    },
    // 待分配班组
    onAssignmentTeam() {
      const component = this.$refs.assignmentTeamRef;
      component.init({
        id: this.id,
        teamId: this.details.teamId,
        teamName: this.details.teamName,
      });
    },
    // 取消班工单
    onCancelOrder() {
      const component = this.$refs.cancelOrderRef;
      component.init({
        id: this.id,
        operateDesc: this.details.operateDesc,
      });
    },
    // 分配人员
    onAssignmentPerson() {
      this.$router.push({
        name: "assignmentPerson",
        query: { id: this.id },
      });
    },
    // 转派班组
    onTransferTeam() {
      const component = this.$refs.transferTeamRef;
      component.init({
        id: this.id,
        teamName: this.details.teamName,
      });
    },
    // 验收
    onAcceptanceCheck(status) {
      const component = this.$refs.acceptanceCheckRef;
      component.init({
        id: this.id,
        orderNum: this.details.orderNum,
        status,
        title: status === 5 ? "报修人验收" : "调度中心验收",
      });
    },

    // 提交验收
    onAcceptanceSubmit() {
      this.$router.push({
        name: "acceptanceSubmit",
        query: { id: this.id },
      });
    },
    onDialogClose() {
      this.$tab.closePage();
      this.$router.go(-1);
    },
    onDialogInit() {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.repair-order-container {
  padding: 20px;
  margin: 0 auto;
  height: 100%;
  overflow-y: scroll;

  .page-title {
    margin-bottom: 30px;
    color: #333;
    text-align: center;
  }

  .section-title {
    font-size: 18px;
    color: #1e1e1e;
    font-weight: bold;
  }

  .info-card {
    margin-bottom: 20px;
    margin-top: 20px;
    .wxcl-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      .wxcl-title {
        font-weight: bold;
        color: #969799;
        font-size: 14px;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-tag {
      margin-left: 10px;
    }
  }

  .image-container {
    margin: 20px 0;
    .repair-image {
      width: 200px;
      height: 150px;
      margin-right: 10px;
      border: 1px solid #eee;
    }
  }

  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    cursor: pointer;
  }
  .action-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 15px;

    .action-bg-white {
      width: 74px;
      height: 35px;
      background: #e2f0ff;
      border-radius: 4px;
      color: #0c7bfe;
      @include flex-center;
    }

    .action-bg-blue {
      width: 96px;
      height: 35px;
      background: #0c7bfe;
      border-radius: 4px;
      color: #fff;
      @include flex-center;
    }
  }
}
</style>
