<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <!-- <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-button size="mini" circle icon="el-icon-menu" @click="showColumn()" />
      </el-tooltip> -->
      <el-dropdown style="margin-left: 7px" trigger="click" :hide-on-click="false" v-if="columnsArr">
        <el-tooltip class="item" effect="dark" content="列设置" placement="top">
          <el-button size="mini" circle icon="el-icon-menu" />
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <div>
            <el-checkbox style="margin: 0 15px;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">列展示</el-checkbox>
            <el-checkbox style="margin-right: 15px;" v-model="number" @change="numberChange">序号</el-checkbox>
            <el-button size="mini" type="text" @click="clickReset">重置</el-button>
          </div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <draggable v-model="columnsArr" @end="onEnd">
              <transition-group>
                <template v-for="(city, index) in columnsArr">
                  <el-dropdown-item :key="city.id" v-if="city.isHide == 0">
                    <i class="el-icon-rank"></i>
                    <el-checkbox :label="city.id" :key="city.id" style="width: 135px">{{city.fieldName}}</el-checkbox>
                    <el-tooltip class="item" style="margin-left: 50px" effect="dark" content="固定到左侧" placement="top">
                      <el-button size="mini" type="text" icon="el-icon-back" :class="city.fixed == 'left'?'dropdown_button':'dropdown_button_default'" @click="leftFixed(city, index)" />
                    </el-tooltip>
                    <el-tooltip class="item" style="margin-left: 10px" effect="dark" content="固定到右侧" placement="top">
                      <el-button size="mini" type="text" icon="el-icon-right" :class="city.fixed == 'right'?'dropdown_button':'dropdown_button_default'" @click="rightFixed(city, index)" />
                    </el-tooltip>
                  </el-dropdown-item>
                </template>
              </transition-group>
            </draggable>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <!-- <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-transfer
        :titles="['显示', '隐藏']"
        v-model="value"
        :data="columns"
        @change="dataChange"
      ></el-transfer>
    </el-dialog> -->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: "RightToolbar",
  components: {
      draggable
  },
  data() {
    return {
      // 显隐数据
      // value: [],
      // 弹出层标题
      title: "显示/隐藏",
      // 是否显示弹出层
      open: false,
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      columnsArr: [],
      number: false
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
  },
  watch: {
    'columns': {
      handler: function (newColumns){
        this.columnsArr = JSON.parse(JSON.stringify(newColumns));
        let columnsArr = [];
        newColumns.forEach( item => {
          if(!item.isHides){
            columnsArr.push(item.id)
          }
        });
        this.checkedCities = columnsArr;
        let checkedCount = columnsArr.length;
        this.checkAll = checkedCount === newColumns.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < newColumns.length;
      }
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    // for (let item in this.columnsArr) {
    //   if (this.columnsArr[item].visible === false) {
    //     this.value.push(parseInt(item));
    //   }
    // }
  },
  methods: {
    init (propertyFieldsArr) {
      this.columnsArr = JSON.parse(JSON.stringify(propertyFieldsArr));
    },
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    // dataChange(data) {
    //   for (let item in this.columnsArr) {
    //     const key = this.columnsArr[item].key;
    //     this.columnsArr[item].visible = !data.includes(key);
    //   }
    // },
    // 打开显隐列dialog
    showColumn() {
      this.open = true;
    },
    onEnd () {
      this.$emit('handleCheckAllChange', this.columnsArr);
    },
    numberChange (val) {
      this.$emit('numberChange', val);
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnsArr.map( (v) => {
        return v.id
      }) : [];
      this.isIndeterminate = false;
      this.columnsArr.forEach( item => {
        if(val){
          item.isHides = false
        }else{
          item.isHides = true
        }
      });
      this.$emit('handleCheckAllChange', this.columnsArr);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnsArr.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnsArr.length;
      this.columnsArr.forEach( (item) => {
        item.isHides = true
        value.forEach( (valueItem) => {
          if(valueItem == item.id){
            item.isHides = false
          }
        })
      })
      this.$emit('handleCheckAllChange', this.columnsArr)
    },
    leftFixed (row, index) {
      row.fixed = row.fixed === 'left'? null:'left'
      this.$set(this.columnsArr, index, row)
      // const oldItem = this.columnsArr[index];
      // this.columnsArr.splice(index, 1);
      // this.columnsArr.splice(0, 0, oldItem);
      this.$emit('handleCheckAllChange', this.columnsArr)
    },
    rightFixed (row, index) {
      row.fixed = row.fixed === 'right'? null:'right'
      this.$set(this.columnsArr, index, row)
      // const oldItem = this.columnsArr[index];
      // this.columnsArr.splice(index, 1);
      // this.columnsArr.splice(this.columnsArr.length, 0, oldItem);
      this.$emit('handleCheckAllChange', this.columnsArr)
    },
    clickReset () {
      this.$emit('clickReset');
    }
  },
};
</script>
<style lang="scss" scoped>
.dropdown_button_default{
  color: #606266;
}
.dropdown_button{
  ::v-deep i{
    font-weight: 700 !important;
  }
}
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
</style>
