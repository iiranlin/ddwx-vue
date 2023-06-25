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
                    @handleResetDept="handleResetDept"
                    style="margin-top:-12px;margin-bottom:6px">
                    <template slot="customItemStar">
                        <el-form-item label="所属单位">
                            <el-select v-model="formData.unitId" placeholder="请选择所属单位" clearable style="width:240px" size="small">
                                <el-option v-for="item in unitOptions"
                                    :key="item.value"
                                    :label="item.unitName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template slot="customItem">
                        <el-form-item label="预算年度">
                            <el-date-picker
                                style="width:240px"
                                value-format="yyyy"
                                v-model="formData.budgetTag"
                                type="year"
                                placeholder="请选择预算年度"
                                size="small"/>
                        </el-form-item>
                    </template>
                     <template slot="customItem">
                        <el-form-item label="审批状态">
                            <el-select v-model="formData.status" placeholder="请选择审批状态" clearable style="width:240px" size="small">
                                <el-option v-for="item in examineStatusOptions"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </form-data>
                <!--表格数据-->
                <el-table ref="elTable" class="container_table" height="100%" v-loading="loading" :data="dataList" border 
                    @selection-change="handleSelectionChange" highlight-current-row stripe>
                    <el-table-column width="50" align="center" type="selection"/>
                    <el-table-column width="50" align="center" label="序号" type="index" v-if="numberShow"/>
                    <el-table-column label="所属单位" prop="unitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="列账单位" prop="accountUnitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="自有车辆购置费用（万元）" prop="ownPurchase" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="运行维护费用（万元）" align="center" prop="strengthCount" :show-overflow-tooltip="true">
                        <el-table-column label="自有车辆" align="center" prop="ownSafeguard" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="租赁车辆" align="center" prop="rentSafeguard" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="小计" align="center" prop="subtotal" :show-overflow-tooltip="true"></el-table-column>
                    </el-table-column>
                    <el-table-column label="业务外包（万元）" prop="outsource" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="合计（万元）" prop="summation" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="预算年度" prop="budgetTag" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="审批状态" prop="status" align="center"  :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{checkStatus(scope.row)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
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
        <!--审批意见弹框-->
        <operate ref="operate" @operateSuccess="operateSuccess"/>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import operate from "./components/operate";
import{ gcywBudgetActivitiList,unitTree } from '@/api/organization'
import indexMixin from "@/views/mixins"
import { getListByParentId } from '@/api/system/dict'

export default {
    name:"budgetManagementExamine",
    components:{buttonTop,formData,operate},
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
                unitId: '',
                budgetTag:'',
                status:'',
            },
            //所属单位数据
            unitOptions:[],
            //审批状态数据
            examineStatusOptions:[],
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
        }
    },
    created(){
        this.menuProperty();
        this.getUnitOptions();
        this.getStatusOptions();
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
        //获取所属单位信息
        async getUnitOptions(){
            this.loading = true

            await unitTree().then(({ data }) => {
                this.unitOptions = data.children;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取状态数据
        getStatusOptions() {
            this.loading = true

            getListByParentId('1661558035975208960').then(({ data }) => {
                this.loading = false
                this.examineStatusOptions = data
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取分页数据
        async getList(){
            this.loading = true;

            await gcywBudgetActivitiList(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;

                this.initSubtotalAndSummation();
            }).catch((err) => {
                this.loading = false;
            })
        },
         //小计+合计计算
        initSubtotalAndSummation(){
            this.dataList.forEach((item) => {
                let itemSubtotal = (item.ownSafeguard*1000 + item.rentSafeguard*1000)/1000;
                let itemSummation = (item.ownPurchase*1000 + item.ownSafeguard*1000 + item.rentSafeguard*1000 + item.outsource*1000)/1000;
            
                this.$set(item, 'subtotal', itemSubtotal);
                this.$set(item, 'summation', itemSummation);
            })
        },
        //判断状态
        checkStatus(row){
            let obj = this.examineStatusOptions.find((item) => {
                return item.code === row.status;
            })
            return !!obj?obj.name:'';
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            if(buttonCode==='examine'){
                if(this.selectionData[0].status === '2' || this.selectionData[0].status === '3'){
                    if(this.selectionData[0].workflowId){
                        if(this.selectionData[0].procInstId){
                            if(this.selectionData[0].endTimeMe){
                                this.$modal.msgWarning('你不是审批人！');
                            }else{
                                this.$refs.operate.init(this.selectionData[0]);
                            }
                        }else{
                            this.$modal.msgWarning('你不是审批人！');
                        }
                    }else{
                        this.$refs.operate.init(this.selectionData[0]);
                    }
                }else{
                    this.$modal.msgWarning('已审核数据无法重新审核，请重新选择!');
                    return;
                }
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
        //多选获取行数据
        handleSelectionChange(selection){
            this.single = selection.length!=1;
            this.multiple = !selection.length;
            this.selectionData = selection;
        },
        //审核回调
        operateSuccess() {
            this.handleQuery();
        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        //清空状态数据
        handleResetDept() {
            this.formData.unitId = '';
            this.formData.budgetTag = '';
            this.formData.status = '';
        },
    }
}
</script>
<style lang="css" scoped>
    ::v-deep.el-table tbody tr.current-row > td {
        background-color: #b8d9fd !important;
    }
</style>
