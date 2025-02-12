<template>
  <el-dialog :close-on-click-modal="false"
    :title="title"
    :visible.sync="openDataScope"
    width="600px"
    append-to-body
    center
  >
    <el-row :span="24" :gutter="20">
      <el-form
        :model="formData"
        ref="form"
        label-width="100px"
        :rules="formRules"
      >
        <el-form-item label="部门名称">
          <el-tag
            v-for="item in deptList"
            :key="item.id"
            @close="handleClose(item)"
            closable
            >{{ item.deptName }}
          </el-tag>
        </el-form-item>
        <el-form-item
          label="选择仓库"
          label-width="100px"
          prop="storehouseCode"
        >
          <el-select
            :placeholder="'请选择仓库'"
            clearable
            size="mini"
            v-model="formData.storehouseCode"
          >
            <el-option
              v-for="(value, key) in warehouseList"
              :key="key"
              :label="value.name"
              :value="value.code"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveWareHouse">确 定</el-button>
      <el-button @click="openDataScope = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getListByParent } from "@/api/system/dict/data";
import { updateStorehouse } from "@/api/system/dept";

export default {
  data() {
    return {
      loading: false,
      title: "选择仓库",
      openDataScope: false,
      formData: {
        storehouseCode: "",
      },
      deptList: [],
      warehouseList: [],
      formRules: {
        storehouseCode: [
          { required: true, trigger: "change", message: "请选择仓库" },
        ],
      },
    };
  },
  methods: {
    init(data) {
      this.deptList = data;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.formData.storehouseCode = data[0].storehouseCode
        this.getWareHouseData();
      });
    },
    //获取仓库信息
    getWareHouseData() {
      getListByParent("60").then(({ data }) => {
        this.warehouseList = data;
      });
    },
    //删除部门
    handleClose(data) {
      if (this.deptList.length === 1) {
        this.$modal.msgWarning("当前仅有一个部门，无法删除");
        return;
      }
      this.deptList = this.deptList.filter((item) => {
        return item.id !== data.id;
      });
    },
    //保存仓库信息
    saveWareHouse() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.deptList.forEach((item) => {
            item.storehouseCode = this.formData.storehouseCode;
          });
          updateStorehouse(this.deptList).then(({ message }) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit("warehouseSuccess");
          });
        }
      });
    },
  },
};
</script>

 <style scoped>
.el-tag {
  margin-right: 10px;
}
</style>