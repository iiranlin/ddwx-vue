<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <el-table
          v-loading="loading"
          :data="dataList"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="序号"
          />
          <el-table-column
            label="身份编号"
            align="center"
            prop="userIdentity"
          />
          <el-table-column
            label="身份名称"
            align="center"
            prop="userIdentityName"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleAssign(scope.row)"
                >分配人员</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--新建-->
    <create ref="create" @createSuccess="createSuccess"></create>
  </div>
</template>

<script>
import create from "./components/create";
import { ProgressConfig } from "@/api/maintenance";

export default {
  name: "identity",
  components: { create },
  data() {
    return {
      // 遮罩层
      loading: false,

      // 表格数据
      dataList: [
        {
          userIdentity: "DISPATCH",
          userIdentityName: "调度中心",
        },
        {
          userIdentity: "REPAIR",
          userIdentityName: "维修人员",
        },
        {
          userIdentity: "USER",
          userIdentityName: "用户",
        },
      ],
    };
  },
  // created() {
  //   this.getList();
  // },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 分配人员按钮
    handleAssign(row) {
      // TODO: 实现分配人员功能
      this.$refs.create.updateInit(row);
    },
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    // 新建成功回调
    createSuccess() {
      // this.getList();
    },
  },
};
</script>

<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
