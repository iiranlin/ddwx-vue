<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="1.5">
                <el-button type="primary" size="small" @click="handleSave">保存</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-form :model="form" :rules="rules" ref="elform" label-width="120px">
                <!--申请信息-->
                <el-row :gutter="20">
                    <el-col style="margin: 15px 10px">
                        <i class="el-icon-caret-right title-icon"></i><span>申请信息</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="申请单位：" prop="unitCode">
                            <el-select v-model="form.unitCode" placeholder="请选择申请单位" style="width:100%" clearable :loading="loading">
                                <el-option
                                    v-for="item in unitOptions"
                                    :key="item.value"
                                    :label="item.unitName"
                                    :value="item.unitCode"
                                    @click.native="handleUnitChange(item)"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="申请部门：" prop="deptCode">
                            <select-tree 
                                :value="form.deptCode"
                                :options="deptOptions"
                                @getValue="deptIdChange($event)"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="申请人：" prop="reqUserId">
                            <el-select v-model="form.reqUserId" placeholder="请选择申请人" style="width:100%" clearable :loading="loading">
                                <el-option
                                    v-for="item in userOptions"
                                    :key="item.value"
                                    :label="item.realName"
                                    :value="item.username"
                                    @click.native="handleUserChange(item)"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="联系电话：" prop="reqphone">
                            <el-input v-model="form.reqphone" maxlength="11" @input="handleNumberLimit(form,'reqphone',11)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="系统类型：" prop="sysSort">
                            <el-select v-model="form.sysSort" placeholder="请选择系统类型" style="width:100%" clearable :loading="loading">
                                <el-option
                                    v-for="item in systemOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.name"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="21">
                        <el-form-item label="问题描述：" prop="reqDesc">
                            <el-input type="textarea" :rows="5" maxlength="500" v-model="form.reqDesc"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import { gcywChangeRequestAdd,userListAll } from '@/api/system/dataChange'
import { handleNumberLimit } from '@/utils'
import { getAllAvailableUnit } from '@/api/system/unit'
import { deptTree } from "@/api/system/dept";
import selectTree from "@/components/selectTree";
import { getListByParentCode } from '@/api/system/dict'
export default {
    name: 'dataChangeOrderCreate',
    components: { selectTree },

    data() {
        return {
            handleNumberLimit: handleNumberLimit,
            //loading框
            loading: false,
            //单位数据
            unitOptions:[],
            //部门数据
            deptOptions:[],
            //申请人数据
            userOptions:[],
            //系统类型数据
            systemOptions:[],
            //表单数据
            form: {
                unitCode: '',    //申请单位编码
                unitName: '',    //申请单位名称
                deptCode: '',    //申请部门编码
                deptName: '',    //申请部门名称
                reqUserId:'',   //申请人id
                reqUserName:'',     //申请人名称
                reqphone:'',        //联系电话
                sysSort:'',         //系统类型
                reqDesc:'',         //问题描述
                resStatus:'0',
            },
            rules: {
                unitCode: [
                    { required: true, message: '申请单位不能为空', trigger: 'change' }
                ],
                deptCode: [
                    { required: true, message: '申请部门不能为空', trigger: 'change' }
                ],
                reqUserId: [
                    { required: true, message: '申请人不能为空', trigger: 'change' }
                ],
                reqphone: [
                    { required: true, message: '联系电话不能为空', trigger: 'blur' }
                ],
                sysSort: [
                    { required: true, message: '系统类型不能为空', trigger: 'change' }
                ],
                reqDesc: [
                    { required: true, message: '问题描述不能为空', trigger: 'blur' }
                ],

            },
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created() {
        this.getUnitOptions();
        this.getSystemSortOptions();
    },
    methods: {
        //获取单位数据
        async getUnitOptions(){
            await getAllAvailableUnit().then(({ data }) => {
                this.unitOptions = data;
            }).catch((err) => {

            })
        },
        //获取部门数据
        async getDeptOptions(){
            let params = {
                unitId:this.form.unitCode,
            }
            await deptTree(params).then(({data}) => {
                this.deptOptions = data;
            }).catch((err) => {
                
            })
        },
        //获取申请人数据
        async getUserOptions(){
            let params = {
                deptId:this.form.deptCode || '',
            }
            await userListAll(params).then(({data}) => {
                this.userOptions = data;
            }).catch((err) => {
                
            })
        },
        //获取系统类型
        async getSystemSortOptions(){
            this.loading = true;
            await getListByParentCode("changSysSort").then(({data}) => {
                this.loading = false;
                this.systemOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //选择单位回调
        handleUnitChange(item){
            this.form.unitCode = item.unitCode;

            this.deptOptions = [];
            this.form.deptCode = '';
            
            this.userOptions = [];
            this.form.reqUserId = '';
            this.form.reqUserName = '';

            this.getDeptOptions();
        },
        //选择部门回调
        deptIdChange (val) {
            this.form.deptCode = val;

            this.userOptions = [];
            this.form.reqUserId = '';
            this.form.reqUserName = '';
            
            this.getUserOptions();
        },
        //选择申请人回调
        handleUserChange(item){
            this.form.reqUserId = item.username;
            this.form.reqUserName = item.realName;
            this.form.reqphone = item.phone;
        },
        //保存数据
        handleSave() {
            this.$refs.elform.validate((result) => {
                if (result) {
                    this.$modal.confirm("是否保存信息?").then(()=>{
                        this.loading = true
                        gcywChangeRequestAdd(Object.assign({}, this.form)).then(({ message }) => {
                            this.loading = false
                            this.$modal.msgSuccess(message)
                            this.closeCurrentPage()
                        }).catch((err) => {
                            this.loading = false
                        })
                    }).catch((err) => {
                        
                    })
                }
            })
        },
        //关闭当前页面
        closeCurrentPage() {
            this.visitedViews.forEach((item) => {
                if (item.name == this.$route.name) {
                    this.$tab.closePage(item).then(({ visitedViews }) => {
                        this.$router.push({ name: 'dataChangeOrder' })
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.app-container {
  padding: 10px 15px;
  overflow: auto;
}
.title-icon {
  color: rgb(64, 158, 255);
  margin-right: 5px;
}
</style>
