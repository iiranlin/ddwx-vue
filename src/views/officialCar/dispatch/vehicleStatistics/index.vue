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
                    <template slot="customItemStar">
                        <el-form-item label="统计方式">
                            <el-select v-model="formData.queryType" placeholder="请选择统计方式" clearable style="width:240px" size="small">
                                <el-option v-for="item in queryTypeOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template slot="customItemStar">
                        <el-form-item label="出车日期">
                            <el-date-picker
                                v-model="dateRange"
                                size="small"
                                style="width: 240px"
                                value-format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="handleDateChange"/>
                        </el-form-item>
                    </template>
                    <template slot="customItemStar">
                        <el-form-item label="8点前出车">
                            <el-select v-model="formData.queryHour" placeholder="请选择是否8点前出车" clearable style="width:240px" size="small">
                                <el-option v-for="item in timeOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.code">
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
                    :loading="loading"
                    :tableData="dataList"
                    :property="property"
                    :numberShow="numberShow"
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
import exportDialog from '@/components/ExportDialog'
import indexMixin from "@/views/mixins"
import { axiosDownloadExcel } from '@/api/download'
import { statisticDriverStatic,statisticDriverStaticExport } from '@/api/car'
import { getListByParentId } from "@/api/system/dict";
import dayjs from 'dayjs'

export default {
    name: 'vehicleStatistics',
    mixins: [indexMixin],
    components:{buttonTop,formData,tableIndex,exportDialog},

    data () {
        return {
            //遮罩层
            loading:false,
            //是否显示序号
            numberShow: false,
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
                queryType: '1',
                drivingTimeStart: '',
                drivingTimeEnd: '',
                queryHour: '',
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            //日期区间
            dateRange: [],
            //统计方式字典
            queryTypeOptions: [],
            //是否8点前字典
            timeOptions:[
                {
                    code: '',
                    name: '否'
                },
                {
                    code: '8',
                    name: '是'
                }
            ],
        }
    },
    created () {
        this.formData.drivingTimeStart = this.parseTime(new Date().getTime(),'{y}-{m}') + '-01' 
        this.formData.drivingTimeEnd = this.getLastDayOfMonth();
        this.dateRange = [this.formData.drivingTimeStart,this.formData.drivingTimeEnd];

        this.menuProperty();
        this.getQueryTypeOptions();
        this.getList();
    },
    methods: {
        //获取当前月的最后一天
        getLastDayOfMonth() {
            const now = dayjs();
            const lastDay = now.endOf('month').format('YYYY-MM-DD');
            return lastDay;
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
        //获取统计方式字典
        getQueryTypeOptions(){
            this.loading = true;

            getListByParentId('1828327078216589312').then(({data}) => {
                this.loading = false;
                this.queryTypeOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取分页数据
        getList(){
            this.loading = true;

            statisticDriverStatic(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
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
        handleButton(ids,buttonCode){
            if(buttonCode === 'export'){
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
        },
        //日期选择回调
        handleDateChange(){
            if(this.dateRange == null){
                this.formData.drivingTimeStart = '';
                this.formData.drivingTimeEnd = '';
            }else{
                this.formData.drivingTimeStart = this.dateRange[0];
                this.formData.drivingTimeEnd = this.dateRange[1];
            }
        },
        //清空自定义搜索条件
        handleResetDept(){
            this.formData.drivingTimeStart = this.parseTime(new Date().getTime(),'{y}-{m}') + '-01' 
            this.formData.drivingTimeEnd = this.getLastDayOfMonth();
            this.dateRange = [this.formData.drivingTimeStart,this.formData.drivingTimeEnd];
            this.formData.queryType = '1';
            this.formData.queryHour = '';
        },
        // 导出文件
        exportFile(pageInfo) {
            axiosDownloadExcel(statisticDriverStaticExport, Object.assign({}, pageInfo, this.listQuery, this.formData))
        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        tableRowClassName({row,rowIndex}){
            row.index = rowIndex + 1;
        },
        numberChange(val) {
            this.numberShow = val
        },
    },
}
</script>
<style lang="scss" scoped>
.container_table {
    margin-bottom: 10px;
}
</style>