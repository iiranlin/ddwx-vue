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
      label-width="100px"
      v-loading="loading"
      label-suffix="："
    >
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'类型名称'" prop="typeName">
            <el-input v-model="form.typeName" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'备注'" prop="remarks">
            <el-input v-model="form.remarks" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-button" type="text" @click="handleCancel"
        >取消</el-button
      >
      <el-button type="text" @click="handleCreate()">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { ResourceManagement } from "@/api/maintenance";
export default {
  data() {
    return {
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        typeName: "",
        remarks: "",
      },
      //表单校验
      rules: {
        typeName: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    //初始化
    init() {
      this.form = {
        typeName: "",
        remarks: "",
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建维修设备类型";
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      await ResourceManagement.getDeviceTypeById(id).then(({ data }) => {
        this.form = Object.assign({}, data);
        this.$nextTick(() => {
          this.title = "编辑维修设备类型";
        });
      });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ResourceManagement[
            this.isEdit ? `updateDeviceType` : `addDeviceType`
          ](Object.assign({}, this.form))
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
  },
};
</script>
<style scoped></style>
