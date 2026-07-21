<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    :close-on-click-modal="false"
    width="600px"
    append-to-body
    center
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix="："
    >
      <el-form-item label="姓名" prop="userId">
        <el-select
          v-model="form.userId"
          :disabled="isEdit"
          filterable
          clearable
          style="width: 100%"
          placeholder="请选择姓名"
          @change="handleUserChange"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="员工工号">
        <el-input
          v-model="form.userName"
          disabled
          placeholder="选择姓名后自动带出"
        />
      </el-form-item>

      <el-form-item label="联系电话">
        <el-input
          v-model="form.phone"
          disabled
          placeholder="选择姓名后自动带出"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-button" type="text" @click="open = false">
        取消
      </el-button>
      <el-button type="text" :loading="loading" @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { IdentityManagement } from "@/api/maintenance";
import { userPage } from "@/api/system/user";

/**
 * 创建调度中心人员表单的默认数据，供新增和编辑初始化时复用。
 * @returns {Object} 包含身份默认值和空人员信息的新表单对象。
 */
const createDefaultForm = () => ({
  id: "",
  userId: "",
  userName: "",
  userIdentity: "DISPATCH",
  userIdentityName: "调度中心",
  phone: "",
  realName: "",
  remark: "",
});

export default {
  data() {
    return {
      open: false,
      loading: false,
      isEdit: false,
      title: "",
      form: createDefaultForm(),
      userOptions: [],
      rules: {
        userId: [
          { required: true, message: "姓名不能为空", trigger: "change" },
        ],
        remark: [
          { max: 200, message: "备注不能超过200个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /**
     * 初始化新增人员弹窗，重置表单并加载可选择的用户列表。
     * @returns {void}
     */
    init() {
      this.isEdit = false;
      this.title = "新增调度中心人员";
      this.form = createDefaultForm();
      this.open = true;
      this.getUserList();
    },
    /**
     * 初始化编辑人员弹窗，并将当前行数据回填到表单中。
     * @param {Object} row 当前待编辑的调度中心人员记录。
     * @returns {void}
     */
    updateInit(row) {
      this.isEdit = true;
      this.title = "编辑调度中心人员";
      this.form = Object.assign(createDefaultForm(), row, {
        userIdentity: row.userIdentity || "DISPATCH",
        userIdentityName: row.userIdentityName || "调度中心",
      });
      this.open = true;
      this.getUserList();
    },
    /**
     * 获取正常状态的用户列表，作为姓名下拉框的数据源。
     * @returns {void}
     */
    getUserList() {
      userPage({
        pageNum: 1,
        pageSize: 99999,
        status: 0,
      }).then(({ data }) => {
        this.userOptions = data.list || [];
      });
    },
    /**
     * 根据所选用户同步回填工号、联系电话和真实姓名。
     * @param {string|number} userId 当前选中的用户主键。
     * @returns {void}
     */
    handleUserChange(userId) {
      const user = this.userOptions.find((item) => item.id === userId);
      this.form.userName = user ? user.userCode : "";
      this.form.phone = user ? user.phone : "";
      this.form.realName = user ? user.realName : "";
    },
    /**
     * 校验表单并根据新增或编辑状态调用对应接口，成功后通知父组件刷新列表。
     * @returns {void}
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        this.loading = true;
        const request = this.isEdit
          ? IdentityManagement.update(this.form)
          : IdentityManagement.create(this.form);

        request
          .then(({ message }) => {
            this.$modal.msgSuccess(message || "操作成功");
            this.open = false;
            this.$emit("success");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    /**
     * 弹窗关闭后重置表单校验状态，避免下次打开时保留历史校验信息。
     * @returns {void}
     */
    handleClose() {
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.resetFields();
      });
    },
  },
};
</script>
