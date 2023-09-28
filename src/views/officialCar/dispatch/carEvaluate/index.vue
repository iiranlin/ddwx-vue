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
                        @numberChange="numberChange"
                        @handleCheckAllChange="handleCheckAllChange"
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
                    <template slot="customItem">
                        <el-form-item label="评价周期">
                            <el-date-picker
                                v-model="dateRange"
                                size="small"
                                style="width: 240px"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleDateChange"/>
                        </el-form-item>
                    </template>
                </form-data>
                <!--报表数据-->
                <div class="echarts-container">
                    <div id="overallChart" class="echartsItem-pie"></div>
                    <div id="firstChart" class="echartsItem-line"></div>
                    <div id="lastChart" class="echartsItem-line"></div>
                </div>
                <!--表格数据-->
                <table-index
                    ref="tableIndex"
                    style="margin-top:-8px"
                    :tableIndexs="tableIndex"
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    :numberShow="numberShow"
                    :selectShow="false"
                    :showSummary="true"
                    :getSummaries="getSummaries"
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
                    style="margin-bottom:40px"/>
            </el-col>
        </el-row>
        <export-dialog ref="export" :page-num="listQuery.pageNum" :page-size="listQuery.pageSize" :total="total" @exportFile="exportFile"/>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import { axiosDownloadExcel } from '@/api/download'
import indexMixin from "@/views/mixins"
import exportDialog from '@/components/ExportDialog'
import{carFeeExportUrl} from "@/api/driver"
import{gcywRequestEvaluateAnalysis,gcywRequestEvaluateList,gcywRequestEvaluateExportList} from "@/api/car"
import echarts from "echarts";

export default {
    name:"carEvaluate",
    mixins:[indexMixin],
    components:{buttonTop,formData,tableIndex,exportDialog},

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
            //表格数据
            dataList:[],
            //日期范围
            dateRange:[],
            //列表显示字段
            property:{},
            //查询参数
            formData:{
                createDateBegin:'',
                createDateEnd:'',
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            numberShow: true,
            //前五数据
            firstList:[],
            //后五数据
            lastList:[],
            //总体数据
            overallData:{},
            //合计数据
            sumTotal:{},
        }
    },
    created(){
        this.menuProperty();
        this.getAnalysis();
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
            });
        },
        //获取报表数据
        getAnalysis(){
            this.loading = true;

            gcywRequestEvaluateAnalysis(Object.assign({},this.formData)).then(({data})=>{
                this.initOverallChart(data.total);
                this.initFirstChart(data.desc);
                this.initLastChart(data.asc);
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取分页数据
        async getList(){
            this.loading = true;

            await gcywRequestEvaluateList(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.page.list;
                this.total = data.page.total;
                this.sumTotal = data.total
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //初始化总体评价图表
        initOverallChart(data){
            //初始化评价分类数据     1：非常不满意 2：不满意 3：一般 4：比较满意 5：非常满意
            let dataList = [];
            for (let i = 0; i < 5; i++) {
                let obj = {};
                if(i===0){
                    this.$set(obj, 'name', '非常差');
                    this.$set(obj, 'value', data.oneNum);
                }else if(i===1){
                    this.$set(obj, 'name', '较差');
                    this.$set(obj, 'value', data.secondNum);
                }else if(i===2){
                    this.$set(obj, 'name', '一般');
                    this.$set(obj, 'value', data.threeNum);
                }else if(i===3){
                    this.$set(obj, 'name', '比较满意');
                    this.$set(obj, 'value', data.fourNum);
                }else if(i===4){
                    this.$set(obj, 'name', '非常满意');
                    this.$set(obj, 'value', data.fiveNum);
                }
                dataList.push(obj);
            }
            let option = {
                legend: {
                    data: ["非常差", "较差", "一般", "比较满意", "非常满意"],
                    bottom: "0%",
                    orient: "horizontal"
                },
                title: {
                    text: "总体评价情况",
                    top: "0px",
                    left: "center"
                },
                series:[
                    {
                        type:'pie',
                        radius: "45px", //饼图半径
                        label: {
                            show: true,
                            formatter: "{b} : {c}" // b代表名称，c代表对应值，d代表百分比
                        },
                        data:dataList,
                        itemStyle:{
                            normal: {
                            color: function (colors) {
                                var colorList = [
                                '#fc8251',
                                '#f9c956',
                                '#91cd77',
                                '#75bedc',
                                '#5470c6',
                                ];
                                return colorList[colors.dataIndex];
                            }
                            },
                        },
                    }
                ]
            }
            let overallChart = echarts.init(document.getElementById("overallChart"));
            overallChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                overallChart.resize();
            });
        },
        //初始化前五排行榜
        initFirstChart(dataList){
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].driverName);
            }
            //Y轴坐标值
            let lineItemListY = [];
            for (let i = 0; i < dataList.length; i++) {
                lineItemListY.push(dataList[i].goodEvaluate);
            }
            let option = {
                title: {
                    text: "前五排行榜",
                    top: "0px",
                    left: "center"
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {},
                series:[
                    {
                        type:'bar',
                        data:lineItemListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        itemStyle: {
                           color:'#5470c6',
                        }
                    }
                ]
            }
            let firstChart = echarts.init(document.getElementById("firstChart"));
            firstChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                firstChart.resize();
            });
        },
         //初始化后五排行榜
        initLastChart(dataList){
            //X轴坐标值
            let lineItemListX = [];

            for (let i = 0; i < dataList.length; i++) {
                lineItemListX.push(dataList[i].driverName);
            }
            //Y轴坐标值
            let lineItemListY = [];
            for (let i = 0; i < dataList.length; i++) {
                lineItemListY.push(dataList[i].goodEvaluate);
            }
            let option = {
                title: {
                    text: "后五排行榜",
                    top: "0px",
                    left: "center"
                },
                xAxis: {
                    data: lineItemListX,
                },
                yAxis: {},
                series:[
                    {
                        type:'bar',
                        data:lineItemListY,
                        label: {
                            show: true,
                            position: "top"
                        },
                        itemStyle: {
                           color:'#fc8251',
                        }
                    }
                ]
            }
            let lastChart = echarts.init(document.getElementById("lastChart"));
            lastChart.setOption(option);
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                lastChart.resize();
            });
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            this.$refs.tableIndex.newButton(buttonCode,row);
        },
        //页面按钮点击事件
        handleButton(ids,buttonCode,row){
            if(buttonCode==='export'){
                this.$refs.export.init()
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
            this.ids = selection.map(item => item.carId)
        },
        //评价周期回调
        handleDateChange(){
            this.formData.createDateBegin = this.dateRange[0];
            this.formData.createDateEnd = this.dateRange[1];
        },
        //清空搜索数据
        handleResetDept(){
            this.formData.createDateBegin = '';
            this.formData.createDateEnd = '';
            this.dateRange = [];
        },
        // 导出文件
        exportFile(pageInfo) {
            // 整合page信息
            axiosDownloadExcel(gcywRequestEvaluateExportList, Object.assign({}, pageInfo, this.listQuery, this.formData))
        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
            this.getAnalysis();
        },
        tableRowClassName({row,rowIndex}){
            row.index = rowIndex + 1;
        },
        //合计显示规则
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            let targetColumenIndex = this.numberShow ? 1:0;

            columns.forEach((column, index) => {
                if (index === targetColumenIndex) {
                    sums[index] = '合计';
                    return;
                }
                if(column.property === 'requestNum'){
                    sums[index] = this.sumTotal.requestNum;
                }else if(column.property === 'evaluateNum'){
                    sums[index] = this.sumTotal.evaluateNum;
                }else if(column.property === 'oneNum'){
                    sums[index] = this.sumTotal.oneNum;
                }else if(column.property === 'secondNum'){
                    sums[index] = this.sumTotal.secondNum;
                }else if(column.property === 'threeNum'){
                    sums[index] = this.sumTotal.threeNum;
                }else if(column.property === 'fourNum'){
                    sums[index] = this.sumTotal.fourNum;
                }else if(column.property === 'fiveNum'){
                    sums[index] = this.sumTotal.fiveNum;
                }else if(column.property === 'goodEvaluate'){
                    sums[index] = this.sumTotal.goodEvaluate;
                }else {
                    sums[index] = '';
                }
            });
            return sums;
        },
    }
}
</script>
<style lang="css" scoped>
.echarts-container {
    width: 100%;
    height: 200px;
    display: flex;
    margin-top: -20px;
    justify-content: space-between;
}
.echartsItem-pie {
    flex: 1.2;
    height: 190px;
}
.echartsItem-line {
    flex: 1;
    height: 190px;
}
::v-deep.el-table tbody tr.current-row > td {
    background-color: #b8d9fd !important;
}
</style>
