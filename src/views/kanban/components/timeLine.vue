<template>
  <div class="assignment-person">
    <div class="task-distribution">
      <h2>今日维修人员维修任务分布</h2>

      <!-- 使用卡片式tabs组件 -->
      <el-tabs
        v-model="activeTab"
        class="person-tabs"
        type="border-card"
        @tab-click="handleTabChange"
      >
        <!-- 有任务人员标签页 -->
        <el-tab-pane label="有任务人员" name="hasTasks">
          <div class="has-task-container">
            <div class="legend">
              <div class="legend-item">
                <div class="legend-color has-task"></div>
                <span>有任务</span>
              </div>
              <div class="legend-item">
                <div class="legend-color no-task"></div>
                <span>无任务</span>
              </div>
            </div>

            <div class="time-scale">
              <div class="time-labels">
                <div v-for="hour in 25" :key="hour - 1" class="time-label">
                  {{ formatHour(hour - 1) }}
                </div>
              </div>
              <div class="time-grid-lines">
                <div
                  v-for="hour in 25"
                  :key="hour - 1"
                  class="time-grid-line"
                  :style="{ left: `${(hour - 1) * (100 / 24)}%` }"
                  @click="handleTimeGridClick(hour - 1)"
                ></div>
              </div>

              <template v-if="persons.length > 0">
                <div class="schedule-grid">
                  <!-- 示例任务时间段 -->
                  <div
                    class="person-row"
                    v-for="(person, index) in persons"
                    :key="index"
                  >
                    <div class="person-name">{{ person.name }}</div>
                    <div class="time-slots">
                      <div
                        v-for="task in person.tasks"
                        :key="task.id"
                        class="task-slot"
                        :style="getTaskStyle(task)"
                        @click="showTaskDetail(person)"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <el-empty></el-empty>
              </template>
            </div>
          </div>
        </el-tab-pane>

        <!-- 无任务人员标签页 -->
        <el-tab-pane label="无任务人员" name="noTasks">
          <div class="no-task-persons">
            <div class="person-tags">
              <el-tag
                v-for="(person, index) in emptyPersons"
                :key="index"
                type="info"
                effect="light"
                class="person-tag"
              >
                <i class="el-icon-user"></i> {{ person.name }}
              </el-tag>
            </div>
            <el-empty
              v-if="emptyPersons.length === 0"
              description="暂无无任务人员"
            ></el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <div class="action-buttons">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div> -->

    <el-dialog :visible.sync="taskDialogVisible" title="任务详情">
      <div
        v-for="(task, idx) in selectedTasks"
        :key="task.id"
        class="task-detail"
      >
        <div class="task-title">任务{{ idx + 1 }}</div>
        <div class="task-content">
          <div
            class="detail-item"
            style="color: black !important; font-weight: bold"
          >
            <span class="detail-label">工单编号</span>
            <span class="detail-content">{{ task.orderNum }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">场所</span>
            <span class="detail-content">{{ task.faultSiteName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">位置</span>
            <span class="detail-content">{{ task.faultAddr }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">故障描述</span>
            <span class="detail-content">{{ task.remark }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修时间</span>
            <span class="detail-content"
              >{{ task.startTime }} 至 {{ task.endTime }}</span
            >
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="taskDialogVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  ResourceManagement,
  WorkOrderManagement,
  WorkOrderPerson,
} from "@/api/maintenance";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
export default {
  name: "AssignmentPerson",
  data() {
    return {
      details: {},
      currentDate: dayjs().format("YYYY-MM-DD"),
      userOptions: [],
      form: {
        personnelId: "",
        selectedPersons: [], // 存储选中人员的完整信息数组
      },
      personOptions: [],
      dateTimeRange: [],
      dateList: [],
      persons: [{}],
      taskDialogVisible: false,
      selectedTasks: [],
      emptyPersons: [],
      activeTab: "hasTasks", // 默认选中有任务的tab
    };
  },
  activated() {
    this.updateTasksByDate();
  },
  async created() {
    await this.updateTasksByDate();
  },
  methods: {
    // 处理tab切换
    handleTabChange() {
      // Tab变化后不需要特殊处理，视图会根据activeTab自动切换
    },
    async updateTasksByDate() {
      const res = await WorkOrderPerson.getWorkOrderPersonByDate({
        date: this.currentDate,
        status: 1,
      });

      this.emptyPersons = res.data.filter(
        (person) => person.tasks.length === 0
      );

      // 格式化时间数据
      const formattedData = res.data
        .filter((person) => person.tasks.length > 0)
        .map((person) => ({
          ...person,
          tasks: person.tasks.map((task) => ({
            ...task,
            // startTime: dayjs(task.startTime).format("HH:mm"),
            // endTime: dayjs(task.endTime).format("HH:mm"),
          })),
        }));

      this.persons = formattedData;
    },
    formatDate(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    },
    formatHour(hour) {
      return `${hour.toString().padStart(2, "0")}:00`;
    },
    getTaskStyle(task) {
      // 获取当前选中日期
      const selectedDate = this.dateList.find((date) => date.isActive);
      const baseDate = selectedDate ? selectedDate.date : new Date();
      const selectedDateStr = dayjs(baseDate).format("YYYY-MM-DD");

      // 解析任务的开始和结束时间
      const taskStartDate = dayjs(task.startTime).format("YYYY-MM-DD");
      const taskEndDate = dayjs(task.endTime).format("YYYY-MM-DD");
      const [startHour, startMinute] = dayjs(task.startTime)
        .format("HH:mm")
        .split(":")
        .map(Number);
      const [endHour, endMinute] = dayjs(task.endTime)
        .format("HH:mm")
        .split(":")
        .map(Number);

      let startTotalMinutes = 0;
      let endTotalMinutes = 1440; // 24小时的总分钟数

      // 根据选中日期与任务时间范围的关系计算显示时间
      if (selectedDateStr === taskStartDate) {
        // 如果是任务开始日期，从开始时间到24点
        startTotalMinutes = startHour * 60 + startMinute;
      }

      if (selectedDateStr === taskEndDate) {
        // 如果是任务结束日期，从0点到结束时间
        endTotalMinutes = endHour * 60 + endMinute;
      }

      // 判断选中日期是否在任务时间范围内
      const isInTaskRange = dayjs(selectedDateStr).isBetween(
        taskStartDate,
        taskEndDate,
        "day",
        "[]"
      );

      // 计算任务在时间轴上的位置和宽度
      const left = `${(startTotalMinutes / 1440) * 100}%`;
      const width = isInTaskRange
        ? `${((endTotalMinutes - startTotalMinutes) / 1440) * 100}%`
        : "0%";

      return {
        left,
        width,
        position: "absolute",
        height: "80%",
        top: "10%",
        backgroundColor: "#387EF7",
        borderRadius: "4px",
        cursor: "pointer",
      };
    },
    showTaskDetail(person) {
      this.selectedTasks = person.tasks;
      this.taskDialogVisible = true;
    },
    handleTimeGridClick(hour) {
      this.selectedTasks = [];
      this.persons.forEach((person) => {
        person.tasks.forEach((task) => {
          const startHour = parseInt(task.startTime.split(":")[0]);
          const endHour = parseInt(task.endTime.split(":")[0]);
          if (hour >= startHour && hour < endHour) {
            this.selectedTasks.push(task);
          }
        });
      });
      if (this.selectedTasks.length > 0) {
        this.taskDialogVisible = true;
      }
    },
    cancel() {
      this.$tab.closePage();
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.assignment-person {
  .header {
    margin-bottom: 20px;

    h2 {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .filter-section {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .person-select {
        display: flex;
        align-items: center;
        margin-right: 30px;
        width: 400px;

        span {
          margin-right: 10px;
          white-space: nowrap;
        }
      }

      .date-range {
        display: flex;
        align-items: center;

        span {
          margin-right: 10px;
          white-space: nowrap;
        }

        .date-separator {
          margin: 0 10px;
        }
      }
    }
  }

  .task-distribution {
    margin-bottom: 20px;

    /* 有任务人员容器样式 */
    .has-task-container {
      min-height: 300px;
    }

    /* 无任务人员展示样式 */
    .no-task-persons {
      min-height: 200px;

      .person-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 12px;
        padding: 10px;

        .person-tag {
          cursor: default;
          border-radius: 4px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }

          i {
            margin-right: 5px;
          }
        }
      }
    }

    .legend {
      display: flex;
      margin-bottom: 15px;
      justify-content: center; /* 添加居中显示 */

      .legend-item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        min-width: 80px;
        justify-content: center;

        .legend-color {
          width: 52px;
          height: 24px;
          margin-right: 8px;
          border-radius: 3px;
          border: 1px solid #ddd;

          &.has-task {
            background-color: #387ef7;
          }

          &.no-task {
            background-color: #e1e1e1;
          }
        }
      }
    }

    .date-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      width: 50%;
      margin-inline: auto;

      .date-item {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 74px;
        height: 74px;
        border-radius: 50%;
        cursor: pointer;

        &.active {
          background-color: #e6efff;
        }

        .week-day {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .date-value {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }

    .time-scale {
      position: relative;

      .time-labels {
        display: flex;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-bottom: 10px;
        padding-left: 80px; /* 与schedule-grid对齐 */

        .time-label {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      }

      .time-grid-lines {
        position: absolute;
        top: 30px;
        left: 100px;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 0; /* 降低网格线的z-index，确保不会遮挡任务 */

        .time-grid-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 0px;
          background-color: #ebeef5; /* 使网格线颜色更淡，提高视觉层次感 */
          cursor: pointer; /* Add cursor pointer to indicate clickable */
        }
      }

      .schedule-grid {
        padding-left: 100px; /* 增加左侧padding，为姓名留出更多空间 */
        .person-row {
          display: flex;
          margin-bottom: 15px;
          height: 60px;
          position: relative; /* 修改为relative定位 */

          .person-name {
            width: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 10px;
            position: absolute;
            left: -100px;
            height: 100%;
            z-index: 2;
          }

          .time-slots {
            flex: 1;
            position: relative;
            background-color: #e1e1e1;
            border-radius: 4px;
            border: 1px solid #e1e1e1;
            z-index: 1;

            // &:hover {
            //   .task-slot {
            //     background-color: #4a7afe9e !important;
            //     box-shadow: 0 2px 8px rgba(74, 122, 254, 0.3);
            //     z-index: 999; /* 悬停时提高层级 */
            //   }
            // }
          }
        }
      }
    }
  }
}

.task-detail {
  font-size: 16px;
  .task-title {
    font-size: 18px;
    font-weight: 400;
    color: #0c7bfe;
  }

  .task-content {
    padding: 10px;
    background: #f4f5f7;
    border-radius: 5px;
    margin-block: 10px;

    .detail-item {
      display: flex;
      margin-bottom: 10px;
      color: #7c8491;
      font-weight: 400;
      .detail-label {
        // 文件两端对齐
        text-align: justify;
        text-align-last: justify;
        width: 80px;
      }
      .detail-content {
        width: calc(100% - 120px);
        &::before {
          content: " : ";
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 30px;

  .el-button {
    margin: 0 10px;
    min-width: 100px;
  }
}
</style>
