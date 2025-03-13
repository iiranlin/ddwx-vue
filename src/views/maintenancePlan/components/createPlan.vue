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
              {{ dayjs(form.createTime).format("YYYY-MM-DD") }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div id="xss-demo"></div>
    <div class="btn-box">
      <div class="close" @click="close">关闭</div>
      <div class="save" @click="save">保存</div>
    </div>
  </el-card>
</template>
<script>
import Spreadsheet from "x-data-spreadsheet";
import zhCN from "x-data-spreadsheet/src/locale/zh-cn";
import { ResourceManagement, MaintenancePlan } from "@/api/maintenance";
import dayjs from "dayjs";
export default {
  name: "createPlan",
  data() {
    return {
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
  watch: {
    "form.teamId": {
      handler() {
        this.getUserList();
      },
      immediate: true,
    },
  },
  methods: {
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
        selectedValues.includes(item.value)
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
        selectedValues.includes(item.value)
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
