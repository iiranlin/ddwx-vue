<template>
    <el-dialog :title="title" :visible.sync="openDataScope" width="800px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="12" >
                    <el-form-item label="车牌号：" prop="licenseNumber">
                        <el-select v-model="form.licenseNumber" filterable placeholder="搜索车牌号" style="width:100%">
                            <el-option 
                                v-for="item in licenseNumberOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="车架号：" prop="frameNumber">
                        <el-input v-model="form.frameNumber" disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="保单号：" prop="insurancePolicy">
                        <el-input v-model="form.insurancePolicy" placeholder="请输入保单号" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="投保人：" prop="policyHolder">
                        <el-input v-model="form.policyHolder" placeholder="请输入投保人" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="承保公司：" prop="insuranceCompany">
                        <el-select v-model="form.insuranceCompany" filterable placeholder="请选择承保公司" style="width:100%">
                            <el-option 
                                v-for="item in insuranceCompanyOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="保险类型：" prop="insuranceType">
                        <el-select v-model="form.insuranceType" filterable placeholder="请选择保险类型" style="width:100%">
                            <el-option 
                                v-for="item in insuranceTypeOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="投保金额：" prop="insuranceMoney">
                        <el-input v-model="form.insuranceMoney" placeholder="请输入投保金额" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经办人：" prop="operator">
                        <el-input v-model="form.operator" placeholder="请输入经办人" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="投保周期" prop="insuranceTime">
                        <el-date-picker
                            style="width:100%"
                            v-model="form.insuranceTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            unlink-panels
                            :picker-options="{firstDayOfWeek:1}"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="type==='create'?handleCreate():handleUpdate()">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {gcjcClassCreate,gcjcClassDetail,gcjcClassModify} from "@/api/driver"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //类型
            type:"",
            //数据id
            id:"",
            //显示隐藏
            openDataScope:false,
            //车牌号数据
            licenseNumberOptions:[],
            //保险公司数据
            insuranceCompanyOptions:[],
            //保险类型数据
            insuranceTypeOptions:[],
            //表单数据
            form:{
                licenseNumber:"",
                frameNumber:"",
                insurancePolicy:"",
                policyHolder:"",
                insuranceCompany:"",
                insuranceType:"",
                insuranceMoney:"",
                operator:"",
                insuranceTime:""
            },
            //表单校验
            rules:{
                licenseNumber:[
                    {required:true,message:"车牌号不能为空",trigger:"change"}
                ],
                frameNumber:[
                    {required:true,message:"车架号不能为空",trigger:"change"}
                ],
                insurancePolicy:[
                    {required:true,message:"保单号不能为空",trigger:"change"}
                ],
                policyHolder:[
                    {required:true,message:"投保人不能为空",trigger:"change"}
                ],
                insuranceCompany:[
                    {required:true,message:"承保公司不能为空",trigger:"change"}
                ],
                insuranceType:[
                    {required:true,message:"保险类型不能为空",trigger:"change"}
                ],
                insuranceMoney:[
                    {required:true,message:"投保金额不能为空",trigger:"change"}
                ],
                operator:[
                    {required:true,message:"经办人不能为空",trigger:"change"}
                ],
                insuranceTime:[
                    {required:true,message:"投保周期不能为空",trigger:"blur"}
                ]
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(type,id){
            this.type = type;
            this.id = id;
            this.openDataScope = true;
            this.$nextTick(() => {
                if(type==="create"){
                    this.title = "新建"
                }else if(type==="update"){
                    this.title = "修改"
                    this.getClassDetail();
                }
            })
        },
        //获取班次详细信息
        async getClassDetail(){
            this.loading = true;
            await gcjcClassDetail(this.id).then(({data}) => {
                this.loading = false;
                this.form = Object.assign(this.form, data);
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               console.log(this.form);
               if (valid) {
                   this.loading = true;
                   await gcjcClassCreate(Object.assign({}, this.form)).then(({message}) => {
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
        //编辑
        handleUpdate(){
            this.$refs.elform.validate(async (valid) => {
               if (valid) {
                   this.loading = true;
                   await gcjcClassModify(Object.assign({}, this.form)).then(({message}) => {
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
::v-deep .fold_label .el-form-item__label {
  white-space: pre-line;
  line-height: 20px;
}
</style>>