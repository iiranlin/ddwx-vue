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
            <el-form-item :label="'耗材名称'" prop="suppliesName">
              <el-input v-model="form.suppliesName" maxlength="240" placeholder="请输入耗材名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'型号'" prop="suppliesModel">
              <el-input v-model="form.suppliesModel" maxlength="240" placeholder="请输入耗材型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'规格'" prop="suppliesSpecs">
              <el-input v-model="form.suppliesSpecs" maxlength="240" placeholder="请输入耗材规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="'单位'" prop="suppliesUnit">
              <el-input v-model="form.suppliesUnit" maxlength="240" placeholder="米/个/根/等其它"></el-input>
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
          suppliesName: "",
          suppliesModel: "",
          suppliesSpecs: "",
          suppliesUnit: "",
        },
        //表单校验
        rules: {
          suppliesName: [
            { required: true, message: "耗材名称不能为空", trigger: "blur" },
          ],
          // Add other rules if needed
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
        this.isEdit = false
        this.openDataScope = true;
        this.$nextTick(() => {
          this.title = "新建耗材";
        });
      },
      // 编辑初始化
      async updateInit(id) {
        this.isEdit = true;
        this.openDataScope = true;
        await ResourceManagement.getConsumableById(id).then(({ data }) => {
          this.form = Object.assign({}, data);
          this.$nextTick(() => {
            this.title = "编辑耗材";
          });
        });
      },
  
      //新建
      handleCreate() {
        this.$refs.elform.validate(async (valid) => {
          if (valid) {
            this.loading = true;
            await ResourceManagement[this.isEdit ? `updateConsumable` : `addConsumable`](
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
    },
  };
  </script>
  <style scoped></style>
  