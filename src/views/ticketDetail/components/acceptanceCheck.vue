<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="openDataScope"
    width="700px"
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
          <el-form-item label="工单编号">
            <span>{{ form.orderNum }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="验收结果" prop="operateType">
            <el-radio-group v-model="form.operateType">
              <el-radio label="PASS">通过</el-radio>
              <el-radio label="NOT_PASS">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="验收图片" prop="operateFileUrl">
            <image-upload
              v-model="form.operateFileUrl"
              :limit="3"
              :file-type="['jpg', 'png', 'PNG']"
              :file-size="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注说明" prop="operateDesc">
            <el-input
              type="textarea"
              v-model="form.operateDesc"
              :rows="4"
              placeholder="请输入"
              maxlength="500"
              show-word-limit
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
import ImageUpload from "@/components/ImageUpload";

export default {
  components: {
    ImageUpload,
  },
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
        id: "",
        orderNum: "",
        operateType: "PASS",
        operateFileUrl: [],
        operateDesc: "",
      },
      //表单校验
      rules: {
        operateType: [
          { required: true, message: "请选择验收结果", trigger: "change" },
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
        orderNum: data.orderNum || "",
        operateType: "PASS",
        operateFileUrl: "",
        operateDesc: "",
        status: data.status,
      };
     
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = data.title || '维修工单验收';
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      await ResourceManagement.getAcceptanceById(id).then(({ data }) => {
        this.form = {
          orderNum: data.orderNum,
          operateType: data.operateType,
          operateFileUrl: data.operateFileUrl ? [data.operateFileUrl] : [],
          operateDesc: data.operateDesc || "",
        };
        this.$nextTick(() => {
          this.title = "编辑验收信息";
        });
      });
    },

    //提交
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;

          WorkOrderManagement.executeWorkOrder(Object.assign({}, this.form))
            .then(({ message }) => {
              this.$modal.msgSuccess(message);

              this.openDataScope = false;

              this.$emit("close");
            })
            .finally(() => (this.loading = false));
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
