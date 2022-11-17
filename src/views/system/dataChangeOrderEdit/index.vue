<template>
    <div class="app-container" v-loading="loading">
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
                        <el-form-item label="申请部门：" prop="deptCode" v-if="deptOptions.length>0">
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
                                    :value="item.code"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="21">
                        <el-form-item label="问题描述：" prop="reqDesc">
                            <el-input type="textarea" :rows="5" maxlength="500" v-model="form.reqDesc"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上传附件">
                            <el-upload
                                ref="elupload"
                                drag
                                :data='uploadData'
                                :action="uploadUrl" 
                                :show-file-list="true"
                                :file-list="appendixList"
                                :on-success="appendixUploadOnSuccess" 
                                :on-error="appendixUploadOnError" 
                                :on-remove="appendixRemove"
                                :before-remove="appendixRemoveOnBefore"
                                :on-preview="handlePreview"
                                :headers="uploadHaders" 
                                :before-upload="appendixBeforeUpload" 
                                :auto-upload="true">
                                <i class="el-icon-upload">
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                                        <span class="upload_span">支持扩展名:.rar .zip .doc .docx .pdf .jpg...</span>
                                    </div>
                                </i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-row>
    </div>
</template>
<script>
import { gcywChangeRequestUpdate,userListAll,
gcywChangeRequestListFile,
appendixInfoImportUrl,
gcywChangeRequestUpdFile } from '@/api/system/dataChange'
import { handleNumberLimit } from '@/utils'
import { getAllAvailableUnit } from '@/api/system/unit'
import { deptTree } from "@/api/system/dept";
import selectTree from "@/components/selectTree";
import { getListByParentCode } from '@/api/system/dict'
import { uploadHaders } from '@/utils/auth'
export default {
    name: 'dataChangeOrderEdit',
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
             //附件数据
            appendixList:[],
            //附件新增数据
            appendixListAdd:[],
            //上传文件地址
            uploadUrl: appendixInfoImportUrl,
            //上传文件请求头
            uploadHaders: uploadHaders(),
            //上传文件参数
            uploadData:{
                type:'6',
            },
            //表单数据
            form: {},

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
        this.form = Object.assign({}, this.$route.params.obj);

        this.getFileList();
        this.getUnitOptions();
        this.getDeptOptions();
        this.getUserOptions();
        this.getSystemSortOptions();
    },
    methods: {
        //获取附件数据
        async getFileList(){
            this.loading = true;
            await gcywChangeRequestListFile({id:this.form.id}).then(({ data }) => {
                this.loading = false;
                this.appendixList = data;

                this.appendixList.forEach((item) => {
                    this.$set(item, 'name', item.oldFileName);
                })
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取单位数据
        async getUnitOptions(){
            this.loading = true;
            await getAllAvailableUnit().then(({ data }) => {
                this.loading = false;
                this.unitOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取部门数据
        async getDeptOptions(){
            let params = {
                unitId:this.form.unitCode,
            }
            this.loading = true;
            await deptTree(params).then(({data}) => {
                this.loading = false;
                this.deptOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取申请人数据
        async getUserOptions(){
            let params = {
                deptId:this.form.deptCode || '',
            }
            this.loading = true;
            await userListAll(params).then(({data}) => {
                this.loading = false;
                this.userOptions = data;
            }).catch((err) => {
                this.loading = false;
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
        //上传附件前
        appendixBeforeUpload(file){
            if(this.appendixList.length===3){
                this.$modal.msgWarning("最多上传3个附件！")
                return false;
            }
            // const isJPG = file.type === 'image/jpeg';
            // const isPNG = file.type === 'image/png'
            // const isPDF = file.type === 'application/pdf'
            const isLt10M = file.size / 1024 / 1024 < 10;
            const isFileName = file.name.length<90;

            if (!isLt10M) {
                this.$modal.msgWarning('上传文件大小不能超过 10MB!');
                return false;
            }
            if (!isFileName) {
                this.$modal.msgWarning('上传文件名过长!');
                return false;
            }
            this.loading = true;
            return true;
        },
        //附件上传成功
        appendixUploadOnSuccess(code, data, message){
            this.loading = false;
            this.$modal.msgSuccess(data.response.message);
            
            this.appendixListAdd.push(data.response.data);

            this.$set(data.response.data, 'name', data.response.data.originalFileName);
            this.appendixList.push(data.response.data);
        },
        //附件上传失败
        appendixUploadOnError(){
            this.loading = false;
            this.$modal.msgError("上传失败, 请重试");
        },
        //点击已上传文件列表
        handlePreview(file){
            console.log(file)
        },
        //删除上传文件前
        appendixRemoveOnBefore(file){
            if(!!file.id){   //删除原始数据
                let obj = {
                    id: file.id,
                    isDelete:'1',
                }
                gcywChangeRequestUpdFile(obj).then((res) => {
                    resolve(true)
                }).catch((err) => {
                    reject(false);
                })
            }
        },
        //删除上传文件
        appendixRemove(file){
            if(!!file.id){   //删除原始数据
                let index = this.appendixList.findIndex((item) => {
                    return item.oldFileName===file.oldFileName;
                })
                this.appendixList.splice(index, 1);
            }else{  //删除新增数据
                let indexAdd =this.appendixListAdd.findIndex((item) => {
                    return item.oldFileName===file.oldFileName;
                })
                this.appendixListAdd.splice(indexAdd,1);

                let index = this.appendixList.findIndex((item) => {
                    return item.oldFileName===file.oldFileName;
                })
                this.appendixList.splice(index, 1);
            }
        },
        //保存数据
        handleSave() {
            this.$refs.elform.validate((result) => {
                if (result) {
                    this.$modal.confirm("是否保存信息?").then(()=>{
                        this.loading = true

                        let files = [];
                        this.appendixListAdd.forEach((item) => {
                            let obj = {};
                            this.$set(obj, 'fileName', item.fileName);
                            this.$set(obj, 'oldFileName', item.originalFileName);
                            files.push(obj);
                        })
                        this.$set(this.form, 'files', files)
                        gcywChangeRequestUpdate(Object.assign({}, this.form)).then(({ message }) => {
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
.upload_span {
    display: block;
    margin-top: -20px;
    font-size: 10px;
    color: #ccc;
}
::v-deep .el-upload-list.el-upload-list--text {
    width:360px;
}
</style>
