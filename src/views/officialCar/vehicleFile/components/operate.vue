<template>
    <el-image
          v-if="openDataScope"
          ref="preview"
          class="hideImgDiv"
          :src="url"
          :preview-src-list="filePaths"/>
</template>
<script>
export default {
    data() {
        return {
            //默认图片地址
            url:'',
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
            this.filePaths = [];
            this.fileNams = fileNams;
            this.initFilePaths();
        },
        //拼接图片地址
        initFilePaths(){
            this.fileNams.forEach((item) => {
                let filePath = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName="+item;
                this.filePaths.push(filePath);
            })
            this.openDataScope = true;
            this.$nextTick(() => {
                this.$refs.preview.clickHandler();
            })
        },
    }
}
</script>
<style scoped>
/*隐藏el-image图片组件中不需要展示的的img标签*/
.hideImgDiv ::v-deep .el-image__inner{
    display: none;
}
</style>>