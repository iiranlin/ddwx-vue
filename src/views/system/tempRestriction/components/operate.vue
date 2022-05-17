<template>
    <el-dialog :title="title" :visible.sync="openDataScope" width="800px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="12" >
                    <el-form-item label="城市：" prop="city">
                        <el-select v-model="form.city" placeholder="请选择城市" style="width:100%">
                            <el-option 
                                v-for="item in cityOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="限行时间：" prop="time">
                        <el-date-picker
                            style="width:100%"
                            v-model="form.time"
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
                <el-col :span="12" >
                    <el-form-item label="限行规则：" prop="restrictionRule">
                        <el-select v-model="form.restrictionRule" placeholder="请选择限行规则" style="width:100%">
                            <el-option 
                                v-for="item in restrictionRuleOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="限行尾号：" prop="restrictionNumber">
                        <el-select v-model="form.restrictionNumber" placeholder="请选择限行尾号" style="width:100%">
                            <el-option 
                                v-for="item in restrictionNumberOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item :label="'尾号字母\u3000\n处理规则：'"  class="fold_label" prop="rule">
                        <el-select v-model="form.rule" placeholder="指定为特定数字" style="width:100%">
                            <el-option 
                                v-for="item in ruleOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <el-form-item label="指定数字：" prop="appoint">
                        <el-input v-model="form.appoint" placeholder="请输入指定数字"></el-input>
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
            //城市数据
            cityOptions:[],
            //限行规则数据
            restrictionRuleOptions:[],
            //限行尾号数据
            restrictionNumberOptions:[],
            //处理规则数据
            ruleOptions:[],
            //表单数据
            form:{
                city:"",
                time:"",
                restrictionRule:"",
                restrictionNumber:"",
                rule:"",
                appoint:""
            },
            //表单校验
            rules:{
                city:[
                    {required:true,message:"城市不能为空",trigger:"change"}
                ],
                time:[
                    {required:true,message:"限行时间不能为空",trigger:"change"}
                ],
                restrictionRule:[
                    {required:true,message:"限行规则不能为空",trigger:"change"}
                ],
                restrictionNumber:[
                    {required:true,message:"限行尾号不能为空",trigger:"change"}
                ],
                rule:[
                    {required:true,message:"尾号字母处理规则不能为空",trigger:"change"}
                ],
                appoint:[
                    {required:true,message:"指定数字不能为空",trigger:"blur"}
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
                    this.title = "新建字典"
                }else if(type==="update"){
                    this.title = "修改字典"
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