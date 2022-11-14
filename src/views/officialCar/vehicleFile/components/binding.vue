<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-form-item v-if="bindDriverOptions.length>0">
                    <label slot="label">&nbsp;&nbsp;已绑司机:</label>
                    <el-tag
                        v-for="item in bindDriverOptions"
                        :key="item.id"
                        closable
                        @close="handleTagClose(item.id)">
                        {{item.driver}}
                    </el-tag>
                </el-form-item>
            </el-row>
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                        <el-form-item label="司机绑定：" prop="driverId">
                            <el-select v-model="form.driverId" multiple collapse-tags filterable placeholder="请选择绑定司机" style="width:100%">
                                <el-option v-for="(item,index) in driverOptions" 
                                    :key="index" 
                                    :label="item.driver" 
                                    :value="item.driverCode">
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
import {gcjcDriverClassGetAvailableDriver,
gcjcDriverVehicleList,
gcjcDriverVehicleAdd,
gcjcDriverVehicleDel} from "@/api/driver"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            usageUnitCode:'',
            vinFlag:'1',
            //发动机号
            vinNumber:'',
            //标题
            title:"司机绑定",
            //司机数据
            driverOptions:[],
            //已绑定车辆数据
            bindDriverOptions:[],
            //显示隐藏
            openDataScope:false,
            //表单数据
            form:{
                driverId:null,
            },
            //表单校验
            rules:{
                driverId:[
                    {required:true,message:"请选择绑定司机",trigger:"blur"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(unitCode,vinNumber){
            this.usageUnitCode = unitCode;
            this.vinNumber = vinNumber;
            this.openDataScope = true;
            this.$nextTick(() => {
                this.getGcjcDriverVehicleList();
                this.getGcjcDriverClassGetAvailableDriver();
            })
        },
        //获取已绑定车辆信息gcjcDriverVehicleList
        async getGcjcDriverVehicleList(){
            this.loading = true;
            let params = {
                vinNumber:this.vinNumber
            }
            await gcjcDriverVehicleList(params).then(({data}) => {
                this.loading = false;
                this.bindDriverOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取可绑定司机信息
        async getGcjcDriverClassGetAvailableDriver(){
            this.loading = true;
            let params = {
                UnitCode:this.usageUnitCode,
                vinFlag:this.vinFlag
            }
            await gcjcDriverClassGetAvailableDriver(params).then(({data}) => {
                this.loading = false;
                this.driverOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //删除绑定车辆
        handleTagClose(id){
            this.$modal.confirm("是否取消绑定司机?").then(()=>{
                let params = {
                    vinNumber:this.vinNumber,
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
                    for (let i = 0; i < this.form.driverId.length; i++) {
                        let driverId = this.form.driverId[i];
                        for (let j = 0; j < this.bindDriverOptions.length; j++) {
                            
                            if(driverId === this.bindDriverOptions[j].driverId){
                                this.$modal.msgWarning(this.bindDriverOptions[j].driver+"已经绑定，无法重复绑定，请重新选择!");
                                return
                            }
                        }
                    }
                    //封装参数
                    let params = [];
                    this.form.driverId.forEach((item) => {
                        let obj = {};
                        this.$set(obj,'vinNumber', this.vinNumber);
                        this.$set(obj,'driverId', item);
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
            this.bindDriverOptions = [];
            this.driverOptions = [];
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
