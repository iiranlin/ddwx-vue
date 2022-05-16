<template>
  <el-table class="container_table3" border v-loading="loading" :row-class-name="tableClassName" :data="buttonData" :row-key="getRowKey" :height="tableHeight()" >
    <el-table-column label="" prop="id" align="center" width="50" type="index" :show-overflow-tooltip="true">
      <i class="el-icon-s-operation drag" ></i>
    </el-table-column>
    <el-table-column label="序号" align="center" width="50" type="index" :show-overflow-tooltip="true">
    </el-table-column>
    <el-table-column label="常用按钮" prop="buttonType" align="center" :show-overflow-tooltip="true">
      <template slot-scope="scope">
          <el-select v-model="scope.row.usuallyButton" placeholder="" @change="handleChangeUsuallyButton(scope.$index,scope.row)">
          <el-option
            v-for="item in usuallyList"
            :key="item.code"
            :label="item.label"
            :value="item.code">
          </el-option> 
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="按钮编号" prop="buttonCode" align="center">
      <template slot-scope="{row}">
        <el-input
          maxlength="200" 
          v-model="row.buttonCode"
          placeholder=""
        />
      </template>
    </el-table-column>
    <el-table-column label="按钮名称" prop="buttonName" align="center">
      <template slot-scope="{row}">
        <el-input
          maxlength="200"
          v-model="row.buttonName"
          placeholder=""
        />
      </template>
    </el-table-column>
    <el-table-column label="图标"  prop="buttonIcon" align="center">
      <template slot-scope="scope">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" @selected="selectButtonIcon" @getTableIndex="getTableIndex(scope.$index)" />
          <el-input
            slot="reference"
            v-model="scope.row.buttonIcon"
            placeholder="点击选择图标"
            readonly
          >
            <svg-icon
              v-if="scope.row.buttonIcon"
              slot="prefix"
              :icon-class="scope.row.buttonIcon"
              class="el-input__icon"
              style="height: 32px; width: 16px"
            />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="按钮类型" prop="buttonType" align="center">
      <template slot-scope="{row}">
          <el-select v-model="row.buttonType" placeholder="" :clearable="true">
          <el-option
            v-for="item in buttonTypeList"
            :key="item.code"
            :label="item.label"
            :value="item.code">
            <span :style="{color:item.color}">{{ item.label }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="操作模式" prop="buttonMode" align="center" >
      <template slot-scope="{row}">
          <el-select v-model="row.buttonMode" placeholder="" :clearable="true">
          <el-option
            v-for="item in buttonModeList"
            :key="item.code"
            :label="item.label"
            :value="item.code">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column  label="启用" align="center">
      <template slot-scope="{row}">
        <el-checkbox v-model="row.status" :true-label="0" :false-label="1"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column  label="按钮位置" align="center" width="150">
      <template slot-scope="{row}">
        <div>
          <el-checkbox v-model="row.isTop" :true-label="1" :false-label="0">顶部</el-checkbox>
        </div>
        <div>
          <el-checkbox v-model="row.isRow" :true-label="1" :false-label="0">列表</el-checkbox>
        </div>
      </template>
    </el-table-column>
    <el-table-column  label="操作" align="center" width="80">
      <template slot-scope="scope">
        <el-button 
        size="mini"
        type="text"
        icon="el-icon-delete"
        @click="handleDelete(scope.row,scope.$index)"></el-button>
      </template>
    </el-table-column>
    
  </el-table>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Sortable from 'sortablejs';
import IconSelect from "@/components/IconSelect";
export default {
  components:{Treeselect,IconSelect},
  props:{
    //表格数据
    buttonData: {
      type: Array,
      default: [],
    },
   //菜单信息配置是否展开
    isMenuShow: {
      type: Boolean,
      default: false,
    },
    isDataSourceShow: {
      type: Boolean,
      default: false,
    },
    dialogFull: {
      type: Boolean,
      default: false,
    },
  },
  data(){
    return{
      loading:false,
      //按钮类型
      buttonTypeList: [
        {code: 'primary',label: '主要按钮',color:"#409eff"},
        {code: 'success',label: '成功按钮',color:"#71e2a3"},
        {code: 'info',label: '信息按钮',color:"#909399"},
        {code: 'warning',label: '警告按钮',color:"#e6a23c"},
        {code: 'danger',label: '危险按钮',color:"red"},
      ],
      // 操作模式
      buttonModeList: [
        {code: '1',label: '单条操作'},
        {code: '2',label: '多条操作'},
      ],
      // 常用按钮
       usuallyList: [
        {code: 'create',label: '新增'},
        {code: 'update',label: '修改'},
        {code: 'delete',label: '删除'},
      ],
      usuallyButtonList:[
        {
          "buttonCode": "create",
          "buttonIcon": "antOutline-plus",
          "buttonMode": "",
          "buttonName": "新增",
          "buttonType": "primary",
          "groupId": "",
          "id": "",
          "ids": "",
          "isHide": 0,
          "isRow": 0,
          "isTop": 1,
          "menuId": "",
          "seq": 0,
          "status": 0,},
        {
          "buttonCode": "update",
          "buttonIcon": "edit",
          "buttonMode": "2",
          "buttonName": "修改",
          "buttonType": "success",
          "groupId": "",
          "id": "",
          "ids": "",
          "isHide": 0,
          "isRow": 1,
          "isTop": 1,
          "menuId": "",
          "seq": 0,
          "status": 0,},
        {
          "buttonCode": "delete",
          "buttonIcon": "trash-can",
          "buttonMode": "2",
          "buttonName": "删除",
          "buttonType": "danger",
          "groupId": "",
          "id": "",
          "ids": "",
          "isHide": 0,
          "isRow": 1,
          "isTop": 1,
          "menuId": "",
          "seq": 0,
          "status": 0,},
      ],
      usuallyButton:"",
      index:"",
      icon:"",
      windowHeight:Number()
    }
  },
  watch:{
    'dialogFull':{
      handler: function (newDialogFull) {
        if(newDialogFull){
          this.windowHeight = this.windowHeight+80
        }else{
          this.windowHeight = this.windowHeight-80
        }
      }
    }
  },
  created(){
    let windowHeight = document.body.clientHeight&&document.documentElement.clientHeight;
    this.windowHeight  = windowHeight-610
  },
  mounted(){
    this.rowDrop();
  },
  methods:{
    tableHeight(){
      let windowHeight = this.windowHeight
      windowHeight = windowHeight+(this.isMenuShow?0:180)+(this.isDataSourceShow?0:60)
      return windowHeight
    },
    tableClassName(e ){
      e.row.index = e.rowIndex;
      e.row.seq = e.rowIndex+1;
    },
    getRowKey(row){
      if(row.id){
        return row.id;
      }else{
        return row.ids;
      }
    },
    selectButtonIcon(e){
      this.buttonData[this.index].buttonIcon = e
    },
    getTableIndex(index){
      this.index = index
    },
    addButtonProperty(){
      let objdata = {
            "buttonCode": "",
            "buttonIcon": "",
            "buttonMode": "",
            "buttonName": "",
            "buttonType": "",
            "groupId": "",
            "id": "",
            "ids": new Date().getTime(),
            "isHide": 0,
            "isRow": 0,
            "isTop": 0,
            "menuId": "",
            "seq": 0,
            "status": 0,
            "usuallyButton":""
          };
      this.buttonData.push(objdata)
      this.$modal.msgSuccess('添加成功');
    },
    handleChangeUsuallyButton(index,row){
      let idx = Number()
      switch(this.buttonData[index].usuallyButton){
        case 'create':
          idx = 0;
          break;
        case 'update':
          idx = 1;
          break;
        case 'delete':
          idx = 2;
          break;
      }
      this.buttonData[index].buttonCode = this.usuallyButtonList[idx].buttonCode;
      this.buttonData[index].buttonIcon = this.usuallyButtonList[idx].buttonIcon
      this.buttonData[index].buttonMode = this.usuallyButtonList[idx].buttonMode
      this.buttonData[index].buttonName = this.usuallyButtonList[idx].buttonName
      this.buttonData[index].buttonType = this.usuallyButtonList[idx].buttonType
      this.buttonData[index].isHide = this.usuallyButtonList[idx].isHide
      this.buttonData[index].isRow = this.usuallyButtonList[idx].isRow
      this.buttonData[index].isTop = this.usuallyButtonList[idx].isTop
      this.buttonData[index].seq = index+1
      this.buttonData[index].status = this.usuallyButtonList[idx].status
    },
    handleDelete (row,index) {  
      let that = this
      this.$modal.confirm('是否确认删除?').then(function() {
				that.buttonData.splice(index,1)
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    rowDrop() { // 行拖拽
      const tbodys = document.querySelector('.container_table3 .el-table__body-wrapper tbody')
      const _this = this;
      Sortable.create(tbodys, {
        handle:'.drag',
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.buttonData.splice(oldIndex, 1)[0];
          _this.buttonData.splice(newIndex, 0, currRow);
        }
      });
    },
    
  }
}
</script>
<style lang="scss" scoped>
.drag{
  cursor: move;
  font-size: 20px;
}
</style>