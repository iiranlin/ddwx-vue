<template>
  <div class="app-container_list">
    <el-row :gutter="20" class="container_h">
      <el-col :span="24" :xs="24" class="container_flex">
        <!--顶部按钮-->
        <!-- <el-row :gutter="24" class="container_flex-right_list">
          <el-col
            :span="1.5"
            v-for="item in property.buttonTop"
            :key="item.id"
            style="margin-top: 2px; padding: 0px"
          >
            <button-top
              :item="item"
              :multiple="multiple"
              :single="single"
              @newButton="newButton"
              class="cume-button"
            >
            </button-top>
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
        </el-row> -->
        <!--搜索条件按钮-->
        <form-data
          :formDta="formData"
          :showSearch="showSearch"
          :searchArr="property.search || []"
          @handleQuery="handleQuery"
          style="margin-top: -12px; margin-bottom: 6px"
        >
          <template #customItem>
            <el-form-item label="提交日期">
              <el-date-picker
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
                v-model="formData.year"
                placeholder="请选择提交日期"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          
            <el-form-item label="提交人" prop="createByName">
              <el-input
                clearable
                v-model="formData.createByName"
                placeholder="请输入提交人"
              ></el-input>
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
    <!--弹出框-->
    <operate ref="operate" @operateSuccess="operateSuccess"></operate>
    <!--新建-->
    <createFeedBack
      ref="createFeedBack"
      @createSuccess="createSuccess"
    ></createFeedBack>
  </div>
</template>
<script>
import buttonTop from "@/components/buttonTop";
import formData from "@/components/formData";
import tableIndex from "@/components/tableIndex";
import operate from "./components/operate";
import createFeedBack from "./components/createFeedBack";
import { MessageManagement } from "@/api/maintenance";
import indexMixin from "@/views/mixins";
import dayjs from "dayjs";

export default {
  name: "feedback",
  mixins: [indexMixin],
  components: { buttonTop, formData, tableIndex, operate, createFeedBack },

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
        createByName: "",
        startTime: "",
        endTime: "",
        year: [],
      },
      //已选中条目
      selectionData: [],
      //数据总数
      total: 0,
    };
  },
  created() {
    this.menuProperty();
    this.getList();
  },
  watch: {
    "formData.year": {
      handler(newVal) {
        console.log(newVal,'newVal')
        if (!newVal) return;
        this.formData.startTime = dayjs(newVal[0]).format("YYYY-MM-DD HH:mm:ss");
        this.formData.endTime = dayjs(newVal[1]).format("YYYY-MM-DD HH:mm:ss");
      },
      deep: true,
    },
  },
  methods: {
    numberChange(val) {
      this.numberShow = val;
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

      await MessageManagement.getMessageFeedbackList(
        Object.assign({}, this.listQuery, this.formData)
      )
        .then(({ data }) => {
          this.dataList = data.list;
          this.total = data.total;
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
      if (buttonCode === "reply") {
        if (!!this.selectionData[0].replyContext) {
          this.$modal.msgWarning("该条反馈已经回复过了！");
          return;
        }
        this.$refs.operate.init(this.selectionData[0]);
      } else if (buttonCode === "create") {
        this.$refs.createFeedBack.init();
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
    //回复成功回调
    operateSuccess() {
      this.handleQuery();
    },
    //新建成功回调
    createSuccess() {
      this.handleQuery();
    },
    //刷新列表数据
    handleQuery(row = {}) {
        if (!row.year) {
        row.startTime = "";
        row.endTime = "";
        row.year = [];
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
<style lang="css" scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
