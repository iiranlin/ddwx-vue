<template>
  <div class="app-container_tree">
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
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24" class="container_flex">
        <el-row :gutter="24" class="container_flex-right_tree">
          <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
            <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              @newButton="newButton"
              class="cume-button"
            ></button-top>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top:4px; padding-right:20px"
            :isRowDropShow="isRowDropShow"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @clickReset="clickReset"
            @numberChange="numberChange"
            @rowDropSortChange="rowDropSortChange"
          ></right-toolbar>
        </el-row>
        <form-data
          :formData="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top:-12px;margin-bottom: 6px;"
        />
        <table-index
          ref="tableIndex"
          style="margin-top:-8px"
          :loading="loading"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :tableData="dataList"
          :property="property"
          :isRowDrop="isRowDrop"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        />
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
          style="margin-bottom: 40px;"
        />
      </el-col>
    </el-row>
    <operate ref="operate" @deptSuccess="deptSuccess" :deptOptions="deptOptions"/>
    <select-ware-house ref="warehouse" @warehouseSuccess="warehouseSuccess"/>
  </div>
</template>

<script>
  import {deptListPageForUnit, deptTree, deptDeleteBatch} from "@/api/system/dept";
  import operate from "./components/operate";
  import selectWareHouse from "./components/selectWarehouse";
  import indexMixin from "@/views/mixins";

  export default {
    name: "dept",
    mixins: [indexMixin],
    components: {operate, selectWareHouse},
    data() {
      return {
        // 表格行是否拖拽排序
        isRowDropShow: true,
        isRowDrop: false,
        modelName: 'dept',
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
        // 表格序号是否展示
        numberShow: false,
        // 表格数据
        dataList: [],
        // 弹出层标题
        title: "",
        // 部门树选项
        deptOptions: undefined,
        //列表显示字段
        property: {},
        selectionData: [],
        defaultProps: {
          children: "children",
          label: "deptName",
        },
        // 查询参数
        formData: {
          parentId: "",
        },
        total: 0
      };
    },
    created() {
      this.menuProperty();
      this.deptTree();
      this.getList();
    },
    mounted() {
    },
    methods: {
      menuProperty() {
        const id = this.$route.meta.id;
        this.$store.dispatch('menuProperty', id).then((data) => {
          this.property = data;
        });
      },
      numberChange(val) {
        this.numberShow = val;
      },
      rowDropSortChange(val) {
        this.isRowDrop = val;
        this.$refs.tableIndex.rowDrop(val, this.modelName)
      },
      // newButton(buttonCode) {
      //   if (buttonCode === "bindStoryhouse") {
      //     this.checkWarehouseState();
      //   } else {
      //     this.$refs.tableIndex.newButton(buttonCode);
      //   }
      // },
      newButton(buttonCode) {
        this.$refs.tableIndex.newButton(buttonCode)
      },
      handleButton(id, buttonCode) {
        if (buttonCode === 'update') {
          this.handleUpdate(id)
        } else if (buttonCode === 'delete') {
          this.handleDelete(id)
        } else if (buttonCode === 'create') {
          this.handleCreate()
        }
      },
      //检查是否属于同一仓库
      checkWarehouseState() {
        if (this.selectionData.length > 1) {
          let storehouseCode = this.selectionData[0].storehouseCode;
          for (let i = 1; i < this.selectionData.length; i++) {
            if (storehouseCode !== this.selectionData[i].storehouseCode) {
              this.$modal.msgWarning("所选部门绑定不同仓库，无法同时修改")
              return
            }
          }
        }
        this.$refs.warehouse.init(this.selectionData);
      },
      handleCheckAllChange(columns) {
        this.$refs.tableIndex.init(columns);
      },
      //选择框回调
      selectChange(row) {
        let {formData, isWatch} = row;
        if (!isWatch) {
          this.handleQuery(formData);
        } else {
          this.formData = Object.assign({}, this.formData, formData);
        }
      },
      deptTree() {
        deptTree().then(({data}) => {
          this.deptOptions = data;
        });
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.formData.parentId = data.id;
        this.handleQuery();
      },
      emitAblFilter(listQuery) {
        this.listQuery = Object.assign({}, this.listQuery, listQuery);
        this.handleQuery();
      },
      handleQuery(row = {}) {
        this.formData = Object.assign({}, this.formData, row);
        this.getList();
      },
      getList() {
        this.loading = true;
        deptListPageForUnit(Object.assign({}, this.listQuery, this.formData)).then(
          ({data}) => {
            this.dataList = data.list;
            this.total = data.total;
            this.loading = false;
          }
        );
      },
      handleSelectionChange(ids, single, multiple, selection) {
        this.single = single;
        this.multiple = multiple;
        this.selectionData = selection;
      },
      handleCreate() {
        this.$refs.operate.init("create", this.formData.parentId);
      },
      handleUpdate(id) {
        this.$refs.operate.init("update", id);
      },
      handleDelete(ids) {
        this.$modal
          .confirm("是否确认删除?")
          .then(function () {
            return deptDeleteBatch({ids});
          })
          .then(() => {
            this.deptTree();
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {
          });
      },
      deptSuccess() {
        this.handleQuery();
        this.deptTree();
      },
      clickReset() {
        this.menuProperty();
        this.handleQuery();
      },
      warehouseSuccess() {
        this.getList();
      },
    },
  };
</script>
