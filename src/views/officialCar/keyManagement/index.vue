<template>
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h">
             <!--左侧树形布局-->
            <el-col :span="5" :xs="24" class="container_flex_overflow">
                <div class="head-title">
                    钥匙柜
                    <svg-icon icon-class="antOutline-plus" class="icon-svg" @click="handleKeyCabinetAdd()"></svg-icon>
                </div>
                <div class="head-container" v-loading='treeLoading'>
                    <div class="search-container">
                        <el-input clearable placeholder="搜索名称" v-model="filterText" size="small"></el-input>
                    </div>
                    <el-tree
                        class="drawer-tree"
                        ref="slotTree"
                        :data="treeOptions"
                        :indent="0"
                        node-key="id"
                        :props="defaultProps"
                        empty-text="暂无数据"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode">
                        <div class="el-tree-node__label show-hide" slot-scope="{ node, data }">
                             <!-- 编辑状态 -->
                            <template v-if="node.isEdit">
                                <el-input
                                    v-model="data.name"
                                    size="mini"
                                    :ref="'slotTreeInput' + data.id"
                                    maxlength="6"
                                    @blur.stop="handleInputBlurStop(node, data)"
                                    @keyup.enter.native="handleInputEnter(node, data)">
                                </el-input>
                            </template>
                            <template v-else>
                                <span>
                                    {{ node.label }}
                                    <i class="el-icon-help" v-if="data.boardClassify === '1'"></i>
                                </span>

                                <span class="el-tree-node__button">
                                    <i class="el-icon-edit" @click="handleTreeNodeEditClick(node,data)"></i>
                                    <i class="el-icon-delete" @click="handleTreeNodeDeleteClick(node,data)"></i>
                                </span>
                            </template>
                        </div>
                    </el-tree>
                </div>
            </el-col>
            <!--普通柜展示-->
            <span v-if="currentTreeData.boardClassify === '0'">
                <!--右侧列表内容布局-->
                <el-col :span="19" :xs="24" class="container_flex" style="padding:0" v-show="!isShowTable">
                  <el-row :gutter="24" class="container_flex-right_tree">
                    <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
                      <button-top
                        v-show="layoutType === 'list' || layoutType === 'empty'"
                        :item="item"
                        :multiple="multiple"
                        :single="single"
                        @newButton="newButton"
                        class="cume-button">
                      </button-top>
                    </el-col>
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="layoutType === 'table'">
                      <el-button  size="mini" class="custom_button" @click="handleCancelBindClick()" :disabled="selectionData.length!==1">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>解绑
                      </el-button>
                    </el-col>
                    <right-toolbar
                      ref="rightToolbar"
                      style="margin-top:4px;padding-right:20px"
                      :showSearch.sync="showSearch"
                      :columns="property.fields"
                      @queryTable="handleQuery"
                      @numberChange="numberChange"
                      @handleCheckAllChange="handleCheckAllChange"
                      @clickReset="clickReset">
                    </right-toolbar>
                  </el-row>
                  <form-data
                    :dateMultiple="true"
                    :formDta="formData"
                    :showSearch="showSearch"
                    :searchArr="property.search || []"
                    @handleQuery="handleQuery"
                    style="margin-top:-12px;margin-bottom:6px">
                  </form-data>
                  <table-index
                    ref="tableIndex"
                    style="margin-top:-8px"
                    :tableIndexs="tableIndex"
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    :numberShow="numberShow"
                    @handleSelectionChange="handleSelectionChange"
                    @handleButton="handleButton"
                    @selectChange="selectChange"
                    @emitAblFilter="emitAblFilter">
                  </table-index>
                  <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList"
                    style="margin-bottom:40px"/>
                </el-col>
                <!--右侧表格内容布局-->
                <el-col :span="19" :xs="24" class="container_flex" style="padding:0" v-show="isShowTable">
                  <el-row :gutter="24" class="container_flex-right_tree">
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;">
                      <el-button  size="mini" class="custom_button" @click="handleGenerateTableClick()">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>生成
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form ref="elFormTable" :inline="true" :model="formTable" style="margin-top:-5px;margin-left:10px">
                      <div class='row-container'>
                        <el-form-item label="层数" class="table-form-item">
                          <el-input v-model="formTable.rowNumber" @input="numberInput($event,'rowNumber')" size="mini" maxlength="2" />
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.rowLanguage" size="mini">
                            <el-option v-for="(item,index) in languageOptionsPlain" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.rowSort" size="mini">
                            <el-option v-for="(item,index) in sortOptionsPlain" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class='column-container'>
                        <el-form-item label="列数" class="table-form-item column-begin">
                          <el-input v-model="formTable.columnNumber" @input="numberInput($event,'columnNumber')" size="mini" maxlength="2" />
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.columnLanguage" size="mini">
                            <el-option v-for="(item,index) in languageOptionsPlain" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.columnSort" size="mini">
                            <el-option v-for="(item,index) in sortOptionsPlain" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-row>
                  <div class="table-wapper">
                    <table class="table-container" border='1' bordercolor="#eaeef5" cellspacing="0" v-if="keyPositionData.length" ref="table">
                      <tr v-for="(item, index) in keyPositionData" :key="index">
                        <td v-for="(childItem, childIndex) in item" :key="childIndex" class="table-td" @dblclick="handleDbClick(index,childIndex,childItem)">
                          <p class="table-item-top">{{childItem.position}}</p>
                          <p :class="[childItem.carNumber ==='双击绑定车辆'?'' : 'table-item-bottom-bind','table-item-bottom']">{{childItem.carNumber}}</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </el-col>
                <div class="content-change-control">
                    <i :class="[isShowTable?'' : 'content-change-control-select','el-icon-s-operation']" @click="handleCheckList()"></i>
                    <i :class="[isShowTable?'content-change-control-select' : '','el-icon-film']" @click="handleCheckTable()"></i>
                </div>
            </span>
            <!--智能柜展示-->
            <span v-else>
                <!--右侧列表内容布局-->
                <el-col :span="19" :xs="24" class="container_flex" style="padding:0" v-show="!isShowTable">
                  <el-row :gutter="24" class="container_flex-right_tree">
                    <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
                      <button-top
                        v-show="layoutType === 'list' || layoutType === 'empty'"
                        :item="item"
                        :multiple="multiple"
                        :single="single"
                        @newButton="newButton"
                        class="cume-button">
                      </button-top>
                    </el-col>
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="layoutType === 'table'">
                      <el-button  size="mini" class="custom_button" @click="handleCancelBindClick()" :disabled="selectionData.length!==1">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>解绑
                      </el-button>
                    </el-col>
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="layoutType === 'table'">
                      <el-button  size="mini" class="custom_button" @click="getKeyDialog = true" :disabled="selectionData.length!==1">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>开门
                      </el-button>
                    </el-col>
                    <!--                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="layoutType === 'table'">-->
                    <!--                      <el-button  size="mini" class="custom_button" @click="handleSetLcdClick()" :disabled="selectionData.length===0">-->
                    <!--                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>设置屏显-->
                    <!--                      </el-button>-->
                    <!--                    </el-col>-->
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="layoutType === 'table'">
                      <el-button  size="mini" class="custom_button" @click="handleSyncKyeStateClick()" :disabled="selectionData.length===0">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>同步状态
                      </el-button>
                    </el-col>
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;" v-show="this.formData.boardClassify === '1'">
                      <el-button  size="mini" class="custom_button" @click="setSeatNoDialog = true">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>设置编号
                      </el-button>
                    </el-col>
                    <right-toolbar
                      ref="rightToolbar"
                      style="margin-top:4px;padding-right:20px"
                      :showSearch.sync="showSearch"
                      :columns="property.fields"
                      @queryTable="handleQuery"
                      @numberChange="numberChange"
                      @handleCheckAllChange="handleCheckAllChange"
                      @clickReset="clickReset">
                    </right-toolbar>
                  </el-row>
                  <form-data
                    :dateMultiple="true"
                    :formDta="formData"
                    :showSearch="showSearch"
                    :searchArr="property.search || []"
                    @handleQuery="handleQuery"
                    style="margin-top:-12px;margin-bottom:6px">
                  </form-data>
                  <table-index
                    ref="tableIndex"
                    style="margin-top:-8px"
                    :tableIndexs="tableIndex"
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    :numberShow="numberShow"
                    @handleSelectionChange="handleSelectionChange"
                    @handleButton="handleButton"
                    @selectChange="selectChange"
                    @emitAblFilter="emitAblFilter">
                  </table-index>
                  <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList"
                    style="margin-bottom:40px"/>
                </el-col>
                <!--右侧表格内容布局-->
                <el-col :span="19" :xs="24" class="container_flex" style="padding:0" v-show="isShowTable">
                  <el-row :gutter="24" class="container_flex-right_tree">
                    <el-col :span="1.5" style="margin-top:2px;margin-bottom:5px;padding:0px;">
                      <el-button  size="mini" class="custom_button" @click="handleGenerateTableClick()">
                        <svg-icon icon-class="switch-button" class="svg-button-icon"></svg-icon>生成
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-form ref="elFormTable" :inline="true" :model="formTable" style="margin-top:-5px;margin-left:10px">
                      <div class='row-container'>
                        <el-form-item label="起始数" class="table-form-item">
                          <el-input v-model="formTable.startNumber" @input="numberInput($event,'startNumber')" size="mini" maxlength="3" />
                        </el-form-item>
                        <el-form-item label="层数" class="table-form-item">
                          <el-input v-model="formTable.rowNumber" @input="numberInput($event,'rowNumber')" size="mini" maxlength="2" />
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.rowLanguage" size="mini">
                            <el-option v-for="(item,index) in languageOptions" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.rowSort" size="mini">
                            <el-option v-for="(item,index) in sortOptions" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                      <div class='column-container'>
                        <el-form-item label="列数" class="table-form-item column-begin">
                          <el-input v-model="formTable.columnNumber" @input="numberInput($event,'columnNumber')" size="mini" maxlength="2" />
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.columnLanguage" size="mini">
                            <el-option v-for="(item,index) in languageOptions" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item class="table-form-item-select" label-width="0">
                          <el-select v-model="formTable.columnSort" size="mini">
                            <el-option v-for="(item,index) in sortOptions" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="排列" style="margin-left: 40px;">
                          <el-select v-model="formTable.arrange" class="table-form-item-select" size="mini">
                            <el-option v-for="(item,index) in arrangeOptions" :key="index"
                                       :label="item.value"
                                       :value="item.code" >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-form>
                  </el-row>
                  <div class="table-wapper">
                    <table class="table-container" border='1' bordercolor="#eaeef5" cellspacing="0" v-if="keyPositionData.length" ref="table">
                      <tr v-for="(item, index) in keyPositionData" :key="index">
                        <td v-for="(childItem, childIndex) in item" :key="childIndex" class="table-td" @dblclick="handleDbClick(index,childIndex,childItem)">
                          <p class="table-item-top">{{childItem.position}}</p>
                          <p :class="[childItem.carNumber ==='双击绑定车辆'?'' : 'table-item-bottom-bind','table-item-bottom']">{{childItem.carNumber}}</p>
                        </td>
                      </tr>
                    </table>
                  </div>
                </el-col>
                <div class="content-change-control">
                    <i :class="[isShowTable?'' : 'content-change-control-select','el-icon-s-operation']" @click="handleCheckList()"></i>
                    <i :class="[isShowTable?'content-change-control-select' : '','el-icon-film']" @click="handleCheckTable()"></i>
                </div>
            </span>
        </el-row>
        <!--钥匙柜创建弹框-->
        <add-key-cabinet ref="addKeyCabinet" @addKeyCabinetSuccess="addKeyCabinetSuccess"></add-key-cabinet>
        <!--列表新建钥匙位弹框-->
        <list-add-key-position ref="listAddKeyPosition" @listAddKeyPositionSuccess="listAddKeyPositionSuccess"></list-add-key-position>
        <!--表格绑定车辆弹框-->
        <table-bind-car ref="tableBindCar" @tableBindCarSuccess="tableBindCarSuccess"></table-bind-car>
        <!--取/还钥匙弹框-->
        <el-dialog :close-on-click-modal="false" title="取/还钥匙" :visible.sync="getKeyDialog" width="600px" append-to-body center>
          <el-form :model="getKeyForm" :rules="getKeyRules" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
              <el-form-item label="类型" prop="keyType">
                <el-radio-group v-model="getKeyForm.keyType">
                  <el-radio :label="1">取钥匙</el-radio>
                  <el-radio :label="2">还钥匙</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row :span="24" :gutter="20">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="getKeyForm.remark"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleGetKeyClickSure">确定</el-button>
            <el-button @click="handleCancelGetKey">取消</el-button>
          </div>
        </el-dialog>
        <!-- 设置设备钥匙卡扣的编号 -->
        <el-dialog :close-on-click-modal="false" title="设置设备钥匙卡扣编号" :visible.sync="setSeatNoDialog" width="600px" append-to-body center>
          <el-form :model="setSeatNoForm" :rules="setSeatNoRules" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
              <el-form-item label="新编号" prop="newNo">
                <el-input v-model="setSeatNoForm.newNo"></el-input>
                <span style="color: red">确定之后，请在10秒之内选择设备按下按钮</span>
              </el-form-item>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSetSeatNoClickSure">确定</el-button>
            <el-button @click="handleCancelSetSeatNo">取消</el-button>
          </div>
        </el-dialog>
        <!--智能钥匙柜修改弹框-->
        <el-dialog :close-on-click-modal="false" title="修改智能柜" :visible.sync="editBoardDialog" width="600px" append-to-body center>
          <el-form :model="editBoardForm" :rules="editBoardFormRules" ref="editBoardForm" label-width="110px" v-loading="loading">
            <el-row :span="24" :gutter="20">
              <el-col :span="24">
                <el-form-item label="智能柜名称：" prop="name">
                  <el-input v-model="editBoardForm.name" maxlength="6"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="智能柜版本：" prop="boardVersion">
                  <el-input v-model="editBoardForm.boardVersion" maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="智能柜地址：" prop="boardAddress">
                  <el-input v-model="editBoardForm.boardAddress" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleEditBoardConfirm">确定</el-button>
            <el-button @click="editBoardDialog = false">取消</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
  import buttonTop from "@/components/buttonTop"
  import formData from "@/components/formData"
  import tableIndex from "@/components/tableIndex"
  import addKeyCabinet from './components/addKeyCabinet'
  import listAddKeyPosition from "./components/listAddKeyPosition"
  import tableBindCar from "./components/tableBindCar"
  import indexMixin from "@/views/mixins"
  import {numberInput} from '@/utils/index';
  import {
    gcywCarkeySeatDelete,
    gcywCarkeySeatDeleteAll,
    gcywCarkeySeatList,
    gcywCarkeySeatUpdate2,
    gcywOpenBoardAndKey,
    gcywSetLcdAll,
    gcywSetSeatNo,
    gcywSyncKyeState,
    gwycCarkeyBoardList,
    gwycCarkeyBoardTree,
    gwycCarkeyBoardUpdate,
  } from "@/api/keyManagement"

  export default {
    name:"keyManagement",
    mixins:[indexMixin],
    components:{buttonTop,formData,tableIndex,addKeyCabinet,listAddKeyPosition,tableBindCar,},

    data() {
        return {
            //设备设置编号弹窗
            setSeatNoDialog: false,
            setSeatNoForm:{
              newNo: "",
            },
            //表单校验
            setSeatNoRules: {
              newNo: [
                {required: true, message: "新编号不能为空", trigger: "blur"}
              ],
            },
            //取钥匙弹窗
            getKeyDialog: false,
            getKeyForm:{
              keyType: 1,
              remark: "",
            },
            //表单校验
            getKeyRules: {
              keyType: [
                {required: true, message: "请选择类型", trigger: "blur"}
              ],
            },
            numberShow: false,
            //输入框数字限制
            numberInput: numberInput,
            //左侧树遮罩层
            treeLoading: false,
            //左侧部门搜索文字
            filterText: "",
            //左侧树形数据
            treeOptions: [],
            //树形控件配置
            defaultProps: {
                children: "children",
                label: "name",
            },
            //表格布局是否显示
            isShowTable:false,
            //右侧内容布局类型
            layoutType:'',
            //节点编辑前原始数据
            originalData:undefined,
            //遮罩层
            loading:false,
            //非单个禁用
            single:true,
            //非多个禁用
            multiple:true,
            //显示搜索条件
            showSearch:true,
            //表格数据
            dataList:[],
            //日期范围
            dateRange:[],
            //列表显示字段
            property:{},
            //查询参数
            formData:{
                areaId:'',
                areaName:'',
                boardId:'',
                boardName:'',
            },
            //已选中条目
            selectionData:[],
            //已选中条目的id
            ids:[],
            //数据总数
            total:0,
            //表格生成参数
            formTable:{
                startNumber:'1',
                rowNumber:'6',
                rowLanguage:'1',
                rowSort:'0',
                columnNumber:'10',
                columnLanguage:'1',
                columnSort:'0',
                arrange:'0',
            },
            languageOptionsPlain:[
              {
                  code:'0',
                  value:'字母',
              },
              {
                  code:'1',
                  value:'数字',
              }
            ],
            sortOptionsPlain:[
              {
                  code:'0',
                  value:'正序',
              },
              {
                  code:'1',
                  value:'倒序',
              }
            ],
            languageOptions:[
                {
                    code:'1',
                    value:'数字',
                }
            ],
            sortOptions:[
                {
                    code:'0',
                    value:'正序',
                },
            ],
            arrangeOptions:[
              {
                code:'0',
                value:'横向',
              },
              {
                code:'1',
                value:'纵向',
              },
            ],
            //表格数据
            keyPositionData:[],
            //字母
            letters:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            //当前选中表格父级角标
            parentIndex:'',
            //当前选中表格子级角标
            childIndex:'',
            //当前选中节点对象
            currentTreeData:{},
            // 列表全部字段
            fields: [],
            // 修改智能柜弹窗
            editBoardDialog: false,
            editBoardForm: {},
            editBoardFormRules: {
                name:[
                    {required:true,message:"名称不能为空!",trigger:"change"}
                ],
                boardVersion:[
                    {required:true,message:"智能柜版本不能为空!",trigger:"change"}
                ],
                boardAddress:[
                    {required:true,message:"智能柜地址不能为空!",trigger:"change"}
                ],
            },
        }
    },
    created(){
        this.menuProperty();
        this.getTreeOptions();
        this.getList();
    },
    methods:{
        numberChange(val) {
            this.numberShow = val
        },
        //获取菜单数据
        menuProperty(){
            let id = this.$route.meta.id;
            this.$store.dispatch('menuProperty', id).then( (data) => {
                data.search.forEach((item) => {
                    item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
                })
                this.property = data;
                this.fields = this.property.fields
            });
        },
        //获取分页数据
        async getList(type){
            this.loading = true;

            let hide = ['boxNo', 'keyState']
            await gcywCarkeySeatList(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;

                // 普通柜展示列
                if (this.currentTreeData.boardClassify === '0') {
                    let fields = []
                    this.property.fields.forEach((item) => {
                        if (!hide.includes(item.fieldCode)) {
                            fields.push(item)
                        }
                    })
                    this.property.fields = fields
                } else {
                    this.property.fields = this.fields
                }
                this.getTableDate(type);
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取表格布局数据
        getTableDate(type){
            this.loading = true;

            let params = {
                id:this.currentTreeData.id,
            }
            gwycCarkeyBoardList(params).then(({data}) => {
                this.loading = false;

                this.checkLayoutType(data[0],type);
            }).catch((err) => {
                this.loading = false;
            })
        },
        //判断页面可显示布局
        checkLayoutType(treeData,type){
            if(!this.currentTreeData.id){
                this.layoutType = 'area';
                return;
            }
            if(treeData.classify === '0'){
                this.layoutType = 'area';
            }
            if(treeData.classify === '1'){
                if(treeData.boardPoint === 'NONE' && this.dataList.length === 0){
                    this.layoutType = 'empty'

                    if(!type){      //表格重新生成删除所有数据，不需要初始化
                        this.formTable.startNumber = '1';
                        this.formTable.rowNumber = '6';
                        this.currentTreeData.boardClassify === '0' ? this.formTable.rowLanguage = '0' : this.formTable.rowLanguage = '1';
                        this.formTable.rowSort = '0';
                        this.formTable.columnNumber = '10';
                        this.formTable.columnLanguage = '1';
                        this.formTable.columnSort = '0';
                        this.keyPositionData = [];
                    }
                }
                if(treeData.boardPoint === 'NONE' && this.dataList.length !== 0){
                    this.layoutType = 'list'
                }
                if(treeData.boardPoint === 'DIFF' && this.dataList.length !== 0){
                    this.layoutType = 'list'
                }
                if(treeData.boardPoint !== 'NONE' && treeData.boardPoint !== 'DIFF'){
                    this.layoutType = 'table';

                    let tableLayout = JSON.parse(treeData.boardPoint);
                    let screenParams = JSON.parse(tableLayout.screenParams);
                    let tableParams = JSON.parse(tableLayout.tableParams);

                    this.formTable.startNumber = screenParams.startNumber;
                    this.formTable.rowNumber = screenParams.rowNumber;
                    this.formTable.rowLanguage = screenParams.rowLanguage;
                    this.formTable.rowSort = screenParams.rowSort;
                    this.formTable.columnNumber = screenParams.columnNumber;
                    this.formTable.columnLanguage = screenParams.columnLanguage;
                    this.formTable.columnSort = screenParams.columnSort;
                    this.keyPositionData = tableParams;
                }
            }
        },
        //获取左侧树形数据
        async getTreeOptions() {
            await gwycCarkeyBoardTree().then(({ data }) => {
                this.treeOptions = data;
            });
        },
        //钥匙柜添加
        handleKeyCabinetAdd(){
            this.$refs.addKeyCabinet.init();
        },
        //钥匙柜添加成功回调
        addKeyCabinetSuccess(){
            this.getTreeOptions();
        },
        //树形点击节点回调
        handleNodeClick(data, node, obj) {
            this.currentTreeData = data;
            this.isShowTable = false;

            if(data.classify === '0'){  //场地
                this.formData.areaId = data.id;
                this.formData.areaName = '';
                this.formData.boardId = '';
                this.formData.boardName = '';
                this.formData.name = '';
            }else {
                this.formData.areaId = data.areaId;
                this.formData.areaName = data.areaName;
                this.formData.boardId = data.id;
                this.formData.boardName = data.name;
                this.formData.name = '';
                this.formData.boardClassify = data.boardClassify;
                this.formData.boardAddress = data.boardAddress;
            }
            this.getList();
        },
        //树形节点编辑点击
        handleTreeNodeEditClick(node, data){
            if (data.boardClassify === '1') {
                this.editBoardDialog = true
                this.editBoardForm = Object.assign({}, data);
                return
            }
            //保存原始数据
            this.originalData = Object.assign({}, data);
            //显示输出框
            if (!node.isEdit) {
                this.$set(node, "isEdit", true);
            }
            // 输入框聚焦
            this.$nextTick(() => {
                if (this.$refs["slotTreeInput" + data.id]) {
                    this.$refs["slotTreeInput" + data.id].$refs.input.focus();
                }
            });
        },
        //树形节点编辑失去焦点
        handleInputBlurStop(node, data){
            if(!!this.originalData){
                data.name = this.originalData.name;
            }
            if (node.isEdit) {
                this.$set(node, "isEdit", false);
            }
        },
        //树形节点编辑点击回车确定
        handleInputEnter(node, data) {
            if(!data.name){
                data.name = this.originalData.name;
            }else {
                this.originalData = undefined;
            }
            this.treeLoading = true;

            let params = {
                id:data.id,
                name:data.name,
            }
            gwycCarkeyBoardUpdate(params).then((res) => {
                this.treeLoading = false;

                // 退出编辑状态
                if (node.isEdit) {
                    this.$set(node, "isEdit", false);
                }
                this.getList();
            }).catch((err) => {
                this.treeLoading = false;
            })
        },
        //树形节点删除点击
        handleTreeNodeDeleteClick(node,data){
            if(data.classify === '0'){
                this.$modal.confirm('是否删除当前场地?').then(() => {
                    this.loading = true;

                    let params = {
                        areaId:data.id,
                        isDelete:'1',
                    }
                    gwycCarkeyBoardUpdate(params).then((res) => {
                        this.loading = false;
                        this.getTreeOptions();
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch(() => {

                });
            }else{
                this.$modal.confirm('是否删除当前钥匙柜?').then(() => {
                    this.loading = true;

                    let params = {
                        id:data.id,
                        isDelete:'1',
                    }
                    gwycCarkeyBoardUpdate(params).then((res) => {
                        this.loading = false;
                        this.getTreeOptions();
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch(() => {

                });
            }
        },
        //跳转列表布局
        handleCheckList(){
            this.isShowTable = false;
        },
        //跳转表格布局
        handleCheckTable(){
            if(this.layoutType ==='empty' || this.layoutType === 'table'){
                this.isShowTable = true;
            }else{
                this.$modal.msgWarning('当前钥匙柜只能查看列表样式数据!');
            }
        },
        //搜索检查
        filterNode(val, data) {
            if (!val) return true;
            //data.属性必须对应defaultProps中label属性
            return data.name.indexOf(val) !== -1;
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            this.$refs.tableIndex.newButton(buttonCode,row);
        },
        //页面按钮点击事件
        handleButton(ids,buttonCode,row){
            if(buttonCode === 'create'){
                if(!this.formData.boardId){
                    this.$modal.msgWarning('请先选择钥匙柜!')
                    return
                }
                this.$refs.listAddKeyPosition.init('0',this.formData);
            }else if(buttonCode === 'update'){
                this.$refs.listAddKeyPosition.init('1',this.selectionData[0])
            }else if(buttonCode === 'delete'){
                this.$modal.confirm('是否删除当前钥匙位?').then(() => {
                    this.loading = true;

                    let params = {
                        id:this.selectionData[0].id,
                        boardId:this.selectionData[0].boardId,
                    }
                    gcywCarkeySeatDelete(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message)
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch(() => {

                });
            }
        },
        //表格生成按钮
        handleGenerateTableClick(){
            if(!this.formData.boardId){
                this.$modal.msgWarning('请先选择钥匙柜!')
                return
            }
            if(this.keyPositionData.length !== 0){
                this.$modal.confirm('重新生成表格将会清空所有已绑定数据，是否生成?').then(() => {

                    this.loading = true;

                    let params = {
                        boardId:this.formData.boardId,
                    }
                    gcywCarkeySeatDeleteAll(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message)

                        this.getList('deleteAll');
                        this.currentTreeData.boardClassify === '0' ? this.generateTable() : this.generateTable2();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch(() => {

                });
            }else {
                this.currentTreeData.boardClassify === '0' ? this.generateTable() : this.generateTable2();
            }
        },
        //生成表格
        generateTable(){
            if(!this.formTable.rowNumber || this.formTable.rowNumber === '0'){
                this.$modal.msgWarning('层数不能为0或者空，请重新输入!');
                return
            }
            if(!this.formTable.columnNumber || this.formTable.columnNumber === '0'){
                this.$modal.msgWarning('列数不能为0或者空，请重新输入!');
                return
            }
            if(this.formTable.rowNumber > 26 || this.formTable.columnNumber > 26){
                this.$modal.msgWarning('层数或列数不能大于26，请重新输入!');
                return
            }
            if(this.formTable.rowLanguage === this.formTable.columnLanguage){
                this.$modal.msgWarning('层数和列数不能同时选择字母或数字，请重新选择!');
                return
            }
            let rows = this.formTable.rowNumber * 1;
            let cols = this.formTable.columnNumber * 1;
            let arr = []

            let AescTempLetters = [];
            let DescTempLetters = [];

            if(this.formTable.rowLanguage === '0'){
                AescTempLetters = this.letters.slice(0, rows);
                DescTempLetters = this.letters.slice(0, rows).reverse();
            }else{
                AescTempLetters = this.letters.slice(0, cols);
                DescTempLetters = this.letters.slice(0, cols).reverse();
            }

            for (let i = 0; i < rows; i++) {
                arr[i] = []
                for (let j = 0; j < cols; j++) {
                    //层：字母 正序   列：数字 正序
                    if(this.formTable.rowLanguage === '0' && this.formTable.columnLanguage == '1'
                        && this.formTable.rowSort === '0' && this.formTable.columnSort === '0'){
                        arr[i][j] = {
                            position: AescTempLetters[i] + j,
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                    //层：字母 倒序   列：数字 正序
                    if(this.formTable.rowLanguage === '0' && this.formTable.columnLanguage == '1'
                        && this.formTable.rowSort === '1' && this.formTable.columnSort === '0'){
                        arr[i][j] = {
                            position: DescTempLetters[i] + j,
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                    //层：字母 正序  列：数字 倒序
                    if(this.formTable.rowLanguage === '0' && this.formTable.columnLanguage == '1'
                        && this.formTable.rowSort === '0' && this.formTable.columnSort === '1'){
                        arr[i][j] = {
                            position: AescTempLetters[i] + (cols-j-1),
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                     //层：字母 倒序  列：数字 倒序
                    if(this.formTable.rowLanguage === '0' && this.formTable.columnLanguage == '1'
                        && this.formTable.rowSort === '1' && this.formTable.columnSort === '1'){
                        arr[i][j] = {
                            position: DescTempLetters[i] + (cols-j-1),
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                    //层：数字 正序 列：字母 正序
                    if(this.formTable.rowLanguage === '1' && this.formTable.columnLanguage == '0'
                        && this.formTable.rowSort === '0' && this.formTable.columnSort === '0'){
                        arr[i][j] = {
                            position: i + AescTempLetters[j],
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                     //层：数字 倒序 列：字母 正序
                    if(this.formTable.rowLanguage === '1' && this.formTable.columnLanguage == '0'
                        && this.formTable.rowSort === '1' && this.formTable.columnSort === '0'){
                        arr[i][j] = {
                            position: (rows-i-1) + AescTempLetters[j],
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                    //层：数字 正序 列：字母 倒序
                    if(this.formTable.rowLanguage === '1' && this.formTable.columnLanguage == '0'
                        && this.formTable.rowSort === '0' && this.formTable.columnSort === '1'){
                        arr[i][j] = {
                            position: i + DescTempLetters[j],
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                     //层：数字 倒序 列：字母 倒序
                    if(this.formTable.rowLanguage === '1' && this.formTable.columnLanguage == '0'
                        && this.formTable.rowSort === '1' && this.formTable.columnSort === '1'){
                        arr[i][j] = {
                            position: (rows-i-1) + DescTempLetters[j],
                            carNumber: '双击绑定车辆',
                            vinNumber:'',
                        }
                    }
                }
            }
            this.keyPositionData = arr;
        },
        //生成表格2
        generateTable2(){
          if(!this.formTable.rowNumber || this.formTable.rowNumber === '0'){
            this.$modal.msgWarning('层数不能为0或者空，请重新输入!');
            return
          }
          if(!this.formTable.columnNumber || this.formTable.columnNumber === '0'){
            this.$modal.msgWarning('列数不能为0或者空，请重新输入!');
            return
          }
          if(this.formTable.rowNumber > 26 || this.formTable.columnNumber > 26){
            this.$modal.msgWarning('层数或列数不能大于26，请重新输入!');
            return
          }
          let rows = this.formTable.rowNumber * 1;
          let cols = this.formTable.columnNumber * 1;
          let arr = []
          let num = this.formTable.startNumber * 1;
          let strNum = ''
          // 横向
          if (this.formTable.arrange === '0') {
            for (let i = 0; i < rows; i++) {
              arr[i] = []
              for (let j = 0; j < cols; j++) {
                if(num < 10){
                  strNum = '0' + num
                } else {
                  strNum = num
                }
                arr[i][j] = {
                  position: strNum,
                  carNumber: '双击绑定车辆',
                  vinNumber: '',
                  boxNo: '',
                }
                num++
              }
            }
          } else { // 纵向
            for (let i = 0; i < rows; i++) {
              arr[i] = []
              for (let j = 0; j < cols; j++) {
                if(j * rows + i + num < 10){
                  strNum = '0' + (j * rows + i + num)
                } else {
                  strNum = j * rows + i + num
                }
                arr[i][j] = {
                  position: strNum,
                  carNumber: '双击绑定车辆',
                  vinNumber: '',
                  boxNo: '',
                }
              }
            }
          }
          this.keyPositionData = arr
        },
        //表格双击绑定
        handleDbClick(index,childIndex,childItem){
            this.parentIndex = index;
            this.childIndex = childIndex;
            this.$refs.tableBindCar.init(
                index,
                childIndex,
                childItem,
                this.formTable,
                this.keyPositionData,
                this.formData.areaId,
                this.formData.boardId,
                this.currentTreeData.boardClassify,
                this.currentTreeData.boardAddress);
        },
        //表格绑定车辆成功回调
        tableBindCarSuccess(type){
            if(type === 'success'){
                this.getList();
            }else{
                if(this.dataList.length !== 0 ){
                    this.getList();
                }
            }
        },
        //表格单个解绑
        handleCancelBindClick(){
            this.$modal.confirm('是否取消绑定当前钥匙位?').then(() => {
                if(this.dataList.length === 1){
                    this.loading = true;

                    let params = {
                        boardId:this.selectionData[0].boardId,
                    }
                    gcywCarkeySeatDeleteAll(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message)

                        this.getList('deleteAll');
                        this.currentTreeData.boardClassify === '0' ? this.generateTable() : this.generateTable2();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }else{
                    for (let i = 0; i < this.keyPositionData.length; i++) {
                        let arr = this.keyPositionData[i];

                        for (let j = 0; j < arr.length; j++) {
                            if(arr[j].position === this.selectionData[0].name){
                                arr[j].carNumber = "双击绑定车辆";
                                arr[j].vinNumber = ''
                            }
                        }
                    }
                    let tableLayout = {
                        screenParams:JSON.stringify(this.formTable),
                        tableParams:JSON.stringify(this.keyPositionData),
                    }
                    let params = {
                        boardId:this.selectionData[0].boardId,
                        name:this.selectionData[0].name,
                        isDelete:'1',
                        boardPoint:JSON.stringify(tableLayout),
                    }
                    gcywCarkeySeatUpdate2(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message)
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                        this.getList();
                    })
                }
            }).catch(() => {

            });
        },
        // 存/取钥匙
        handleGetKeyClickSure(){
          if(this.selectionData.length === 1){
            this.loading = true;
            let params = {
              boxNo:this.selectionData[0].boxNo,
              seatName:this.selectionData[0].name,
              carNumber:this.selectionData[0].carNumber,
              vinNumber:this.selectionData[0].vinNumber,
              id:this.selectionData[0].id,
              keyType:this.getKeyForm.keyType,
              remark:this.getKeyForm.remark,
              boardAddress:this.selectionData[0].boardAddress,
            }
            gcywOpenBoardAndKey(params).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message)
              this.handleCancelGetKey()
              setTimeout(() => {
                this.getList();
              }, 10000);
            }).catch((err) => {
              this.loading = false;
            })
          }
        },
        handleCancelGetKey(){
          this.getKeyDialog = false
          this.getKeyForm = {
            keyType: 1,
            remark: "",
          }
        },
        // 设置屏显
        handleSetLcdClick(){
          if(this.selectionData.length !== 0){
            this.loading = true;
            gcywSetLcdAll(this.selectionData).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message)
            }).catch((err) => {
              this.loading = false;
            })
          }
        },
        // 同步钥匙位上钥匙存取状态
        handleSyncKyeStateClick(){
          if(this.selectionData.length !== 0){
            this.loading = true;
            gcywSyncKyeState(this.selectionData).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message)
              this.getList();
            }).catch((err) => {
              this.loading = false;
            })
          }
        },
        // 设置设备钥匙卡扣的编号
        handleSetSeatNoClickSure(){
          this.loading = true;
          gcywSetSeatNo(this.setSeatNoForm).then(({message}) => {
            this.loading = false;
            this.$modal.msgSuccess(message)
            this.handleCancelSetSeatNo()
          }).catch((err) => {
            this.loading = false;
          })
        },
        handleCancelSetSeatNo(){
          this.setSeatNoDialog = false
          this.setSeatNoForm = {
            newNo: "",
          }
        },
        //顶部列字段展示
        handleCheckAllChange(columns){
            this.$refs.tableIndex.init(columns);
        },
        //顶部重置按钮
        clickReset(){
            this.menuProperty();
            this.handleQuery();
        },
        //表格内部搜索条件回调
        selectChange(row){
            let {formData, isWatch} = row;
            if(!isWatch){
                this.handleQuery(formData);
            }else{
                this.formData = Object.assign({}, this.formData, formData);
            }
        },
        //表格内部排序
        emitAblFilter(){
            this.getList();
        },
        //多选获取行数据
        handleSelectionChange(ids,single,multiple,selection){
            this.single = single;
            this.multiple = multiple;
            this.selectionData = selection;
        },
        //列表新建钥匙位回调
        listAddKeyPositionSuccess(){
            this.handleQuery();
        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        tableRowClassName({row,rowIndex}){
            row.index = rowIndex + 1;
        },
        // 钥匙柜修改
        handleEditBoardConfirm() {
            this.loading = true;
            gwycCarkeyBoardUpdate(this.editBoardForm).then((res) => {
                this.loading = false;
                this.editBoardDialog = false;
                this.getTreeOptions();
            }).catch((err) => {
              this.loading = false;
            })
        }
    },
    watch: {
        //左侧树形搜索栏监听
        filterText(val) {
            this.$refs.slotTree.filter(val);
        },
    },

}
</script>

<style lang="scss" scoped>
.app-container_list {
    .head-title {
        text-align: center;
        line-height: 37px;
        font-size: 14px;
        position: relative;

        .icon-svg {
            color: #66b1ff;
            position: absolute;
            right: 0;
            top:10px
        }
        .icon-svg:hover {
            cursor: pointer;
        }
    }
    .search-container {
        width: 100%;
        box-sizing: border-box;
        padding-left: 10px;
    }
    .el-tree-node__label {
        width: 100% !important;
    }
    .show-hide:hover :nth-child(2) {
        display: inline-block !important;
    }
    .el-icon-help {
        color: #66b1ff;
        margin-left: 5px;
    }
    .el-tree-node__button {
        display: none;
        position: absolute;
        right: 10px;
        top: 10px;

        .el-icon-edit {
            color: #66b1ff;
            margin-right: 5px;
        }
        .el-icon-delete {
            color: red;
        }
    }
    .content-change-control {
        position: absolute;
        right: 15px;
        top: 35px;
        font-size: 20px;
        color: #6e7388;
        cursor: pointer;

        .content-change-control-select {
            color: #66b1ff;
        }
        .el-icon-s-operation {
            margin-right: 5px;
        }
    }
    .custom_button {
        border: none;
        background: none ;
        font-size: 12px;
        color: #000000;
    }
    .custom_button:hover{
        color: #000000;
        border-color: #b3d8ff !important;
        background: #ECF5FF !important;
    }
    .svg-button-icon {
        color: #66b1ff;
    }
    .row-container {
        display: inline-block;
    }
    .column-container {
        margin-left: 40px;
        display: inline-block;
    }

    .table-form-item {
        width: 125px;

        ::v-deep .el-form-item__content {
            width: 70px;
        }
    }
    .table-form-item-select {
        width: 75px;
    }
    .table-wapper {
        width: 100%;
        height: 100%;
        overflow: auto;
        margin: 0 0 10px 10px;

        .table-container {

            .table-td {
                width: 70px;
                height: 70px;
                padding: 0px 8px;
            }
            .table-item-top {
                text-align: center;
                font-size: 12px;
            }
            .table-item-bottom {
                color: #C0C4CC;
                text-align: center;
                font-size: 12px;
                overflow: hidden;
                white-space:nowrap;
                text-overflow: ellipsis;
            }
            .table-item-bottom-bind {
                color: #66b1ff;
            }
        }
    }
}
::v-deep .el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>
