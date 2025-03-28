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
            <el-select
              style="width: 100%"
              v-model="form.teamType"
              placeholder="请选择班组类型"
            >
              <el-option
                v-for="item in teamType"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'班组名称'" prop="teamName">
            <el-input
              v-model="form.teamName"
              maxlength="240"
              placeholder="请输入班组名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'班组工长'" prop="leader.userId">
            <csSelect
              :selectData="{
                data: userOptions,
                label: 'label',
                value: 'value',
                isRight: false,
              }"
              v-model="form.leader.userId"
              placeholder="请选择班组工长"
              clearable
              @change="userChange"
            ></csSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="'维修类型'" prop="equipmentTypeIds">
            <el-select
              style="width: 100%"
              v-model="form.equipmentTypeIds"
              multiple
              filterable
              placeholder="请选择维修类型"
              @change="handleSelectionChange"
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
import { teamType } from "@/utils/enum";
import csSelect from "../../maintenanceTechnician/components/csSelect.vue";
import { userPage } from "@/api/system/user";

export default {
  components: {
    csSelect,
  },
  data() {
    return {
      teamType,
      userOptions: [],
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
        equipmentType: "",
        equipmentTypeIds: [],
        leader: {
          userId: "",
          name: "",
          phone: "",
          landline: "",
          jobNum: "",
        },
      },
      equipmentTypeOptions: [],
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
        "leader.userId": [
          {
            required: true,
            message: "班组工长不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取所有用户人员信息
    getUserList() {
      userPage({
        pageNum: 1,
        pageSize: 99999,
        total: 0,
        status: 0,
      }).then(({ data: { list } }) => {
        this.userOptions = list.map((item) => {
          return {
            ...item,
            label: item.realName,
            value: item.id,
          };
        });
      });
    },
    userChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.userOptions.find((item) =>
        selectedValues.includes(item.value)
      );

      this.form.leader.name = selectedItems.label;
      this.form.leader.phone = selectedItems.phone;
      this.form.leader.landline = selectedItems.landline;
      this.form.leader.jobNum = selectedItems.userCode;
    },
    // 获取设备枚举不分页
    getEquipmentType() {
      ResourceManagement.getDeviceTypeListAll().then(({ data }) => {
        console.log(data, "data");
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
        teamType: "",
        teamName: "",
        equipmentType: "",
        equipmentTypeIds: [],
        leader: {
          userId: "",
          name: "",
          phone: "",
          landline: "",
          jobNum: "",
        },
      };
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建班组";
      });
      this.getEquipmentType();
      this.getUserList();
    },
    // 编辑初始化
    async updateInit(id) {
      this.isEdit = true;
      this.openDataScope = true;
      this.getEquipmentType();
      this.getUserList();
      await ResourceManagement.getTeamById(id).then(({ data }) => {
        this.form = Object.assign(
          {},
          data,
          data.leader
            ? { leader: data.leader }
            : {
                leader: {
                  userId: "",
                  name: "",
                  phone: "",
                  landline: "",
                  jobNum: "",
                },
              }
        );
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
      this.form.leader = {
        userId: null,
        name: "",
        phone: "",
        landline: "",
        jobNum: "",
      };
    },
    handleSelectionChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.equipmentTypeOptions.filter((item) =>
        selectedValues.includes(item.value)
      );
      this.form.equipmentType = selectedItems
        .map((item) => item.label)
        .join(",");

      console.log("选中的数据详情:", selectedItems);
    },
  },
};
</script>
<style scoped></style>
