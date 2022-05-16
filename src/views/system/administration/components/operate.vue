<template>
   <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
           <el-row :span="24" :gutter="20">
               <el-col :span="12" >
                    <el-form-item label="区划代码：" prop="divisionId">
                        <el-input v-model="form.divisionId" size="small" :disabled="readonly"></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                    <el-form-item label="区划名称：" prop="divisionName">
                        <el-input v-model="form.divisionName" size="small"></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="24">
                    <el-form-item label="上级区划：" prop="divisionData">
                        <el-select v-model="form.divisionData" placeholder="请选择上级区划" value-key="divisionId" filterable clearable size="small" style="width:100%">
                            <el-option 
                                v-for="item in divisionList" 
                                :key="item.divisionId" 
                                :label="item.divisionName" 
                                :value="item">
                            </el-option>
                        </el-select>
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
import {gcjcDivisionCreate,gcjcDivisionList,gcjcDivisionDetail,gcjcDivisionModify} from "@/api/system/dict/administration"
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
            divisionId:"",
            //显示隐藏
            openDataScope:false,
            //是否禁用
            readonly:false,
            //上级区划数据
            divisionList:[],
            //表单数据
            form:{
                divisionId:"",
                divisionName:"",
                divisionData:"",
            },
            //表单校验
            rules:{
                divisionId:[
                    {required:true,message:"区划代码不能为空",trigger:"blur"}
                ],
                divisionName:[
                    {required:true,message:"区划名称不能为空",trigger:"blur"}
                ],
                divisionData:[
                    {required:true,message:"上级区划不能为空",trigger:"change"}
                ]
            }
        }
    },
    created(){
        this.getDivisionList();
    },
    methods:{
        //初始化
        init(type,divisionId){
            this.type = type;
            this.divisionId = divisionId;
            this.openDataScope = true;
            this.$nextTick(() => {
                if(type==="create"){
                    this.title = "新建字典"
                }else if(type==="update"){
                    this.title = "修改字典"
                    this.readonly = true;
                    this.getClassDetail();
                }
            })
        },
        //获取上级区划列表
        async getDivisionList(){
            this.loading = true;
            await gcjcDivisionList().then(({data}) => {
                this.loading = false;
                this.divisionList = data.list;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取行政规划详细信息
        async getClassDetail(){
            this.loading = true;
            await gcjcDivisionDetail(this.divisionId).then(({data}) => {
                this.loading = false;
                this.form.divisionId = data.divisionId;
                this.form.divisionName = data.divisionName;

                this.form.divisionData = {};
                this.$set(this.form.divisionData, 'divisionId', data.pid)
                this.$set(this.form.divisionData, 'divisionName', data.pname)
            }).catch((err) => {
                this.loading = false;
            })
        },
        //新建
        handleCreate(){
           this.$refs.elform.validate(async (valid) => {
               if (valid) {
                    let pid = this.form.divisionData.divisionId;
                    let pname = this.form.divisionData.divisionName;
                    let longName = pname+"/"+this.form.divisionName;

                    this.loading = true;
                    await gcjcDivisionCreate(Object.assign({}, this.form,{pid},{pname},{longName})).then(({message}) => {
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
                    let pid = this.form.divisionData.divisionId;
                    let pname = this.form.divisionData.divisionName;
                    let longName = pname+"/"+this.form.divisionName;

                    this.loading = true;
                    await gcjcDivisionModify(Object.assign({}, this.form,{pid},{pname},{longName})).then(({message}) => {
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
            this.readonly = false;
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>