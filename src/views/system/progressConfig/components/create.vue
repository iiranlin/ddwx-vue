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
        <el-col :span="24">
          <el-alert :closable="false" show-icon title="说明：启用后，设定的时间内报修人未验收，系统会默认验收通过。" type="warning"> </el-alert>
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
          console.log(this.form.resourceValue);
          this.loading = true;
          await ProgressConfig[
            this.isEdit ? `updateProgressConfig` : `addConsumable`
          ](
            Object.assign({}, this.form, {
              resourceName: `报修人${this.form.resourceValue}小时自动验收`,
            })
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
  },
};
</script>
<style scoped></style>
