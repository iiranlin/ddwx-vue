<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
       <el-form :model="form" :rules="rules" ref="elform" label-width="100px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="24" >
                    <el-form-item label="分类：" prop="classify">
                        <el-select v-model="form.classify" placeholder="请选择分类" style="width:100%">
                            <el-option v-for="(item,index) in classifyOptions"
                                :key="index"
                                :label="item.value"
                                :value="item.code"
                                @click.native="handleClassifyChange(item)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="!areaFlag">
                    <el-form-item label="场地：" prop="areaId">
                        <el-select v-model="form.areaId" placeholder="请选择场地" style="width:100%">
                            <el-option v-for="(item,index) in areaOptions"
                                :key="index"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="form.name" maxlength="6"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="!areaFlag">
                    <el-form-item label="类型：" prop="boardClassify">
                        <el-select v-model="form.boardClassify" placeholder="请选择类型" style="width:100%">
                            <el-option v-for="(item,index) in boardClassifyOptions"
                                :key="index"
                                :label="item.value"
                                :value="item.code">
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
import {gwycCarkeyBoardList,gwycCarkeyBoardSave} from "@/api/keyManagement"

export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"新建钥匙柜",
            //显示隐藏
            openDataScope:false,
            //是否新建场地标识
            areaFlag:true,
            //分类数据
            classifyOptions:[
                {
                    code:'0',
                    value:'场地',
                },
                {
                    code:'1',
                    value:'钥匙柜',
                }
            ],
            //钥匙柜类型
            boardClassifyOptions:[
                {
                    code:'0',
                    value:'普通柜',
                },
                {
                    code:'1',
                    value:'智能柜',
                }
            ],
            //场地数据
            areaOptions:[],
            //表单数据
            form:{
                classify:'0',    //分类
                name:'',   //场地名称
                areaId:'',  //场地id
                boardClassify:'0',       //钥匙柜类型
            },
            //表单校验
            rules:{
                classify:[
                    {required:true,message:"请选择分类!",trigger:"change"}
                ],
                name:[
                    {required:true,message:"名称不能为空!",trigger:"change"}
                ],
                areaId:[
                    {required:true,message:"请选择场地!",trigger:"change"}
                ],
                boardClassify:[
                    {required:true,message:"请选择类型!",trigger:"change"}
                ],
            }
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(){
            this.openDataScope = true;
        },
        //获取场地信息
        async getGwycCarkeyBoardList(){
            this.loading = true;
            let params = {
                classify:'0',
            }
            await gwycCarkeyBoardList(params).then(({data}) => {
                this.loading = false;
                this.areaOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //保存场地或钥匙柜信息
        async postGwycCarkeyBoardSave(params){
            this.loading = true;
            await gwycCarkeyBoardSave(params).then(({data}) => {
                this.loading = false;
                this.openDataScope = false;
                this.$emit('addKeyCabinetSuccess')
            }).catch((err) => {
                this.loading = false;
            })
        },

        //选择分类回调
        handleClassifyChange(item){
            if(item.code === '0'){
                this.areaFlag = true;
            }else{
                this.areaFlag = false;
                this.getGwycCarkeyBoardList();
            }
            this.$nextTick(() => {
                this.$refs.elform.clearValidate();
            })
        },
        //确定
        handleConfirm(){
            this.$refs.elform.validate((valid) => {
                if (valid) {
                    if(this.areaFlag){
                        let params = {
                            classify:'0',
                            name:this.form.name,
                        }
                        this.postGwycCarkeyBoardSave(params);
                    }else{
                        let params = {
                            classify:'1',
                            areaId:this.form.areaId,
                            name:this.form.name,
                            boardClassify:this.form.boardClassify,
                        }
                        this.postGwycCarkeyBoardSave(params);
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
            this.areaFlag = true;
            this.areaOptions = [];
            this.$refs.elform.resetFields();
        }
    }
}
</script>
<style scoped>

</style>>
