<template>
  <el-popover placement="bottom" width="260" trigger="click">
    <span slot="reference">
        <svg-icon :icon-class="value ? 'shaixuanHongse' : 'shaixuan'" />
    </span>
    <el-input
      v-if="fieldType == 'String'"
      :placeholder="'请输入' + columnLabel"
      v-model="value"
      class="input-with-select"
      @keyup.enter.native="confirm"
    >
    </el-input>
    <el-select
      v-if="fieldType == 'dict'"
      :placeholder="'请选择' + columnLabel"
      v-model="value"
      clearable
      size="small"
    >
      <el-option
        v-for="(value,key)  in fieldFormat"
        :key="key"
        :label="value"
        :value="key"
      />
    </el-select>
    <el-date-picker
      v-if="fieldType && fieldType.indexOf('date') != -1"
      v-model="value"
      size="small"
      style="width: 240px"
      value-format="yyyy-MM-dd"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <div class="render_header_popover">
      <el-button type="primary" icon="el-icon-search" size="mini" @click="confirm">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </div>
  </el-popover>
</template>
 
<script>
export default {
  data () {
    return {
      value: ""
    };
  },
  props: {
    columnLabel: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    fieldType: {
      type: String,
      default: "String"
    },
    fieldFormat: {
      type: Object,
      default: {}
    }
  },
  watch: {
    'value':{
      handler: function (newValue) {
        let self = this;
        self.$emit("selectChange", { fieldType: self.fieldType, type: self.type, value: newValue, watch: true });
      }
    }
  },
  methods: {
    confirm () {
      let self = this;
      self.$emit("selectChange", { fieldType: self.fieldType, type: self.type, value: self.value });
    },
    resetQuery () {
      let self = this;
      self.value = '';
      self.$emit("selectChange", { fieldType: self.fieldType, type: self.type, value: self.value });
    }
  }
};
</script>
<style lang="scss" scoped>
.render_header_popover{
  margin-top: 10px;
  float: right;
}
</style>