<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px" style="width:90%">
        <!--申请信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>申请信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24">
                <el-col :span="8">
                    <el-form-item label="工单号："><span>{{form.reqNo}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请单位："><span>{{form.unitName}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请部门：" ><span>{{form.deptName}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="系统类型："><span>{{form.sysSort}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请人："><span>{{form.reqUserName}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话："><span>{{form.reqphone}}</span></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="问题描述："><span>{{form.reqDesc}}</span></el-form-item>
                </el-col>
            </el-col>
        </el-row>
        </el-form>
        <!--附件-->
        <el-row :gutter="20">
            <el-col style="width:90%;margin: 15px 10px;">
                <i class="el-icon-caret-right title-icon"></i><span>附件</span>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 20px 40px">
                <el-table ref="eltableSecond" :data="appendixList" stripe border class="container_table">
                    <el-table-column label="序号" align="center" type="index" width="50px"></el-table-column>
                    <el-table-column label="附件名称" align="center" prop="oldFileName">
                        <template slot-scope="scope">
                            <a class='custom-a' href="#" @click="handleImageClick(appendixList[scope.$index])">{{appendixList[scope.$index].oldFileName}}</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--审核信息-->
        <el-row :gutter="20">
            <el-col style="width:90%;margin: 15px 10px;">
                <i class="el-icon-caret-right title-icon"></i><span>审核信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 20px 40px">
                <el-table ref="eltable" max-height="300px" :data="activittList" stripe border>
                    <el-table-column label="序号" align="center" type="index"></el-table-column>
                    <el-table-column label="审批日期" align="center" prop="endTime"></el-table-column>
                    <el-table-column label="审批人" align="center" prop="realName"></el-table-column>
                    <el-table-column label="审批意见" align="center" prop="message"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-form :model="form" ref="elform" label-width="120px" style="width:90%">
        <!--运维处理-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>运维处理</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24">
                <el-col :span="8">
                    <el-form-item label="处理人："><span>{{form.resUserName}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理日期："><span>{{form.resTimeStr}}</span></el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理状态："><span>{{checkResStatus(form.resStatus)}}</span></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处理过程："><span>{{form.resProcess}}</span></el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注："><span>{{form.remark}}</span></el-form-item>
                </el-col>
            </el-col>
        </el-row>
        </el-form>
    </el-row>
  </div>
</template>
<script>
import { gcywChangeRequestActivitiLog,gcywChangeRequestListFile,appendixInfoExporttUrl } from "@/api/system/dataChange"
import { getListByParentCode } from '@/api/system/dict'
import { axiosDownloadExcel } from '@/api/download'
export default {
    name: "dataChangeOrderDetail",
    data() {
        return {
            //loading框
            loading:false,
            //表单数据
            form:{},
            //附件信息
            appendixList:[],
            //审核日志
            activittList:[],
            //处理状态数据
            resStatusOptions:[],
        };
    },     
    activated(){
        this.form = Object.assign({}, this.$route.params.obj);
        this.getResStatusOptions();
        this.getFileList();
        this.getActivitiList();
    },
    methods: {
        //获取附件数据
        async getFileList(){
            this.loading = true;
            await gcywChangeRequestListFile({id:this.form.id}).then(({ data }) => {
                this.loading = false;
                this.appendixList = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取审批日志
        async getActivitiList(id){
            this.loading = true;
            let params = {
                id:this.form.id,
            }
            await gcywChangeRequestActivitiLog(params).then(({data}) => {
                this.loading = false;
                this.activittList = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取处理状态
        async getResStatusOptions(){
            this.loading = true;
            await getListByParentCode("changResStatus").then(({data}) => {
                this.loading = false;
                this.resStatusOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //判断系统类型
        checkSystemSort(value) {
            let obj = this.systemSortOptions.find((item) => {
                return item.code === value;
            })
            return !!obj?obj.name:'';
        },
        //判断处理状态
        checkResStatus(status){
            let obj = this.resStatusOptions.find((item) => {
               return item.code === status;
            })
            return !!obj?obj.name:'';
        },
        //附件点击
        handleImageClick(item){
            let params = {
                fileName: item.fileName,
            }
            axiosDownloadExcel(appendixInfoExporttUrl,params);
        },
    },
};
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
.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
.custom-a, .custom-a:focus, .custom-a:hover {
    color: #00a0ff !important;
    text-decoration: underline;
}
</style>