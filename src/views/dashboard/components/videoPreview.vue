<template>
    <el-dialog :close-on-click-modal="false" :title='title' :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
        <video
            :src="videoUrl"
            width="100%"
            height="100%"
            controls
            muted/>
   </el-dialog>
</template>
<script>

export default {

    data() {
        return {
            openDataScope:false,
            videoUrl:'',
            title:'',
            player:null,
        }
    },
    methods:{
        //初始化
        init(videoUrl,fileName){
            this.openDataScope = true;
            this.videoUrl = videoUrl;
            this.title = fileName;
        },
        handleDialogClose(){
            this.videoUrl = '';
        },
    }
    
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 0px;
}
</style>