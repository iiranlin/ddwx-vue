<template>
   <div class="app-container_list">
        <el-row :gutter="20" class="container_h" v-loading="loading">
            <el-col :span="24" :xs="24" class="container_flex">
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
                </el-row>
                <el-row>
                    <el-col :span="24" :xs="24">
                        <el-table ref="eltable" :data="tableData" stripe border @selection-change="handleSelectionChange">
                            <el-table-column type="selection" align="center"></el-table-column>
                            <el-table-column label='序号' type="index" align="center" ></el-table-column>
                            <el-table-column label="车牌号" align="center" prop="carNumber" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="维保类型" align="center" prop="maintainType" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{checkMaintainType(scope.row.maintainType)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="司机" align="center" prop="driver" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="店铺地址" align="center" prop="maintainShop" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保养日期" align="center" prop="maintainDate" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保养里程" align="center" prop="maintainMiles" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保养地点" align="center" prop="maintainAddress" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="项目" align="center" prop="itemName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="材料费" align="center" prop="materialCost" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="材料数量" align="center" prop="materialNum" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="工时费" align="center" prop="hourlyCost" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="工时（小时）" align="center" prop="hourlyNum" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="其他费" align="center" prop="otherCost" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="状态" align="center" prop="statusStr" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" v-if="!scope.row.isSum" @click="handleDeleteClick(scope.$index)" style="color:#1890ff;">删除</a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import buttonTop from "@/components/buttonTop"
import { getListByParentId } from '@/api/system/dict'
import { maintenanceRecordImportSave } from '@/api/maintenanceRecord'

export default {
    name:"maintenanceImport",
    components:{buttonTop},

    data() {
        return {
            //遮罩层
            loading:false,
            //非单个禁用
            single:true,
            //非多个禁用
            multiple:true,
            //列表显示字段
            property:{},
            //表格数据
            tableData:[],
            //选中数据
            selectionData:[],
            //维保类型
            maintenanceTypeOptions: [],
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created(){
        this.tableData = this.$route.params.obj;
        this.getMaintenanceTypeOptions();
        this.menuProperty();
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
        //获取维保类型
        getMaintenanceTypeOptions() {
            this.loading = true

            getListByParentId('1529623183877562368').then(({ data }) => {
                this.loading = false
                this.maintenanceTypeOptions = data
            }).catch((err) => {
                this.loading = false
            })
        },
        //顶部按钮点击
        newButton(buttonCode,row){
            if(buttonCode==='save'){
                this.handleSave();
            }
        },
        //多选获取行数据
        handleSelectionChange(selection) {
            this.selectionData = selection;
        },
         //维保类型
        checkMaintainType(maintainTye){
            let obj = this.maintenanceTypeOptions.find((item) => {
                return item.code === maintainTye;
            })
            return !!obj?obj.name:'';
        },
        //删除
        handleDeleteClick(index){
            this.tableData.splice(index, 1)
        },
        //保存
        handleSave(){
            if(this.selectionData.length === 0){
                this.$modal.msgWarning('请选择要保存的条目!')
                return
            }
            let notSave = this.selectionData.some((item) => {
                return !!item.statusStr
            })
            if(notSave){
                this.$modal.msgWarning("当前选项中有'车牌号不存在'的条目,请重新选择!")
                return
            }
            this.$modal.confirm('是否保存选中数据?').then(() => {
                this.loading = true;

                maintenanceRecordImportSave(this.selectionData).then(({message}) => {
                    this.loading = false;
                    this.$modal.msgSuccess(message)
                    this.closeCurrentPage();
                }).catch((err) => {
                    this.loading = false;
                })
            }).catch(() => {

            });
        },
        //关闭当前页面
        closeCurrentPage() {
            this.visitedViews.forEach((item) => {
                if (item.name === this.$route.name) {
                    this.$tab.closePage(item).then(({ visitedViews }) => {
                         this.$router.push({ name: 'maintenanceManagement' })
                    })
                }
            })
        },
    },
}
</script>
<style scoped>
    .app-container_list {
        overflow: auto;
    }
</style>