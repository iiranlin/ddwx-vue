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
                            <el-table-column label="保险公司" align="center" prop="insrUnit" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保单号" align="center" prop="insrNumber" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="投保人" align="center" prop="policyHolder" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="投保金额" align="center" prop="minsrFee" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="生效日期" align="center" prop="insrDate" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{parseTime(scope.row.insrDate,'{y}-{m}-{d}')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="到期时间" align="center" prop="dueDate" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{parseTime(scope.row.dueDate,'{y}-{m}-{d}')}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="经办人" align="center" prop="clerk" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="险种" align="center" prop="insrType" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保费" align="center" prop="insrFee" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="保额" align="center" prop="insrPaidAmount" :show-overflow-tooltip="true"></el-table-column>
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
import { gcywInsuranceRecordImportSave } from '@/api/driver'

export default {
    name:"insuranceImport",
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
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created(){
        this.tableData = this.$route.params.obj;
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

                gcywInsuranceRecordImportSave(this.selectionData).then(({message}) => {
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
                         this.$router.push({ name: 'insuranceManagement' })
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