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
         <!--弹出框-->
        <operate ref="operate" @operateSuccess="operateSuccess"></operate>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import indexMixin from "@/views/mixins"
import {gcjcDriverPeccancyListPage,gcjcDriverPeccancyUpdate} from "@/api/violationRegistration"
import operate from "./components/operate"

export default {
    name: 'violationRegistration',
    mixins: [indexMixin],
    components:{buttonTop,formData,tableIndex,operate},

    data () {
        return {
            //遮罩层
            loading:false,
            //是否显示序号
            numberShow: true,
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

            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
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

            gcjcDriverPeccancyListPage(Object.assign({}, this.listQuery, this.formData)).then(({data})=>{
                this.loading = false;
                this.dataList = data.list;
                this.total = data.total
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
            if(buttonCode == 'create'){
                this.$refs.operate.init('create');
            }else if(buttonCode == 'update'){
                this.$refs.operate.init('update',this.selectionData[0]);
            }else if(buttonCode == 'submit'){
                if(this.selectionData[0].status == '1'){
                    this.$modal.msgWarning('已提交单据无法重复提交!');
                    return
                }
                this.handleSubmit()
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
       
        //清空自定义搜索条件
        handleResetDept(){

        },
        //刷新列表数据
        handleQuery(row = {}){
            this.formData = Object.assign({}, this.formData,row);
            this.getList();
        },
        //新建或修改成功回调
        operateSuccess(){
            this.handleQuery();
        },
        //提交
        handleSubmit(){
            this.loading = true;

            let params = {
                status: '1',
            }
            gcjcDriverPeccancyUpdate(Object.assign({}, this.selectionData[0], params)).then(({data})=>{
                this.loading = false;
                this.handleQuery();
            }).catch((err) => {
                this.loading = false;
            })
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