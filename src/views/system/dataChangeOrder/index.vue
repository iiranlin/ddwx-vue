<template>
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h">
            <el-col :span="24" :xs="24" class="container_flex">
                <!--顶部按钮-->
                <el-row :gutter="24" class="container_flex-right_list">
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
                        @numberChange="numberChange"
                        @clickReset="clickReset">
                    </right-toolbar>
                </el-row>
                <!--搜索条件按钮-->
                <form-data
                    :formDta="formData"
                    :showSearch="showSearch"
                    :searchArr="property.search || []"
                    @handleQuery="handleQuery"
                    style="margin-top:-12px;margin-bottom:6px">
                    <template slot="customItem">
                        <el-form-item label="申请单位" prop="value">
                            <el-select v-model="formData.unitCode" placeholder="请选择申请单位" clearable style="width:240px" size="small">
                                <el-option v-for="item in unitOptions"
                                    :key="item.value"
                                    :label="item.unitName"
                                    :value="item.unitCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </form-data>
                <!--表格数据-->
                <table-index
                    ref="tableIndex"
                    style="margin-top:-8px"
                    :tableIndexs="tableIndex"
                    :numberShow="numberShow"
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    @handleSelectionChange="handleSelectionChange"
                    @handleButton="handleButton"
                    @selectChange="selectChange"
                    @emitAblFilter="emitAblFilter"
                    @clickLink="clickLink">
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
        <!--审核弹出框-->
        <assignee ref="assignee" @assingeeSuccess="assingeeSuccess"></assignee>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import assignee from "./components/assignee";
import{ gcywChangeRequestListPage,
gcywChangeRequestUpdate,
gcywChangeRequestUpdateRes,
dataChangeOrderExportUrl } from "@/api/system/dataChange"
import { activitiAssigneeListByType } from "@/api/driver";
import { getAllAvailableUnit } from '@/api/system/unit'
import indexMixin from "@/views/mixins"
import { axiosDownloadExcel } from '@/api/download'

export default {
    name:"dataChangeOrder",
    components:{buttonTop,formData,tableIndex,assignee},
    mixins: [indexMixin],
    data() {
        return {
            //遮罩层
            loading:false,
            //非单个禁用
            single:true,
            //非多个禁用
            multiple:true,
            //显示搜索条件
            showSearch:true,
            // 表格序号是否展示
            numberShow: false,
            //表格数据
            dataList:[],
            //日期范围
            dateRange:[],
            //列表显示字段
            property:{},
            //查询参数
            formData:{
                unitCode:'',
            },
            //申请单位数据
            unitOptions:[],
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            //审批参数
            procDefId: '',
            assignee: '',
            candidateUser:[],
        }
    },
    created(){
        this.menuProperty();
        this.getUnitOptions();
        this.getList();
    },
    methods:{
        //序号展示隐藏
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
            });
        },
        //获取分页数据
        async getList(){
            this.loading = true;

            await gcywChangeRequestListPage(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取单位数据
        async getUnitOptions(){
            await getAllAvailableUnit().then(({ data }) => {
                this.unitOptions = data;
            }).catch((err) => {

            })
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            this.$refs.tableIndex.newButton(buttonCode,row);
        },
        //页面按钮点击事件
        handleButton(ids,buttonCode){
            if(buttonCode==='create'){
                this.$router.push({name:"dataChangeOrderCreate"})
            }else if(buttonCode==='update'){
                if(this.selectionData[0].reqStatus !== '0'){
                    this.$modal.msgWarning('已提交数据无法修改，请重新选择!');
                    return;
                }
                this.$router.push({
                    name: 'dataChangeOrderEdit',
                    params: {
                        obj:this.selectionData[0],                        
                    },
                })
            }else if(buttonCode==="delete"){
                if(this.selectionData[0].reqStatus !== '0'){
                    this.$modal.msgWarning('已提交数据无法删除，请重新选择!');
                    return;
                }
                this.$modal.confirm("是否删除所选信息?").then(()=>{
                    this.loading = true;
                    let params = {
                        isDelete:'1',
                        id:this.selectionData[0].id,
                    }
                    gcywChangeRequestUpdate(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message);
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch((err) => {
                    
                })
            }else if(buttonCode==="submit"){
                if(this.selectionData[0].reqStatus !== '0'){
                    this.$modal.msgWarning('已提交数据无法重复提交，请重新选择!');
                    return;
                }
                this.$modal.confirm("是否提交所选信息?").then(()=>{
                    this.loading = true
                    activitiAssigneeListByType({ type: '数据变更' }).then(({ data }) => {
                        this.loading = false
                        if (!data.procDefId) {
                            this.dataChangeOrderSubmit();
                        } else{
                            this.procDefId = data.procDefId;
                            if (!!data.assignee) {
                                this.assignee = data.assignee;
                                this.dataChangeOrderSubmit();
                            } else {
                                this.$refs.assignee.init(data.assigneeList);
                            }
                        }
                    }).catch((err) => {
                        this.loading = false
                    })
                }).catch((err) => {
                    
                })
            }else if(buttonCode==='handle'){
                if(this.selectionData[0].reqStatus !== '5'){
                    this.$modal.msgWarning('未审核数据无法处理，请重新选择!');
                    return;
                }
                if(this.selectionData[0].resStatus !== '0'){
                    this.$modal.msgWarning('已处理数据无法重复处理，请重新选择!');
                    return;
                }
                this.$modal.confirm("是否处理所选信息?").then(()=>{
                    this.loading = true;
                    let params = {
                        resStatus:'1',
                        id:this.selectionData[0].id,
                    }
                    gcywChangeRequestUpdateRes(params).then(({message}) => {
                        this.loading = false;
                        this.$modal.msgSuccess(message);
                        this.getList();
                    }).catch((err) => {
                        this.loading = false;
                    })
                }).catch((err) => {
                    
                })
            }else if(buttonCode==='export'){
                this.exportFile();
            }
        },
        //选择审批人回调
        assingeeSuccess(assignee){
            this.candidateUser = assignee
            this.dataChangeOrderSubmit()
        },
        //提交数据
        async dataChangeOrderSubmit(){
            this.loading = true;
            let params = {
                reqStatus:'1',
                id:this.selectionData[0].id,
                procDefId: this.procDefId,
                assignee: this.assignee,
                candidateUser:this.candidateUser,
            }
            await gcywChangeRequestUpdate(params).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.getList();
            }).catch((err) => {
                this.loading = false;
            })
        },
        // 导出
        exportFile() {
            axiosDownloadExcel(dataChangeOrderExportUrl,{id:this.selectionData[0].id})
        },
        //跳转详情
        clickLink (row, fieldCode, linkText) {
            this.$router.push({
                name: 'dataChangeOrderDetail',
                params: {
                    obj:row
                },
            })
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
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        tableRowClassName({row,rowIndex}){
            row.index = rowIndex + 1;
        }
    }
}
</script>
<style lang="css" scoped>
    ::v-deep.el-table tbody tr.current-row > td {
        background-color: #b8d9fd !important;
    }
</style>
