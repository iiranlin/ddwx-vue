<template>
   <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="12" >
                    <el-form-item label="班次名称：" prop="className">
                        <el-input v-model="form.className" size="small"></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="form.remark" size="small"></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="上班时间：" prop="beginTime">
                        <el-time-picker
                            v-model="form.beginTime"
                            size="small"
                            style="width:100%"
                            format="HH:mm"
                            value-format="HH:mm"
                            :default-value="form.beginTime"
                            placeholder="请选择上班时间">
                        </el-time-picker>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="下班时间：" prop="endTime">
                         <el-time-picker
                            v-model="form.endTime"
                            size="small"
                            style="width:100%"
                            format="HH:mm"
                            value-format="HH:mm"
                            :default-value="form.endTime"
                            placeholder="请选择下班时间">
                        </el-time-picker>
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
            //表单数据
            form:{
                className:"",
                beginTime:"",
                endTime:"",
                remark:""
            },
            //表单校验
            rules:{
                className:[
                    {required:true,message:"班次名称不能为空",trigger:"blur"}
                ],
                beginTime:[
                    {required:true,message:"上班时间不能为空",trigger:"blur"}
                ],
                endTime:[
                    {required:true,message:"下班时间不能为空",trigger:"blur"}
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
                    this.title = "新建班次"
                }else if(type==="update"){
                    this.title = "修改班次"
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

</style>>