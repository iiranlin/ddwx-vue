<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="120px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="24">
                    <el-form-item label="已绑定车辆：">
                        <span>{{isBind?form.isBindCarNumber:''}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="选择车辆：" prop="vinNumber">
                        <el-select v-model="form.vinNumber" placeholder="请选择车辆" style="width:100%">
                            <el-option v-for="(item,index) in carOptions"
                                :key="index"
                                :label="item.carNumber"
                                :value="item.vinNumber"
                                @click.native="handleCarChange(item)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="箱门号：" prop="boxNo" v-if="boardClassify !== '0'">
                    <el-input v-model="form.boxNo"></el-input>
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
import {vehicleInfoUsagelistPage} from "@/api/system/vehicleAllocation"
import {gcywCarkeySeatUpdate2,gcywCarkeySeatSave} from "@/api/keyManagement"

export default {
    data() {
        return {
            id:'',
            //遮罩层
            loading:false,
            //标题
            title:"绑定车辆",
            //显示隐藏
            openDataScope:false,
            //是否已绑定
            isBind:false,
            //标志位
            position:'',
            //车辆数据
            carOptions:[],
            //表单数据
            form:{
                isBindCarNumber:'',
                carNumber:'',
                vinNumber:'',
                position:'',
                boxNo:'',
            },
            //表单校验
            rules:{
                vinNumber:[
                    {required:true,message:"请选择车辆!",trigger:"change"}
                ],
                boxNo:[
                    {required:true,message:"请输入箱门号",trigger:"change"}
                ],
            },
            //表格生成参数
            formTable:{},
            //表格数据
            keyPositionData:[],
            //父级角标
            parentIndex:'',
            //子集角标
            childIndex:'',
            //场地id
            areaId:'',
            //钥匙柜id
            boardId:'',
            //钥匙柜类型
            boardClassify:'0',   //0普通 1智能
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(index,childIndex,obj,formTable,keyPositionData,areaId,boardId,boardClassify){
            this.openDataScope = true;
            this.isBind = obj.carNumber === "双击绑定车辆"?false:true;

            this.$nextTick(() => {
                this.parentIndex = index;
                this.childIndex = childIndex;
                this.formTable = formTable;
                this.keyPositionData = JSON.parse(JSON.stringify(keyPositionData))
                this.areaId = areaId;
                this.boardId = boardId;
                this.boardClassify = boardClassify;
                this.form.position = obj.position;

                if(this.isBind){
                    this.form.isBindCarNumber = obj.carNumber;
                    this.form.carNumber = obj.carNumber;
                    this.form.vinNumber = obj.vinNumber;
                    this.form.boxNo = obj.boxNo
                }
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
        //选择车辆
        handleCarChange(item){
            this.form.vinNumber = item.vinNumber;
            this.form.carNumber = item.carNumber;
        },
        //确定
        handleConfirm(){
            this.$refs.elform.validate((valid) => {
                if (valid) {
                    this.keyPositionData[this.parentIndex][this.childIndex].carNumber = this.form.carNumber;
                    this.keyPositionData[this.parentIndex][this.childIndex].vinNumber = this.form.vinNumber;
                    this.keyPositionData[this.parentIndex][this.childIndex].boxNo = this.form.boxNo;

                    let tableLayout = {
                        screenParams:JSON.stringify(this.formTable),
                        tableParams:JSON.stringify(this.keyPositionData),
                    }
                    this.loading = true;

                    if(this.isBind){   //修改
                        let params = {
                            areaId:this.areaId,
                            boardId:this.boardId,
                            name:this.form.position,
                            vinNumber:this.form.vinNumber,
                            carNumber:this.form.carNumber,
                            boxNo:this.form.boxNo,
                            boardPoint:JSON.stringify(tableLayout),
                            boardClassify: this.boardClassify,
                        }

                        gcywCarkeySeatUpdate2(params).then(({message}) => {
                            this.loading = false;
                            this.openDataScope = false;
                            this.$modal.msgSuccess(message)
                            this.$emit('tableBindCarSuccess');
                        }).catch((err) => {
                            this.loading = false;
                            this.openDataScope = false;
                            this.$emit('tableBindCarSuccess');
                        })
                    }else{      //新增
                        let params = {
                            areaId:this.areaId,
                            boardId:this.boardId,
                            name:this.form.position,
                            vinNumber:this.form.vinNumber,
                            carNumber:this.form.carNumber,
                            boxNo:this.form.boxNo,
                            boardPoint:JSON.stringify(tableLayout),
                            boardClassify: this.boardClassify,
                        }
                        gcywCarkeySeatSave(params).then(({message}) => {
                            this.loading = false;
                            this.openDataScope = false;
                            this.$modal.msgSuccess(message)
                            this.$emit('tableBindCarSuccess','success');
                        }).catch((err) => {
                            this.loading = false;
                            this.openDataScope = false;
                            this.$emit('tableBindCarSuccess','error');
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
            this.form.isBindCarNumber = '';
            this.form.carNumber = '';
            this.form.vinNumber = '';
            this.form.position = '';
            this.form.boxNo = '';
            this.formTable = {};
            this.keyPositionData = [];
            this.parentIndex = '';
            this.childIndex = '';
            this.areaId = '';
            this.boardId = '';
        }
    }
}
</script>
<style scoped>

</style>>
