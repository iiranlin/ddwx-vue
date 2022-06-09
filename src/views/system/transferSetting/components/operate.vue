<template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="140px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                    <el-form-item label="转派接收单位：" prop="turnUnitCode">
                        <el-select v-model="form.turnUnitCode" placeholder="请选择转派接收单位" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in unitOptions" 
                                :key="item.value" 
                                :label="item.unitName" 
                                :value="item.unitCode">
                            </el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24" >
                    <el-form-item label="车辆来源单位：" prop="carUnitCode">
                        <el-select v-model="form.carUnitCode" placeholder="请选择车辆来源单位" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in carOptions" 
                                :key="item.value" 
                                :label="item.unitName" 
                                :value="item.unitCode">
                            </el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleCreate()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {gcjcTurnUnitAddTU,systemUnitListAll} from "@/api/system/dict/setting"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //接收单位信息
            unitOptions:[],
            //车辆来源信息
            carOptions:[],
            //表单数据
            form:{
                turnUnitCode:"",
                carUnitCode:"",
            },
            //表单校验
            rules:{
                turnUnitCode:[
                    {required:true,message:"转派接收单位不能为空",trigger:"change"}
                ],
                carUnitCode:[
                    {required:true,message:"车辆来源单位不能为空",trigger:"change"}
                ],
            }
        }
    },
    created(){
        this.getUnitInfo();
    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "新建"
            })
        },
        //获取单位信息
        async getUnitInfo(){
            this.loading = true;
            await systemUnitListAll().then(({data}) => {
                this.loading = false;
                this.unitOptions = data;
                this.carOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   if(this.form.turnUnitCode===this.form.carUnitCode){
                       this.$modal.msgWarning("转派接收单位和车辆来源单位不能一样，请重新选择!")
                       return;
                   }
                   this.loading = true;
                   await gcjcTurnUnitAddTU(Object.assign({}, this.form)).then(({message}) => {
                       this.loading = false;
                       this.$modal.msgSuccess(message);
                       this.openDataScope = false;
                       this.$emit('operateSuccess')
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
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>