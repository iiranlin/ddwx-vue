<template>
  <el-table class="container_table2" border v-loading="loading" :data="tableData" :row-key="getRowKey" :height="tableHeight()" :row-class-name="tableRowClassName">
    <el-table-column label="" prop="id" align="center" width="50" type="index">
      <i class="el-icon-s-operation drag" ></i>
    </el-table-column>
    <el-table-column label="序号" prop="id" align="center" width="50" type="index">
    </el-table-column>
    <el-table-column label="字段编码" prop="fieldCode" align="center" width="150">
      <template slot-scope="{row}">
        <el-input
          maxlength="200"
          v-model="row.fieldCode"
          placeholder=""
        />
      </template>
    </el-table-column>
     <el-table-column label="字段名称" prop="fieldName" align="center" width="150">
      <template slot-scope="{row}">
        <el-input
          maxlength="200"
          v-model="row.fieldName"
          placeholder=""
        />
      </template>
    </el-table-column>
     <el-table-column label="字段类型" prop="fieldType" align="center" width="150">
      <template slot-scope="scope">
        <el-select
          v-model="scope.row.fieldType"
          placeholder="请选择"
          clearable
          value-key="label"
          @change="changeFieldType($event,scope.$index)"
        >
          <el-option
            v-for="dict in fieldTypeList"
            :key="dict.label"
            :label="dict.label"
            :value="dict.code"
          />
        </el-select>
      </template>
    </el-table-column> 
   <el-table-column width="150" label="字典" align="center" prop="fieldFormatDict" >
      <template slot-scope="scope">
        <treeselect v-if="scope.row.fieldType == 'dict'" v-model="scope.row.fieldFormatDict" :options="commonTreeList" :normalizer="normalizera"  placeholder="请选择字典" />
      </template>
    </el-table-column>
    <el-table-column label="启用"  prop="status" align="center" width="80">
      <template slot-scope="{row}">
        <el-checkbox v-model="row.status" :true-label="0" :false-label="1"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="列头排序"  prop="isOrder" align="center" width="80">
      <template slot-scope="{row}">
        <el-checkbox v-model="row.isOrder" :true-label="1" :false-label="0"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="隐藏字段" prop="isHide" align="center" width="80">
      <template slot-scope="{row}">
        <el-checkbox v-model="row.isHide" :true-label="1" :false-label="0"></el-checkbox>
      </template>
    </el-table-column>
      <el-table-column  label="启用搜索" align="center" width="150">
      <template slot-scope="{row}">
        <div>
          <el-checkbox v-model="row.isSearchArea" :true-label="1" :false-label="0">查询区域</el-checkbox>
        </div>
        <div>
          <el-checkbox v-model="row.isSearchHeader" :true-label="1" :false-label="0">列表表头</el-checkbox>
        </div>
      </template>
    </el-table-column>
    <el-table-column  label="对齐方式" align="center" min-width="120">
      <template slot-scope="{row}">
        <el-select v-model="row.align" placeholder="">
          <el-option
            v-for="item in alignList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column  label="宽度" align="center" min-width="120">
      <template slot-scope="{row}">
        <el-input
          maxlength="200"
          v-model="row.fieldWidth"
          placeholder=""
        />
      </template>
    </el-table-column>
    <el-table-column  label="链接页面" align="center" min-width="180">
      <template slot-scope="{row}">
        <el-input
          maxlength="200"
          v-model="row.link"
          placeholder=""
        />
      </template>
    </el-table-column>
    <el-table-column  label="操作" fixed="right" align="center" width="80">
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
import {commonTree} from '@/api/system/dict';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {alignList} from "@/utils/constant";
import Sortable from 'sortablejs';
import {generateUUID} from '@/utils/index';
import {camelCase} from "@/utils/index"

export default {
  components:{Treeselect},
  props:{
    //表格数据
    tableData: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
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
      windowHeight:Number(),
      alignList,
      commonTreeList: [],
      fieldTypeList: [
        {code: "String",label: '字符串'},
        {code: "Number",label: '数字'},
        {code: "date_{y}",label: '日期(年)'},
        {code: "date_{y}-{m}",label: '日期(年-月)'},
        {code: 'date_{y}-{m}-{d}',label: '日期(年-月-日)'},
        {code: 'date_{y}-{m}-{d} {h}:{i}:{s}',label: '日期(年-月-日 时-分-秒)'},
        {code: "dict",label: '字典'},
      ],
      index:""
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
    this.windowHeight  = windowHeight-610;
  },
  mounted(){
    this.rowDropPage();
  },
  methods:{
    tableHeight(){
      let windowHeight = this.windowHeight
      windowHeight = windowHeight+(this.isMenuShow?0:180)+(this.isDataSourceShow?0:60)
      return windowHeight
    },
    tableRowClassName(e){
      e.row.index = e.rowIndex;
      e.row.seq = e.rowIndex+1;
      return 'rowPadding'
    },
    getRowKey(row){
      if(row.id){
        return row.id;
      }else{
        return row.ids;
      }
    },
    commonTree () {
      commonTree().then( ({data}) => {
        this.commonTreeList = data
      })
    },
    changeFieldType (row,index) {
      this.tableData[index].fieldFormatDict = undefined;
      if(this.tableData[index].fieldType.indexOf('date') > -1){
        this.tableData[index].fieldFormatDate = this.tableData[index].fieldType.substr(5);
      }
      if(row === 'dict' && this.commonTreeList.length === 0){
        this.commonTree();
      }
    },
    /** 转换字段数据结构 */
    normalizera(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    addPageProperty(e){ // 添加行
    if(e){
      for (let index = 0; index < e.length; index++) {
        let objdata = {
          "align": "",
          "fieldCode":"",
          "fieldFormat": "",
          "fieldFormat": "",
          "fieldFormatDict": "",
          "fieldName":"",
          "fieldType": "",
          "fieldWidth": "",
          "id": "",
          "ids": "",
          "isHide": 0,
          "isOrder": 0,
          "isSearchArea": 0,
          "isSearchHeader": 0,
          "link": "",
          "menuId": "",
          "menuName": "",
          "seq": 0,
          "status": 0,
        };
        objdata.ids = generateUUID();
        objdata.fieldCode= camelCase(e[index].columnName);
        objdata.fieldName=e[index].columnComment;
        this.tableData.push(objdata)
      }
    }else{
        let objdata = {
          "align": "",
          "fieldCode":"",
          "fieldFormat": "",
          "fieldFormat": "",
          "fieldFormatDict": "",
          "fieldName":"",
          "fieldType": "",
          "fieldWidth": "",
          "id": "",
          "ids": "",
          "isHide": 0,
          "isOrder": 0,
          "isSearchArea": 0,
          "isSearchHeader": 0,
          "link": "",
          "menuId": "",
          "menuName": "",
          "seq": 0,
          "status": 0,
        };
        objdata.ids = generateUUID();
        this.tableData.push(objdata)
    }
      this.$modal.msgSuccess('添加成功');
    },
    handleDelete (row,index) {
      let that = this
      this.$modal.confirm('是否确认删除?').then(function() {
				that.tableData.splice(index,1)
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    rowDropPage() { // 行拖拽
      const tbodys = document.querySelector('.container_table2 .el-table__body-wrapper tbody')
      const _this = this;
      Sortable.create(tbodys, {
        handle:".drag",
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
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