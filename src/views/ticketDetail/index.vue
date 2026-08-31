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
            {{ details.foreman ? details.foreman.phone : "" }},
            {{ details.foreman ? details.foreman.landline : "" }}
          </el-descriptions-item>
          <el-descriptions-item label="分配时间">{{
            details.assignTime
          }}</el-descriptions-item>
          <template v-if="status >= 3">
            <el-descriptions-item label="维修人员">{{
              details.personnelNames
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

    <template v-if="status >= 3">
      <!-- 维修过程表格 -->
      <div class="section-title">维修过程</div>
      <div class="info-card">
        <el-table :data="repairProcessLogs" border>
          <el-table-column
            prop="createByName"
            label="维修人员"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="提交时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ formatRepairProcessTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operateDesc"
            label="维修说明"
            align="center"
          >
            <template slot-scope="scope">
              <div class="repair-process-desc">
                {{ scope.row.operateDesc || "-" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <div
                v-if="getOperateFileImages(scope.row).length"
                class="repair-process-images"
              >
                <el-image
                  v-for="(image, index) in getOperateFileImages(scope.row)"
                  :key="`${scope.$index}-${index}`"
                  :src="image"
                  :preview-src-list="getOperateFileImages(scope.row)"
                  class="repair-process-image"
                  fit="cover"
                ></el-image>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
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
        <div
          v-if="canShowWorkOrderAction('assignmentTeam')"
          @click="onAssignmentTeam"
          class="action-bg-blue"
        >
          分配班组
        </div>
        <div
          v-if="canShowWorkOrderAction('cancel')"
          @click="onCancelOrder"
          class="action-bg-white"
        >
          取消工单
        </div>
      </template>
      <!-- 待分配人员 -->
      <template v-if="status === 2">
        <div
          v-if="canShowWorkOrderAction('cancel')"
          @click="onCancelOrder"
          class="action-bg-white"
        >
          取消工单
        </div>
        <div
          v-if="canShowWorkOrderAction('transferTeam')"
          @click="onTransferTeam"
          class="action-bg-blue"
        >
          转派班组
        </div>
        <div
          v-if="canShowWorkOrderAction('assignmentPerson')"
          @click="onAssignmentPerson"
          class="action-bg-blue"
        >
          分配人员
        </div>
      </template>

      <!-- 处理中 -->
      <template v-if="status === 3">
        <div
          v-if="canShowWorkOrderAction('transferPerson')"
          @click="onAssignmentPerson"
          class="action-bg-blue"
        >
          转派人员
        </div>
        <div
          v-if="canShowWorkOrderAction('acceptanceSubmit')"
          @click="onAcceptanceSubmit"
          class="action-bg-blue"
        >
          提交验收
        </div>
      </template>

      <!-- 待验收 - 报修人 -->
      <template v-if="status === 4">
        <div
          v-if="canShowWorkOrderAction('acceptanceUser')"
          @click="onAcceptanceCheck(5)"
          class="action-bg-blue"
        >
          验收
        </div>
      </template>
      <!-- 待验收 - 调度中心 -->
      <template v-if="status === 5">
        <div
          v-if="canShowWorkOrderAction('acceptanceDispatch')"
          @click="onAcceptanceCheck(6)"
          class="action-bg-blue"
        >
          验收
        </div>
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
import dayjs from "dayjs";
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
    /**
     * 功能：提取当前登录用户的身份编码列表。
     * 返回值：身份编码数组，例如 ["REPAIR", "DISPATCH"]。
     * 使用方式：供 workOrderPermissionType 计算详情页按钮权限类型。
     */
    identityCodes() {
      return (this.$store.getters.sysUserIdentitys || [])
        .map((item) =>
          typeof item === "string" ? item : item && item.userIdentity
        )
        .filter(Boolean);
    },
    /**
     * 功能：按照“调度优先”规则计算当前工单详情按钮权限类型。
     * 返回值：default 表示原权限，foreman 表示班组工长，repair 表示维修人员。
     * 使用方式：供 canShowWorkOrderAction 判断具体按钮是否展示。
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

    repairProcessLogs() {
      return Array.isArray(this.details.operateLogs)
        ? this.details.operateLogs.filter(
            (item) => item && item.operateType === "SUBMIT"
          )
        : [];
    },

    status() {
      return this.details.status;
    },
  },
  methods: {
    /**
     * 功能：根据当前身份类型和工单状态判断详情页操作按钮是否展示。
     * 参数：action 为操作编码；当前支持 assignmentTeam、cancel、transferTeam、
     * assignmentPerson、transferPerson、acceptanceSubmit、acceptanceUser、
     * acceptanceDispatch。
     * 返回值：true 表示展示按钮，false 表示隐藏按钮。
     * 使用方式：在模板按钮的 v-if 中调用 canShowWorkOrderAction("操作编码")。
     */
    canShowWorkOrderAction(action) {
      const canCancelOwnOrder =
        [1, 2].includes(this.status) &&
        this.isCreatedByCurrentUser(this.details.createBy);
      if (this.workOrderPermissionType === "foreman") {
        const foremanActions = {
          assignmentTeam: this.status === 1,
          transferTeam: this.status === 2,
          assignmentPerson: this.status === 2,
          transferPerson: this.status === 3,
          cancel: canCancelOwnOrder,
        };
        return foremanActions[action] === true;
      }
      if (this.workOrderPermissionType === "repair") {
        return (
          action === "acceptanceSubmit" &&
          this.status === 3 &&
          this.isAssignedRepairPersonnel(this.details.personnelIds)
        ) || (action === "cancel" && canCancelOwnOrder);
      }
      const defaultActions = {
        assignmentTeam: !this.isOnlyUserIdentity && this.status === 1,
        cancel: [1, 2].includes(this.status),
        transferTeam: !this.isOnlyUserIdentity && this.status === 2,
        assignmentPerson: !this.isOnlyUserIdentity && this.status === 2,
        transferPerson: !this.isOnlyUserIdentity && this.status === 3,
        acceptanceSubmit: !this.isOnlyUserIdentity && this.status === 3,
        acceptanceUser: this.status === 4,
        acceptanceDispatch: !this.isOnlyUserIdentity && this.status === 5,
      };
      return defaultActions[action] === true;
    },
    /**
     * 功能：判断当前维修人员是否属于工单已分配的维修人员。
     * 参数：personnelIds 为工单维修人员 ID 字符串，多个 ID 使用英文逗号分隔。
     * 返回值：当前 repairPersonnel.id 与任一完整人员 ID 使用 == 相等时返回 true。
     * 使用方式：普通维修人员显示“提交验收”按钮前调用本方法校验工单归属。
     */
    isAssignedRepairPersonnel(personnelIds) {
      const repairPersonnel = this.$store.getters.repairPersonnel;
      const repairPersonnelId = repairPersonnel && repairPersonnel.id;
      if (!repairPersonnelId || typeof personnelIds !== "string") {
        return false;
      }
      return personnelIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .some((id) => id == repairPersonnelId);
    },
    /**
     * 功能：判断工单是否由当前登录用户创建。
     * 参数：createBy 为工单创建人用户 ID。
     * 返回值：createBy 与当前登录用户 ID 使用 == 相等时返回 true。
     * 使用方式：判断任意身份是否可以取消本人创建的待分配工单。
     */
    isCreatedByCurrentUser(createBy) {
      const currentUserId = this.$store.getters.id;
      return Boolean(currentUserId) && createBy == currentUserId;
    },
    async init() {
      const { data = {} } = await WorkOrderManagement.getWorkOrderById(this.id);
      console.log(data);
      this.details = data;
      this.$forceUpdate();
    },
    /**
     * 功能：将维修过程记录中的逗号分隔图片路径转换为可访问的完整地址。
     * 参数：data 为单条维修过程记录，operateFile 字段保存图片相对路径。
     * 返回值：图片完整地址数组；无图片时返回空数组。
     * 使用方式：维修过程表格通过本方法渲染缩略图和图片预览列表。
     */
    getOperateFileImages(data) {
      if (!data || !data.operateFile) {
        return [];
      }
      return data.operateFile
        .split(",")
        .map((path) => path.trim())
        .filter(Boolean)
        .map((path) => this.baseUrl + path);
    },
    /**
     * 功能：将维修过程的提交时间格式化为“年-月-日 时:分”。
     * 参数：time 为接口返回的提交时间字符串。
     * 返回值：格式化后的时间；时间为空或无效时返回“-”。
     * 使用方式：维修过程表格的“提交时间”列调用本方法展示时间。
     */
    formatRepairProcessTime(time) {
      if (!time || !dayjs(time).isValid()) {
        return "-";
      }
      return dayjs(time).format("YYYY-MM-DD HH:mm");
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

  .repair-process-desc {
    line-height: 22px;
    white-space: pre-wrap;
    word-break: break-all;
    text-align: left;
  }

  .repair-process-images {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 6px 0;

    .repair-process-image {
      width: 80px;
      height: 80px;
      border-radius: 4px;
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
