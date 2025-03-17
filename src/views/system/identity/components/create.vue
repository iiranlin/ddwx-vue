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
      label-width="120px"
      v-loading="loading"
      label-suffix="："
    >
      <el-row :span="24" :gutter="20">
        <el-col :span="24">
          <el-form-item :label="'姓名'" prop="userIds">
            <csSelect
              :selectData="{
                data: userOptions,
                label: 'label',
                value: 'value',
                isRight: false,
              }"
              v-model="form.userIds"
              placeholder="请选择姓名"
              multiple
              @change="userChange"
            ></csSelect>
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
import { MessageManagement } from "@/api/maintenance";
import { userPage } from "@/api/system/user";
import CsSelect from "@/views/maintenance/maintenanceTechnician/components/csSelect.vue";
export default {
  components: {
    CsSelect,
  },
  data() {
    return {
      valueKey: "value",
      teamTypeOptions: [],
      userOptions: [],
      isEdit: false,
      //遮罩层
      loading: false,
      //标题
      title: "",
      //显示隐藏
      openDataScope: false,
      // 当前班工长
      currentForeman: "",
      //表单数据
      form: {
        userIds: "",
        sysUsers: [],
      },
      //表单校验
      rules: {
        teamId: [
          {
            required: true,
            message: "归属班组不能为空",
            trigger: "blur",
          },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        landline: [
          { required: true, message: "座机不能为空", trigger: "blur" },
        ],
        foreman: [
          { required: true, message: "是否班工长不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 获取班组枚举不分页
    getTeamType() {
      ResourceManagement.getTeamListAll().then(({ data }) => {
        this.teamTypeOptions = data.map((item) => {
          return {
            ...item,
            label: item.teamName,
            value: item.id,
          };
        });

        this.currentForeman = this.teamTypeOptions.find(
          (x) => x.id === this.form?.teamId
        )?.leaderName;
      });
    },
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
            label: item.nickName,
            value: item.id,
          };
        });
      });
    },

    //初始化
    init() {
      this.form = {};
      this.currentForeman = "";
      this.isEdit = false;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.title = "新建维修人员";
      });
      // this.getTeamType();
      this.getUserList();
    },
    // 编辑初始化
    async updateInit(datas) {
      this.isEdit = true;
      this.openDataScope = true;
      // this.getTeamType();
      this.getUserList();
      await MessageManagement.getMessageById(datas.userIdentity).then(
        ({ data }) => {
          // 构建form数据
          const formData = {
            sysUsers: data.map((x) => ({
              id: x.userId,
              username: x.userName,
            })),
          };
          this.form = Object.assign(
            {
              userIdentityName: datas.userIdentityName,
              userIdentity: datas.userIdentity,
              userIds: data.map((x) => x.userId),
            },
            formData
          );

          this.$nextTick(() => {
            this.title = "分配人员";
          });
        }
      );
    },

    //新建
    handleCreate() {
      this.$refs.elform.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await MessageManagement[
            this.isEdit ? `updateUserIdentity` : `addRepair`
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
    handleSelectionChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.teamTypeOptions.find((item) =>
        selectedValues.includes(item.value)
      );
      this.currentForeman = selectedItems.leaderName;
      this.form.teamName = selectedItems.label;
    },
    userChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.userOptions.filter((item) =>
        selectedValues.includes(item.value)
      );

      // 将选中人员的信息存储为对象数组
      const selectedPersons = selectedItems.map((item) => ({
        id: item.value,
        username: item.label,
      }));
      // 更新form中的信息
      this.form.sysUsers = selectedPersons;
    },
  },
};
</script>
<style lang="scss" scoped>
.virtualselect {
  &-list {
    max-height: 245px;
    overflow-y: auto;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical {
    width: 0;
  }
}
</style>
