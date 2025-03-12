<template>
  <el-card style="height: 500px; overflow-y: scroll;">
    <div class="info-card">
      <div class="timeline">
        <div
          class="timeline-item"
          v-for="(item, index) in details.operateLogs"
          :key="index"
          :class="{ 'first-item': index === 0 }"
        >
          <div class="timeline-time">
            <div class="time">{{ formatDate(item.createTime) }}</div>
          </div>
          <div class="timeline-content">
            <div
              class="timeline-dot"
              :class="index === 0 ? 'first-dot' : ''"
            ></div>
            <div
              class="timeline-line"
              v-if="index !== details.operateLogs.length"
            ></div>
            <div class="timeline-card">
              <div class="timeline-header">
                <span
                  class="timeline-title"
                  :class="{ 'first-title': index === 0 }"
                  >【{{ item.operateName }}】</span
                >
                <span
                  class="timeline-user"
                  :class="{ 'first-title': index === 0 }"
                  >{{ item.createByName }}</span
                >
              </div>
              <!-- 评分 -->
              <div
                v-if="item.evaluateLevel"
                style="display: flex; gap: 40px; margin-bottom: 10px"
              >
                <span style="display: flex">
                  响应速度：
                  <el-rate :colors="colors" disabled :value="3"></el-rate>
                </span>
                <span style="display: flex">
                  服务态度：
                  <el-rate :colors="colors" disabled :value="5"></el-rate>
                </span>
                <span style="display: flex">
                  维修评价：
                  <el-rate :colors="colors" disabled :value="5"></el-rate>
                </span>
              </div>
              <div class="timeline-desc" :class="{ 'first-desc': index === 0 }">
                {{ item.operateDesc }}
              </div>
              <!-- 图片展示区域 -->
              <div class="image-container" v-if="item.operateFile">
                <el-image
                  v-for="(img, imgIndex) in operateFileImg(item)"
                  :key="imgIndex"
                  :src="img"
                  :preview-src-list="operateFileImg(item)"
                  class="repair-image"
                ></el-image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
  <!-- 时间轴信息 -->
</template>
<script>
export default {
  props: {
    details: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_FILE_API,
      colors: {
        1: "#387EF7", // Color for 2 stars
        2: "#387EF7", // Color for 4 stars
        3: "#387EF7", // Color for 5 stars
        4: "#387EF7", // Color for 5 stars
        5: "#387EF7", // Color for 5 stars
      },
    };
  },
  methods: {
    operateFileImg(data) {
      console.log(data, "data");
      return data.operateFile.split(",").map((x) => this.baseUrl + x);
    },
    // 获取操作类型文本
    getOperateTypeText(type) {
      const typeTextMap = {
        ASSIGN: "分配工单",
        SUBMIT: "提交验收",
        ACCEPT: "验收通过",
        REJECT: "验收不通过",
        CANCEL: "取消工单",
      };
      return typeTextMap[type] || type;
    },
    // 获取状态类名
    getStatusClass(type) {
      const statusClassMap = {
        ASSIGN: "status-assign",
        SUBMIT: "status-submit",
        ACCEPT: "status-accept",
        REJECT: "status-reject",
        CANCEL: "status-cancel",
      };
      return statusClassMap[type] || "";
    },
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.section-title {
  font-size: 18px;
  color: #1e1e1e;
  font-weight: bold;
  margin-bottom: 20px;
}

.info-card {
  margin-bottom: 20px;
  margin-top: 20px;
}

/* 时间轴样式 */
.timeline {
  position: relative;
  padding: 20px;

  .image-container {
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;

    .repair-image {
      width: 120px;
      height: 120px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      object-fit: cover;
    }
  }

  .timeline-item {
    display: flex;
    margin-bottom: 30px;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    &.first-item {
      .timeline-time .time {
        color: #387ef7;
        font-weight: bold;
      }

      .timeline-content .timeline-line {
        border-left: 1px dashed #387ef7;
      }
    }

    .timeline-time {
      width: 150px;
      text-align: right;
      padding-right: 20px;
      flex-shrink: 0;

      .time {
        color: #909399;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .timeline-content {
      flex: 1;
      position: relative;

      .timeline-dot {
        position: absolute;
        left: 0;
        top: 5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #909399;
        z-index: 2;
        transform: translateX(-50%);

        &.first-dot {
          background-color: #409eff;
          width: 12px;
          height: 12px;
        }
      }

      .timeline-line {
        position: absolute;
        left: 0;
        top: 11px;
        width: 0;
        height: calc(100% + 30px);
        border-left: 1px dashed #969799;
        transform: translateX(-50%);
        z-index: 1;
      }

      .timeline-card {
        margin-left: 20px;
        border-radius: 4px;
        padding: 15px;

        .timeline-header {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;

          .timeline-title {
            font-weight: bold;
            font-size: 16px;
            color: #606266;

            &.first-title {
              color: #409eff;
            }
          }

          .timeline-user {
            color: #606266;
            font-weight: bold;
            font-size: 16px;

            &.first-title {
              color: #409eff;
            }
          }
        }

        .timeline-desc {
          color: #969799;
          margin-bottom: 10px;
          line-height: 1.5;
          white-space: pre-line;

          &.first-desc {
            color: #303133;
          }
        }
      }
    }
  }
}
</style>
