<template>
    <el-dialog :close-on-click-modal="false" :title='title' :visible.sync="openDataScope" width="700px" append-to-body center @close="handleDialogClose()">
        <div style="width:100%;height:500px">
            <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" style="width:100%;height:100%;"></video>
        </div>
   </el-dialog>
</template>
<script>
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

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

            this.$nextTick(() => {
                this.initVideoPlayer();
            })
        },
        initVideoPlayer() {
            this.player = videojs(this.$refs.videoPlayer, {
                controls: true,
                sources: [{
                    src: this.videoUrl,
                    type: 'video/mp4'
                }]
            });
        },
        handleDialogClose(){
            this.videoUrl = '';
            this.player.pause(); 
            this.player.currentTime(0); 
        },
    }
    
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 0px;
}
</style>