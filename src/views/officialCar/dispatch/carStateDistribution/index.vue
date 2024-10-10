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
                        <el-form-item label="用车申请日期">
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
                </form-data>
                <!--表格数据-->
                <el-table ref="elTable" class="container_table" height="100%" v-loading="loading"
                    :data="dataList" border @selection-change="handleSelectionChange" stripe>
                    <el-table-column width="50" align="center" label="序号" type="index" v-if="numberShow" />
                    <el-table-column label="应用端" prop="source" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="用户申请订单量" align="center"
                        :show-overflow-tooltip="true">
                        <template>
                            <el-table-column label="总订单数" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.totalCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="网上订单" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.pcCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="电话订单" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.rgCount}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态分布" align="center" prop="realCount"
                        :show-overflow-tooltip="true">
                        <template>
                            <el-table-column label="待派单" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dispatchCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="进行中" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.drivingCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="已完成" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.finishCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="已取消/驳回" align="center" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.cacelCount}}</span>
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
import { statisticRequestOrderStatic,statisticRequestOrderStaticExport } from '@/api/car'

export default {
    name: 'carStateDistribution',
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
                createTimeStart: '',
                createTimeEnd: '',
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            //日期区间
            dateRange: [],
        }
    },
    created () {
        this.menuProperty();
        this.getList();
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

            statisticRequestOrderStatic(this.formData).then(({data})=>{
                this.dataList = data;
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
                this.formData.createTimeStart = '';
                this.formData.createTimeEnd = '';
            }else{
                this.formData.createTimeStart = this.dateRange[0];
                this.formData.createTimeEnd = this.dateRange[1];
            }
        },
        //清空自定义搜索条件
        handleResetDept(){
            this.dateRange = [];
            this.formData.createTimeStart = '';
            this.formData.createTimeEnd = '';
        },
        // 导出文件
        exportFile(pageInfo) {
            axiosDownloadExcel(statisticRequestOrderStaticExport, Object.assign({}, pageInfo, this.listQuery, this.formData))
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