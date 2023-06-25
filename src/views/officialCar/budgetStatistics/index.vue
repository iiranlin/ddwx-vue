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
                        <el-form-item label="统计年度">
                            <el-date-picker
                                style="width:240px"
                                value-format="yyyy"
                                v-model="formData.dateRange"
                                type="monthrange"
                                placeholder="请选择统计年度"
                                size="small"
                                @change="handleDateChange"/>
                        </el-form-item>
                    </template>
                </form-data>
                <div class="div_title" v-if="dataList.length!==0">
                    <span>铁科院集团公司{{formData.eyear}}年公务用车专项统计表</span>
                </div>
                <!--表格数据-->
                <el-table :key="tableRefresh" ref="elTable" class="container_table" height="100%" v-loading="loading" :data="dataList" border 
                    @selection-change="handleSelectionChange" :span-method="spanMethod" highlight-current-row stripe show-summary :summary-method="getSummaries">
                    <el-table-column width="50" align="center" label="序号" type="index" v-if="numberShow"/>
                    <el-table-column label="所属单位" prop="unitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="固定资产单位列账名称" prop="accountUnitName" align="center"  :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="自有车辆总数（辆）" align="center" prop="realCount" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="编制车辆总数（辆）" align="center" prop="strengthCount" :show-overflow-tooltip="true"></el-table-column>
                   
                    <template v-for="(item,index) in binfosArr.length===0?1:binfosArr">
                        <!--预算费用-->
                        <el-table-column :label="item.year + '年预算费用（万元）'" align="center" :show-overflow-tooltip="true" :key="`binfo_${index}`" v-if="!!binfosArr[index]">
                            <el-table-column label="自有车辆购置费用" align="center" :show-overflow-tooltip="true" :prop="item.year + 'binfo_ownPurchase'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'binfo_ownPurchase'] || 0}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="运行维护费用" align="center" :show-overflow-tooltip="true">
                                <el-table-column label="自有车辆" align="center" :show-overflow-tooltip="true" :prop="item.year + 'binfo_ownSafeguard'">
                                    <template slot-scope="scope">
                                        <span>{{scope.row[item.year + 'binfo_ownSafeguard'] || 0}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="租赁车辆" align="center" :show-overflow-tooltip="true" :prop="item.year + 'binfo_rentSafeguard'">
                                    <template slot-scope="scope"> 
                                        <span>{{scope.row[item.year + 'binfo_rentSafeguard'] || 0}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="小计" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'binfo_subtotal'">
                                    <template slot-scope="scope">
                                        <span>{{scope.row[item.year + 'binfo_subtotal'] || 0}}</span>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="业务外包" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'binfo_outsource'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'binfo_outsource'] || 0}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合计" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'binfo_summation'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'binfo_summation'] || 0}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <!--实际费用-->
                        <el-table-column :label="item.year + '年实际费用（万元）'" align="center" :show-overflow-tooltip="true" :key="`rinfo_${index}`" v-if="!!rinfosArr[index]">
                            <el-table-column label="自有车辆购置费用" align="center" :show-overflow-tooltip="true" :prop="item.year + 'rinfo_ownPurchase'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'rinfo_ownPurchase'] || 0}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="运行维护费用" align="center" :show-overflow-tooltip="true">
                                <el-table-column label="自有车辆" align="center" :show-overflow-tooltip="true" :prop="item.year + 'rinfo_ownSafeguard'">
                                    <template slot-scope="scope">
                                        <span>{{scope.row[item.year + 'rinfo_ownSafeguard'] || 0}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="租赁车辆" align="center" :show-overflow-tooltip="true" :prop="item.year + 'rinfo_rentSafeguard'">
                                    <template slot-scope="scope">
                                        <span>{{scope.row[item.year + 'rinfo_rentSafeguard'] || 0}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="小计" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'rinfo_subtotal'">
                                    <template slot-scope="scope">
                                        <span>{{scope.row[item.year + 'rinfo_subtotal'] || 0}}</span>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column label="业务外包" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'rinfo_outsource'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'rinfo_outsource'] || 0}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合计" align="center"  :show-overflow-tooltip="true" :prop="item.year + 'rinfo_summation'">
                                <template slot-scope="scope">
                                    <span>{{scope.row[item.year + 'rinfo_summation'] || 0}}</span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </template>
                    <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import buttonTop from '@/components/buttonTop'
import formData from '@/components/formData'
import { gcywBudgetExportDate,gcywBudgetExportFile } from '@/api/organization'
import { axiosDownloadExcel } from '@/api/download'
import indexMixin from '@/views/mixins'

export default {
    name: 'budgetStatistics',
    mixins: [indexMixin],
    components: { buttonTop, formData},

    data () {
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
            //列表显示字段
            property: {},
            //查询参数
            formData: {
                dateRange:[],
                syear: null,
                eyear:null,
            },
            //是否显示序号
            numberShow: false,
            //合并数据
            spanArr:[],
            //预算数据
            binfosArr:[],
            //实际数据
            rinfosArr:[],
            //触发表格重新渲染
            tableRefresh:0,
        }
    },
    mounted() {
        this.menuProperty();
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
        //获取分页数据
        async getList() {
            if(!this.formData.syear && !this.formData.eyear){
                return;
            }
            let currentYear = new Date().getFullYear();

            if(this.formData.eyear > currentYear || this.formData.syear < currentYear -2){
                this.$modal.msgWarning('只能查询近3年的数据，请重新选择');
                return;
            }
            this.loading = true

            let params = {
                syear:this.formData.syear,
                eyear:this.formData.eyear,
            }
            await gcywBudgetExportDate(params).then(({ data }) => {
                this.loading = false;
                this.dataList = data.infos;

                this.initDataList(data);
                this.initSpanArr();

                this.$nextTick(() => {
                    this.tableRefresh++;
                })
            }).catch(() => {
                this.loading = false;
            })
        },
        //封装数据
        initDataList(data){
            //清空数据
            this.binfosArr = [];
            this.rinfosArr = [];

            //预算数据
            let binfos = data.binfos;
            //实际数据
            let rinfos = data.rinfos;

            Object.keys(binfos).forEach((key) => {
                let obj = {};
                this.$set(obj, 'year', key);
                this.$set(obj, 'value', binfos[key]);
                this.binfosArr.push(obj)
            })
            Object.keys(rinfos).forEach((key) => {
                let obj = {};
                this.$set(obj, 'year', key);
                this.$set(obj, 'value', rinfos[key]);
                this.rinfosArr.push(obj)
            })
            this.dataList.forEach((item,index) => {
                this.binfosArr.forEach((binfosArrItem) => {
                    this.$set(item, binfosArrItem.year + 'binfo_ownPurchase', binfosArrItem.value[index].ownPurchase);
                    this.$set(item, binfosArrItem.year + 'binfo_ownSafeguard', binfosArrItem.value[index].ownSafeguard);
                    this.$set(item, binfosArrItem.year + 'binfo_rentSafeguard', binfosArrItem.value[index].rentSafeguard);
                    this.$set(item, binfosArrItem.year + 'binfo_outsource', binfosArrItem.value[index].outsource);
                    this.$set(item, binfosArrItem.year + 'binfo_subtotal', this.checkSubtotal(binfosArrItem.value[index].ownSafeguard,binfosArrItem.value[index].rentSafeguard));
                    this.$set(item, binfosArrItem.year + 'binfo_summation', this.checkSummation(binfosArrItem.value[index].ownPurchase,binfosArrItem.value[index].ownSafeguard,
                                    binfosArrItem.value[index].rentSafeguard,binfosArrItem.value[index].outsource));
                })
                this.rinfosArr.forEach((rinfosArrItem) => {
                    this.$set(item, rinfosArrItem.year + 'rinfo_ownPurchase', rinfosArrItem.value[index].ownPurchase);
                    this.$set(item, rinfosArrItem.year + 'rinfo_ownSafeguard', rinfosArrItem.value[index].ownSafeguard);
                    this.$set(item, rinfosArrItem.year + 'rinfo_rentSafeguard', rinfosArrItem.value[index].rentSafeguard);
                    this.$set(item, rinfosArrItem.year + 'rinfo_outsource', rinfosArrItem.value[index].outsource);
                    this.$set(item, rinfosArrItem.year + 'rinfo_subtotal', this.checkSubtotal(rinfosArrItem.value[index].ownSafeguard,rinfosArrItem.value[index].rentSafeguard));
                    this.$set(item, rinfosArrItem.year + 'rinfo_summation', this.checkSummation(rinfosArrItem.value[index].ownPurchase,rinfosArrItem.value[index].ownSafeguard,
                                    rinfosArrItem.value[index].rentSafeguard,rinfosArrItem.value[index].outsource));
                })
            })
        },
        //小计
        checkSubtotal(ownSafeguard,rentSafeguard){
            return (ownSafeguard*1000 + rentSafeguard*1000)/1000;
        },
        //合计
        checkSummation(ownPurchase,ownSafeguard,rentSafeguard,outsource){
            return (ownPurchase*1000 + ownSafeguard*1000 + rentSafeguard*1000 + outsource*1000)/1000;
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
                    if (this.dataList[index].unitName === this.dataList[index - 1].unitName) {
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
            let targetColumenIndex = this.numberShow ? 1:0;

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
            let targetColumenIndex = this.numberShow ? 1:0;

            columns.forEach((column, index) => {
                if (index === targetColumenIndex) {
                    sums[index] = '总计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));

                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] += '';
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        },
        //顶部按钮点击
        newButton(buttonCode) {
            if(buttonCode === 'export'){
                this.handleExport();
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
        //统计年度切换
        handleDateChange(){
            this.formData.syear = this.formData.dateRange[0];
            this.formData.eyear = this.formData.dateRange[1];
        },
        //导出
        handleExport(){
            if(!this.formData.syear && !this.formData.eyear){
                return;
            }
            let params = {
                syear: this.formData.syear,
                eyear: this.formData.eyear,
            }
            axiosDownloadExcel(gcywBudgetExportFile,params);
        },
        //刷新列表数据
        handleQuery(row = {}) {
            this.formData = Object.assign({}, this.formData, row)
            this.getList()
        },
        //清空状态数据
        handleResetDept() {
            this.formData.dateRange = [];
            this.formData.syear = null;
            this.formData.eyear = null;
            this.binfosArr = [];
            this.rinfosArr = [];
            this.dataList = [];
            this.tableRefresh++;
        },
    }
}
</script>
<style lang="scss">
.div_title {
    text-align: center;
    margin-top: -15px;
    margin-bottom: 10px;

    span {
        font-weight: 700;
        font-size: 22px;
    }
}
</style>