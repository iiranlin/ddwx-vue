<template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
        <el-row :span="24" :gutter="20"  v-loading='loading'>
            <el-col :span="12" >
                <el-input
                    placeholder="搜索菜单名称"
                    size="small"
                    v-model="filterText"
                    style="margin-right:40px">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div class="el-tree-container">
                    <el-tree
                        class="drawer-tree"
                        ref="tree"
                        :data="menuOptions"
                        show-checkbox
                        node-key="menuId"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        :default-expanded-keys='defaultExpandedKeys'
                        :render-content="renderContent"
                        @check="handleCheck"/>
                </div>
            </el-col>
            <el-col :span="12" >
                <span>已选择常用菜单</span>
                <div class="tag-container">
                    <el-tag
                        v-for="tag in defaultChecked"
                        :key="tag.id"
                        closable
                        type="info"
                        @close='handleTagClose(tag)'>
                        {{tag.menuName}}
                    </el-tag>
                </div>
                <div class="right-container">
                    <el-button class="button-create" type="primary" @click="handleConfirm()">保存</el-button>
                    <el-button class="button-cancel" @click="handleCancel()">取消</el-button>
                </div>
            </el-col>
        </el-row>
    </el-dialog>
</template>
<script>
import { getUserMenu } from '@/api/menu'
import { usemenuSave } from '@/api/home.js'

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
                label:'menuName',
            },
            //菜单数据
            menuOptions:[],
            //默认展开的数据
            defaultExpandedKeys:[],
            //默认选中的数据
            defaultChecked:[],
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    created(){
        this.getUserMenu();
    },
    methods:{
        //初始化
        init(defaultCheckedMenu){
            this.openDataScope = true;
            this.defaultChecked = JSON.parse(JSON.stringify(defaultCheckedMenu));

            this.$nextTick(() => {
                this.title = "添加常用菜单";
                this.initDefaultExpanded();
                this.initDefaultChecked();
            })
        },
        //获取菜单数据
        async getUserMenu(){
            this.loading = true;

            await getUserMenu().then(({ data }) => {
                this.loading = false;
                this.menuOptions = data;

                this.addAttrMenuId(this.menuOptions)
            }).catch((err) => {
                this.loading = false;
            })
        },
        //添加属性
        addAttrMenuId(arr){
            arr.forEach((item) => {
                this.$set(item, 'menuId', item.id);

                if(item.children.length !== 0){
                    this.addAttrMenuId(item.children)
                }
            })
        },
        // 根据isHide属性值判断是否渲染节点
        renderContent(h, { node, data, store }) {
            if (data.isHide === 0) {
                return <span>{data.menuName}</span>;
            } else {
                this.remove(node, data);
            }
        },
        // 删除节点数据方法
        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex((d) => d.isHide === data.isHide);
            children.splice(index, 1);
        },
        //初始化默认展开节点
        initDefaultExpanded(){
            this.defaultChecked.forEach((item) => {
                this.defaultExpandedKeys.push(item.menuId)
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
                if(nodes[i].children.length === 0 && nodes[i].isHide === 0){
                    let obj = {
                        id:nodes[i].id,
                        menuName:nodes[i].menuName,
                        component:nodes[i].component,
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
            return data.menuName.indexOf(value) !== -1;
        },
        //删除tag
        handleTagClose(tag){
            let index = this.defaultChecked.findIndex((item) => {
                return tag.id === item.id;
            })
            this.defaultChecked.splice(index, 1);
          
            this.initDefaultChecked();
        },
        //确定
        handleConfirm(){
            if(this.defaultChecked.length === 0){
                this.$modal.msgWarning("请选择常用菜单!");
                return
            }
            if(this.defaultChecked.length > 8){
                this.$modal.msgWarning("最多只能选择8个常用菜单，请重新选择!");
                return
            }

            let menuIds = [];

            this.defaultChecked.forEach((item) => {
                let obj = {
                    menuId:item.id,
                }
                menuIds.push(obj);
            })
            this.loading = true;

            usemenuSave(menuIds).then(({message}) => {
                this.loading = false;
                this.$modal.msgSuccess(message)
                this.openDataScope = false;
                this.$emit('commonMenuSuccess');
            }).catch((err) => {
                this.loading = false;
            })
        },
        //取消
        handleCancel(){
            this.openDataScope = false;
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
::v-deep .is-leaf,.el-tree-node__expand-icon,.el-icon-caret-right{
    display: none;
}
</style>>