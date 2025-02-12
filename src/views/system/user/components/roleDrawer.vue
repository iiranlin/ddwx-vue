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
                <p>用户名称：{{selectRadioData && selectRadioData.nickName}}</p>
                <div style="width:440px;height: 1px;background: #f5f5f5;margin: 16px auto;"></div>
            </div>
            <div class="menuDrawer-div">
                <el-radio-group v-model="radio">
                    <el-radio-button v-for="(item, index) in dataParent" :key="index" :label="item">{{item.roleName}}<span :class="item.checkFlagList==0?'menuDrawer-span menuDrawer-span-color':'menuDrawer-span'">{{item.checkFlagList}}/{{(item.children && item.children.length) || 0}}</span></el-radio-button>
                </el-radio-group>
                <div class="menuDrawer-tree">
                    <!-- <el-checkbox style="margin-left: 24px;font-size: 12px;" v-model="checkbox" v-if="data.length > 0">全部</el-checkbox> -->
                    <el-tree
                        v-for="(item, index) in dataParent"
                        :key="index"
                        v-show="item.roleCode == radioData.roleCode"
                        class="drawer-tree"
                        :data="item.children"
                        show-checkbox
                        node-key="id"
                        :ref="'tree'+index"
                        @check-change="changeTree"
                        :props="defaultProps">
                    </el-tree>
                </div>
            </div> 
        </div>
        <div class="menuDrawer-footer">
            <div class="menuDrawer-footer-button">
                <el-button @click="drawer = false">关闭</el-button>
                <el-button type="primary" @click="userBindRole()">保存</el-button>
            </div>
        </div>  
    </el-drawer>
</template>
<script>
import {userRoleList, userBindRole} from '@/api/system/user';
export default {
    data () {
        return {
            checkbox: false,
            drawer: false,
            selectRadioData: null,
            totalCount: 0,
            radio: {},
            dataParent: [],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'roleName',
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
        radio (val, oldVal) {
            this.radioData = val
        }
    },
    methods: {
        init (row) {
            this.selectRadioData = row;
            this.drawer = true;
            this.userRoleList(row.id);
        },
        menuIdsArrList() {
            let menuIdsArr = [];
            this.dataParent.forEach((item, index)=>{
                let children = this.$refs['tree'+index][0].getCheckedKeys();
                let fatherNode = this.$refs['tree'+index][0].getHalfCheckedNodes();
                let menuIds = fatherNode.concat(children);
                menuIdsArr.push(...menuIds)
            })
            return menuIdsArr
        },
        userBindRole () {
            userBindRole({roleIds: this.menuIdsArrList()}, this.selectRadioData.id).then( ({message}) => {
                this.$message({
                    message: message,
                    type: 'success'
                });
                this.drawer = false;
                this.$emit('userBindRoleSuccess')
            })
        },
        userRoleList (id) {
            userRoleList(id).then( ({data}) => {
                this.dataParent = data;
                this.radioData = data[0];
				this.$nextTick(() => {
                    this.checkFlagList();
				});
            })
        },
        checkFlagList (init) {
            this.dataParent.forEach((item, index)=>{
                let generateArr = this.generateArr([item]);
                this.$refs['tree'+index][0].setCheckedNodes(generateArr);
                this.$set(item,'checkFlagList',generateArr.length);
            })
        },
		generateArr(routes, checkbox) {
			let data = [];
			const filterRoute = (routes) => {
				routes.forEach(route => {
                    if(route.children){
                        filterRoute(route.children)
                    }else{
                        if(route.isBind == 1){
                            data.push(route);
                        }
                    }
				});
				return 
			};
            filterRoute(routes);
            return data;
        },
        changeTree (val) {
            this.dataParent.forEach((item, index)=>{
                let children = this.$refs['tree'+index][0].getCheckedNodes();
                let fatherNode = this.$refs['tree'+index][0].getHalfCheckedNodes();
                let menuIds = fatherNode.concat(children);
                this.$set(item,'checkFlagList',menuIds.length);
            })
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