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
                    @handleQueryDept="handleQueryDept"
                    @handleResetDept="handleResetDept"
                    style="margin-top:-12px;margin-bottom:6px">
                    <template slot="customItem">
                      <el-form-item label="用车部门" prop="value">
                        <el-select v-model="formData.deptId" placeholder="请选择用车部门" clearable style="width:240px" size="small">
                          <el-option v-for="item in deptOptions"
                            :key="item.value"
                            :label="item.deptName"
                            :value="item.id">
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
                    @clickLink="clickLink"
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
                    style="margin-bottom:40px"
                />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import formData from "@/components/formData"
import tableIndex from "@/components/tableIndex"
import {gcywVehicleRequestDispatchListInfo} from "@/api/car"
import {getAllAvailableDept} from "@/api/dept"
import indexMixin from "@/views/mixins"

export default {
    name:"searchVehicleInfo",
    components:{buttonTop,formData,tableIndex},
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
            //表格数据
            dataList:[],
            //日期范围
            dateRange:[],
            //列表显示字段
            property:{},
            //用车部门数据
            deptOptions:[],
            //查询参数
            formData:{
                deptId:"",
            },
            //已选中条目
            selectionData:[],
            //数据总数
            total:0,
          numberShow: false
        }
    },
    created(){
        Object.assign(this.$data, this.$options.data());
        this.menuProperty();
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
        //获取分页数据
        async getList(){
            this.loading = true;

            await gcywVehicleRequestDispatchListInfo(Object.assign({}, this.listQuery,this.formData)).then(({data})=>{
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
        //查询部门数据
        handleQueryDept(unitCode){
            this.formData.deptId ="";
            this.loading = true;
            getAllAvailableDept({unitCode:unitCode}).then(({data}) => {
                this.loading = false;
                this.deptOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //清空部门数据
        handleResetDept(){
            this.formData.deptId = "";
            this.deptOptions = [];
        },
        //
        clickLink(row, fieldCode, linkText){
            let name = linkText.substring(linkText.indexOf("/")+1);
            this.$router.push({
                name: name,
                params: {
                    id:row.id
                },
            })
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
