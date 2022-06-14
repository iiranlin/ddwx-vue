<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="导出范围选择"
    width="30%"
  >
    <el-row class="alert-title">
      <span>提示:单次导出条数最大为10000条</span>
    </el-row>
    <el-row>
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="当前页"></el-tab-pane>
        <el-tab-pane label="所有"></el-tab-pane>
        <el-tab-pane label="指定范围页">
          <el-form :model="pageRange" :rules="exportRules" ref="pageRange" label-width="100px">
            <el-col :span="10">
              <el-form-item label-width="0" prop="startPage">
                <el-input v-model="pageRange.startPage" :size="size" placeholder="请输入开始页数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="margin-top: 10px">
              <i class="el-icon-minus"></i>
            </el-col>
            <el-col :span="10" style="margin-bottom: 10px">
              <el-form-item label-width="0" prop="endPage">
                <el-input v-model="pageRange.endPage" :size="size" placeholder="请输入结束页数"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <span slot="footer">
      <el-button size="small" type="primary" @click="exportFile">导出</el-button>
      <el-button size="small" @click="visible=false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'index',
  props: {
    total: {
      required: true,
      type: Number
    },
    pageSize: {
      required: true,
      type: Number
    },
    pageNum: {
      required: true,
      type: Number
    }
  },
  data() {
    let validateStartPage = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入开始页数'))
      } else {
        if (parseInt(value) > this.maxPage) {
          callback(new Error('开始页数不能大于最大页'))
        }
        if (this.pageRange.endPage !== '') {
          if (parseInt(value) > this.pageRange.endPage) {
            callback(new Error('开始页数不能大于结束页数'))
          }
        }
        callback()
      }
    }
    let validateEndPage = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入结束页数'))
      } else {
        if (parseInt(value) > Math.ceil(this.total / this.pageSize)) {
          callback(new Error('结束页数不能大于最大页'))
        }
        if (this.pageRange.startPage !== '') {
          if (parseInt(value) < this.pageRange.startPage) {
            callback(new Error('结束页数不能小于开始页数'))
          }
        }
        callback()
      }
    }
    return {
      size: 'small',
      visible: false,
      pageRange: {
        startPage: '',
        endPage: ''
      },
      exportRules: {
        startPage: { required: true, validator: validateStartPage, trigger: 'blur' },
        endPage: { required: true, validator: validateEndPage, trigger: 'blur' }
      },
      searchInfo: {
        startPage: this.pageNum,
        endPage: this.pageNum
      },
      currentTabIndex: '0',
      maxExportNum: 10000
    }
  },
  computed: {
    maxPage() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  methods: {
    tabClick(tab) {
      switch (tab.index) {
        case '0':
          this.currentTabIndex = '0'
          this.searchInfo.startPage = this.pageNum
          this.searchInfo.endPage = this.pageNum
          break
        case '1':
          this.currentTabIndex = '1'
          this.searchInfo.startPage = 1
          this.searchInfo.endPage = this.maxPage
          break
        case '2':
          this.currentTabIndex = '2'
          break
        default:
          console.log('out of index')
      }
    },
    exportFile() {
      if (this.currentTabIndex === '0') {
        this.$emit('exportFile', this.searchInfo)
      } else if (this.currentTabIndex === '1') {
        if (this.total > this.maxExportNum) {
          this.$message.warning('导出条数大于' + this.maxExportNum + '条')
        } else {
          this.$emit('exportFile', this.searchInfo)
        }
      } else if (this.currentTabIndex === '2') {
        this.$refs.pageRange.validate((valid) => {
          if (valid) {
            this.searchInfo.startPage = this.pageRange.startPage
            this.searchInfo.endPage = this.pageRange.endPage
            let exportNumber = (this.searchInfo.endPage - this.searchInfo.startPage + 1) * this.pageSize
            if (exportNumber > this.maxExportNum) {
              this.$message.warning('导出条数大于' + this.maxExportNum + '条')
            } else {
              this.$emit('exportFile', this.searchInfo)
            }
          }
        })
      }
    },
    init() {
      this.visible = true
    }
  }
}
</script>

<style scoped>
.alert-title {
  font-size: 13px;
  line-height: 35px;
  padding: 0 10px;
  background-color: #ffeded;
  color: #ff4949;
  margin-bottom: 10px;
}
</style>
