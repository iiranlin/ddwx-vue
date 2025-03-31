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
          <el-form-item :label="'取消原因'" prop="operateDesc">
            <el-select
              style="width: 100%"
              v-model="form.operateDesc"
              filterable
              placeholder="请选择取消原因"
            >
              <el-option
                v-for="item in cancelReason.map((x) => ({
                  label: x,
                  value: x,
                }))"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="form.remark"
              placeholder="请输入备注"
            ></el-input>
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
import { ResourceManagement, WorkOrderManagement } from "@/api/maintenance";
import { cancelReason } from "@/utils/enum";
export default {
  // 待分配班组
  data() {
    return {
      cancelReason,
      teamTypeOptions: [],
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        id: "",
        operateDesc: "",
        remark: "",
      },
      //表单校验
      rules: {
        operateDesc: [
          {
            required: true,
            message: "归属班组不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    //初始化
    init(data) {
      this.form = {
        id: data.id,
        operateDesc: data.operateDesc || "",
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "取消工单";
      });
    },
    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await WorkOrderManagement.executeWorkOrder(
            Object.assign({}, this.form, { status: 7 })
          )
            .then(({ message }) => {
              this.loading = false;
              this.$modal.msgSuccess(message);
              this.openDataScope = false;

              this.$emit("close");
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
        selectedValues.includes(item.value)
      );
      this.form.teamName = selectedItems.label;
    },
  },
};
</script>
<style scoped></style>
