<template>
  <div class="app-container">
    <el-row :gutter="20" class="container_h">
      <!--部门数据-->
      <el-col :span="4" :xs="24" class="container_flex_overflow">
        <div class="head-container">
          <el-tree
            class="drawer-tree"
            :indent="0"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            :highlight-current="true"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" class="container_flex">
        <el-form :model="formData" ref="queryForm" v-show="showSearch" :inline="true">
          <el-form-item label="用户账号:" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户账号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- <el-row :gutter="10" class="mb8" style="background-color: #ddd;line-height: 28px;">
          <el-col :span="1.5">
            <el-button class="custom_button" plain size="mini" @click="handleCreate"><svg-icon icon-class="xinjian" /> 新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button class="custom_button" plain size="mini" :disabled="single" @click="handleUpdate('')" ><svg-icon icon-class="xiugai" />修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button class="custom_button" plain size="mini" :disabled="multiple" @click="handleDelete" ><svg-icon icon-class="shanchu" />删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <span style="color: #ccc;line-height: 26px;">|</span>
          </el-col>
          <el-col :span="1.5">
            <el-button class="custom_button" plain size="mini" @click="getList" ><svg-icon icon-class="shuaxin" />刷新</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button class="custom_button" plain size="mini"  @click="closeSelectedTag"><svg-icon icon-class="guanbi" />关闭</el-button>
          </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row> -->

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleCreate"
              v-hasPermi="['system:role:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate('')"
              v-hasPermi="['system:role:edit']"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:role:remove']"
            >删除
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table class="container_table" height="100%" v-loading="loading" :data="userList"
                  @selection-change="handleSelectionChange" @sort-change="sortableColumnChange" stripe :row-class-name="rowOnlineTableColumIndex">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column  width="50" align="center" label="序号" prop="index"/>
          <el-table-column label="登录账号" v-if="columns[0].visible" prop="username" sortable="custom" align="center"
                           :show-overflow-tooltip="true" width="150"/>
          <el-table-column label="用户编号" v-if="columns[0].visible" prop="userCode" sortable="custom" align="center"
                           :show-overflow-tooltip="true" width="150"/>
          <el-table-column label="用户昵称" v-if="columns[0].visible" prop="nickName" sortable="custom" align="center"
                           :show-overflow-tooltip="true" width="150"/>
          <el-table-column label="所属部门" v-if="columns[0].visible" prop="deptName" sortable="custom" align="center"
                           :show-overflow-tooltip="true" width="150"/>
          <el-table-column label="角色" v-if="columns[0].visible" prop="roleName" sortable="custom" align="center"
                           :show-overflow-tooltip="true" width="150"/>
          <el-table-column label="状态" v-if="columns[1].visible" align="center" sortable="custom" width="100">
            <template slot-scope="{row}">
              {{ row.status == 0 ? '正常' : '停用' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" v-if="columns[2].visible" sortable="custom" align="center" prop="createTime"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" v-if="columns[3].visible" sortable="custom" align="center" prop="createTime"
                           width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              >删除
              </el-button>
              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="bindRole" icon="el-icon-user">分配角色</el-dropdown-item>
                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key">重置密码</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <operate ref="operate" @operateSuccess="operateSuccess"/>
    <roleDrawer ref="roleDrawer" @userBindRoleSuccess="operateSuccess"/>
  </div>
</template>

<script>
import {userPage, userDeleteBatch, userRoleList, resetPwd} from '@/api/system/user';
import {deptTree} from '@/api/system/dept';
import operate from "./components/operate";
import roleDrawer from "./components/roleDrawer";
import indexMixin from '@/views/mixins';

export default {
  name: "user",
  mixins: [indexMixin],
  components: {operate, roleDrawer},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // selectionData:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 日期范围
      dateRange: [],
      defaultProps: {
        children: "children",
        label: "deptName"
      },
      // 列信息
      columns: [
        {key: 0, label: `用户名称`, visible: true},
        {key: 1, label: `状态`, visible: true},
        {key: 2, label: `创建时间`, visible: true},
        {key: 3, label: `更新时间`, visible: true},
      ],
      // 数据范围选项
      sys_normal_disable: [
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "停用"
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 30,
      },
      // 表单参数
      formData: {
        username: "",
        status: "",
        deptId: "",
      },
    };
  },
  created() {
    this.deptTree();
    this.getList();
  },
  methods: {
    deptTree() {
      deptTree().then(({data}) => {
        this.deptOptions = data;
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.formData.deptId = data.id;
      this.handleQuery();
    },
    closeSelectedTag() {
    },
    handleQuery() {
      this.getList();
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "bindRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.formData.deptId = '';
      this.handleQuery();
    },
    emitAblFilter() {
      this.dateRange = [];
      this.getList();
    },
    operateSuccess() {
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      // this.selectionData = selection
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;

      let dateRange = this.dateRange;
      if(dateRange && dateRange.length !== 0){
        this.formData.createTimeStart = dateRange[0];
        this.formData.createTimeEnd = dateRange[1];
      }else{
        this.formData.createTimeStart = null;
        this.formData.createTimeEnd = null;
      }

      userPage(Object.assign({}, this.listQuery, this.formData)).then(({data}) => {
        this.userList = data.list;
        this.total = data.total;
        this.loading = false;
      })
    },
    //序号
      rowOnlineTableColumIndex({row,rowIndex}){
      row.index=rowIndex+1
    },
    handleCreate() {
      // this.$refs.operate.init('create');
      this.$router.push({name:'userCreate'});
    },
    handleUpdate(row) {
      let id = '';
      // let selectionData = []
      if (row) {
        id = row.id;
      } else {
        id = this.ids[0];
      }
      // this.$refs.operate.init('update', id);
      this.$router.push({name:'userCreate',query:{id}});
    },
    handleDelete(row) {
      let ids = row.id || this.ids;
      if (!(ids instanceof Array)) {
        ids = [ids];
      }
      this.$modal.confirm('是否确认删除用户?').then(function () {
        return userDeleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleAuthRole(row) {
      this.$refs.roleDrawer.init(row, 'user');
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      let confirmMessage = '确定重置[' + row.nickName + ']的密码?'
      this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd({id: row.id}).then(res => {
          this.$modal.msgSuccess(res.message);
        })
      }).catch(() => {
      })
    },
  }
};
</script>
<style lang="scss" scoped>
.custom_button {
  border: none;
  background: none !important;
  font-size: 15px;
}
</style>
