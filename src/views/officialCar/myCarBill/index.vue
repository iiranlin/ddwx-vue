<template>
  <div class="app-container">
    
    <el-row :gutter="20" class="container_h">
      <!--菜单数据-->
      <el-col :span="4" :xs="24" class="container_flex_overflow">
        <div class="head-container">
          <el-tree
            class="drawer-tree"
            :indent="0"
            :data="menuOptions"
            :props="defaultPropsMenu"
            :expand-on-click-node="false"
            ref="tree"
            :highlight-current="true"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24" class="container_flex">
        <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleCreate"
              
            >新增</el-button>
        <el-form :model="formData" ref="queryForm" v-show="showSearch" :inline="true">
          <el-form-item label="字段名称:" prop="fieldName">
            <el-input
              v-model="formData.fieldName"
              placeholder="请输入字段名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="字段状态"
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

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleCreate"
              v-hasPermi="['system:menu:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate('')"
              v-hasPermi="['system:menu:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:menu:remove']"
            >删除</el-button>
          </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table class="container_table" height="100%" v-loading="loading" :data="menuList" @selection-change="handleSelectionChange" @sort-change="sortableColumnChange" :row-class-name="rowOnlineTableColumIndex"  stripe
          highlight-current-row>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column  width="50" align="center" label="序号" prop="index"/>
          <!-- <el-table-column v-for="(val,key) in fields" :key="key"
          :v-if="val.visible"
          :show-overflow-tooltip="true"
          :label="val.label" 
          :prop="val.prop" 
          :align="val.align"
          :width="val.width"
          >
          </el-table-column> -->
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="所属页面" prop="menuName"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="字段编码"  prop="fieldCode" />
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="字段名称" prop="fieldName"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="排序" prop="seq"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="字段类型" prop="fieldType"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="展示方式" prop="fieldFormat"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="启用排序" prop="isOrder">
            <template slot-scope="{row}">
              {{row.isOrder == 0? '否' : '是'}}
            </template>
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="启用搜索" prop="isSearch">
            <template slot-scope="{row}">
              {{row.isOrder == 0? '否' : '是'}}
            </template>
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="字段宽度" prop="fieldWidth"/>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="对齐方式" prop="align">
              <template slot-scope="{row}">
                {{ align[row.align] }}
              </template>
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="隐藏字段" prop="isHide">
            <template slot-scope="{row}">
              {{row.isHide == 0? '否' : '是'}}
            </template>
          </el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" width="150" label="状态" prop="status"
          :filters="[{ text: '正常', value: 0 }, { text: '停用', value: 1 }]" v-if="columns[1].visible" sortable="custom">
            <template slot-scope="{row}">
              {{row.status == 0? '正常' : '停用'}}
            </template>
          </el-table-column>
          <el-table-column  align="center" :show-overflow-tooltip="true" width="150" label="创建时间" prop="createTime" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column  align="center" :show-overflow-tooltip="true" width="150" label="更新时间" prop="createTime" sortable="custom">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="200" align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
        style="margin-bottom:35px"
        v-show="total>0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <operate ref="operate" :menuId="formData.menuId" @operateSuccess="operateSuccess" />
  </div>
</template>

<script>
import {menuProperty, menuTree} from '@/api/system/menu';
import {menuFieldPage, menuFieldDeleteBatch} from '@/api/system/menu-field';
import operate from "./components/operate";
import indexMixin from '@/views/mixins';
export default {
  name: "MenuField",
  mixins: [indexMixin],
  components: { operate },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字段表格数据
      menuList: [],
      // 菜单列表
      menuOptions: [],
      defaultPropsMenu: {
        children: "children",
        label: "menuName"
      },
      // 日期范围
      dateRange: [],
      // 字段信息
      fields:[],
      searchs:[],
      buttons:[],
      align: {
        "left":"居左",
        "center":"居中",
        "right":"居右",
      },
      // 列信息
      columns: [
        { key: 0, label: `字段名称`, visible: true },
        { key: 1, label: `状态`, visible: true },
        { key: 2, label: `创建时间`, visible: true },
        { key: 3, label: `更新时间`, visible: true },
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
      // 查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 30,
      },
      // 表单参数
      formData: {
        fieldName: '',
        status: '',
        menuId: ''
      },
      visible: false,
    };
  },
  created() {
    // 获得页面属性
    this.getMenuTree();
      // menuProperty('1487327353118199704').then( ({data}) => {
      //   let fields = []
      //   data.fields.forEach(e => {
      //     console.log(e)
      //     const field = {
      //       key: e.id,
      //       prop: e.fieldCode,
      //       label: e.fieldName,
      //       width: e.width || 180,
      //       align: e.align || '',
      //       visible: true
      //     }
      //     fields.push(field);
      //   });
      //   this.fields = fields;
      // })


    this.getList();
  },
  methods: {
    clearSearch () {
      this.formData.fieldName = '';
      this.getList();
    },
    handleQuery () {
      this.getList();
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    emitAblFilter () {
      this.dateRange = [];
      this.getList();
    },
    operateSuccess () {
      this.handleQuery();
    },
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleNodeClick (data) {
      this.formData.menuId = data.id;
      if(data.id){
        this.handleQuery();
      }
    },
    getMenuTree () {
      menuTree().then( ({data}) => {
        this.menuOptions = data;
      })
    },
    /** 查询字段列表 */
    getList() {
      this.loading = true;
      menuFieldPage(Object.assign({}, this.listQuery, this.formData)).then( ({data}) => {
        this.menuList = data.list;
        this.total = data.total;
        this.loading = false;
      })
    },
     rowOnlineTableColumIndex({row,rowIndex}){
      row.index=rowIndex+1
    },
    handleCreate () {
      this.$refs.operate.init('create');
    },
    handleUpdate (row) {
      let id = '';
      if(row){
        id = row.id;
      }else{
        id = this.ids[0];
      }
      this.$refs.operate.init('update', id);
    },
    handleDelete (row) {
      let ids = row.id || this.ids;
      if(!(ids instanceof Array)){
        ids = [ids];
      }
      this.$modal.confirm('是否确认删除字段?').then(function() {
        return menuFieldDeleteBatch({ids});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row>td{
      background-color: #B8D9FD !important;
    }
</style>