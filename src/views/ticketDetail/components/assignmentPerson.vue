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
                @click="showTaskDetail(person)"
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
      <div
        v-for="(task, idx) in selectedTasks"
        :key="task.id"
        class="task-detail"
      >
        <div class="task-title">任务{{ idx + 1 }}</div>
        <div class="task-content">
          <div class="detail-item " style="color:black !important;font-weight: bold;">
            <span class="detail-label">工单编号</span>
            <span class="detail-content">：{{ task.orderNum }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">场所</span>
            <span class="detail-content">：{{ task.faultSiteName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">位置</span>
            <span class="detail-content">：{{ task.faultAddr }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">故障描述</span>
            <span class="detail-content">：{{ task.remark }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">维修时间</span>
            <span class="detail-content"
              >：{{ task.startTime }} - {{ task.endTime }}</span
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
  async created() {
    await this.getOrderDetail();

    this.initDateList();
    await this.getUserList();
  },
  methods: {
    async getOrderDetail() {
      const { data = {} } = await WorkOrderManagement.getWorkOrderById(
        this.$route.query.id
      );
      this.details = data;
      console.log(data, "ressss  1");
      return Promise.resolve();
    },
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

      this.updateTasksByDate();
    },
    // 获取所有用户人员信息
    async getUserList() {
      console.log(this.details, "details 2");
      await ResourceManagement.getRepairListAll({
        teamId: this.details.teamId,
      }).then(({ data }) => {
        console.log(data, "data  3");
        this.userOptions = data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });

        // 获取到用户信息后，查看details里面有没有选择用户，数据回显
        if (this.details.personnelList) {
          this.form.personnelId = this.details.personnelList.map(
            (item) => item.personnelId
          );
        }
        // 时间段回显
        if (this.details.startDate && this.details.endDate) {
          this.dateTimeRange = [this.details.startDate, this.details.endDate];
        }
      });

      return Promise.resolve();
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
      this.currentDate = dayjs(selectedDate).format("YYYY-MM-DD");
      this.updateTasksByDate(selectedDate);
    },

    async updateTasksByDate() {
      if (this.form.selectedPersons.length === 0) {
        return;
      }

      const res = await WorkOrderPerson.getWorkOrderPersonByDate({
        date: this.currentDate,
        personnelIds: this.form.personnelId.join(),
      });

      // 格式化时间数据
      const formattedData = res.data.map((person) => ({
        ...person,
        tasks: person.tasks.map((task) => ({
          ...task,
          startTime: dayjs(task.startTime).format("HH:mm"),
          endTime: dayjs(task.endTime).format("HH:mm"),
        })),
      }));

      this.persons = formattedData;
      console.log(res, "res");
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

      // 解析开始和结束时间
      const [startHour, startMinute] = task.startTime.split(":").map(Number);
      const [endHour, endMinute] = task.endTime.split(":").map(Number);

      // 创建完整的时间对象
      const startDate = new Date(baseDate);
      startDate.setHours(startHour, startMinute, 0);

      const endDate = new Date(baseDate);
      endDate.setHours(endHour, endMinute, 0);

      // 如果结束时间小于开始时间，说明是跨天任务，结束时间加一天
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // 计算开始时间和结束时间的分钟数（相对于当天0点）
      const startTotalMinutes =
        (startDate.getTime() - baseDate.setHours(0, 0, 0, 0)) / (60 * 1000);
      const endTotalMinutes =
        (endDate.getTime() - baseDate.setHours(0, 0, 0, 0)) / (60 * 1000);

      // 计算任务在时间轴上的位置和宽度
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
    async confirm() {
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

      // 提交前检查时间内是否有任务，如果有给出提示，让用户确认是否继续提交
      const { data = false } = await WorkOrderPerson.checkTask({
        startDate: dayjs(this.dateTimeRange[0]).format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(this.dateTimeRange[1]).format("YYYY-MM-DD HH:mm:ss"),
        personnelIds: this.form.personnelId.join(),
      });
      console.log(data, "res");
      if (data) {
        this.$confirm(
          "维修时间和现有任务的维修时间分配有重叠，请确认",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.submit();
        });
      } else {
        this.submit();
      }
    },

    submit() {
      WorkOrderManagement.executeWorkOrder(
        Object.assign(
          {},
          {
            // 有人则为转派，没人则是分配
            status: this.details.status ? 10 : 3,
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

    h3 {
      font-size: 18px;
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
            }
          }
        }
      }
    }
  }
}

.task-detail {
  .task-title {
    font-size: 16px;
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
      color:#7C8491;
      font-weight: 400;
      .detail-label{
        // 文件两端对齐
        text-align: justify;
        text-align-last: justify;
        width: 70px;
       
      }
      .detail-content {
        width: 200px;
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
