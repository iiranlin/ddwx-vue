<template>
    <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body center @close="handleDialogClose()">
        <el-carousel trigger="click" indicator-position="outside" :autoplay="false">
            <el-carousel-item v-for="(item,index) in filePaths" :key="index">
                <img :src="item" style="width:100%;height:100%;">
            </el-carousel-item>
        </el-carousel>
     </el-dialog>
</template>
<script>
import {gcjcClassCreate,gcjcClassDetail,gcjcClassModify} from "@/api/driver"
export default {
    data() {
        return {
            //遮罩层
            loading:false,
            //标题
            title:"",
            //图片名称数据
            fileNams:[],
            //图片地址集合
            filePaths:[],
            //显示隐藏
            openDataScope:false,
        }
    },
    created(){

    },
    methods:{
        //初始化
        init(fileNams){
            this.fileNams = fileNams;
            console.log(this.fileNams);
            this.openDataScope = true;
            this.$nextTick(() => {
                this.title = "图片详情"
                this.initFilePaths();
            })
        },
        //拼接图片地址
        initFilePaths(){
            this.fileNams.forEach((item) => {
                let filePath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+item;
                this.filePaths.push(filePath);
            })
        },
        //关闭dialog回调
        handleDialogClose(){
            this.fileNams = [];
            this.filePaths = [];
        }
    }
}
</script>
<style scoped>

</style>>