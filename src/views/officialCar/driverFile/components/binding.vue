<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-form-item v-if="bindCarOptions.length>0">
                    <label slot="label">&nbsp;&nbsp;已绑车辆:</label>
                    <el-tag
                        v-for="item in bindCarOptions"
                        :key="item.id"
                        closable
                        @close="handleTagClose(item.id)">
                        {{item.carNumber}}
                    </el-tag>
                </el-form-item>
            </el-row>
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                        <el-form-item label="车辆绑定：" prop="vinNumber">
                            <el-select v-model="form.vinNumber" multiple collapse-tags filterable placeholder="请选择绑定车辆" style="width:100%">
                                <el-option v-for="(item,index) in carOptions" 
                                    :key="index" 
                                    :label="item.carNumber" 
                                    :value="item.vinNumber">
                                </el-option>
                            </el-select>
                        </el-form-item>
                </el-col>
            </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
           <el-button type="primary" @click="handleConfirm">确定</el-button>
           <el-button @click="handleCancel">取消</el-button>
       </div>
   </el-dialog>
</template>
<script>
import {vehicleInfoGetAvailableCarForDriver,
gcjcDriverVehicleList,
gcjcDriverVehicleAdd,
gcjcDriverVehicleDel} from "@/api/driver"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //司机unitCode
            unitCode:'',
            //司机driverId
            driverId:'',
            //标题
            title:"车辆绑定",
            //车辆数据
            carOptions:[],
            //已绑定车辆数据
            bindCarOptions:[],
            //显示隐藏
            openDataScope:false,
            //表单数据
            form:{
                vinNumber:null,
            },
            //表单校验
            rules:{
                vinNumber:[
                    {required:true,message:"请选择绑定车辆",trigger:"blur"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(unitCode,id){
            this.unitCode = unitCode;
            this.driverId = id;
            this.openDataScope = true;
            this.$nextTick(() => {
                this.getGcjcDriverVehicleList();
                this.getAvailableCarForDriver();
            })
        },
        //获取已绑定车辆信息gcjcDriverVehicleList
        async getGcjcDriverVehicleList(){
            this.loading = true;
            let params = {
                driverId:this.driverId
            }
            await gcjcDriverVehicleList(params).then(({data}) => {
                this.loading = false;
                this.bindCarOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取可绑定车辆信息
        async getAvailableCarForDriver(){
            this.loading = true;
            let params = {
                UnitCode:this.unitCode
            }
            await vehicleInfoGetAvailableCarForDriver(params).then(({data}) => {
                this.loading = false;
                this.carOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //删除绑定车辆
        handleTagClose(id){
            this.$modal.confirm("是否取消绑定车辆?").then(()=>{
                let params = {
                    driverId:this.driverId,
                    id:id,
                }
                this.loading = true;
                gcjcDriverVehicleDel(params).then(({message}) => {
                    this.loading = false;
                    this.getGcjcDriverVehicleList();
                }).catch((err) => {
                    this.loading = false;
                })
            }).catch((err) => {
                
            })
        },
        //确定
        handleConfirm(){
            this.$refs.elform.validate((valid) => {
                if (valid) {
                    //去重判断
                    for (let i = 0; i < this.form.vinNumber.length; i++) {
                        let vinNumber = this.form.vinNumber[i];
                        for (let j = 0; j < this.bindCarOptions.length; j++) {
                            if(vinNumber === this.bindCarOptions[j].vinNumber){
                                this.$modal.msgWarning(this.bindCarOptions[j].carNumber+"已经绑定，无法重复绑定，请重新选择!");
                                return
                            }
                        }
                    }
                    //封装参数
                    let params = [];
                    this.form.vinNumber.forEach((item) => {
                        let obj = {};
                        this.$set(obj,'driverId', this.driverId);
                        this.$set(obj, 'vinNumber', item);
                        params.push(obj);
                    })
                    this.loading = true;
                    gcjcDriverVehicleAdd(params).then((res) => {
                        this.loading = false;
                        this.openDataScope = false;
                    }).catch((err) => {
                        this.loading = false;
                    })
                } 
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.bindCarOptions = [];
            this.carOptions = [];
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>
::v-deep .el-tag.el-tag--medium.el-tag--light {
    margin-left: 10px;
}
</style>>
