<template>
  <el-dialog :title="title" :visible.sync="openDataScope" append-to-body v-loading="loading">
    <div class="title-info">
        {{detailInfo.noticeTitle}}
    </div>
    <div class="content-info">
        <div v-html="detailInfo.noticeMessage"></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="openDataScope=false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {noticeReaded} from "@/api/system/notice";
export default {
  
  data() {
    return {
      title:'通知公告',
      loading: false,
      openDataScope: false,
      detailInfo:{},
    };
  },
  methods: {
    init(obj) {
      this.detailInfo = obj;
      this.openDataScope = true;

      noticeReaded(this.detailInfo.noticeUserId).then((res) => {
        
      }).catch((err) => {
        
      })
    },
  },
};
</script>
<style lang="scss" scoped>
.title-info {
    text-align: center;
}
.content-info {
  border-bottom: 1px solid #f0f0f0;

  ::v-deep a {
    color: blue !important;
    text-decoration: underline !important;
  }
}
::v-deep .el-dialog__body {
    max-height: calc(100vh - 200px);
    overflow: auto;
} 
::v-deep .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
}
</style>
