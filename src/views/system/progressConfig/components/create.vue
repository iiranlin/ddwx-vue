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
    <!-- lable value 竖向排列 -->
    <el-form
      :model="form"
      :rules="rules"
      ref="elform"
      label-width="100px"
      v-loading="loading"
      label-suffix="："
      label-position="top"
    >
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'设置自动验收通过的时间'" prop="resourceValue">
            <el-input
              type="number"
              v-model="form.resourceValue"
              :max="1000"
              placeholder="请输入"
              :min="1"
            >
              <template #append>小时</template>
            </el-input>
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
import { ProgressConfig } from "@/api/maintenance";
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
        resourceValue: "",
      },
      //表单校验
      rules: {
        resourceValue: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^\+?[1-9]\d*$/,
            message: "请输入正整数",
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
      this.form = {
        suppliesName: "",
        suppliesModel: "",
        suppliesSpecs: "",
        suppliesUnit: "",
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "时间配置";
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      await ProgressConfig.getProgressConfigById(id).then(({ data }) => {
        this.form = Object.assign({}, data);
        this.$nextTick(() => {
          this.title = "时间配置";
        });
      });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ProgressConfig[
            this.isEdit ? `updateProgressConfig` : `addConsumable`
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
