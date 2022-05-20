<template lang="">
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h">
             <!--左侧树形布局-->
            <el-col :span="4" :xs="24" class="container_flex_overflow">
                <div class="head-container">
                    <el-input style="margin: 10px" clearable placeholder="搜索名称" v-model="filterText" size="small"></el-input>
                    <el-tree
                        class="drawer-tree"
                        ref="tree"
                        :data="treeOptions"
                        :indent="0"
                        node-key="id"
                        :props="defaultProps"
                        empty-text="暂无数据"
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        @node-click="handleNodeClick"
                        :filter-node-method="filterNode">
                        <span class="el-tree-node__label" slot-scope="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </el-col> 
            <!--右侧内容布局-->
            <el-col :span="20" :xs="24" class="container_flex">
                <!--顶部按钮-->
                <el-row :gutter="24" class="container_flex-right_tree">
                  <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0px;">
                      <button-top
                        :item="item"
                        :multiple="multiple"
                        :single="single"
                        @newButton="newButton"
                        class="cume-button">
                      </button-top>
                  </el-col>
                  <right-toolbar
                     ref="rightToolbar"
                     style="margin-top:4px;padding-right:20px"
                     :showSearch.sync="showSearch"
                     :columns="property.fields"
                     @queryTable="handleQuery"
                     @handleCheckAllChange="handleCheckAllChange"
                     @clickReset="clickReset">
                   </right-toolbar>
                </el-row>
                <!--搜索条件按钮-->
                <form-data
                :dateMultiple="true"
                    :formDta="formData"
                    :showSearch="showSearch"
                    :searchArr="property.search || []"
                    @handleQuery="handleQuery"
                    style="margin-top:-12px;margin-bottom:6px">
                </form-data>
                <!--表格数据-->
                <table-index
                    ref="tableIndex"
                    style="margin-top:-8px"
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    @handleSelectionChange="handleSelectionChange"
                    @handleButton="handleButton"
                    @selectChange="selectChange"
                    @emitAblFilter="emitAblFilter">
                </table-index>
                <!--分页器-->
                <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList"
                    style="margin-bottom:40px"
                />
            </el-col>
        </el-row>
         <!--弹出框-->
        <operate ref="operate" @operateSuccess="operateSuccess"></operate>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import operate from "./components/operate"
import {vehicleInfoUsagelistPage,vehicleInfoRemoveUsages} from "@/api/system/vehicleAllocation"
import {deptTree} from "@/api/system/dept";
export default {
    name:"vehicleAllocation",
    components:{buttonTop,formData,tableIndex,operate},

    data() {
        return {
            //左侧部门搜索文字
            filterText: "",
            //左侧树形数据
            treeOptions: [],
            //树形控件配置
            defaultProps: {
                children: "children",
                label: "deptName",
            },
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
                usageDept: "",
            },
            //已选中条目
            selectionData:[],
            //已选中条目的id
            ids:[],
            //数据总数
            total:0,
            //分页参数
            listQuery:{
                pageNum:1,
                pageSize:10
            }
        }
    },
    created(){
        this.getTreeOptions();
    },
    methods:{
        //获取左侧树形数据
        async getTreeOptions() {
            await deptTree().then(({ data }) => {
                this.treeOptions = data;
                //设置默认选中第一个节点
                this.$nextTick(() => {
                    this.formData.usageDept = this.treeOptions[0].id;
                    this.$refs.tree.setCurrentKey(this.formData.usageDept);
                    this.menuProperty();
                    this.getList();
                });
            });
        },
        //搜索检查
        filterNode(val, data) {
            if (!val) return true;
            //data.属性必须对应defaultProps中label属性
            return data.deptName.indexOf(val) !== -1;
        },
        //树形点击节点回调
        handleNodeClick(data, node, obj) {
            this.formData.usageDept = data.id;
            this.handleQuery();
        },
        //获取菜单数据
        menuProperty(){
            let id = this.$route.meta.id;
            this.$store.dispatch('menuProperty', id).then( (data) => {
                data.search.forEach((item) => {
                    item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat));
                })
                this.property = data;
            });
        },
        //获取分页数据
        async getList(){
            this.loading = true;
            await vehicleInfoUsagelistPage(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            this.$refs.tableIndex.newButton(buttonCode,row);
        },
        //页面按钮点击事件
        handleButton(ids,buttonCode,row){
            if(buttonCode==='distribution'){
                for (let i = 0; i < this.selectionData.length; i++) {
                    if(this.selectionData[i].usageFlag==="1"||this.selectionData[i].usageFlag==="0"){
                        this.$modal.msgWarning("已分配车辆需取消后才能再次分配，请重新选择!")
                        return;
                    }
                }
                this.$refs.operate.init(this.selectionData,this.formData.usageDept);
            }else if(buttonCode==="cancel"){
                for (let i = 0; i < this.selectionData.length; i++) {
                    if(!this.selectionData[i].usageFlag){
                        this.$modal.msgWarning("未分配车辆无法取消，请重新选择!")
                        return;
                    }
                }
                this.$modal.confirm("是否取消所选分配信息?").then(()=>{
                    let carIds = [];
                    this.selectionData.forEach((item) => {
                        let obj = {};
                        this.$set(obj, 'carId', item.carId);
                        carIds.push(obj)
                    })
                    vehicleInfoRemoveUsages(carIds).then(({message}) => {
                        this.$modal.msgSuccess(message);
                        this.getList();
                    }).catch((err) => {

                    })
                })
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
        //车辆分配回调
        operateSuccess(){
            this.handleQuery();
        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        tableRowClassName({row,rowIndex}){
            row.index = rowIndex + 1;
        }
    },
    watch: {
        //左侧树形搜索栏监听
        filterText(val) {
            this.$refs.tree.filter(val);
        },
  },

}
</script>
<style scoped>
::v-deep.el-table tbody tr.current-row > td {
  background-color: #b8d9fd !important;
}
</style>