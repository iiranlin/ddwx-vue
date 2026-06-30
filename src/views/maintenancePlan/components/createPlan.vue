<template>
  <el-card>
    <div>
      <h2 style="text-align: center">
        {{ isView ? `${form.planName}` : id ? "编辑" : "创建" }}维保计划
      </h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="elform"
        label-width="110px"
        v-loading="loading"
        label-suffix="："
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-if="!isView">
            <el-form-item :label="'计划名称'" prop="planName">
              <template v-if="!isView">
                <el-input
                  v-model="form.planName"
                  placeholder="请输入计划名称"
                ></el-input>
              </template>
              <template v-else>
                {{ form.planName }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item :label="'计划年份'" prop="planningYear">
              <!-- 年份选择器 -->
              <template v-if="!isView">
                <el-date-picker
                  style="width: 100%"
                  v-model="form.planningYear"
                  type="year"
                  placeholder="请选择计划年份"
                  value-format="yyyy"
                ></el-date-picker>
              </template>
              <template v-else>
                {{ form.planningYear }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item :label="'负责班组'" prop="teamId">
              <template v-if="!isView">
                <el-select
                  style="width: 100%"
                  v-model="form.teamId"
                  filterable
                  placeholder="请选择班组"
                  @change="handleSelectionChange"
                >
                  <el-option
                    v-for="item in teamTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
              <template v-else>
                {{ form.teamName }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-form-item :label="'实施负责人'" prop="implementPersonId">
              <template v-if="!isView">
                <el-select
                  style="width: 100%"
                  v-model="form.implementPersonId"
                  filterable
                  placeholder="请选择实施负责人"
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
              </template>
              <template v-else>
                {{ form.implementPersonName }}
              </template>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-if="isView">
            <el-form-item :label="'制定时间'">
              {{ dayjs(form.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div id="xss-demo"></div>
    <div class="btn-box">
      <div class="close" @click="close">关闭</div>
      <div  class="save" @click="download">下载</div>
      <div v-if="!isView" class="save" @click="save">保存</div>
    </div>
  </el-card>
</template>
<script>
import Spreadsheet from "x-data-spreadsheet";
import zhCN from "x-data-spreadsheet/src/locale/zh-cn";
import { ResourceManagement, MaintenancePlan } from "@/api/maintenance";
import dayjs from "dayjs";
import XLSX from "xlsx-js-style";
import { xtos } from "./util";
export default {
  name: "createPlan",
  data() {
    const initTableData = [
      {
        name: "sheet1",
        freeze: "A1",
        styles: [],
        merges: [],
        rows: {
          len: 6,
        },
        cols: {
          len: 16,
        },
        validations: [],
        autofilter: {},
      },
    ];
    return {
      initTableData,
      loading: false,
      xs: null,
      userOptions: [],
      teamTypeOptions: [],
      form: {
        teamId: "",
        implementPersonId: "",
        implementPersonName: "",
        planName: "",
        planningYear: "",
        teamName: "",
      },
      rules: {
        teamId: [
          { required: true, message: "请选择归属班组", trigger: "blur" },
        ],
        implementPersonId: [
          { required: true, message: "请选择实施负责人", trigger: "blur" },
        ],
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" },
        ],
        planningYear: [
          { required: true, message: "请选择计划年份", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getTeamType();
  },
  mounted() {
    Spreadsheet.locale("zh-cn", zhCN);
    this.xs = new Spreadsheet(document.getElementById("xss-demo"), {
      mode: this.isView ? "read" : "edit", // edit | read
      showToolbar: this.isView ? false : true,
      showGrid: true,
      showContextmenu: true,
      showBottomBar: false,
      view: {
        height: () => document.documentElement.clientHeight - 320,
        width: () => document.documentElement.clientWidth - 200,
      },
      row: {
        len: 6,
        height: 40,
      },
      col: {
        len: 16,
        width: 100,
        indexWidth: 60,
        minWidth: 60,
      },
      style: {
        bgcolor: "#ffffff",
        align: "left",
        valign: "middle",
        textwrap: false,
        strike: false,
        underline: false,
        color: "#0a0a0a",
        font: {
          name: "Helvetica",
          size: 10,
          bold: false,
          italic: false,
        },
      },
      menu: [
        {
          key: "mergeCells",
          title: "合并单元格",
          handler: function () {
            const { ri, ci } = sheet.selector;
            sheet.sheet.mergeCells.add(ri, ci, ri, ci);
            sheet.reRender();
          },
        },
      ],
    });

    // 获取id
    if (this.id) {
      this.getPlanById(this.id);
      this.getUserList();
    }
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
    isView() {
      return this.$route.query.isView;
    },
  },
  activated() {
    // 如果是新增，则默认初始
    if (!this.id) {
      this.form.planningYear = "";
      this.form.planName = "";
      this.form.teamId = "";
      this.form.implementPersonId = "";
      this.form.implementPersonName = "";

      this.xs.loadData(this.initTableData);
    }
  },
  watch: {
    "form.teamId": {
      handler() {
        this.getUserList();
      },
      immediate: true,
    },
  },
  methods: {
    completeMergedCellsData(sheetsData) {
      return sheetsData.map((sheet) => {
        const updatedSheet = JSON.parse(JSON.stringify(sheet));

        // 确保存在merges数组
        updatedSheet.merges = updatedSheet.merges || [];

        // 解析合并单元格
        const parsedMerges = updatedSheet.merges.map((merge) => {
          const [start, end] = merge.split(":");
          const startCol = start.charCodeAt(0) - 65; // A = 0, B = 1, etc.
          const startRow = parseInt(start.slice(1)) - 1;
          const endCol = end.charCodeAt(0) - 65;
          const endRow = parseInt(end.slice(1)) - 1;

          return { startRow, startCol, endRow, endCol };
        });

        // 处理每个合并区域
        parsedMerges.forEach((merge) => {
          for (let row = merge.startRow; row <= merge.endRow; row++) {
            for (let col = merge.startCol; col <= merge.endCol; col++) {
              // 确保行和单元格存在
              if (!updatedSheet.rows[row]) {
                updatedSheet.rows[row] = { cells: {} };
              }

              // 主合并单元格
              const mainCell =
                updatedSheet.rows[merge.startRow].cells[merge.startCol];

              // 处理当前单元格
              const currentCell = updatedSheet.rows[row].cells[col] || {};

              // 合并单元格的第一个单元格不需要处理
              if (row === merge.startRow && col === merge.startCol) continue;

              // 修改这里：正确设置merge属性，包含行和列的合并信息
              updatedSheet.rows[row].cells[col] = {
                ...currentCell,
                style: mainCell.style !== undefined ? mainCell.style : 0,
                merge: [
                  merge.startRow - row,
                  merge.startCol - col,
                  merge.endRow - row,
                  merge.endCol - col,
                ],
                text: mainCell.text || currentCell.text,
              };
            }
          }
        });

        return updatedSheet;
      });
    },
    download() {
      // 获取当前表格的数据
      const data = this.completeMergedCellsData(this.xs.getData());
      console.log(data, "data");
      // 克隆原始数据，不直接修改它
      const clonedData = JSON.parse(JSON.stringify(data));

      // 获取第一个sheet（通常只有一个）
      const sheet = clonedData[0];

      // 确保rows存在
      if (!sheet.rows) {
        sheet.rows = { len: 0 };
      }

      // 插入标题行，移动现有数据行向下
      // 首先把所有行向下移动5行（原来是3行，现在增加到5行）
      const oldRows = { ...sheet.rows };
      sheet.rows = { len: (oldRows.len || 0) + 5 }; // 增加到5行标题信息

      // 移动现有行数据和样式
      Object.keys(oldRows).forEach((key) => {
        if (key !== "len") {
          const rowNum = parseInt(key);
          sheet.rows[rowNum + 6] = oldRows[key]; // 从第6行开始放原始数据，前5行放标题信息
        }
      });

      // 添加标题行并设置边框
      if (!sheet.rows[0]) sheet.rows[0] = { cells: {} };
      if (!sheet.rows[1]) sheet.rows[1] = { cells: {} };
      if (!sheet.rows[2]) sheet.rows[2] = { cells: {} };
      if (!sheet.rows[3]) sheet.rows[3] = { cells: {} };
      if (!sheet.rows[4]) sheet.rows[4] = { cells: {} };

      // 设置计划名称
      sheet.rows[0].cells = {
        0: {
          text: `计划名称：${this.form.planName}`,
        },
      };

      // 设置计划年份
      sheet.rows[1].cells = {
        0: {
          text: `计划年份：${this.form.planningYear}`,
        },
      };

      // 设置负责班组
      sheet.rows[2].cells = {
        0: {
          text: `负责班组：${this.form.teamName || ""}`,
        },
      };

      // 设置实施负责人
      sheet.rows[3].cells = {
        0: {
          text: `实施负责人：${this.form.implementPersonName || ""}`,
        },
      };

      // 设置制定时间
      const formattedDate = dayjs(this.form.createTime).format("YYYY-MM-DD HH:mm:ss");
      sheet.rows[4].cells = {
        0: {
          text: `制定时间：${formattedDate}`,
        },
      };

      // 转换为工作表
      const worksheet = xtos(Object.values(clonedData));

      // 写入文件并下载
      XLSX.writeFile(worksheet, `${this.form.planName}维保计划.xlsx`);
    },
    async getPlanById(id) {
      await MaintenancePlan.getMaintenancePlanById(id)
        .then(({ data }) => {
          this.form = data;
          this.xs.loadData(JSON.parse(data.planContent || ""));
        })
        .finally(() => {
          this.loading = false;
        });
      return Promise.resolve();
    },
    close() {
      this.$tab.closePage();
      this.$router.go(-1);
    },
    save() {
      this.$refs.elform.validate((valid) => {
        if (valid) {
          MaintenancePlan[
            this.id ? "updateMaintenancePlan" : "addMaintenancePlan"
          ]({
            ...this.form,
            planContent: JSON.stringify(this.xs.getData()),
          }).then((data) => {
            this.$message.success(data.message);
            this.$tab.closePage();
            this.$router.go(-1);
          });
        }
      });
    },
    addRow() {
      // this.xs.insertRow(0);
      console.log(this.xs.getData());
    },
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
    // 获取所有用户人员信息
    async getUserList() {
      console.log(this.form.teamId, "this.form.teamId");
      if (!this.form.teamId) {
        this.userOptions = [];
        this.form.implementPersonId = "";

        return;
      }
      await ResourceManagement.getRepairListAll({
        teamId: this.form.teamId,
      }).then(({ data }) => {
        this.userOptions = data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });
      });
    },
    userChange(selectedValues) {
      // 获取选中的所有人员的详细信息
      const selectedItems = this.userOptions.find((item) =>
        selectedValues == item.value
      );

      // 更新form中的信息
      this.form.implementPersonName = selectedItems.label;
    },
    handleSelectionChange(selectedValues) {
      // 班组改变就清空负责人
      this.form.implementPersonId = "";
      this.form.implementPersonName = "";
      if (!selectedValues) {
        this.userOptions = [];
        return;
      }
      // 获取选中的数据详情
      const selectedItems = this.teamTypeOptions.find((item) =>
        selectedValues == item.value
      );
      this.form.teamName = selectedItems.label;
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-box {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  .close {
    width: 74px;
    height: 35px;
    background: #e2f0ff;
    border-radius: 4px;
    cursor: pointer;
    color: #0c7bfe;
    text-align: center;
    line-height: 35px;
  }
  .save {
    width: 74px;
    height: 35px;
    background: #0c7bfe;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    text-align: center;
    line-height: 35px;
  }
}
</style>
