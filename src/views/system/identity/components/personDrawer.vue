<template>
  <el-drawer
    class="menuDrawer"
    size="500px"
    :show-close="false"
    :visible.sync="drawer"
    :before-close="handleClose"
  >
    <div class="menuDrawer-box" v-loading="loading">
      <div class="menuDrawer-box-p">
        <p>人员分配</p>
        <p>
          身份名称：{{ selectRadioData && selectRadioData.userIdentityName }}
        </p>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <div
          style="
            width: 440px;
            height: 1px;
            background: #f5f5f5;
            margin: 16px auto;
          "
        ></div>
      </div>
      <div class="menuDrawer-div">
        <div class="menuDrawer-tree">
          <vue-easy-tree
            ref="veTree"
            node-key="id"
            height="calc(100vh - 300px)"
            :data="treeData"
            :filter-node-method="filterNode"
            showCheckbox
            default-expand-all
            :default-checked-keys="checkedKeys"
            @check-change="handleCheckChange"
            :props="{ label: 'label', children: 'children' }"
          ></vue-easy-tree>
        </div>
      </div>
    </div>
    <div class="menuDrawer-footer">
      <div class="menuDrawer-footer-button">
        <el-button @click="drawer = false">关闭</el-button>
        <el-button type="primary" @click="onSave()">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { userRoleList, userBindRole } from "@/api/system/user";
import { userPage, userBindRoleBatch } from "@/api/system/user";
import { MessageManagement } from "@/api/maintenance";
import VueEasyTree from "@wchbrad/vue-easy-tree";
// 样式文件，可以根据需要自定义样式或主题
import "@wchbrad/vue-easy-tree/src/assets/index.scss";

export default {
  components: {
    VueEasyTree,
  },
  data() {
    return {
      loading: false,
      checkbox: false,
      drawer: false,
      selectRadioData: null,
      totalCount: 0,
      filterText: "",
      data: [],
      //表单数据
      form: {
        userIds: "",
        sysUsers: [],
      },
      userOptions: [],
      treeData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "roleName",
        disabled: (data, node) => {
          //禁用操作
          // if(data.isBind === 1){
          //     return true
          // }else{
          //     return false
          // }
        },
      },
      radioData: {},
      type: "1",
      arrTree: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.veTree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    init(row) {
      console.log(row, "row");
      this.selectRadioData = row;
      // this.checkedKeys = row.userIds || [];
      this.filterText = "";
      this.drawer = true;
      this.getCheckUser(row);
      //   this.userRoleList(row.id);
      this.getUserList();
    },
    handleCheckChange(data, checked, indeterminate) {

      const checkedKeys = (this.$refs.veTree.getCheckedKeys() || []).map(
        (key) => String(key)
      );
      // 获取选中的数据详情
      const selectedItems = this.userOptions.filter((item) =>
        checkedKeys.some((key) => key === String(item.value))
      );
      // 将选中人员的信息存储为对象数组
      const selectedPersons = selectedItems.map((item) => ({
        id: item.value,
        username: item.label,
      }));
      // 更新form中的信息
      this.form.sysUsers = selectedPersons;
      console.log(this.form, "form.sysUsers");
    },
    // 获取当前选中人员信息
    async getCheckUser(datas) {
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
          this.checkedKeys = data.map((x) => x.userId);
        }
      );
    },
    // 获取所有用户人员信息
    getUserList() {
      this.loading = true;
      userPage({
        pageNum: 1,
        pageSize: 99999,
        total: 0,
        status: 0,
      })
        .then(({ data: { list } }) => {
          const child = list.map((item) => {
            return {
              ...item,
              label: item.realName,
              value: item.id,
              children: [],
            };
          });

          this.treeData = [
            {
              id: "all",
              label: "全部",
              children: child,
            },
          ];

          this.userOptions = list.map((item) => {
            return {
              ...item,
              label: item.realName,
              value: item.id,
            };
          });
        })
        .finally(() => (this.loading = false));
    },

    async onSave() {
      this.loading = true;
      const checkedKeys = this.$refs.veTree.getCheckedKeys() || [];
      await MessageManagement.updateUserIdentity(
        Object.assign({}, this.form, { userIds: checkedKeys })
      )
        .then(() => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          this.drawer = false;
          this.$emit("userBindRoleSuccess");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleClose(done) {
      done();
    },
  },
};
</script>
<style lang="scss" scoped>
.menuDrawer {
  .el-drawer__body {
    height: 100%;
    overflow: initial;
  }
  .menuDrawer-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 10px 10px 70px 10px;
  }
  .menuDrawer-div {
    flex: 1;
    overflow-y: auto;
    .el-radio-group {
      width: 230px;
      border-right: 1px solid #f5f5f5;
      .el-radio-button {
        width: 200px;
        height: 40px;
        line-height: 40px;
        margin-left: 15px;
        .el-radio-button__inner {
          width: 100%;
          height: 100%;
          border: 0px;
          padding: 0px;
          padding-left: 5px;
          font-family: Microsoft YaHei;
          font-size: 14px;
          line-height: 40px;
          text-align: inherit;
        }
        .menuDrawer-span {
          position: absolute;
          right: 5px;
          font-size: 12px;
        }
        .menuDrawer-span-color {
          color: #c4c4c4;
        }
      }
      .is-active {
        .menuDrawer-span-color {
          color: #ffffff;
        }
      }
    }
    .menuDrawer-tree {
      padding-left: 20px;
      width: 100%;
      margin: 0;
    }
  }
  ::v-deep .el-drawer__header {
    margin-bottom: 0px;
    padding: 0px;
    font-family: Microsoft YaHei;
    color: #292b32;
    font-size: 18px;
  }
  p:nth-child(1) {
    width: 100%;
    height: 19px;
    margin-left: 20px;
    font-family: Microsoft YaHei;
    color: #292b32;
    font-size: 18px;
  }
  p:nth-child(2) {
    margin-left: 20px;
    height: 25px;
    font-family: Microsoft YaHei;
    color: #292b32;
    font-size: 14px;
  }
  .menuDrawer-footer {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 20px;
    .menuDrawer-footer-button {
      .el-button {
        height: 40px;
        width: 40%;
        margin-left: 0px;
        &:first-child {
          margin-right: 1%;
        }
      }
    }
  }
}
</style>
