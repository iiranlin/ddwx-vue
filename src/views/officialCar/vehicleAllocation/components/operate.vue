<template>
    <el-dialog :title="title" :visible.sync="openDataScope" width="800px" append-to-body center @close="handleDialogClose()">
        <el-row :span="24" :gutter="20">
            <el-table :data="vehicleData" border stripe style="width: 100%" max-height="400px"  v-loading="loading">
                <el-table-column label="车牌号" prop="carNumber" width="200" align="center"></el-table-column>
                <el-table-column label="使用范围" align="center" >
                    <template v-slot="scope">
                        <el-radio v-model="vehicleData[scope.$index].usageFlag" label="1">本级及所属下级使用</el-radio>
                        <el-radio v-model="vehicleData[scope.$index].usageFlag" label="0">仅本级使用</el-radio>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSave()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {vehicleInfoUpdGVC} from "@/api/system/vehicleAllocation"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //车辆数据
            vehicleData:[],
            //显示隐藏
            openDataScope:false,
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(originData,usageDept){
            originData.forEach((item) => {
                item.usageFlag="1";
                item.usageDept=usageDept;
            })
            this.vehicleData = originData;
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "车辆分配"
            })
        },
        //保存
        async handleSave(){
            let commitData = [];
            let obj = {};
            this.vehicleData.forEach((item) => {
                this.$set(obj, 'usageFlag', item.usageFlag)
                this.$set(obj, 'usageDept', item.usageDept)
                this.$set(obj, 'carId', item.carId);
                commitData.push(obj);
            })
            this.loading = true;
            await vehicleInfoUpdGVC(commitData).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message);
                this.openDataScope = false;
                this.$emit('operateSuccess')
            }).catch((err) => {                       
                this.loading = false;
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            Object.assign(this.$data, this.$options.data());
        }
    }
}
</script>
<style scoped>
::v-deep .fold_label .el-form-item__label {
  white-space: pre-line;
  line-height: 20px;
}
</style>>