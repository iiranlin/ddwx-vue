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
                        <el-form-item label="司机">
                            <el-select v-model="formData.driverId" placeholder="请选择司机" clearable style="width:240px" size="small">
                                <el-option v-for="item in driverList"
                                    :key="item.value"
                                    :label="item.username"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </form-data>
                <!--表格数据-->
                <el-table ref="elTable" class="container_table" height="100%" v-loading="loading"
                    :data="dataList" border @selection-change="handleSelectionChange" stripe>
                    <el-table-column width="50" align="center" label="序号" type="index" v-if="numberShow" />
                    <el-table-column label="司机" prop="driver" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="出车里程" align="center"
                        :show-overflow-tooltip="true">
                        <template>
                            <el-table-column label="小轿车" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.carMiles}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="面包车" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.vanMiles}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="考斯特" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.cstMiles}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="合计里程" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.totalMiles}}</span>
                                </template>
                            </el-table-column>
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
import { statisticDriverMilesStatic,statisticDriverMilesStaticExport } from '@/api/car'
import{ gcjcDriverList } from "@/api/driver"

export default {
    name: 'driverMileageStatistics',
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
                drivingTimeStart: '',
                drivingTimeEnd: '',
                driverId: '',
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            //日期区间
            dateRange: [],
            //司机数据
            driverList: [],
        }
    },
    created () {
        this.menuProperty();
        this.getList();
        this.getDriverList();
    },
    methods: {
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
        getList(){
            this.loading = true;

            statisticDriverMilesStatic(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取司机数据
        getDriverList(){
            this.loading = true;

            gcjcDriverList().then(({data})=>{
                this.driverList = data.list;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //顶部按钮点击
        newButton(buttonCode,row){
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
            this.dateRange = [];
            this.formData.drivingTimeStart = '';
            this.formData.drivingTimeEnd = '';
            this.formData.driverId = '';
        },
        // 导出文件
        exportFile(pageInfo) {
            axiosDownloadExcel(statisticDriverMilesStaticExport, Object.assign({}, pageInfo, this.listQuery, this.formData))
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