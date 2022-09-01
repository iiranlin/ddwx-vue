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
                        <el-form-item label="使用单位" prop="value">
                        <el-select v-model="formData.usageUnitCode" placeholder="请选择使用单位" clearable style="width:240px" size="small">
                            <el-option v-for="item in unitOptions"
                                :key="item.value"
                                :label="item.unitName"
                                :value="item.unitCode">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </template>
                    <template slot="customItemStar">
                        <el-form-item label="产权单位" prop="value">
                            <el-select v-model="formData.unitCode" placeholder="请选择产权单位" clearable style="width:240px" size="small">
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
                    :selectShow="false"
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
        <export-dialog ref="export" :page-num="listQuery.pageNum" :page-size="listQuery.pageSize" :total="total" @exportFile="exportFile"/>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import{vehicleInfoGetStatList,carFeeExportUrl} from "@/api/driver"
import {allUnit} from "@/api/system/unit";
import { axiosDownloadExcel } from '@/api/download'
import indexMixin from "@/views/mixins"
import exportDialog from '@/components/ExportDialog'

export default {
    name:"carFee",
    components:{buttonTop,formData,tableIndex,exportDialog},
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
                usageUnitCode:'',
                unitCode:'',
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
            //单位数据
            unitOptions:[],
        }
    },
    created(){
        this.menuProperty();
        this.getList();
        this.getUntiList();
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

            await vehicleInfoGetStatList(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
                this.dataList = data.list;
                this.total = data.total;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取单位数据
       async getUntiList(){
            this.loading = true;

            await allUnit().then(({data})=>{
                this.unitOptions = data;
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
            if(buttonCode==='export'){
                this.$refs.export.init()
            }
        },
        // 导出文件
        exportFile(pageInfo) {
            // 整合page信息
            axiosDownloadExcel(carFeeExportUrl, Object.assign({}, pageInfo, this.listQuery, this.formData))
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
        //新建或修改成功回调
        operateSuccess(){
            this.handleQuery();
        },
        //清空单位数据
        handleResetDept(){
            this.formData.usageUnitCode = "";
            this.formData.unitCode = "";
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
