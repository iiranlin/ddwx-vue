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
                            <el-table-column type="selection" align="center" :selectable="selectable"></el-table-column>
                            <el-table-column label='序号' type="index" align="center"></el-table-column>
                            <el-table-column label="卡号" align="center" prop="cardNumber" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="交易类型" align="center" prop="incomeOrExp" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{checkIncomeOrExp(scope.row.incomeOrExp)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="车牌号" align="center" prop="carNumber" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="交易日期" align="center" prop="transDate" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column label="交易金额" align="center" prop="transFee" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="油品" align="center" prop="gasGrade" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="油价" align="center" prop="oilPrice" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="数量" align="center" prop="oilNum" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="状态" align="center" prop="statusStr"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)"  v-if="!scope.row.isSum" @click="handleDeleteClick(scope.$index)" style="color:#1890ff;">删除</a>
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
import { gcywFuelRecordImportSave } from '@/api/fuelCardManagement/fuelCardRecord'

export default {
    name:"fuelCardImport",
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
            //交易类型数据
            incomeOrExpOptions:[],
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created(){
        this.tableData = this.$route.params.obj;
        
        this.getIncomeOrExpOptions();
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
        //获取交易类型
        getIncomeOrExpOptions() {
            this.loading = true

            getListByParentId('1529008035781427200').then(({ data }) => {
                this.loading = false
                this.incomeOrExpOptions = data;
                this.initSumTransFee();
            }).catch((err) => {
                this.loading = false
            })
        },
        //初始化小计数据
        initSumTransFee(){
            let tempArr = [];

            //添加类型
            this.incomeOrExpOptions.forEach((item,index) => {
                let obj = {};
                this.$set(obj, 'incomeOrExp', item.code);
                this.$set(obj, 'isSum', true)
                tempArr.push(obj)
            })
            //添加类型数据
            tempArr.forEach((item) => {
                let tempTransFee = 0;
                this.tableData.forEach((itemChild) => {
                    if(item.incomeOrExp === itemChild.incomeOrExp){
                        tempTransFee = (tempTransFee*1000 + itemChild.transFee*1000)/1000;
                    }
                })
                this.$set(item, 'transFee', tempTransFee);
            })
            //删除无效类型
            let finalArr = [];
            tempArr.forEach((item) => {
                let isExist = this.tableData.some((itemChild) => {
                    return item.incomeOrExp === itemChild.incomeOrExp;
                })
                if(isExist){
                    finalArr.push(item)
                }
            })
            //添加到表格
            this.$set(finalArr[0], 'cardNumber', '小计');
            this.tableData = [...this.tableData,...finalArr];
        },
        //设置是否可以选中
        selectable:function(row,index){
            if(row.isSum){
                return false;
            }
            return true;
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
        //交易类型
        checkIncomeOrExp(value){
            let obj = this.incomeOrExpOptions.find((item) => {
                return item.code === value
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
                this.$modal.msgWarning("当前选项中有'卡号不存在'或者'记录存在'的条目,请重新选择!")
                return
            }
            this.$modal.confirm('是否保存选中数据?').then(() => {
                this.loading = true;

                gcywFuelRecordImportSave(this.selectionData).then(({message}) => {
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
                         this.$router.push({ name: 'fuelCardRecord' })
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
.title-icon {
    color: rgb(64, 158, 255);
    margin-right: 5px;
}
</style>