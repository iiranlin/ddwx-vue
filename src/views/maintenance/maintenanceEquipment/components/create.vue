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
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
              v-model="form.equipmentName"
              maxlength="240"
              placeholder="请输入设备名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备类型" prop="equipmentTypeId">
            <el-select
              style="width: 100%"
              v-model="form.equipmentTypeId"
              filterable
              placeholder="请选择设备类型"
              @change="equipmentTypeChange"
            >
              <el-option
                v-for="item in equipmentTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="型号" prop="equipmentModel">
            <el-input
              v-model="form.equipmentModel"
              maxlength="240"
              placeholder="请输入设备型号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="规格" prop="equipmentSpecs">
            <el-input
              v-model="form.equipmentSpecs"
              maxlength="240"
              placeholder="请输入设备规格"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="技术参数" prop="equipmentPara">
            <el-input
              v-model="form.equipmentPara"
              maxlength="240"
              placeholder="请输入技术参数"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="安装日期" prop="installationDate">
            <el-date-picker
              v-model="form.installationDate"
              type="date"
              placeholder="yyyy/mm/dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生产厂家" prop="equipmentFactory">
            <el-input
              v-model="form.equipmentFactory"
              maxlength="240"
              placeholder="请输入生产厂家"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="备注说明"
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
      equipmentTypeOptions: [],
      //表单数据
      form: {
        equipmentName: "",
        equipmentType: "",
        equipmentModel: "",
        equipmentSpecs: "",
        equipmentPara: "",
        installationDate: "",
        equipmentFactory: "",
        remark: "",
      },
      //表单校验
      rules: {
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        equipmentTypeId: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 设备类型管理-不分页
    async getEquipmentType() {
      await ResourceManagement.getDeviceTypeListAll().then(({ data }) => {
        this.equipmentTypeOptions = data.map((item) => {
          return {
            label: item.typeName,
            value: item.id,
          };
        });
      });
    },
    //初始化
    init() {
      this.form = {
        equipmentName: "",
        equipmentType: "",
        equipmentModel: "",
        equipmentSpecs: "",
        equipmentPara: "",
        installationDate: "",
        equipmentFactory: "",
        remark: "",
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.getEquipmentType();
      this.$nextTick(() => {
        this.title = "新增维修设备";
      });
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      this.loading = true;
      this.getEquipmentType();
      await ResourceManagement.getDeviceById(id)
        .then(({ data }) => {
          this.form = Object.assign({}, data);
          this.$nextTick(() => {
            this.title = "修改维修设备";
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await ResourceManagement[this.isEdit ? `updateDevice` : `addDevice`](
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
    // 设备类型改变
    equipmentTypeChange(selectedValues) {
      const selectedItem = this.equipmentTypeOptions.find(
        (item) => item.value === selectedValues
      );
      this.form.equipmentType = selectedItem.label;
    },
  },
};
</script>
<style scoped></style>
