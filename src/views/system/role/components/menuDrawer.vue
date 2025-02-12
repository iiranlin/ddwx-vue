<template>
    <el-drawer
        class="menuDrawer"
        size="500px"
        :show-close="false"
        :visible.sync="drawer"
        :before-close="handleClose">
        <div class="menuDrawer-box">
            <div class="menuDrawer-box-p">
                <p>权限管理</p>
                <p>角色名称：{{selectRadioData && selectRadioData.roleName}}</p>
                <div style="width:440px;height: 1px;background: #f5f5f5;margin: 16px auto;"></div>
            </div>
            <div class="menuDrawer-div">
                <!-- <el-radio-group v-model="radio">
                    <el-radio-button v-for="(item, index) in dataParent" :key="index" :label="item">{{item.menuName}}<span :class="item.checkFlagList==0?'menuDrawer-span menuDrawer-span-color':'menuDrawer-span'">{{item.checkFlagList}}/{{item.children.length}}</span></el-radio-button>
                </el-radio-group> -->
                <div class="menuDrawer-tree">
                    <!-- <el-checkbox style="margin-left: 24px;font-size: 12px;" v-model="checkbox" v-if="data.length > 0">全部</el-checkbox> -->
                    <el-tree
                        class="drawer-tree"
                        :indent="0"
                        :data="dataParent"
                        show-checkbox
                        node-key="id"
                        ref="tree"
                        default-expand-all
                        @check-change="changeTree"
                        :props="defaultProps">
                    </el-tree>
                </div>
            </div> 
        </div>
        <div class="menuDrawer-footer">
            <div class="menuDrawer-footer-button">
                <el-button @click="drawer = false">关闭</el-button>
                <el-button type="primary" @click="roleAssignMenu()">保存</el-button>
            </div>
        </div>  
    </el-drawer>
</template>
<script>
import {roleMenuList, roleBindMenu} from '@/api/system/role';
export default {
    data () {
        return {
            checkbox: false,
            drawer: false,
            selectRadioData: null,
            totalCount: 0,
            radio: {},
            dataParent: [],
            defaultProps: {
                children: 'children',
                label: 'menuName',
                disabled: (data, node) => {
                    //禁用操作
                    // if(data.isBind === 1){
                    //     return true
                    // }else{
                    //     return false
                    // }
                }
            },
            radioData: {},
            type: '1',
            arrTree: [],
        };
    },
    watch: {
        // checkbox(val, oldVal) {
        //     this.$refs.tree.setCheckedNodes(this.generateArr(this.data,val))
        // },
        // radio (val, oldVal) {
        //     this.radioData = val
        // }
    },
    methods: {
        init (row) {
            this.selectRadioData = row;
            this.drawer = true;
            // this.type = type;
            // if(this.selectRadioData){
            //     this.drawer = true;
                this.roleMenuList(row.id);
            // }else{
            //     this.$message({
            //         message: "请选择一条数据！",
            //         type: 'warning'
            //     });
            // }
        },
        roleAssignMenu () {
            roleBindMenu({menuIds: this.arrTree}, this.selectRadioData.id).then( ({message}) => {
                this.$message({
                    message: message,
                    type: 'success'
                });
                this.drawer = false;
            })
        },
        roleMenuList (id) {
            roleMenuList(id).then( ({data}) => {
                this.dataParent = data
				this.$nextTick(() => {
                    this.checkFlagList();
				});
            })
        },
        checkFlagList () {
            let generateArr = this.generateArr(this.dataParent);
            this.$refs['tree'].setCheckedNodes(generateArr);
        },
		generateArr(routes, checkbox) {
			let data = [];
			const filterRoute = (routes) => {
				routes.forEach(route => {
					if (route.children.length) {
						filterRoute(route.children)
					} else {
						if(route.isBind == 1){
							data.push(route);
                        }
					};
				});
				return 
			};
            filterRoute(routes);
            return data;
        },
        changeTree (row, type) {
            this.arrTree = [];
            let children = this.$refs['tree'].getCheckedNodes();
            let fatherNode = this.$refs['tree'].getHalfCheckedNodes();
            let menuIds = fatherNode.concat(children);
            for (var i = 0; i < menuIds.length; i++) {
                this.arrTree.push(menuIds[i].id);
            }
        },
        handleClose(done) {
            done();
        },
    }
}
</script>
<style lang="scss">
.menuDrawer{
    .el-drawer__body{
        height: 100%;
        overflow: initial;
    }
    .menuDrawer-box{
        display: flex;
		flex-direction: column;
		justify-content: space-between;
        height: 100%;
        padding: 10px 10px 70px 10px;
    }
    .menuDrawer-div{
        flex: 1;
        overflow-y: auto;
        .el-radio-group{
            width: 230px;
            float: left;
            border-right: 1px solid #f5f5f5;
            .el-radio-button{
                width: 200px;
                height: 40px;
                line-height: 40px;
                margin-left: 15px;
                .el-radio-button__inner{
                    width: 100%;
                    height: 100%;
                    border: 0px;
                    padding: 0px;
                    padding-left: 5px;
                    font-family:Microsoft YaHei;
                    font-size:14px;
                    line-height: 40px;
                    text-align: inherit;
                }
                .menuDrawer-span{
                    position: absolute;
                    right: 5px;
                    font-size:12px;
                }
                .menuDrawer-span-color{
                    color: #c4c4c4;
                }
            }
            .is-active{
                .menuDrawer-span-color{
                    color: #ffffff;
                }
            }
        }
        .menuDrawer-tree{
            width: 210px;
            float: left;
            margin-left: 20px;
        }
    }
    .el-drawer__header{
        margin-bottom: 0px;
        padding: 0px;
        font-family:Microsoft YaHei;
        color:#292b32;
        font-size:18px;
    }
    p:nth-child(1){
        width: 100%;
        height: 19px;
        margin-left: 20px;
        font-family:Microsoft YaHei;
        color: #292b32;
        font-size: 18px;
    }
    p:nth-child(2){
        margin-left: 20px;
        height: 25px;
        font-family:Microsoft YaHei;
        color: #292b32;
        font-size: 14px;
    }
    .menuDrawer-footer{
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 20px;
        .menuDrawer-footer-button{
            .el-button {
                height: 40px;
                width: 40%;
                margin-left: 0px;
                &:first-child {
                    margin-right: 1%;
                }
            }
        }
    }
}
</style>