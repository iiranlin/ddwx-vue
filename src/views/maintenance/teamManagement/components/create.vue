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
          <el-form-item :label="'班组类型'" prop="teamType">
            <el-input v-model="form.teamType" maxlength="240"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'班组名称'" prop="teamName">
            <el-input v-model="form.teamName" maxlength="240"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'维修类型'" prop="deptName">
            <el-input v-model="form.deptName" maxlength="240"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleCreate()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
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
        teamType: "",
        teamName: "",
      },
      //表单校验
      rules: {
        teamType: [
          { required: true, message: "班组类型不能为空", trigger: "change" },
        ],
        teamName: [
          {
            required: true,
            message: "班组名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    //初始化
    init() {
      this.isEdit = false
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建班组";
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      await ResourceManagement.getTeamById(id).then(({ data }) => {
        this.form = Object.assign({}, data);
        this.$nextTick(() => {
          this.title = "编辑班组";
        });
      });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ResourceManagement[this.isEdit ? `updateTeam` : `addTeam`](
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
      thit.feedBackTypeOptions = [];
    },
  },
};
</script>
<style scoped></style>
