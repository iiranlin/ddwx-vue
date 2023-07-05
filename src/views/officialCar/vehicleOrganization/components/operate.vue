<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
        <el-form :model="form" :rules="rules" ref="elform" label-width="0px" v-loading="loading">
            <el-row :span="24" :gutter="20">
                <el-col :span="12" >
                    <span class="span-left">选择所属单位：</span>
                    <el-form-item prop="unitId">
                        <div class="el-tree-container">
                            <el-tree
                                class="drawer-tree"
                                ref="tree"
                                :data="unitOptions"
                                show-checkbox
                                node-key="id"
                                :props="defaultProps"
                                default-expand-all
                                @check-change="changeTree"/>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12" >
                    <span>编制年度：</span>
                    <div class="right-container">
                        <el-form-item prop="strengthTag">
                            <el-input placeholder="请输入编制年度" v-model="form.strengthTag" size="small" maxlength="20"></el-input>
                        </el-form-item>
                        <el-button class="button-create" type="primary" @click="handleCreate()">确定</el-button>
                        <el-button class="button-cancel" @click="handleCancel">取消</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
   </el-dialog>
</template>
<script>
import { authorizedStrengthAdd,unitTree } from '@/api/organization'

export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //树形控件规则
            defaultProps:{
                children: 'children',
                label: 'unitName'
            },
            //单位数据
            unitOptions:[],
            //表单数据
            form:{
                unitId:"",
                strengthTag:'',
            },
            //所选单位
            unitIds:[],
            //表单校验
            rules:{
                unitId:[
                    {required:true,message:"所属单位不能为空",trigger:"blur"}
                ],
                strengthTag:[
                    {required:true,message:"编制年度不能为空",trigger:"blur"}
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
            this.$nextTick(() => {
                this.title = "新建车辆编制";
                if (this.$refs.elform!==undefined) {
                    this.$refs.elform.resetFields();
                }
                this.form.strengthTag = new Date().getFullYear();
                this.getUnitOptions();
            })
        },
        //获取单位数据
        async getUnitOptions(){
            this.loading = true;

            await unitTree().then(({ data }) => {
                this.unitOptions.push(data);
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //节点选中事件
        changeTree(){
            let nodes = this.$refs['tree'].getCheckedNodes();
            this.unitIds = [];

            for (let i = 0; i < nodes.length; i++) {
                if(nodes[i].children.length === 0){
                    this.unitIds.push(nodes[i].id);
                }
            }
            if(this.unitIds.length !== 0 ){
                this.form.unitId = 'check'
            }else{
                this.form.unitId = ''
            }
        },
        //新建
        handleCreate(){
            this.$refs.elform.validate(async (valid) => {
                if (valid) {
                    this.loading = true;

                    let params = {
                        strengthTag:this.form.strengthTag,
                        unitIds:this.unitIds,
                    }
                    await authorizedStrengthAdd(params).then(({message}) => {
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
            this.form.unitId = '';
            this.form.strengthTag = '';
            this.unitIds = [];
            this.unitOptions = [];
        }
    }
}
</script>
<style lang="scss" scoped>
.span-left {
    margin-left: 25px;
}
.el-tree-container {
    border: 1px solid #f0f0f0;
    margin-top: 10px;
    height: 450px;
    overflow: auto;
   
   .el-tree{
        display: inline-block;
        min-width:100% ;
    }
   
}
.right-container {
    margin-top: 10px;
    height: 450px;
    position: relative;

    .button-create {
        position: absolute;
        right: 0px;
        bottom: 10px;
    }
    .button-cancel {
        position: absolute;
        right: 100px;
        bottom: 10px;
    }
}
::v-deep .is-leaf,.el-tree-node__expand-icon,.el-icon-caret-right{
    display: none;
}
</style>>
