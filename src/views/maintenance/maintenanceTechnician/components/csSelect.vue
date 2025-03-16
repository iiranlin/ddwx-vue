<template>
  <div>
    <el-select
    style="width: 100%;"
      :value="defaultValue"
      popper-class="virtualselect"
      filterable
      :filter-method="filterMethod"
      @visible-change="visibleChange"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <virtual-list
        ref="virtualList"
        class="virtualselect-list"
        :data-key="selectData.value"
        :data-sources="selectArr"
        :data-component="itemComponent"
        :keeps="20"
        :extra-props="{
          label: selectData.label,
          value: selectData.value,
          isRight: selectData.isRight,
        }"
      ></virtual-list>
    </el-select>
  </div>
</template>
<script>
import virtualList from "vue-virtual-scroll-list";
import Options from "./options";
export default {
  components: {
    "virtual-list": virtualList,
    Options,
  },
  model: {
    prop: "defaultValue",
    event: "change",
  },
  props: {
    selectData: {
      type: Object,
      default() {
        return {};
      },
    }, //父组件传的值
    defaultValue: {
      type: [String, Array],
      default: "",
    }, // 绑定的默认值，支持字符串（单选）或数组（多选）
  },
  mounted() {
    this.init();
  },
  watch: {
    "selectData.data"() {
      this.init();
    },
  },
  data() {
    return {
      itemComponent: Options,
      selectArr: [],
    };
  },
  methods: {
    init() {
      // 检查数据有效性
      if (!this.selectData?.data || !Array.isArray(this.selectData.data)) {
        this.selectArr = [];
        return;
      }

      // 如果没有默认值，直接使用原始数据
      if (!this.defaultValue) {
        this.selectArr = this.selectData.data;
        return;
      }
      
      this.selectArr = JSON.parse(JSON.stringify(this.selectData.data));
      
      // 处理多选情况
      if (Array.isArray(this.defaultValue)) {
        const selectedItems = [];
        const remainingItems = [];
        
        this.selectArr.forEach(item => {
          const itemValue = item[this.selectData.value];
          if (!itemValue) return;
          
          if (this.defaultValue.some(val => {
            return val && itemValue && val.toString().toLowerCase() === itemValue.toString().toLowerCase();
          })) {
            selectedItems.push(item);
          } else {
            remainingItems.push(item);
          }
        });
        
        this.selectArr = [...selectedItems, ...remainingItems];
        return;
      }
      
      // 处理单选情况
      let obj = {};
      const defaultValueStr = this.defaultValue?.toString().toLowerCase();
      
      if (defaultValueStr) {
        for (let i = 0; i < this.selectArr.length; i++) {
          const element = this.selectArr[i];
          const elementValue = element[this.selectData.value];
          
          if (elementValue && elementValue.toString().toLowerCase() === defaultValueStr) {
            obj = element;
            this.selectArr.splice(i, 1);
            break;
          }
        }
      }
      
      this.selectArr.unshift(obj);
    },
    // 搜索
    filterMethod(query) {
      if (query !== "") {
        this.$refs.virtualList.scrollToIndex(0); //滚动到顶部
        setTimeout(() => {
          this.selectArr = this.selectData.data.filter((item) => {
            return this.selectData.isRight
              ? item[this.selectData.label]
                  .toLowerCase()
                  .indexOf(query.toLowerCase()) > -1 ||
                  item[this.selectData.value]
                    .toLowerCase()
                    .indexOf(query.toLowerCase()) > -1
              : item[this.selectData.label]
                  .toLowerCase()
                  .indexOf(query.toLowerCase()) > -1;
          });
        }, 100);
      } else {
        this.init();
      }
    },
    visibleChange(bool) {
      if (!bool) {
        this.$refs.virtualList.reset();
        this.init();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.virtualselect {
  // 设置最大高度
  &-list {
    max-height: 245px;
    overflow-y: auto;
  }
  .el-scrollbar .el-scrollbar__bar.is-vertical {
    width: 0;
  }
}
</style>
