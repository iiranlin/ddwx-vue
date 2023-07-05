<template>
    <div class="app-container_list">
        <el-row :gutter="20" class="container_h">
            <el-col :span="24" :xs="24" class="container_flex">
                <el-row :gutter="24" class="container_flex-right_list">
                    <!--顶部按钮-->
                    <el-col :span="1.5" v-for="item in property.buttonTop" :key="item.id" style="margin-top:2px;padding:0;">
                        <button-top
                            :item="item"
                            :multiple="multiple"
                            :single="single"
                            @newButton="newButton"
                            class="cume-button"/>
                    </el-col>
                    <!--右侧按钮-->
                    <right-toolbar
                        ref="rightToolbar"
                        style="margin-top:4px;padding-right:20px"
                        :showSearch.sync="showSearch"
                        :columns="property.fields"
                        @numberChange="numberChange"
                        @queryTable="handleQuery"
                        @handleCheckAllChange="handleCheckAllChange"
                        @clickReset="clickReset"/>
                </el-row>
                <!--搜索条件按钮-->
                <form-data
                    :formDta="formData"
                    :showSearch="showSearch"
                    :searchArr="property.search || []"
                    @handleQuery="handleQuery"
                    @handleResetDept="handleResetDept"
                    style="margin-top:-12px;margin-bottom:6px">
                    <template slot="customItem">
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
                </form-data>
                <!--表格数据-->
                <el-table ref="elTable" class="container_table" height="100%" v-loading="loading" :data="dataList" border 
                    @selection-change="handleSelectionChange" :span-method="spanMethod" highlight-current-row stripe :show-summary="showSummary" :summary-method="getSummaries">
                    <el-table-column width="50" align="center" type="selection"/>
                    <el-table-column width="50" align="center" label="序号" type="index" v-if="numberShow"/>
                    <el-table-column label="所属单位" prop="unitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="列账单位" prop="accountUnitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="自有车辆购置费用（万元）" align="center" prop="ownPurchase" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input placeholder="输入金额" size="small" v-model="scope.row.ownPurchase" 
                                :disabled="checkInputDisabled(scope.row)" maxlength="10" 
                                @input="handleNumberLimit(scope.row,'ownPurchase')"
                                @blur="handleInputBlur(scope.row)" >
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="运行维护费用（万元）" align="center" :show-overflow-tooltip="true">
                        <el-table-column label="自有车辆" align="center" prop="ownSafeguard" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input placeholder="输入金额" size="small" v-model="scope.row.ownSafeguard" 
                                    @input="handleNumberLimit(scope.row,'ownSafeguard')" 
                                    :disabled="checkInputDisabled(scope.row)" maxlength="10"
                                    @blur="handleInputBlur(scope.row)">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="租赁车辆" align="center" prop="rentSafeguard" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input placeholder="输入金额" size="small" v-model="scope.row.rentSafeguard" 
                                    @input="handleNumberLimit(scope.row,'rentSafeguard')" 
                                    :disabled="checkInputDisabled(scope.row)" maxlength="10"
                                    @blur="handleInputBlur(scope.row)">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="小计" prop="subtotal" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    </el-table-column>
                    <el-table-column label="业务外包（万元）" prop="outsource" align="center"  :show-overflow-tooltip="true">
                         <template slot-scope="scope">
                            <el-input placeholder="输入金额" size="small" v-model="scope.row.outsource" 
                                @input="handleNumberLimit(scope.row,'outsource')" 
                                :disabled="checkInputDisabled(scope.row)" maxlength="10"
                                @blur="handleInputBlur(scope.row)">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计（万元）" prop="summation" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="预算年度" prop="budgetTag" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="状态" prop="status" align="center"  :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{checkStatus(scope.row)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="驳回原因" prop="auditDesc" align="center"  :show-overflow-tooltip="true"></el-table-column>
                </el-table>
                <!--分页器-->
                <pagination
                    v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList"
                    style="margin-bottom:40px"/>
            </el-col>
        </el-row>
        <!--新增预算管理-->
         <operate ref="operate" @operateSuccess="operateSuccess"></operate>
        <!--审核弹出框-->
        <assignee ref="assignee" @assingeeSuccess="assingeeSuccess"></assignee>
    </div>
</template>
<script>
import buttonTop from '@/components/buttonTop'
import formData from '@/components/formData'
import operate from './components/operate'
import assignee from "./components/assignee";
import { gcywBudgetList,
unitTree,
gcywBudgetDelete,
gcywBudgetDistribute,
gcywBudgetUpdate,
gcywBudgetClean} from '@/api/organization'
import { activitiAssigneeListByType } from "@/api/driver";
import indexMixin from '@/views/mixins'
import { mapGetters } from 'vuex'
import { handleNumberLimit } from '@/utils'
import { getListByParentId } from '@/api/system/dict'

export default {
    name: 'budgetManagement',
    mixins: [indexMixin],
    components: { buttonTop, formData,operate,assignee },

    computed: {
        ...mapGetters(['rank'])
    },

    data() {
        return {
            //遮罩层
            loading: false,
            //非单个禁用
            single: true,
            //非多个禁用
            multiple: true,
            //显示搜索条件
            showSearch: true,
            //表格数据
            dataList: [],
            //表格原始数据
            originalDataList:[],
            //所属单位数据
            unitOptions: [],
            //列表显示字段
            property: {},
            //查询参数
            formData: {
                unitId: '',
                budgetTag:'',
            },
            //已选中条目
            selectionData: [],
            //数据总数
            total: 0,
            //状态数据
            statusOptions:[],
            //是否显示序号
            numberShow: false,
            //合并数据
            spanArr:[],
            //是否显示合计
            showSummary:false,

            //所有自有车辆购置费用用合计
            ownPurchase:null,
            //除当前页外所有自有车辆购置费用用合计
            otherOwnPurchase:null,
            //所有自有车辆维护费用用合计
            ownSafeguard:null,
            //除当前页外所有自有车辆维护费用用合计
            otherOwnSafeguard:null,
            //所有租赁车辆维护费用用合计
            rentSafeguard:null,
            //除当前页外所有租赁车辆维护费用用合计
            otherRentSafeguard:null,
            //所有业务外包费用合计
            outsource:null,
            //除当前页外所有业务外包费用合计
            otherOutsource:null,
            
            //输入验证规则
            handleNumberLimit: handleNumberLimit,
            //审批参数
            procDefId: '',
            assignee: '',
            candidateUser:[],

            //0：待填报，1：已下发  2：待审核 3.审核中 4.审核通过 5:已驳回  6：已失效
        }
    },
    mounted() {
        this.menuProperty();
        this.getUnitOptions();
        this.getStatusOptions();
        this.getList();
    },
    methods: {
        //是否显示序号
        numberChange(val) {
            this.numberShow = val
        },
        //获取菜单数据
        menuProperty() {
            let id = this.$route.meta.id

            this.$store.dispatch('menuProperty', id).then((data) => {
                data.search.forEach((item) => {
                    item.fieldFormat = JSON.parse(JSON.stringify(item.fieldFormat))
                })
                this.property = data
            })
        },
        //获取所属单位信息
        async getUnitOptions() {
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
                this.statusOptions = data
            }).catch((err) => {
                this.loading = false
            })
        },
        //获取分页数据
        async getList() {
            this.loading = true

            await gcywBudgetList(Object.assign({}, this.listQuery, this.formData)).then(({ data }) => {
                this.dataList = data.list.list;
                this.originalDataList = JSON.parse(JSON.stringify(this.dataList));
                this.total = data.list.total;
                this.loading = false;
                this.initSubtotalAndSummation();
                this.initSpanArr();

                this.dataList.forEach((item) => {
                    if(!!item.ownPurchase ||!!item.ownSafeguard ||!!item.rentSafeguard ||!!item.outsource
                        || item.ownPurchase === 0 || item.ownSafeguard === 0 || item.rentSafeguard === 0 || item.outsource === 0){
                        this.$set(item, 'isDisabled', true)
                    }else{
                        this.$set(item, 'isDisabled', false)
                    }
                })

                this.ownPurchase = data.ownPurchase === null? 0:data.ownPurchase;
                this.ownSafeguard = data.ownSafeguard === null? 0:data.ownSafeguard;
                this.rentSafeguard = data.rentSafeguard === null? 0:data.rentSafeguard;
                this.outsource = data.outsource === null? 0:data.outsource;

                if(this.ownPurchase !== 0 || this.ownSafeguard !==0 || this.rentSafeguard !== 0 || this.outsource !==0){
                    this.showSummary = true;
                }else{
                    this.showSummary = false;
                }
                this.$nextTick(() => {
                    this.$refs.elTable.doLayout();
                })
            }).catch(() => {
                this.loading = false;
            })
        },
        //合并数据处理
        initSpanArr(){
            let position = 0;  // 当前合并的行位置（连续相同名称的第一条数据位置）
            this.spanArr = [];

            this.dataList.forEach((item, index) => {
                if (index === 0) {  // 第一行， 不进行处理
                    this.spanArr.push(1)
                    position = 0
                } else {
                    if ((this.dataList[index].unitName + this.dataList[index].budgetTag) 
                            === (this.dataList[index-1].unitName + this.dataList[index-1].budgetTag)) {
                        // 当条数据跟上一条数据名称相同，要合并
                        this.spanArr[position] += 1  // 首条相同名称行合并行数增加
                        this.spanArr.push(0) // 当前行消除
                    } else { // 不需要处理的数据
                        this.spanArr.push(1)
                        position = index
                    }
                }
            })
        },
        //合并行列规则
        spanMethod({ row, column, rowIndex, columnIndex }){
            let targetColumenIndex = this.numberShow ? 2:1;

            if (columnIndex === targetColumenIndex) {
                const _row = this.spanArr[rowIndex]  // 合并行数
                const _col = _row > 0 ? 1 : 0 // 合并列数，1：不改变，0：被消除
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        //合计显示规则
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            let targetColumenIndex = this.numberShow ? 2:1;

            columns.forEach((column, index) => {
                if (index === targetColumenIndex) {
                    sums[index] = '合计';
                    return;
                }
                if(column.property === 'ownPurchase'){
                    sums[index] = this.ownPurchase;
                }else if(column.property === 'ownSafeguard'){
                    sums[index] = this.ownSafeguard;
                }else if(column.property === 'rentSafeguard'){
                    sums[index] = this.rentSafeguard;
                }else if(column.property === 'outsource'){
                    sums[index] = this.outsource;
                }else{
                    sums[index] = '';
                }
            });
            return sums;
        },
        //输入框失去焦点
        handleInputBlur(row){
            //计算列表的小计和合计数量
            this.initSubtotalAndSummation();

            //计算底部合计条目的合计数量
            if(this.showSummary && !!row.accountUnitId){
                //获取当前页合计数量
                let sumCurrentOwnPurchase = 0;
                let sumCurrentOwnSafeguard = 0;
                let sumCurrentRentSafeguard = 0;
                let sumCurrentOutsource = 0;

                this.dataList.forEach((item) => {
                    if(!!item.accountUnitId){
                        sumCurrentOwnPurchase = Number(item.ownPurchase) + Number(sumCurrentOwnPurchase);
                        sumCurrentOwnSafeguard = Number(item.ownSafeguard) + Number(sumCurrentOwnSafeguard);
                        sumCurrentRentSafeguard = Number(item.rentSafeguard) + Number(sumCurrentRentSafeguard);
                        sumCurrentOutsource = Number(item.outsource) + Number(sumCurrentOutsource);
                    }
                })
                //总合计数量= 当前页合计数量+其他页合计数量
                this.ownPurchase = Number(this.otherOwnPurchase) + Number(sumCurrentOwnPurchase);
                this.ownSafeguard = Number(this.otherOwnSafeguard) + Number(sumCurrentOwnSafeguard);
                this.rentSafeguard = Number(this.otherRentSafeguard) + Number(sumCurrentRentSafeguard);
                this.outsource = Number(this.otherOutsource) + Number(sumCurrentOutsource);
            }

        },
        //判断输入权限
        checkInputDisabled(row){
            if(row.status === '0' && this.rank === '0' && !row.isDisabled){
                return false;
            }
            if(row.status === '1' && this.rank === '1' && !row.isDisabled){
                return false;
            }
            if(row.status === '5' && !row.isDisabled){
                return false;
            }
            return true;
        },
        //判断状态
        checkStatus(row){
            let obj = this.statusOptions.find((item) => {
                return item.code === row.status;
            })
            return !!obj?obj.name:'';
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
        //顶部按钮点击
        newButton(buttonCode) {
            if(buttonCode === 'create'){
                this.$refs.operate.init();
            }else if(buttonCode === 'delete'){
                this.handleDelete();
            }else if(buttonCode === 'send'){
                this.handleSend();
            }else if(buttonCode === 'save'){
                this.handleSave();
            }else if(buttonCode==="submit"){
                this.handleSubmit();
            }else if(buttonCode==="reset"){
                this.handleReset();
            }
        },
        //顶部列字段展示
        handleCheckAllChange(columns) {
            
        },
        //顶部重置按钮
        clickReset() {
            this.menuProperty()
            this.handleQuery()
        },
        //多选获取行数据
        handleSelectionChange(selection) {
            this.single = selection.length!=1;
            this.multiple = !selection.length;
            this.selectionData = selection;
        },
        //新建成功回调
        operateSuccess() {
            this.handleQuery()
        },
        //删除
        handleDelete(){
            for (let i = 0; i < this.selectionData.length; i++) {
                if(!this.selectionData[i].accountUnitId){
                    this.$modal.msgWarning("全所汇总数据无法删除，请重新选择!")
                    return;
                }
                if(this.selectionData[i].status !== '0' && this.selectionData[i].status !== '5'){
                    this.$modal.msgWarning("只能删除已填报或已驳回数据，请重新选择!")
                    return;
                }
            }
            let params = [];

            this.selectionData.forEach((item) => {
                let obj = {};
                this.$set(obj, 'isDelete', '1');
                this.$set(obj, 'id', item.id);
                this.$set(obj, 'unitId', item.unitId);
                params.push(obj);
            })
            this.$modal.confirm("是否删除所选信息?").then(()=>{
                this.loading = true;

                gcywBudgetDelete(params).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message);
                    this.getList();
                }).catch((err) => {
                    this.loading = false;
                })
            })
        },
        //下发
        handleSend(){
            for (let i = 0; i < this.selectionData.length; i++) {
                if(!!this.selectionData[i].accountUnitId){
                    this.$modal.msgWarning("非全所汇总数据无法下发，请重新选择!")
                    return;
                }
                if(this.selectionData[i].status !== '0'){
                    this.$modal.msgWarning("非待填报数据无法下发，请重新选择!")
                    return;
                }
                if(!this.selectionData[i].outsource){
                    this.$modal.msgWarning("业务外包费用为空无法下发，请重新选择!")
                    return;
                }
                if(!this.selectionData[i].ownPurchase){
                    this.$modal.msgWarning("自有车辆购置费用为空无法下发，请重新选择!")
                    return;
                }
                if(!this.selectionData[i].ownSafeguard){
                    this.$modal.msgWarning("自有车辆维护费用为空无法下发，请重新选择!")
                    return;
                }
                if(!this.selectionData[i].rentSafeguard){
                    this.$modal.msgWarning("租赁车辆维护费用为空无法下发，请重新选择!")
                    return;
                }
            }
            if(!this.checkSend('ownPurchase')){
                this.$modal.msgWarning("全所汇总自有车辆购置费用不能小于已填报的列账单位自有车辆购置费用之和，请重新填写!")
                return;
            }
            if(!this.checkSend('ownSafeguard')){
                this.$modal.msgWarning("全所汇总自有车辆维护费用不能小于已填报的列账单位自有车辆维护费用之和，请重新填写!")
                return;
            }
            if(!this.checkSend('rentSafeguard')){
                this.$modal.msgWarning("全所汇总租赁车辆维护费用不能小于已填报的列账单位租赁车辆维护费用之和，请重新填写!")
                return;
            }
            if(!this.checkSend('outsource')){
                this.$modal.msgWarning("全所汇总业务外包费用不能小于已填报的列账单位业务外包费用费用之和，请重新填写!")
                return;
            }
            let params = [];

            this.selectionData.forEach((item) => {
                let obj = {};
                this.$set(obj, 'unitId', item.unitId);
                this.$set(obj, 'id', item.id);
                this.$set(obj, 'outsource', item.outsource);
                this.$set(obj, 'ownPurchase', item.ownPurchase);
                this.$set(obj, 'ownSafeguard', item.ownSafeguard);
                this.$set(obj, 'rentSafeguard', item.rentSafeguard);
                params.push(obj);
            })
            this.$modal.confirm("下发后将清除页面上所有未保存数据，是否下发所选信息?").then(()=>{
                this.loading = true;

                gcywBudgetDistribute(params).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message);
                    this.getList();
                }).catch((err) => {
                    this.loading = false;
                })
            })
        },
        //保存
        handleSave(){
            if(!this.selectionData[0].ownPurchase && this.selectionData[0].ownPurchase !== 0){
                this.$modal.msgWarning("请输入自有车辆购置费用!")
                return;
            }
            if(!this.selectionData[0].ownSafeguard && this.selectionData[0].ownSafeguard !== 0){
                this.$modal.msgWarning("请输入自有车辆维护费用!")
                return;
            }
            if(!this.selectionData[0].rentSafeguard && this.selectionData[0].rentSafeguard !== 0){
                this.$modal.msgWarning("请输入租赁车辆维护费用!")
                return;
            }
            if(!this.selectionData[0].outsource && this.selectionData[0].outsource !== 0){
                this.$modal.msgWarning("请输入业务外包费用!")
                return;
            }
            if(this.rank === '0'){
                if(this.selectionData[0].status !== '0' && this.selectionData[0].status !== '5'){
                    this.$modal.msgWarning("当前条目无法保存，请重新选择!")
                    return;
                }
            }
            if(this.rank === '1'){
                if(this.selectionData[0].status !== '1' && this.selectionData[0].status !== '5'){
                    this.$modal.msgWarning("当前条目无法保存，请重新选择!")
                    return;
                }
            }
            if(this.selectionData[0].isDisabled){
                this.$modal.msgWarning("已保存数据无法重复保存，请重新选择!")
                return;
            }
            if(!this.checkSaveAndCommit('ownPurchase')){
                this.$modal.msgWarning("列账单位的自有车辆购置费用之和不能大于全所汇总的自有车辆购置费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('ownSafeguard')){
                this.$modal.msgWarning("列账单位的自有车辆维护费用之和不能大于全所汇总的自有车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('rentSafeguard')){
                this.$modal.msgWarning("列账单位的租赁车辆维护费用之和不能大于全所汇总的租赁车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('outsource')){
                this.$modal.msgWarning("列账单位的业务外包费用之和不能大于全所汇总的业务外包费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('ownPurchase')){
               this.$modal.msgWarning("列账单位的自有车辆购置费用之和必须等于全所汇总的自有车辆购置费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('ownSafeguard')){
                this.$modal.msgWarning("列账单位的自有车辆维护费用之和必须等于全所汇总的自有车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('rentSafeguard')){
                this.$modal.msgWarning("列账单位的租赁车辆维护费用之和必须等于全所汇总的租赁车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('outsource')){
                this.$modal.msgWarning("列账单位的业务外包费用之和必须等于全所汇总的业务外包费用，请重新填写!")
                return;
            }
            let params = {
                id:this.selectionData[0].id,
                status:this.selectionData[0].status,
                outsource:this.selectionData[0].outsource,
                ownPurchase:this.selectionData[0].ownPurchase,
                ownSafeguard:this.selectionData[0].ownSafeguard,
                rentSafeguard:this.selectionData[0].rentSafeguard,
            }
            this.$modal.confirm("是否保存所选信息?").then(()=>{
                this.loading = true;

                gcywBudgetUpdate(params).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message);
                    
                    //更新原始数据
                    this.originalDataList.forEach((item) => {
                        if(item.id === this.selectionData[0].id){
                            item.ownPurchase = this.selectionData[0].ownPurchase;
                            item.ownSafeguard = this.selectionData[0].ownSafeguard;
                            item.rentSafeguard = this.selectionData[0].rentSafeguard;
                            item.outsource = this.selectionData[0].outsource;
                        }
                    })
                    //更新界面数据
                    this.dataList.forEach((item) => {
                        if(item.id === this.selectionData[0].id){
                            item.isDisabled = true;
                        }
                    })
                    this.$refs.elTable.clearSelection();
                }).catch((err) => {
                    this.loading = false;
                })
            })
        },
        //提交
        handleSubmit(){
            if(!this.selectionData[0].accountUnitId){
                this.$modal.msgWarning("全所汇总数据无法提交，请重新选择!")
                return;
            }
            if(!this.selectionData[0].ownPurchase && this.selectionData[0].ownPurchase !== 0){
                this.$modal.msgWarning("请输入自有车辆购置费用!")
                return;
            }
            if(!this.selectionData[0].ownSafeguard && this.selectionData[0].ownSafeguard !== 0){
                this.$modal.msgWarning("请输入自有车辆维护费用!")
                return;
            }
            if(!this.selectionData[0].rentSafeguard && this.selectionData[0].rentSafeguard !== 0){
                this.$modal.msgWarning("请输入租赁车辆维护费用!")
                return;
            }
            if(!this.selectionData[0].outsource && this.selectionData[0].outsource !== 0){
                this.$modal.msgWarning("请输入业务外包费用!")
                return;
            }
            if(this.rank === '0'){
                if(this.selectionData[0].status !== '0' && this.selectionData[0].status !== '5'){
                    this.$modal.msgWarning("当前条目无法提交，请重新选择!")
                    return;
                }
            }
            if(this.rank === '1'){
                if(this.selectionData[0].status !== '1' && this.selectionData[0].status !== '5'){
                    this.$modal.msgWarning("当前条目无法提交，请重新选择!")
                    return;
                }
            }
            if(!this.checkSaveAndCommit('ownPurchase')){
                this.$modal.msgWarning("列账单位的自有车辆购置费用之和不能大于全所汇总的自有车辆购置费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('ownSafeguard')){
                this.$modal.msgWarning("列账单位的自有车辆维护费用之和不能大于全所汇总的自有车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('rentSafeguard')){
                this.$modal.msgWarning("列账单位的租赁车辆维护费用之和不能大于全所汇总的租赁车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSaveAndCommit('outsource')){
                this.$modal.msgWarning("列账单位的业务外包费用之和不能大于全所汇总的业务外包费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('ownPurchase')){
               this.$modal.msgWarning("列账单位的自有车辆购置费用之和必须等于全所汇总的自有车辆购置费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('ownSafeguard')){
                this.$modal.msgWarning("列账单位的自有车辆维护费用之和必须等于全所汇总的自有车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('rentSafeguard')){
                this.$modal.msgWarning("列账单位的租赁车辆维护费用之和必须等于全所汇总的租赁车辆维护费用，请重新填写!")
                return;
            }
            if(!this.checkSumStrengthCount('outsource')){
                this.$modal.msgWarning("列账单位的业务外包费用之和必须等于全所汇总的业务外包费用，请重新填写!")
                return;
            }
            this.$modal.confirm("提交后将清除页面上所有未保存数据，是否提交所选信息?").then(()=>{
                this.loading = true

                activitiAssigneeListByType({ type: '车辆预算' }).then(({ data }) => {
                    this.loading = false
                    if (!data.procDefId) {
                        this.vehicleOrganizationSubmit();
                    } else{
                        this.procDefId = data.procDefId;
                        if (!!data.assignee) {
                            this.assignee = data.assignee;
                            this.vehicleOrganizationSubmit();
                        } else {
                            this.$refs.assignee.init(data.assigneeList);
                        }
                    }
                }).catch((err) => {
                    this.loading = false
                })
            }).catch((err) => {
                
            })
        },
        //校验下发逻辑
        checkSend(key){
            for (let i = 0; i < this.selectionData.length; i++) {
                let obj = this.selectionData[i];

                //获取当前所属单位的所有原始数据
                let originalArr = this.originalDataList.filter((item) => {
                    return item.unitId === obj.unitId && item.budgetTag === obj.budgetTag;
                })
                //判断全所汇总数据是否大于已填报的列账单位数据之和
                let sum = 0;

                originalArr.forEach((item) => {
                    if(!!item.accountUnitId){
                        sum = Number(item[key]) + sum;
                    }
                })
                //判断总和是否超过全所汇总数
                if(Number(obj[key]) < Number(sum)){
                    return false;
                }
            }
            return true;
        },
        //校验列账单位
        checkSaveAndCommit(key){
            let obj = this.selectionData[0];

            //获取当前所属单位的所有原始数据
            let originalArr = this.originalDataList.filter((item) => {
                return item.unitId === obj.unitId && item.budgetTag === obj.budgetTag;
            })
            //判断当前保存的是否是全所汇总数据
            if(!!obj.accountUnitId){
                //判断当前全所汇总是否有值
                let temp = originalArr.find((item) => {
                    return !item.accountUnitId
                })
                if(!!temp[key] || temp[key] === 0){
                    let sum = 0;

                    originalArr.forEach((item) => {
                        if(item.id !== obj.id && !!item.accountUnitId){
                            sum = Number(item[key]) + sum;
                        }
                    })
                    sum = Number(obj[key]) + sum;
                    //判断总和是否超过全所汇总数
                    if(Number(temp[key]) < Number(sum)){
                        return false;
                    }
                }
            }else{
                let sum = 0;

                originalArr.forEach((item) => {
                    if(!!item.accountUnitId){
                        sum = Number(item[key]) + sum;
                    }
                })
                //判断总和是否超过全所汇总数
                if(Number(obj[key]) < Number(sum)){
                    return false;
                }
            }
            return true;
        },
        //判断列账单位之和是否等于全所汇总数量
        checkSumStrengthCount(key){
            let obj = this.selectionData[0];

            //获取当前所属单位的所有原始数据
            let originalArr = this.originalDataList.filter((item) => {
                return item.unitId === obj.unitId && item.budgetTag === obj.budgetTag;
            })
            //判断当前未填写条目数量
            let num = 0;
            originalArr.forEach((item) => {
                if(!item[key] && item[key]!== 0){
                    num = num +1;
                }
            })
            if(num === 1){
                //判断未填写条目是否是当前保存或提交数据
                let temp = originalArr.find((item) => {
                    return !item[key] && item[key] !==0;
                })
                if(temp.id === obj.id){
                    //判断当前保存的是否是全所汇总数据
                    if(!!obj.accountUnitId){
                        let sum = 0;
                        let temp = 0;

                        originalArr.forEach((item) => {
                            if(item.id !== obj.id && !!item.accountUnitId){
                                sum = Number(item[key]) + sum;
                            }
                            if(!item.accountUnitId){
                                temp =  Number(item[key]);
                            }
                        })
                        sum = Number(obj[key]) + sum;
                        //判断总和是否等于全所汇总数
                        if(Number(temp) !== Number(sum)){
                            return false;
                         }
                    }else{
                        let sum = 0;

                        originalArr.forEach((item) => {
                            if(!!item.accountUnitId){
                                sum = Number(item[key]) + sum;
                            }
                        })
                        //判断总和是否等于全所汇总数
                        if(Number(obj[key]) !== Number(sum)){
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        //选择审批人回调
        assingeeSuccess(assignee){
            this.candidateUser = assignee
            this.vehicleOrganizationSubmit()
        },
        //提交数据
        async vehicleOrganizationSubmit(){
            this.loading = true;
            let params = {
                status:'2',
                id:this.selectionData[0].id,
                outsource:this.selectionData[0].outsource,
                ownPurchase:this.selectionData[0].ownPurchase,
                ownSafeguard:this.selectionData[0].ownSafeguard,
                rentSafeguard:this.selectionData[0].rentSafeguard,
                procDefId: this.procDefId,
                assignee: this.assignee,
                candidateUser:this.candidateUser,
            }
            await gcywBudgetUpdate(params).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.getList();
            }).catch((err) => {
                this.loading = false;
            })
        },
        //重报
        handleReset(){
            this.$modal.confirm("重报后将清除页面上所有未保存数据,是否重报当前所属单位的预算费用信息?").then(()=>{
                this.loading = true;

                let params = {
                    unitId:this.selectionData[0].unitId,
                    budgetTag:this.selectionData[0].budgetTag,
                }
                gcywBudgetClean(params).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message);
                    this.getList();
                }).catch((err) => {
                    this.loading = false;
                })
            })
        },
        //刷新列表数据
        handleQuery(row = {}) {
            this.formData = Object.assign({}, this.formData, row)
            this.getList()
        },
        //清空状态数据
        handleResetDept() {
            this.formData.unitId = '';
            this.formData.budgetTag = '';
        },
    }
}
</script>
<style lang="css" scoped>

</style>
