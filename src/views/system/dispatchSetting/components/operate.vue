<template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                    <el-form-item label="用车单位：" prop="useUnitCode">
                        <el-select v-model="form.useUnitCode" placeholder="请选择用车单位" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in useUnitOptions" 
                                :key="item.value" 
                                :label="item.unitName" 
                                :value="item.unitCode">
                            </el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24" >
                    <el-form-item label="调度单位：" prop="disUnitCode">
                        <el-select v-model="form.disUnitCode" placeholder="请选择调度单位" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in disUnitOptions" 
                                :key="item.value" 
                                :label="item.unitName" 
                                :value="item.unitCode">
                            </el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24" >
                    <el-form-item label="车辆来源：" prop="carSource">
                        <el-select v-model="form.carSource" placeholder="请选择车辆来源" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in carSourceOptions" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.code">
                            </el-option>
                       </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24" >
                    <el-form-item label="模式：" prop="modeTag">
                        <el-select v-model="form.modeTag" placeholder="请选择模式" clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in modeTagOptions" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.code">
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
import {sysUnitUsedisRelationAddDU,systemUnitListAll} from "@/api/system/dict/setting"
import {getListByParentCode} from '@/api/system/dict'
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //用车单位信息
            useUnitOptions:[],
            //调度单位信息
            disUnitOptions:[],
            //车辆来源信息
            carSourceOptions:[],
            //模式信息
            modeTagOptions:[],
            //表单数据
            form:{
                useUnitCode:"",
                disUnitCode:"",
                carSource:"",
                modeTag:""
            },
            //表单校验
            rules:{
                useUnitCode:[
                    {required:true,message:"用车单位不能为空",trigger:"change"}
                ],
                disUnitCode:[
                    {required:true,message:"调度单位不能为空",trigger:"change"}
                ],
                carSource:[
                    {required:true,message:"车辆来源不能为空",trigger:"change"}
                ],
                modeTag:[
                    {required:true,message:"模式不能为空",trigger:"change"}
                ]
            }
        }
    },
    created(){
        this.getUnitInfo();
        this.getCarSource();
        this.getModeTag();
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
                this.useUnitOptions = data;
                this.disUnitOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取车辆来源
        async getCarSource(){
            this.loading = true;
            await getListByParentCode("10015").then(({data}) => {
                this.loading = false;
                this.carSourceOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取模式
        async getModeTag(){
            this.loading = true;
            await getListByParentCode("10016").then(({data}) => {
                this.loading = false;
                this.modeTagOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   if(this.form.useUnitCode===this.form.disUnitCode){
                       this.$modal.msgWarning("用车单位和调度单位不能一样，请重新选择!")
                       return;
                   }
                   this.loading = true;
                   await sysUnitUsedisRelationAddDU(Object.assign({}, this.form)).then(({message}) => {
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