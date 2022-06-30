<template>
  <el-form
    class="form_data"
    ref="queryForm"
    :model="formData"
    :inline="true"
    v-show="showSearch"
  >
    <el-form-item
      :label="item.fieldName"
      :prop="item.fieldType == 'date' ? '' : item.fieldCode"
      v-for="item in searchArr"
      :key="item.id"
    >
      <el-select
        v-if="item.fieldType == 'dict'"
        v-model="formData[item.fieldCode]"
        :placeholder="'请选择' + item.fieldName"
        clearable
        size="small"
        style="width: 240px"
      >
        <el-option
          v-for="(item, key) in item.fieldFormatArr"
          :key="key"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
      <el-select
        v-else-if="item.fieldType == 'enum'"
        v-model="formData['unitCode']"
        :placeholder="'请选择' + item.fieldName"
        clearable
        size="small"
        style="width: 240px"
      >
        <el-option
          v-for="(item, key) in enumData"
          :key="key"
          :label="item.unitName"
          :value="item.unitCode"
           @click.native="handleUnitChange(item)"
        />
      </el-select>
      <el-date-picker
        v-else-if="item.fieldType && item.fieldType.indexOf('date') != -1"
        v-model="dateRange[item.fieldCode]"
        size="small"
        style="width: 240px"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-input
        v-else-if="item.fieldType == 'String'"
        v-model="formData[item.fieldCode]"
        :placeholder="'请输入' + item.fieldName"
        clearable
        size="small"
        style="width: 240px"
        @keyup.enter.native="handleQuery"
      />
      <el-input
        v-else
        v-model="formData[item.fieldCode]"
        :placeholder="'请输入' + item.fieldName"
        clearable
        size="small"
        style="width: 240px"
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <slot name='customItem'></slot>
    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="handleQuery"
        >搜索</el-button
      >
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { getAllAvailableUnit } from "@/api/system/unit";
export default {
  name: "FormData",
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    searchArr: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // 日期范围
      dateRange: {},
      formData: {},
      enumData: [],
    };
  },
  watch: {
    searchArr: {
      handler: function (val, oldVal) {
        val.forEach((item) => {
          if (item.fieldType === "enum") {
            getAllAvailableUnit().then(({ data }) => {
              this.enumData = data;
            });
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    handleQuery() {
      let dateRange = this.dateRange;
      for (let key in dateRange) {
        if (dateRange[key]) {
          this.formData[key + "Start"] = dateRange[key][0];
          this.formData[key + "End"] = dateRange[key][1];
        } else {
          this.formData[key + "Start"] = null;
          this.formData[key + "End"] = null;
        }
      }

      this.$emit("handleQuery", this.formData);
    },
    //使用单位选择回调
    handleUnitChange(value){
      this.$emit("handleQueryDept", value.unitCode);
    },
    /** 重置按钮操作 */
    resetQuery() {
      //清空用车信息查询界面-用车部门信息
      this.$emit("handleResetDept");
      // this.resetForm("queryForm");
      this.dateRange = {};
      for (let key in this.formData) {
        this.formData[key] = null;
      }
      this.handleQuery();
    },
  },
};
</script>

<style scoped lang="scss">
</style>