<template>
  <!-- 添加或修改部门对话框 -->
  <el-dialog
    :title="title" :close-on-click-modal="false"
    :visible.sync="openDataScope"
    width="1300px"
    :fullscreen="dialogFull"
    append-to-body
    :class="dialogFull ? '' : dialogHeight()"
  >
  <template slot="title">
        <div class="avue-crud__dialog__header">
            <span class="el-dialog__title">
              {{title}}
            </span>
          <div class="avue-crud__dialog__menu" @click="dialogFull? dialogFull=false: dialogFull=true">
            <i class="el-icon-full-screen"></i>
          </div>
        </div>
      </template>

    <el-form ref="elForm" :model="form" :rules="rules" label-width="115px" :style="{'--theme':theme}">
      <div class="contTitle" > 
        <span @click="showForm('menu')">
          <i class="el-icon-caret-right" :style="isMenuShow?'transform:rotate(90deg)':''"/> 
          菜单信息配置
        </span>
      </div>
      <template v-if="isMenuShow">
        <el-row>
          <el-col :span="8">
            <el-form-item label="上级菜单:" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="菜单名称:" prop="menuName">
              <el-input v-model="form.menuName" maxlength="200" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="菜单图标:" prop="menuIcon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.menuIcon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.menuIcon"
                    slot="prefix"
                    :icon-class="form.menuIcon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="排序:" prop="seq">
              <el-input-number
                v-model="form.seq"
                controls-position="right"
                :min="1"
                :max="99"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否隐藏:" prop="isHide">
              <el-switch
                v-model="form.isHide"
                :active-value="1" :inactive-value="0"
                >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否启用:" prop="status">
              <el-switch
                v-model="form.status"
                :active-value="0" :inactive-value="1"
                >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否页面缓存:" prop="isCache">
              <el-switch
                v-model="form.isCache"
                :active-value="1" :inactive-value="0"
                >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="菜单URL:" prop="menuUrl">
              <el-input v-model="form.menuUrl" maxlength="200" placeholder="请输入URL" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组件地址:" prop="component">
              <el-input v-model="form.component" maxlength="200" placeholder="请输入组件地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="字段权限:" prop="isAcl">
              <el-switch
                v-model="form.isAcl"
                :active-value="1" :inactive-value="0"
                >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div class="contTitle" > 
        <span @click="showForm('dataSource')">
          <i class="el-icon-caret-right" :style="isDataSourceShow?'transform:rotate(90deg)':''"/> 
          数据源配置
        </span>
        </div>
      <template v-if="isDataSourceShow">
        <el-row>
          <el-col :span="8">
            <el-form-item label="数据源类型:" prop="dataType">
              <el-select
                v-model="form.dataType"
                placeholder="数据源类型"
                clearable
                @change="changeDataSourceType"
              >
                <el-option
                  v-for="dict in dataTypeData"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据源名称:" prop="datasource">
              <el-select
                v-model="datasource"
                placeholder="数据源名称"
                clearable
                @change="changeDataSource"
              >
                <el-option
                  v-for="dict in datasourceList"
                  :key="dict.id"
                  :label="dict.sourceName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据表名称:">
            <el-select
                v-model="ListDbTable"
                placeholder="数据表名称"
                clearable
                filterable
                @change="changeDbTable"
              >
                <el-option
                  v-for="dict in allListDbTable"
                  :key="dict.tableName"
                  :label="!dict.tableComment ? dict.tableName : `${dict.tableComment}【${dict.tableName}】`"
                  :value="dict.tableName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div class="tableWrap">
        <el-tabs v-model="activeTab" :addable="activeTab != '0'" @tab-add="handleClickAdd">
          <el-tab-pane label="数据属性" >
            <dataProperty ref="dataProperty" 
            :dataList="columnByTableNameList" 
            @handleAddField="handleAddField" 
            :dialogFull="dialogFull" 
            :isMenuShow="isMenuShow" 
            :isDataSourceShow="isDataSourceShow" 
            />
          </el-tab-pane>
          <el-tab-pane label="页面属性">
            <fieldProperty ref="fieldProperty" 
            :tableData="form.fields" 
            :dialogFull="dialogFull" 
            :isMenuShow="isMenuShow" 
            :isDataSourceShow="isDataSourceShow"
            :loading="loading"
            v-show="activeTab == '1'"
            />
          </el-tab-pane>
          <el-tab-pane label="按钮属性">
            <buttonProperty ref="buttonProperty" 
            :buttonData="form.buttons" 
            :dialogFull="dialogFull" 
            :isMenuShow="isMenuShow" 
            :isDataSourceShow="isDataSourceShow" 
            />
          </el-tab-pane>
        </el-tabs>
        <div class="add" v-if="activeTab == '0'">
          <el-button
            type="primary"
            size="mini"
            @click="selectAdd"
            >批量添加</el-button>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="type == 'create' ? submitDataScope() : menuModify()"
        >确 定</el-button
      >
      <el-button @click="openDataScope = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  menuCreate,
  menuDetail,
  menuModify,
  menuTree,
  
} from "@/api/system/menu";
import {listDatasource} from "@/api/system/datasource";
import {allListDbTable} from "@/api/system/datatable";
import {columnByTableName} from "@/api/system/column";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import fieldProperty from "./fieldProperty";
import buttonProperty from "./buttonProperty";
import dataProperty from "./dataProperty.vue";

export default {
  components: { Treeselect, IconSelect , fieldProperty , buttonProperty ,dataProperty },
  data() {
    return {
      loading: false,
      title: "新增菜单", 
      type: "add",
      dialogFull:false,
      id: "",
      openDataScope: false,
      menuOptions: [],
      isMenuShow:true,
      isDataSourceShow:false,
      allListDbTable:[],
      ListDbTable:"",
      datasource:"",
      columnByTableNameList:[],
      selectionList:[],
      list:[],
      form:{
        "bindTable": "string", 
        "buttons": [],
        "component": "",
        "createBy": "string",
        "dataPath": "string",
        "fields": [],
        "id": "",
        "isHide": 0,
        "isSystem": 0,
        "menuIcon": "",
        "menuName": "",
        "menuType": "",
        "menuUrl": "",
        "parentId": undefined,
        "parentName": "string",
        "seq": 0,
        "status": 0,
        "isAcl":0,
        "datasource":"",
        'isCache': 1
      },
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        menuUrl: [
          { required: true, message: "菜单地址不能为空", trigger: "blur" },
        ],
      },
      dataTypeData: [
        { code: "0", label: "表" },
        { code: "1", label: "视图" },
        { code: "2", label: "物化视图" },
        { code: "3", label: "函数" },
        { code: "4", label: "JSON" },
        { code: "5", label: "API" },
      ],
      datasourceList: [],
      sheetNameData: [
      ],
      editableTabs: [
        {
        title: '数据属性',
        name: '1',
        content: 'Tab 1 content'
      }, 
      {
        title: '页面属性',
        name: '2',
        content: 'Tab 2 content'
      }, {
        title: '按钮属性',
        name: '3',
        content: 'Tab 2 content'
       }, 
      ],
      activeTab:'1',
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },  
  watch:{
    'openDataScope':{
      handler:function(newOpenDataScope){
        if(!newOpenDataScope){
          Object.assign(this.$data, this.$options.data.call(this));
        }
      }
    }
  },
  methods: {
    dialogHeight(){
      let windowHeight = document.body.clientHeight&&document.documentElement.clientHeight;
      let dialogHeight = windowHeight-50
      return dialogHeight
    },
    // 选择图标
    selected(name) {
      this.form.menuIcon = name;
    },
    getMenuTree() {
      menuTree().then(({ data }) => {
        this.menuOptions = data;
      });
    },
    /** 提交按钮（数据权限） */
    init(type, id) {
      this.getMenuTree();
      this.type = type;
      this.id = id;
      this.openDataScope = true;
      this.$nextTick(() => {
        this.$refs.elForm.resetFields();
        if (type === "update") {
          this.title = "修改菜单";
          this.loading = true
          this.menuDetail(id);
          this.$refs.fieldProperty.commonTree()
        }
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    menuDetail(id) {
      this.loading = true
      menuDetail(id).then(({ data }) => {
        let {buttons} = data
        for (let i = 0; i < buttons.length; i++) {
          const element = buttons[i];
          if(element.buttonCode=='create' || element.buttonCode=='update' || element.buttonCode=='delete'){
            element.usuallyButton = element.buttonCode
          }
        }
        this.form = data;
        this.loading = false
        this.form.parentId = data.parentId || undefined;
      });
    },
    submitDataScope() {
      this.form.fields = this.$refs.fieldProperty.tableData;
      this.form.buttons = this.$refs.buttonProperty.buttonData;
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          menuCreate(this.form).then(({ message }) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit("menuSuccess");
          });
        }
      });
    },
    menuModify() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          menuModify(this.form).then(({ message }) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit("menuSuccess");
          });
        }
      });
    },
    handleClickAdd(e){
      let _this = this;
      switch(_this.activeTab){
        case "1":
					_this.$refs.fieldProperty.addPageProperty();
					break;
        case "2":
					_this.$refs.buttonProperty.addButtonProperty();
					break;
      }
    },
    selectAdd(){
      let selectionList = this.$refs.dataProperty.selectionList;
      if(selectionList.length>0){
        this.$refs.fieldProperty.addPageProperty(selectionList);
      }
    },
    showForm(res){
      switch(res){
        case 'menu':
          this.isMenuShow = !this.isMenuShow;
          break;
        case 'dataSource':
          this.isDataSourceShow = !this.isDataSourceShow;
          break;
      }
    },
    // 数据属性行操作添加
    handleAddField(item){
      this.$refs.fieldProperty.addPageProperty(item);
    },
    getDatasourceList() {
      listDatasource().then(({ data }) => {
        let list = data.list;
        let initArr = [{ id: "null", sourceName: "默认数据源" }];
        this.datasourceList = [ ...initArr , ...list]
      });
    },
    getallListDbTable(params) {
      allListDbTable(params).then(({ data }) => {
        this.allListDbTable = data;
      });
    },
    getColumnByTableName(params) {
      columnByTableName(params).then(({ data }) => {
        this.columnByTableNameList = data;
      });
    },
    changeDataSourceType(val){
      this.datasourceList = [];
      this.allListDbTable = [];
      this.columnByTableNameList = [];
      this.datasource = "";
      this.ListDbTable="";
      switch(val){
        case "0":
          this.getDatasourceList();
          break;
      }
    },
    changeDataSource(id){
      this.ListDbTable="";
      this.allListDbTable = [];
      this.columnByTableNameList = [];
      if(id==="null"){
        id = ""
      }
      this.getallListDbTable({id})
    },
    changeDbTable(val){
      var objVal= {};
      if(val){
        this.allListDbTable.forEach((ele)=>{
          if(ele.tableName == val){
            objVal=ele;
          }
        })
      }else{
        objVal= {
          id: "",
          sourceId: "",
          tableComment: "",
          tableName: "",
        };
      }
      this.getColumnByTableName(objVal)
    }
  },
};
</script>
<style lang="scss" scoped>
.dialog{
  ::v-deep.el-dialog{
    height: 730px;
  }
}
.contTitle{
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}
.el-icon-caret-right{
  color: #{'var(--theme)'};
}
::v-deep .container_table .el-input__inner{
  background: none;
  border: none;
}
.container_table2{
  ::v-deep.cell{
    overflow: unset;
  }
}
 .container_table2, .container_table3{
  ::v-deep tbody .el-table__cell{
    padding-top: 1px ;
    padding-bottom: 1px ;
  }
}
::v-deep .el-dialog__body{
  padding: 10px 20px;
}
::v-deep .el-tabs__new-tab{
  background: #{'var(--theme)'};
  border-color: #{'var(--theme)'};
  color: #ffffff;
}
.tableWrap{
  position: relative;
}
.add{
  position: absolute;
  right:0px;
  top:5px;
}
::v-deep .el-tabs__nav-wrap{
  position: unset;
}
::v-deep .avue-crud__dialog__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
::v-deep .avue-crud__dialog__menu {
  padding-right: 25px;
  float: left;
}
::v-deep .avue-crud__dialog__menu i {
  color: #909399;
  font-size: 15px;
}
</style>