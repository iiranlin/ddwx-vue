<template>
  <el-card style="margin: 20px; height: calc(100% - 40px); overflow-y: scroll;">
    <el-form :model="formData" ref="formData" label-width="80px" :inline="true">
      <el-form-item label="统计时间">
        <el-date-picker
          :clearable="false"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
          v-model="formData.year"
          placeholder="请选择统计时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="维修班组" prop="teamId">
        <el-select
          style="width: 100%"
          v-model="formData.teamId"
          clearable
          filterable
          placeholder="请选择维修班组"
          @change="handleTeamChange"
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
      <el-form-item>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
          "
        >
          <div
            style="
              width: 90px;
              height: 36px;
              background: #2965dc;
              border-radius: 4px;
              color: #fff;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            "
            @click="handleQuery"
          >
            <i class="el-icon-search"></i>查询
          </div>
          <div
            style="
              width: 90px;
              height: 36px;
              background: #ffffff;
              border: 1px solid #cbcbcb;
              border-radius: 4px;
              color: #2b4054;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            "
            @click="resetQuery"
          >
            <i class="el-icon-refresh"></i>重置
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 顶部统计卡片 -->
    <h2>维修工单总览</h2>
    <el-row :gutter="20" class="card-panel-row">
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="4"
        v-for="(item, index) in cardPanelData"
        :key="index"
      >
        <div class="card-panel" :class="item.color">
          <div class="card-panel-icon-wrapper">
            <img height="51.92" :src="item.icon" alt="icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ item.title }}</div>
            <div class="card-panel-num">{{ item.count }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 各场所维修工单柱状图 -->
    <h2>各场所维修工单</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <div slot="header" class="clearfix">
          <span>各场所维修工单</span>
        </div>
        <div class="chart-wrapper">
          <div ref="barChart" class="chart" style="height: 300px"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部环形图 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="box-card">
          <div slot="header" class="clearfix">
            <h2>维修工单先后</h2>
          </div>
          <div class="chart-wrapper">
            <div ref="pieChart1" class="chart" style="height: 300px"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="box-card">
          <div slot="header" class="clearfix">
            <h2>设备类型维修工单</h2>
          </div>
          <div class="chart-wrapper">
            <div ref="pieChart2" class="chart" style="height: 300px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts主题
import resize from "@/views/dashboard/mixins/resize";
import formData from "@/components/formData";
import { ResourceManagement } from "@/api/maintenance";
import dayjs from "dayjs";
export default {
  name: "Kanban",
  mixins: [resize],
  components: { formData },
  data() {
    return {
      teamTypeOptions: [],
      formData: {
        teamId: "",
        name: "",
        startTime: this.getCurrentMonthRange().start,
        endTime: this.getCurrentMonthRange().end,
        year: [
          this.getCurrentMonthRange().start,
          this.getCurrentMonthRange().end,
        ],
      },
      cardPanelData: [
        {
          title: "总工单",
          count: 88,
          icon: require("@/assets/images/ddwx/总工单.png"),
          color: "blue",
        },
        {
          title: "待分配",
          count: 12,
          icon: require("@/assets/images/ddwx/待分配.png"),
          color: "blue-light",
        },
        {
          title: "处理中",
          count: 12,
          icon: require("@/assets/images/ddwx/处理中.png"),
          color: "orange",
        },
        {
          title: "待验收",
          count: 12,
          icon: require("@/assets/images/ddwx/待验收.png"),
          color: "blue-light",
        },
        {
          title: "已完成",
          count: 12,
          icon: require("@/assets/images/ddwx/已完成.png"),
          color: "green",
        },
        {
          title: "已取消",
          count: 12,
          icon: require("@/assets/images/ddwx/已取消.png"),
          color: "gray",
        },
      ],
      barChart: null,
      pieChart1: null,
      pieChart2: null,
    };
  },
  watch: {
    "formData.year": {
      handler(newVal) {
        if (!newVal) return;
        this.formData.startTime = dayjs(newVal[0]).format("YYYY-MM-DD");
        this.formData.endTime = dayjs(newVal[1]).format("YYYY-MM-DD");
      },
      deep: true,
    },
  },
  created() {
    this.getTeamType();
  },
  mounted() {
    this.$nextTick(() => {
      this.initBarChart();
      this.initPieChart1();
      this.initPieChart2();
    });
  },
  beforeDestroy() {
    if (this.barChart) {
      this.barChart.dispose();
      this.barChart = null;
    }
    if (this.pieChart1) {
      this.pieChart1.dispose();
      this.pieChart1 = null;
    }
    if (this.pieChart2) {
      this.pieChart2.dispose();
      this.pieChart2 = null;
    }
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
    /** 重置按钮操作 */
    resetQuery() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
      if (!row.year) {
        row.startTime = this.getCurrentMonthRange().start;
        row.endTime = this.getCurrentMonthRange().end;
        row.year = [
          this.getCurrentMonthRange().start,
          this.getCurrentMonthRange().end,
        ];
      }
      this.formData = Object.assign({}, this.formData, row);
      //   this.getList();
    },
    initBarChart() {
      this.barChart = echarts.init(this.$refs.barChart, "macarons");

      const locations = [
        "土区",
        "东南区",
        "西南区",
        "东北区",
        "综合区",
        "变电",
        "车辆段",
        "驱动段",
        "综合楼",
        "变电所",
        "东车段",
        "车道区",
      ];
      const firstData = [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42];
      const secondData = [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37];
      const thirdData = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9];

      this.barChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["一般", "非常紧急", "紧急"],
          left: 0,
          top: 0,
        },
        grid: {
          left: 0,
          right: "4%",
          bottom: "10%", // 为旋转标签留出更多空间
          top: 50,
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: locations,
            axisTick: {
              show: false,
            },
            barCategoryGap: "10%", // 不同类目间距保留
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              formatter: "{value}",
            },
            splitLine: {
              // 修改网格线样式为虚线
              show: true,
              lineStyle: {
                type: "dashed", // 设置为虚线
                color: "#ccc", // 颜色可以调整
                width: 1, // 线条宽度
              },
            },
          },
        ],
        series: [
          {
            name: "一般",
            type: "bar",
            barWidth: 30,
            barGap: 0,
            data: firstData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(25,120,229,0.10)" }, // 顶部颜色（浅）
                { offset: 1, color: "rgba(25,120,229,0.60)" }, // 底部颜色（深）
              ]),
            },
            label: {
              show: true, // 显示数值
              position: "top", // 在柱子顶部显示
              formatter: "{c} 单", // 添加单位 "单"
              color: "#333", // 文字颜色
              fontSize: 12, // 字体大小
            },
          },
          {
            name: "非常紧急",
            type: "bar",
            barGap: 0,
            barWidth: 30,
            data: secondData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(232,32,45,0.15)" }, // 顶部颜色（浅）
                { offset: 1, color: "rgba(255,78,78,0.70)" }, // 底部颜色（深）
              ]),
            },
            label: {
              show: true, // 显示数值
              position: "top", // 在柱子顶部显示
              formatter: "{c} 单", // 添加单位 "单"
              color: "#333", // 文字颜色
              fontSize: 12, // 字体大小
            },
          },
          {
            name: "紧急",
            type: "bar",
            barGap: 0,
            barWidth: 30,
            data: thirdData,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(255,208,46,0.15)" }, // 顶部颜色（浅）
                { offset: 1, color: "#ffd02e" }, // 底部颜色（深）
              ]),
            },
            label: {
              show: true, // 显示数值
              position: "top", // 在柱子顶部显示
              formatter: "{c} 单", // 添加单位 "单"
              color: "#333", // 文字颜色
              fontSize: 12, // 字体大小
            },
          },
        ],
      });
    },
    initPieChart1() {
      this.pieChart1 = echarts.init(this.$refs.pieChart1, "macarons");

      this.pieChart1.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "bottom",
          data: ["一般", "紧急", "非常紧急"],
        },
        series: [
          {
            name: "维修工单先后",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 32, name: "一般" },
              { value: 32, name: "紧急" },
              { value: 24, name: "非常紧急" },
            ],
            itemStyle: {
              color: function (params) {
                const colorList = ["#91c7ae", "#c23531", "#d48265"];
                return colorList[params.dataIndex];
              },
            },
          },
        ],
      });
    },
    initPieChart2() {
      this.pieChart2 = echarts.init(this.$refs.pieChart2, "macarons");

      this.pieChart2.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "horizontal",
          bottom: "bottom",
          data: [
            "供排水设备",
            "弱电设备",
            "强电设备",
            "电梯设备",
            "空调系统设备",
            "照明设备",
          ],
        },
        series: [
          {
            name: "设备类型维修工单",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 12, name: "供排水设备" },
              { value: 12, name: "弱电设备" },
              { value: 12, name: "强电设备" },
              { value: 12, name: "电梯设备" },
              { value: 12, name: "空调系统设备" },
              { value: 12, name: "照明设备" },
            ],
          },
        ],
      });
    },
    handleTeamChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.teamTypeOptions.find((item) =>
        selectedValues.includes(item.value)
      );
      // this.formData.teamName = selectedItems?.label;
    },
    // 获取当月范围（包含时间）
    getCurrentMonthRange() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD"); // 当月第一天 00:00:00
      const end = dayjs().endOf("month").format("YYYY-MM-DD"); // 当月最后一天 23:59:59.999
      return { start, end };
    },
  },
};
</script>

<style lang="scss" scoped>
.card-panel-row {
  margin-bottom: 20px;
}

.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}

.chart-wrapper {
  background: #fff;
  padding: 0 16px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
