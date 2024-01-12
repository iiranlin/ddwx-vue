<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                    <el-form-item label="钥匙柜：">
                        <span>{{checkAreaName()}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-show="boardClassify === '1'">
                  <el-form-item label="箱门号：" prop="boxNo">
                    <el-input v-model="form.boxNo" maxlength="3" placeholder="请输入箱门号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="boardClassify === '1'">
                    <el-form-item label="钥匙位号：" prop="name">
                        <el-input v-model="form.name" maxlength="3" placeholder="请输入钥匙位号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-else>
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="form.name" maxlength="10" placeholder="请输入钥匙位名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="车牌号：" prop="vinNumber">
                        <el-select ref="selVinNumber" v-model="form.vinNumber" filterable placeholder="请选择车辆" style="width:100%">
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
import {gcywCarkeySeatSave,gcywCarkeySeatUpdate} from "@/api/keyManagement"
import {vehicleInfoUsagelistPage} from "@/api/system/vehicleAllocation"

export default {
    data() {
        return {
            id:'',
            //遮罩层
            loading:false,
            //标题
            title:"新建钥匙位",
            //显示隐藏
            openDataScope:false,
            //车辆数据
            carOptions:[],
            //类型  0:新增 1：修改
            type:'',
            //表单数据
            form:{
                boxNo:'',
                name:'',
                vinNumber:'',
                areaId:'',
                boardId:'',
                areaName:'',
                boardName:'',
            },
            //表单校验
            rules:{
                boxNo:[
                    {required:true,message:"箱门号不能为空!",trigger:"blur"}
                ],
                name:[
                    {required:true,message:"钥匙位不能为空!",trigger:"blur"}
                ],
                vinNumber:[
                    {required:true,message:"请选择车辆!",trigger:"change"}
                ],
            },
            boardClassify: '',
            boardAddress: '',
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(type,obj){
            this.openDataScope = true;
            this.type = type;
            this.boardClassify = obj.boardClassify
            this.boardAddress = obj.boardAddress

            if(this.type === '0'){
                this.form.areaId = obj.areaId;
                this.form.areaName = obj.areaName;
                this.form.boardId = obj.boardId;
                this.form.boardName = obj.boardName;
            }else{
                this.form.areaName = obj.areaName;
                this.form.name = obj.name;
                this.form.vinNumber = obj.vinNumber;
                this.id = obj.id;
                this.form.boxNo = obj.boxNo;
                this.form.carNumber = obj.carNumber;
            }

            this.boardClassify === '0' ? this.rules.boxNo[0].required = false : this.rules.boxNo[0].required = true
            this.$nextTick(() => {
                this.getCarOptions();
            })
        },
        //获取车辆数据
        async getCarOptions(){
            this.loading = true;
            await vehicleInfoUsagelistPage().then(({data})=>{
                this.carOptions = data.list;
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //钥匙柜字段显示
        checkAreaName(){
            if(this.type === '0'){
                return this.form.areaName+'/'+this.form.boardName;
            }else{
                return this.form.areaName;
            }
        },
        //确定
        handleConfirm(){
            this.$refs.elform.validate((valid) => {
                if (valid) {
                    if(this.type === '0'){
                        this.loading = true;

                        this.form.boardClassify = this.boardClassify
                        this.form.boardAddress = this.boardAddress
                        this.form.carNumber = this.$refs.selVinNumber.selected.label
                        gcywCarkeySeatSave(Object.assign({},{boardPoint:'DIFF'}, this.form)).then((res) => {
                            this.loading = false;
                            this.$emit('listAddKeyPositionSuccess');
                            this.openDataScope = false;
                        }).catch((err) => {
                            this.loading = false;
                        })
                    }else{
                        this.loading = true;

                        let params = {
                            areaName:this.form.areaName,
                            name:this.form.name,
                            vinNumber:this.form.vinNumber,
                            id:this.id,
                            boardPoint:'DIFF',
                            carNumber:this.$refs.selVinNumber.selected.label,
                            boardClassify: this.boardClassify,
                            boardAddress: this.boardAddress
                        }
                        gcywCarkeySeatUpdate(params).then((res) => {
                            this.loading = false;
                            this.$emit('listAddKeyPositionSuccess');
                            this.openDataScope = false;
                        }).catch((err) => {
                            this.loading = false;
                        })
                    }
                }
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //关闭dialog回调
        handleDialogClose(){
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>
