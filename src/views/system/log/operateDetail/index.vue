<template >
  <div class="app-container">
    <el-row :gutter="20">
        <el-form :model="form" ref="elform" label-width="120px" style="width:90%">
        <!--详细信息-->
        <el-row :gutter="20">
            <el-col style="margin: 15px 10px">
                <i class="el-icon-caret-right title-icon"></i><span>详细信息</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" :xs="24">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="操作人：" prop="username"><span>{{form.username}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作人Id：" prop="userId"><span>{{form.userId}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="模块名称：" prop="module"><span>{{form.module}}</span></el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="业务名称：" prop="business"><span>{{form.business}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="ip地址：" prop="clientIp"><span>{{form.clientIp}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作时间：" prop="createDate"><span>{{parseTime(form.createDate)}}</span></el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="执行方法：" prop="method"><span style="word-break: break-all;">{{form.method}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="执行描述：" prop="message"><span>{{form.message}}</span></el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="请求方式：" prop="requestMethod"><span>{{form.requestMethod}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="请求地址：" prop="requestUrl"><span style="word-break: break-all;">{{form.requestUrl}}</span></el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="请求参数：" prop="params"><span style="word-break: break-all;">{{form.params}}</span></el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="请求结果：" prop="result"><span style="word-break: break-all;">{{form.result}}</span></el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        </el-form>
    </el-row>
  </div>
</template>
<script>
export default {
    name: "operateDetail",
    data() {
        return {
            //loading框
            loading:false,
            //表单数据
            form:{},
        };
    },            
    created(){
        let obj = JSON.parse(this.$route.query.detail);

        if(this.form.id !== obj.id){
            this.form = Object.assign({}, obj);
        }
    },
    methods: {

    }
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
</style>