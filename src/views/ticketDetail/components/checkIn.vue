<template>
  <div class="acceptance-submit">
    <div class="top">
      <h2 class="title">现场打卡</h2>

      <!-- 故障图片上传区域 -->
      <div class="section">
        <div class="section-title">
          <span style="color: #f34d39">*</span>故障图片
        </div>
        <ImageUpload
          v-model="form.operateFileUrl"
          @input="handleFileChange"
          :limit="3"
          :fileType="['jpg', 'jpeg', 'png']"
        />
      </div>

      <!-- 故障说明 -->
      <div class="section">
        <div class="section-title">
          <span style="color: #f34d39">*</span>故障说明
        </div>
        <el-input
          style="width: 50%"
          v-model="form.operateDesc"
          type="textarea"
          :rows="4"
          placeholder="请输入故障说明"
        ></el-input>
      </div>

    </div>

    <!-- 底部按钮 -->
    <div class="footer-buttons">
      <div style="background-color: #e2f0ff; color: #0c7bfe" @click="goBack">
        返回
      </div>
      <div
        style="background-color: #0c7bfe; color: #ffffff"
        @click="submitForm"
      >
        确认
      </div>
    </div>
  </div>
</template>

<script>
import { WorkOrderManagement } from "@/api/maintenance";
export default {
  // 打卡签到
  name: "checkIn",
  data() {
    return {
      form: {
        operateFileUrl: "",
        operateDesc: "",
      },
    };
  },
  methods: {
    /**
     * 功能：同步图片上传组件返回的文件地址。
     * 参数：fileUrl 为图片上传组件返回的逗号分隔文件地址。
     * 返回值：无。
     * 使用方式：图片上传组件触发 input 事件时调用。
     */
    handleFileChange(fileUrl) {
      this.form.operateFileUrl = fileUrl;
    },
    /**
     * 功能：放弃本次现场打卡并返回上一页。
     * 参数：无。
     * 返回值：无。
     * 使用方式：点击页面底部“返回”按钮时调用。
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * 功能：校验现场照片和故障说明，并以状态 11 提交现场打卡。
     * 参数：无，提交内容来自当前页面表单及路由中的工单 ID。
     * 返回值：无；提交成功后关闭当前页签并返回工单列表。
     * 使用方式：点击页面底部“确认”按钮时调用。
     */
    submitForm() {
      // 表单验证
      if (!this.form.operateFileUrl) {
        this.$message.error("请上传故障图片");
        return;
      }

      if (!this.form.operateDesc || !this.form.operateDesc.trim()) {
        this.$message.error("请填写故障说明");
        return;
      }

      WorkOrderManagement.executeWorkOrder(
        Object.assign({}, this.form, {
          status: 11,
          id: this.$route.query.id,
        })
      ).then(({ message }) => {
        this.$modal.msgSuccess(message);

        this.$tab.closePage();
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.acceptance-submit {
  height: calc(100% - 60px);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .top {
    overflow-y: scroll;
    flex: 1;
  }
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap:4px;
}

.material-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.header-cell {
  flex: 1;
  padding: 12px 10px;
  text-align: center;
  font-weight: bold;
  color: #606266;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.table-cell {
  flex: 1;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.operation {
  justify-content: center;
}

.add-row {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.footer-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
  div {
    padding: 10px 30px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
