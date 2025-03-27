<template>
  <div class="acceptance-submit">
    <div class="top">
      <h2 class="title">提交验收</h2>

      <!-- 完工图片上传区域 -->
      <div class="section">
        <div class="section-title">
          <span style="color: #f34d39">*</span>完工图片
        </div>
        <ImageUpload
          v-model="form.operateFileUrl"
          @input="handleFileChange"
          :limit="3"
          :fileSize="10"
          :fileType="['jpg', 'jpeg', 'png']"
        />
      </div>

      <!-- 维修说明 -->
      <div class="section">
        <div class="section-title">维修说明</div>
        <el-input
          style="width: 50%"
          v-model="form.operateDesc"
          type="textarea"
          :rows="4"
          placeholder="请输入维修说明"
        ></el-input>
      </div>

      <!-- 维修消耗转材说明 -->
      <div class="section">
        <div class="section-title">维修消耗转材说明</div>
        <div class="material-table">
          <div class="table-header">
            <div class="header-cell">品名</div>
            <div class="header-cell">规格</div>
            <div class="header-cell">单位</div>
            <div class="header-cell">数量</div>
            <div class="header-cell">操作</div>
          </div>

          <!-- 表格内容 -->
          <template v-if="materialList.length > 0">
            <div
              v-for="(item, index) in materialList"
              :key="index"
              class="table-row"
            >
              <div class="table-cell">
                <csSelect
                  style="width: 100%"
                  :selectData="{
                    data: materialOptions,
                    label: 'suppliesName',
                    value: 'suppliesName',
                    isRight: false,
                  }"
                  v-model="item.suppliesName"
                  placeholder="请选择或输入品名"
                  filterable
                  allow-create
                  default-first-option
                  @change="(val) => handleMaterialChange(val, index)"
                ></csSelect>
              </div>
              <div class="table-cell">
                <el-input
                  v-model="item.suppliesSpecs"
                  placeholder="规格"
                ></el-input>
              </div>
              <div class="table-cell">
                <el-input
                  v-model="item.suppliesUnit"
                  placeholder="单位"
                ></el-input>
              </div>
              <div class="table-cell">
                <el-input-number
                  v-model="item.amount"
                  :min="0"
                  :precision="2"
                  placeholder="数量"
                ></el-input-number>
              </div>
              <div class="table-cell operation">
                <div
                  v-if="index === materialList.length - 1"
                  @click="addMaterial"
                  style="
                    color: #3481f9;
                    font-weight: bold;
                    margin-right: 4px;
                    cursor: pointer;
                  "
                >
                  增加 |
                </div>
                <div
                  style="color: #f34d39; font-weight: bold; cursor: pointer"
                  @click="removeMaterial(index)"
                >
                  删除
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <el-empty>
              <template slot="description">
                <el-button type="text" @click="addMaterial">添加耗材</el-button>
                <div style="color: #606266">当前暂无消耗耗材</div>
              </template>
            </el-empty>
          </template>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-buttons">
      <div style="background-color: #e2f0ff; color: #0c7bfe" @click="goBack">
        返回
      </div>
      <div
        style="background-color: #0c7bfe; color: #ffffff"
        @click="submitForm"
      >
        确认
      </div>
    </div>
  </div>
</template>

<script>
import CsSelect from "@/views/maintenance/maintenanceTechnician/components/csSelect.vue";
import { ResourceManagement, WorkOrderManagement } from "@/api/maintenance";
export default {
  // 提交验收
  name: "AcceptanceSubmit",
  components: {
    CsSelect,
  },
  data() {
    return {
      form: {
        operateFileUrl: "",
        operateDesc: "",
        suppliesList: [],
      },
      imageUrl: "",
      imageFile: null,
      repairDescription: "",
      materialList: [
        { suppliesName: "", suppliesSpecs: "", suppliesUnit: "", amount: 0 },
      ],
      materialOptions: [],
      isCustomInput: false,
    };
  },
  mounted() {
    ResourceManagement.getConsumableListAll().then((res) => {
      this.materialOptions = Object.freeze(res.data);
    });
  },
  methods: {
    // 点击上传区域触发文件选择
    handleUploadClick() {
      this.$refs.fileInput.click();
    },

    // 文件选择变化处理
    handleFileChange(fielUrl) {
      this.form.operateFileUrl = fielUrl;
    },

    // 添加材料行
    addMaterial() {
      this.materialList.push({
        suppliesName: "",
        suppliesSpecs: "",
        suppliesUnit: "",
        amount: 0,
      });
    },

    // 处理品名选择或输入变化
    handleMaterialChange(value, index) {
      const selectedMaterial = this.materialOptions.find(
        (item) => item.suppliesName === value
      );
      if (selectedMaterial) {
        this.materialList[index].suppliesSpecs = selectedMaterial.suppliesSpecs;
        this.materialList[index].suppliesUnit = selectedMaterial.suppliesUnit;
      }
    },

    // 删除材料行
    removeMaterial(index) {
      this.materialList.splice(index, 1);
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 文件上传
    handleFileChange(fielUrl) {
      this.imageUrl = fielUrl;
    },

    // 提交表单
    submitForm() {
      // 表单验证
      if (!this.form.operateFileUrl) {
        this.$message.error("请上传完工图片");
        return;
      }

      // if (!this.form.operateDesc || !this.form.operateDesc.trim()) {
      //   this.$message.error("请填写维修说明");
      //   return;
      // }

      // 验证材料列表
      if (this.materialList.length > 0) {
        const invalidMaterial = this.materialList.some((item) => {
          return (
            !item.suppliesName.trim() ||
            !item.suppliesSpecs.trim() ||
            !item.suppliesUnit.trim() ||
            item.amount === null ||
            item.amount === undefined ||
            item.amount === 0
          );
        });

        if (invalidMaterial) {
          this.$message.error("请完善材料信息，所有字段都为必填项");
          return;
        }
      }
      WorkOrderManagement.executeWorkOrder(
        Object.assign({}, this.form, {
          status: 4,
          id: this.$route.query.id,
          suppliesList: this.materialList,
        })
      ).then(({ message }) => {
        this.$modal.msgSuccess(message);

        this.$tab.closePage();
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.acceptance-submit {
  height: calc(100% - 60px);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .top {
    overflow-y: scroll;
    flex: 1;
  }
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap:4px;
}

.material-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table-header {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.header-cell {
  flex: 1;
  padding: 12px 10px;
  text-align: center;
  font-weight: bold;
  color: #606266;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.table-cell {
  flex: 1;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.operation {
  justify-content: center;
}

.add-row {
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.footer-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
  div {
    padding: 10px 30px;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
