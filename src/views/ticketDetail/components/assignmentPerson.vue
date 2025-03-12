<template>
  <div class="assignment-person">
    <div class="header">
      <h2>分配维修人员</h2>
      <div class="filter-section">
        <div class="person-select">
          <span>分配维修人员</span>
          <el-select
            style="width: 100%"
            v-model="form.personnelId"
            multiple
            filterable
            placeholder="请选择姓名"
            @change="userChange"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="date-range">
          <span>维修时间段</span>
          <el-date-picker
            v-model="dateTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期时间"
            end-placeholder="结束日期时间"
            :default-time="['09:00:00', '18:00:00']"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
              },
            }"
          ></el-date-picker>
        </div>
      </div>
    </div>

    <div class="task-distribution">
      <h3>任务分配情况</h3>
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
      <div class="date-header">
        <div
          v-for="(date, index) in dateList"
          :key="index"
          class="date-item"
          :class="{ active: date.isActive }"
          @click="selectDate(index)"
        >
          <div class="week-day">星期{{ date.weekDay }}</div>
          <div class="date-value">{{ date.dateValue }}</div>
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
                @click="showTaskDetail(person, task)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>

    <el-dialog :visible.sync="taskDialogVisible" title="任务详情">
      <div v-for="task in selectedTasks" :key="task.id" class="task-detail">
        <div>任务编号: {{ task.ticketNo }}</div>
        <div>位置: {{ task.location }} - {{ task.position }}</div>
        <div>描述: {{ task.description }}</div>
        <div>时间: {{ task.startTime }} - {{ task.endTime }}</div>
      </div>
      <!-- footer -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="taskDialogVisible = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ResourceManagement, WorkOrderManagement } from "@/api/maintenance";
import dayjs from "dayjs";
export default {
  name: "AssignmentPerson",
  data() {
    return {
      userOptions: [],
      form: {
        personnelId: "",
        selectedPersons: [], // 存储选中人员的完整信息数组
      },
      personOptions: [
        { value: "1", label: "维修员1" },
        { value: "2", label: "维修员2" },
        { value: "3", label: "维修员3" },
      ],
      dateTimeRange: [],
      dateList: [],
      persons: [
        {
          name: "张三丰",
          tasks: [
            {
              id: 1,
              startTime: "02:30",
              endTime: "18:50",
              ticketNo: "WX2025028888",
              location: "主楼",
              position: "2楼202办公室",
              description: "门把手了不开了",
              showDetail: false,
              day: 0, // 当天
            },
          ],
        },
        {
          name: "段誉",
          tasks: [
            {
              id: 2,
              startTime: "12:00",
              endTime: "18:00",
              ticketNo: "WX2025028889",
              location: "副楼",
              position: "1楼101会议室",
              description: "灯不亮了",
              showDetail: false,
              day: 0, // 当天
            },
          ],
        },
        {
          name: "虚竹",
          tasks: [
            {
              id: 3,
              startTime: "14:00",
              endTime: "18:00",
              ticketNo: "WX2025028890",
              location: "主楼",
              position: "3楼305办公室",
              description: "空调不制冷",
              showDetail: false,
              day: 0, // 当天
            },
          ],
        },
      ],
      taskDialogVisible: false,
      selectedTasks: [],
    };
  },
  created() {
    this.initDateList();
    this.getUserList();
  },
  methods: {
    userChange(selectedValues) {
      // 获取选中的所有人员的详细信息
      const selectedItems = this.userOptions.filter((item) =>
        selectedValues.includes(item.value)
      );
      // 将选中人员的信息存储为对象数组
      const selectedPersons = selectedItems.map((item) => ({
        personnelId: item.value,
        name: item.label,
        phone: item.phone,
        landline: item.landline,
      }));
      // 更新form中的信息
      this.form.selectedPersons = selectedPersons;
    },
    // 获取所有用户人员信息
    getUserList() {
      ResourceManagement.getRepairListAll().then(({ data }) => {
        console.log(data, "data");
        this.userOptions = data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });
      });
    },
    initDateList() {
      const today = new Date();
      const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

      this.dateList = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        return {
          date,
          weekDay: weekDays[date.getDay()],
          dateValue: this.formatDate(date),
          isActive: index === 0, // 设置当前日期为选中状态
        };
      });
    },
    selectDate(index) {
      // 更新选中状态
      this.dateList.forEach((date, i) => {
        date.isActive = i === index;
      });

      // 根据选中日期更新任务列表
      const selectedDate = this.dateList[index].date;
      this.updateTasksByDate(selectedDate);
    },

    updateTasksByDate(date) {
      // 更新每个人的任务列表，这里仅作示例
      // 实际项目中应该根据后端接口获取数据
      this.persons.forEach((person) => {
        person.tasks = person.tasks.map((task) => ({
          ...task,
        }));
      });
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
      // 解析开始和结束时间的小时和分钟
      const [startHour, startMinute] = task.startTime.split(":").map(Number);
      const [endHour, endMinute] = task.endTime.split(":").map(Number);

      // 将时间转换为分钟数
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      // 计算任务在时间轴上的位置和宽度（基于1440分钟 = 24小时）
      const left = `${(startTotalMinutes / 1440) * 100}%`;
      const width = `${((endTotalMinutes - startTotalMinutes) / 1440) * 100}%`;

      return {
        left,
        width,
        position: "absolute",
        height: "100%",
        backgroundColor: "#CBD8FF",
        borderRadius: "4px",
        cursor: "pointer",
        zIndex: 2,
      };
    },
    showTaskDetail(person, task) {
      this.selectedTasks = [task];
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
    confirm() {
      // 处理确认逻辑
      console.log(
        this.form,
        "form",
        dayjs(this.dateTimeRange[0]).format("YYYY-MM-DD HH:mm:ss"),
        "time"
      );

      if (this.form.selectedPersons.length === 0) {
        this.$modal.msgError("请选择维修人员");
        return;
      }
      if (this.dateTimeRange.length === 0) {
        this.$modal.msgError("请选择维修时间段");
        return;
      }

      WorkOrderManagement.executeWorkOrder(
        Object.assign(
          {},
          {
            status: 3,
            id: this.$route.query.id,
            personnelList: this.form.selectedPersons,
            startDate: dayjs(this.dateTimeRange[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            endDate: dayjs(this.dateTimeRange[1]).format("YYYY-MM-DD HH:mm:ss"),
          }
        )
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
.assignment-person {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header {
    margin-bottom: 20px;

    h2 {
      font-size: 18px;
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

    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
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
            background-color: #cbd8ff;
          }

          &.no-task {
            background-color: #d2efeb;
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
          width: 1px;
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
            background-color: #d2efeb;
            border-radius: 4px;
            border: 1px solid #d2efeb;
            z-index: 1;

            .task-slot {
              &:hover {
                background-color: #4a7afe9e !important;
                box-shadow: 0 2px 8px rgba(74, 122, 254, 0.3);
                z-index: 5; /* 悬停时提高层级 */
              }

              .task-detail {
                background-color: #fff;
                border-radius: 4px;
                padding: 10px;
                width: 250px;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

                div {
                  margin-bottom: 5px;
                  font-size: 12px;
                }
              }
            }
          }
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
