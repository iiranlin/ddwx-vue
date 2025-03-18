<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
        <el-row :gutter="24" class="container_flex-right_list">
          <el-col :span="1.5" style="margin-top: 2px; padding: 0px">
            <el-button type="primary" plain size="mini" class="custom_button">
              <svg-icon icon-class="mb-download" class="icon"></svg-icon>下载
            </el-button>
          </el-col>
          <right-toolbar
            ref="rightToolbar"
            style="margin-top: 4px; padding-right: 20px"
            :showSearch.sync="showSearch"
            :columns="property.fields"
            @queryTable="handleQuery"
            @handleCheckAllChange="handleCheckAllChange"
            @numberChange="numberChange"
            @clickReset="clickReset"
          >
          </right-toolbar>
        </el-row>
        <!--搜索条件按钮-->
        <form-data
          :formDta="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top: -12px; margin-bottom: 6px"
        >
          <template #customItem>
            <el-form-item label="统计时间">
              <el-date-picker
                :clearable="false"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                v-model="formData.year"
                placeholder="请选择统计时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="场所" prop="siteId">
              <el-select
                clearable
                filterable
                v-model="formData.siteId"
                placeholder="请选择场所"
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
          </template>
        </form-data>
        <!--表格数据-->
        <table-index
          ref="tableIndex"
          style="margin-top: -8px"
          :tableIndexs="tableIndex"
          :numberShow="numberShow"
          :loading="loading"
          :tableData="dataList"
          :property="property"
          @handleSelectionChange="handleSelectionChange"
          @handleButton="handleButton"
          @selectChange="selectChange"
          @emitAblFilter="emitAblFilter"
        >
          <template #column-date>
            <span>{{ formData.startTime }} - {{ formData.endTime }}</span>
          </template>
        </table-index>
        <!--分页器-->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.pageNum"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
          style="margin-bottom: 40px"
        />
      </el-col>
    </el-row>
    <!--新建-->
    <create ref="create" @createSuccess="createSuccess"></create>
  </div>
</template>
<script>
import buttonTop from "@/components/buttonTop";
import formData from "@/components/formData";
import tableIndex from "@/components/tableIndex";
import create from "./components/create";
import { DataStatistics, FacilityManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import dayjs from "dayjs";

export default {
  // 班组维修数据
  name: "place",
  mixins: [indexMixin],
  components: { buttonTop, formData, tableIndex, create },

  data() {
    return {
      //遮罩层
      loading: false,
      //非单个禁用
      single: true,
      //非多个禁用
      multiple: true,
      //显示搜索条件
      showSearch: true,
      // 表格序号是否展示
      numberShow: false,
      //表格数据
      dataList: [],
      //日期范围
      dateRange: [],
      //列表显示字段
      property: {},
      //查询参数
      formData: {
        startTime: dayjs().format("YYYY") + "-01-01",
        endTime: dayjs().format("YYYY") + "-12-31",
        year: [
          dayjs().format("YYYY") + "-01-01",
          dayjs().format("YYYY") + "-12-31",
        ],
        siteId: "",
      },
      placeOptions: [],
      //已选中条目
      selectionData: [],
      //数据总数
      total: 0,
    };
  },
  watch: {
    "formData.year": {
      handler(newVal) {
        this.formData.startTime = dayjs(newVal[0]).format("YYYY-MM-DD");
        this.formData.endTime = dayjs(newVal[1]).format("YYYY-MM-DD");
      },
      deep: true,
    },
  },
  created() {
    this.menuProperty();
    this.getPlaceList();
    this.getList();
  },
  methods: {
    numberChange(val) {
      this.numberShow = val;
    },
    // 获取场所枚举不分页
    getPlaceList() {
      FacilityManagement.getSysRepairPlaceList().then(({ data }) => {
        this.placeOptions = data.map((item) => {
          return {
            label: item.houseName,
            value: item.id,
          };
        });
      });
    },
    //获取菜单数据
    menuProperty() {
      let id = this.$route.meta.id;
      this.$store.dispatch("menuProperty", id).then((data) => {
        data.search.forEach((item) => {
          item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
        });
        this.property = data;
      });
    },
    //获取分页数据
    async getList() {
      this.loading = true;

      await DataStatistics.getPlaceStatistics(
        Object.assign({}, this.listQuery, this.formData)
      )
        .then(({ data }) => {
          const { pageNum, pageSize } = this.listQuery;
          const startIndex = (pageNum - 1) * pageSize;
          const endIndex = startIndex + pageSize;

          this.total = data.length;
          this.dataList = data.slice(startIndex, endIndex);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    //顶部按钮点击
    newButton(buttonCode, row) {
      this.$refs.tableIndex.newButton(buttonCode, row);
    },
    //页面按钮点击事件
    handleButton(ids, buttonCode) {
      if (buttonCode === "create") {
        this.$refs.create.init();
      } else if (buttonCode === "update") {
        this.$refs.create.updateInit(ids);
      } else if (buttonCode === "delete") {
        this.$confirm("是否删除该条数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          ResourceManagement.deleteDeviceType(ids).then(() => {
            this.$message.success("删除成功！");
            this.handleQuery();
          });
        });
      }
    },
    //顶部列字段展示
    handleCheckAllChange(columns) {
      this.$refs.tableIndex.init(columns);
    },
    //顶部重置按钮
    clickReset() {
      this.menuProperty();
      this.handleQuery();
    },
    //表格内部搜索条件回调
    selectChange(row) {
      let { formData, isWatch } = row;
      if (!isWatch) {
        this.handleQuery(formData);
      } else {
        this.formData = Object.assign({}, this.formData, formData);
      }
    },
    //表格内部排序
    emitAblFilter() {
      this.getList();
    },
    //多选获取行数据
    handleSelectionChange(ids, single, multiple, selection) {
      this.single = single;
      this.multiple = multiple;
      this.selectionData = selection;
    },
    handlePlaceChange(selectedValues) {
      // 获取选中的数据详情
      const selectedItems = this.placeOptions.find((item) =>
        selectedValues.includes(item.value)
      );
    },

    //新建成功回调
    createSuccess() {
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
      if (!row.year) {
        row.startTime = dayjs().format("YYYY") + "-01-01";
        row.endTime = dayjs().format("YYYY") + "-12-31";
        row.year = [
          dayjs().format("YYYY") + "-01-01",
          dayjs().format("YYYY") + "-12-31",
        ];
      }
      this.formData = Object.assign({}, this.formData, row);
      this.getList();
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}

.custom_button {
  border: none;
  background: none;
  font-size: 12px;
  color: #000000;
}
.icon {
  color: #1296db !important;
}
::v-deep.el-button.el-button--primary {
  // color: #409eff;
  color: #000000;
  background: none !important;
  border-color: #a3d3ff;
}
::v-deep.el-button.el-button--primary:hover {
  color: #000000;
  border-color: #b3d8ff !important;
  background: #ecf5ff !important;
}
::v-deep.el-button.el-button--danger {
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--danger:hover {
  color: #000000;
  border-color: #fbc4c4 !important;
  background: #fef0f0 !important;
}
::v-deep.el-button.el-button--info {
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--info:hover {
  color: #000000;
  border-color: #d3d4d6 !important;
  background: #f4f4f5 !important;
}
::v-deep.el-button.el-button--success {
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--success:hover {
  color: #000000;
  border-color: #c2e7b0 !important;
  background: #f0f9eb !important;
}
::v-deep.el-button.el-button--warning {
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--warning:hover {
  color: #000000;
  border-color: #f5dab1 !important;
  background: #fdf6ec !important;
}
</style>
