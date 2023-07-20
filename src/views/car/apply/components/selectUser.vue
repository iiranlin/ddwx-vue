<template>
   <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
        <el-row :span="24" :gutter="20"  v-loading='loading'>
            <el-col :span="12" >
                <el-input
                    placeholder="支持按账号/姓名搜索"
                    size="small"
                    v-model="filterText"
                    style="margin-right:40px">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div class="el-tree-container">
                    <el-tree
                        class="drawer-tree"
                        ref="tree"
                        :data="unitOptions"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :default-expanded-keys='defaultExpandedKeys'
                        @check="handleCheck"/>
                </div>
            </el-col>
            <el-col :span="12" >
                <span>已选择</span>
                <div class="tag-container">
                    <el-tag
                        v-for="tag in defaultChecked"
                        :key="tag.id"
                        closable
                        type="info"
                        @close='handleTagClose(tag)'>
                        {{tag.realName}}
                    </el-tag>
                </div>
                <div class="right-container" v-if="!isInput">
                    <el-button class="button-create" type="primary" @click="handleConfirm()">确定</el-button>
                    <el-button class="button-cancel" @click="handleCancel()">取消</el-button>
                    <el-button class="button-input" @click="handleInput()">手动录入</el-button>
                </div>
                <div class="input-container" v-else>
                    <el-input v-model="inputText" size="small" placeholder="请输入乘车人姓名" maxlength="5"></el-input>
                    <el-button class="button-create" type="primary" @click="handleInputConfirm()" size="small">确定</el-button>
                    <el-button class="button-cancel" @click="handleInputCancel()" size="small">取消</el-button>
                </div>
            </el-col>
        </el-row>
   </el-dialog>
</template>
<script>
import { userListAllForDept } from '@/api/system/laborDict'

export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //显示隐藏
            openDataScope:false,
            //搜索内容
            filterText:'',
            //树形控件规则
            defaultProps:{
                children: 'children',
                label:function(data,node){
                    if(data.children.length === 0){
                        return data.realName;
                    }else{
                         return data.deptName;
                    }
                },
            },
            //部门单位数据
            unitOptions:[],
            //默认展开的数据
            defaultExpandedKeys:[],
            //默认选中的数据
            defaultChecked:[],
            //是否手动录入
            isInput:false,
            //手动输入
            inputText:'',
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    created(){
        this.getUserListAllForDept();
    },
    methods:{
        //初始化
        init(defaultCheckedUser){
            this.openDataScope = true;
            this.defaultChecked = defaultCheckedUser;

            this.$nextTick(() => {
                this.title = "选择乘车人";
                this.initDefaultExpanded();
                this.initDefaultChecked();
            })
        },
        //获取树形数据
        async getUserListAllForDept(){
            this.loading = true;

            await userListAllForDept().then(({ data }) => {
                this.unitOptions = data;
                this.loading = false;
              
            }).catch((err) => {
                this.loading = false;
            })
        },
        //初始化默认展开节点
        initDefaultExpanded(){
            this.defaultChecked.forEach((item) => {
                this.defaultExpandedKeys.push(item.deptId)
            })
        },
        //初始化默认选中节点
        initDefaultChecked(){
            this.$nextTick(() => {
                this.$refs.tree.setCheckedNodes(this.defaultChecked);
            })
        },
        //节点选中事件
        handleCheck(){
            let nodes = this.$refs['tree'].getCheckedNodes();
            this.defaultChecked = [];

            for (let i = 0; i < nodes.length; i++) {
                if(nodes[i].children.length === 0){
                    let obj = {
                        id:nodes[i].id,
                        deptId:nodes[i].deptId,
                        realName:nodes[i].realName,
                    }
                    this.defaultChecked.push(obj)
                }
            }
        },
        filterNode(value, data) {
            if (!value){
                return true;
            } 
            //data.属性必须对应defaultProps中label属性
            if(data.realName === null){
                 return data.deptName.indexOf(value) !== -1;
            }else{
                 return data.realName.indexOf(value) !== -1;
            }
        },
        //删除tag
        handleTagClose(tag){
            if(!tag.id){
                let index = this.defaultChecked.findIndex((item) => {
                    return tag.realName === item.realName;
                })
                this.defaultChecked.splice(index, 1);
            }else{
                let index = this.defaultChecked.findIndex((item) => {
                    return tag.id === item.id;
                })
                this.defaultChecked.splice(index, 1);
            }
            this.initDefaultChecked();
            
        },
        //确定
        handleConfirm(){
            if(this.defaultChecked.length === 0){
                this.$modal.msgWarning("请选择乘车人!");
                return
            }
            if(this.defaultChecked.length > 30){
                this.$modal.msgWarning("最多只能选择30名乘车人，请重新选择!");
                return
            }
            this.openDataScope = false;
            this.$emit('selectUserSuccess', this.defaultChecked);
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
        },
        //手动输入
        handleInput(){
            this.inputText = '';
            this.isInput = true;
        },
        //手动输入确定
        handleInputConfirm(){
            this.isInput = false;

            let obj = {
                id:'',
                deptId:'',
                realName:this.inputText,
            }
            this.defaultChecked.push(obj)
        },
        //手动输入取消
        handleInputCancel(){
            this.isInput = false;
        },
        //关闭dialog回调
        handleDialogClose(){
           
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
.tag-container {
    margin-top: 20px;
    height: 400px;
    overflow-y: auto;

    .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
.right-container {
    margin-top: 10px;
    height: 50px;
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
    .button-input {
        position: absolute;
        right: 200px;
        bottom: 10px;
    }   
}
.input-container {
    margin-top: 10px;
    display: flex;
    align-items: center;

    ::v-deep .el-input__inner {
        width: 180px;
    }
}
::v-deep .is-leaf,.el-tree-node__expand-icon,.el-icon-caret-right{
    display: none;
}
</style>>
