<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="openDataScope"
    width="600px"
    append-to-body
    center
    @close="handleDialogClose()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="elform"
      label-width="120px"
      v-loading="loading"
      label-suffix="："
    >
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'归属班组'" prop="teamId">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <el-select
                style="flex: 1"
                v-model="form.teamId"
                filterable
                placeholder="请选择归属班组"
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
              <span v-if="currentForeman" style="margin-left: 10px"
                >班工长：{{ currentForeman }}</span
              >
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'姓名'" prop="userId">
            <csSelect
              :selectData="{
                data: userOptions,
                label: 'label',
                value: 'value',
                isRight: false,
              }"
              v-model="form.userId"
              placeholder="请选择姓名"
              clearable
              @change="userChange"
            ></csSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'员工工号'" prop="userCode">
            <el-input
              :disabled="true"
              v-model="form.userCode"
              maxlength="200"
              placeholder="请输入员工工号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'联系电话'" prop="phone">
            <el-input
              v-model="form.phone"
              maxlength="11"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'座机'" prop="landline">
            <el-input
              v-model="form.landline"
              maxlength="12"
              placeholder="请输入座机号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'工种'" prop="job">
            <el-input
              v-model="form.job"
              maxlength="200"
              placeholder="请输入工种名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'是否班工长'" prop="foreman">
            <el-radio-group v-model="form.foreman">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-button" type="text" @click="handleCancel">取消</el-button>
      <el-button type="text" @click="handleCreate()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ResourceManagement } from "@/api/maintenance";
import { userPage } from "@/api/system/user";
import VirtualScrollList from "vue-virtual-scroll-list";
import Options from "./options.vue";
import CsSelect from "./csSelect.vue";
export default {
  components: {
    VirtualScrollList,
    Options,
    CsSelect,
  },
  data() {
    return {
      optionComponent: Options,
      valueKey: "value",
      teamTypeOptions: [],
      userOptions: [],
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      // 当前班工长
      currentForeman: "",
      //表单数据
      form: {
        teamId: "",
        teamName: "",
        name: "",
        userCode: "",
        phone: "",
        landline: "",
        job: "",
        foreman: 0,
      },
      //表单校验
      rules: {
        teamId: [
          {
            required: true,
            message: "归属班组不能为空",
            trigger: "blur",
          },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /^\d{11}$/,
            message: "联系电话须为11位数字",
            trigger: "blur",
          },
        ],
        landline: [
          { required: true, message: "座机不能为空", trigger: "blur" },
          {
            pattern: /^(?=(?:\D*\d){4,11}\D*$)\d+(?:-\d+)?$/,
            message: "座机号码格式不正确",
            trigger: "blur",
          },
        ],
        foreman: [
          { required: true, message: "是否班工长不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 获取班组枚举不分页
    getTeamType() {
      ResourceManagement.getTeamListAll().then(({ data }) => {
        console.log(data, "data");
        this.teamTypeOptions = data.map((item) => {
          return {
            ...item,
            label: item.teamName,
            value: item.id,
          };
        });

        this.currentForeman = this.teamTypeOptions.find(
          (x) => x.id === this.form?.teamId
        )?.leaderName;
      });
    },
    // 获取所有用户人员信息
    getUserList() {
      userPage({
        pageNum: 1,
        pageSize: 99999,
        total: 0,
        status: 0,
      }).then(({ data: { list } }) => {
        console.log(list, "data");
        this.userOptions = list.map((item) => {
          return {
            ...item,
            label: item.realName,
            value: item.id,
          };
        });

        this.form.userCode = this.userOptions.find(
          (x) => x.id === this.form?.userId
        )?.userCode;
      });
    },

    //初始化
    init() {
      this.form = {
        teamId: "",
        teamName: "",
        name: "",
        userCode: "",
        phone: "",
        landline: "",
        job: "",
        foreman: 0,
      };
      this.currentForeman = "";
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建维修人员";
      });
      this.getTeamType();
      this.getUserList();
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      this.getTeamType();
      this.getUserList();
      await ResourceManagement.getRepairById(id).then(({ data }) => {
        this.form = Object.assign({}, data);

        this.$nextTick(() => {
          this.title = "编辑维修人员";
        });
      });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ResourceManagement[this.isEdit ? `updateRepair` : `addRepair`](
            Object.assign({}, this.form)
          )
            .then(({ message }) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;
              this.$emit("createSuccess");
            })
            .catch((err) => {
              this.loading = false;
            });
        }
      });
    },
    //取消
    handleCancel() {
      this.openDataScope = false;
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elform.resetFields();
    },
    handleSelectionChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.teamTypeOptions.find((item) =>
        selectedValues == item.value
      );
      this.currentForeman = selectedItems.leaderName;
      this.form.teamName = selectedItems.label;
    },
    userChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.userOptions.find((item) =>
        selectedValues == item.value
      );
      this.form.name = selectedItems?.label;
      this.form.userCode = selectedItems?.userCode;
      this.form.phone =  selectedItems?.phone  ;
      this.form.landline =  selectedItems?.landline;
    },
  },
};
</script>
<style lang="scss" scoped>
.virtualselect {
  &-list {
    max-height: 245px;
    overflow-y: auto;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical {
    width: 0;
  }
}
</style>
