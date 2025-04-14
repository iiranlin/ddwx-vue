<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="openDataScope"
    width="800px"
    append-to-body
    center
    @close="handleDialogClose()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="elform"
      label-width="120px"
      v-loading="loading"
      label-suffix="："
    >
      <el-row :gutter="20">
        <!-- 第一行 -->
        <el-col :span="12">
          <el-form-item label="故障场所" prop="faultSiteId">
            <el-select
              style="width: 100%"
              filterable
              v-model="form.faultSiteId"
              placeholder="请选择故障场所"
              @change="handlePlaceChange"
            >
              <el-option
                v-for="item in placeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="具体位置" prop="faultAddr">
            <el-input
              v-model="form.faultAddr"
              placeholder="请输入故障场所的具体位置"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- 第二行 -->
        <el-col :span="12">
          <el-form-item label="故障设备" prop="faultEquipmentId">
            <el-select
              filterable
              v-model="form.faultEquipmentId"
              placeholder="请选择故障设备"
              @change="handleEquipmentChange"
              allow-create
              style="width: 100%"
            >
              <el-option
                v-for="item in equipmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select filterable v-model="form.urgency" style="width: 100%">
              <el-option
                v-for="item in priorityLevel"
                :key="item.value"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 第三行 -->
        <el-col :span="12">
          <el-form-item label="报修人" prop="contactName">
            {{ form.contactName }}
            <!-- <el-input
              v-model="form.contactName"
              placeholder="请输入报修人姓名"
            ></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- 第四行 -->
        <el-col :span="12">
          <el-form-item label="座机" prop="landline">
            <el-input
              v-model="form.landline"
              placeholder="请输入座机号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="故障描述" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请详细描述故障问题"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- 第五行 -->
        <el-col :span="24">
          <el-form-item label="故障图片" prop="faultFileUrl">
            <!-- <el-upload
              action="your-upload-url"
              list-type="picture-card"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload> -->
            <ImageUpload
              v-model="form.faultFileUrl"
              @input="uploadChange"
              :limit="3"
              :fileSize="10"
              :fileType="['png', 'jpg', 'jpeg']"
            />
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
import {
  WorkOrderManagement,
  FacilityManagement,
  ResourceManagement,
} from "@/api/maintenance";
import { priorityLevel } from "@/utils/enum";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      priorityLevel,
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        equipmentType: "",
        faultSiteId: "",
        faultSiteName: "",
        faultEquipmentId: "",
        faultEquipmentName: "",
        faultAddr: "",
        remark: "",
        contactName: "",
        contactPhone: "",
        landline: "",
        urgency: "",
      },
      placeOptions: [],
      equipmentOptions: [],
      //表单校验
      rules: {
        faultSiteId: [
          {
            required: true,
            message: "故障场所不能为空",
            trigger: "blur",
          },
        ],
        faultEquipmentId: [
          { required: true, message: "故障设备不能为空", trigger: "blur" },
        ],
        urgency: [
          { required: true, message: "紧急程度不能为空", trigger: "blur" },
        ],
        contactName: [
          { required: true, message: "报修人不能为空", trigger: "blur" },
        ],
        faultAddr: [
          { required: true, message: "具体位置不能为空", trigger: "blur" },
        ],
        contactPhone: [
          { required: false, message: "联系电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码格式",
            trigger: "blur",
          },
        ],
        landline: [
          { required: true, message: "座机不能为空", trigger: "blur" },
          {
            pattern: /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/,
            message: "请输入正确的座机号码格式",
            trigger: "blur",
          },
        ],
        remark: [
          { required: true, message: "故障描述不能为空", trigger: "blur" },
        ],
        faultFileUrl: [
          { required: true, message: "故障图片不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user, // 获取当前用户信息
    }),
  },
  methods: {
    // 获取场所枚举不分页
    getPlaceList() {
      FacilityManagement.getSysRepairPlaceList().then(({ data }) => {
        console.log(data, "data");
        this.placeOptions = data.map((item) => {
          return {
            label: item.houseName,
            value: item.id,
          };
        });
      });
    },
    // 获取设备枚举不分页
    getEquipmentList() {
      ResourceManagement.getDeviceListAll().then(({ data }) => {
        console.log(data, "data");
        this.equipmentOptions = data.map((item) => {
          return {
            label: item.equipmentName,
            value: item.id,
          };
        });
      });
    },
    //初始化
    init() {
      this.form = {
        equipmentType: "",
        faultSiteId: "",
        faultSiteName: "",
        faultEquipmentId: "",
        faultEquipmentName: "",
        faultAddr: "",
        remark: "",
        contactName: "",
        contactPhone: "",
        landline: "",
        urgency: priorityLevel[0],
      };
      if (this.currentUser) {
        this.form.contactName = this.currentUser.realName || "";
        this.form.contactPhone = this.currentUser.phone || "";
      }
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新增维修工单";
      });
      this.getInitOptions();
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      this.getInitOptions();
      await WorkOrderManagement.getWorkOrderById(id).then(({ data }) => {
        this.form = Object.assign({}, data, {
          faultEquipmentName: data.faultEquipmentName,
          faultSiteName: data.faultSiteName,
        });
        this.$nextTick(() => {
          this.title = "修改维修工单";
        });
      });
    },
    getInitOptions() {
      this.getPlaceList();
      this.getEquipmentList();
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          Reflect.deleteProperty(this.form, 'operateLogs')
          this.loading = true;
          await WorkOrderManagement[
            this.isEdit ? `updateWorkOrder` : `addWorkOrder`
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
    handlePlaceChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.placeOptions.find((item) =>
        selectedValues.includes(item.value)
      );
      console.log("selectedItems", selectedItems);
      this.form.faultSiteName = selectedItems.label;
    },
    handleEquipmentChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.equipmentOptions.find((item) =>
        selectedValues.includes(item.value)
      );
      this.form.faultEquipmentName = selectedItems?.label || selectedValues;
    },
    uploadChange(e) {
      console.log(e, "e");
      this.form.faultFileUrl = e;
    },
    handlePreview(file) {
      console.log("Preview:", file);
    },
    handleRemove(file, fileList) {
      console.log("Remove:", file, fileList);
    },
  },
};
</script>
<style scoped></style>
