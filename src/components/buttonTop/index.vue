<template>
  <el-upload v-if="item.buttonCode.indexOf('import') != -1" 
    :action="uploadUrl" 
    accept=".xlsx, .xls" 
    :show-file-list="false"
    :on-success="uploadOnSuccess" 
    :on-error="uploadOnError" 
    :headers="uploadHaders" 
    :before-upload="beforeUpload" 
    :auto-upload="true">
      <el-button 
        class="custom_button"
        :type="item.buttonType" 
        plain
        :icon="item.buttonIcon"
        size="mini">
        <svg-icon :icon-class="item.buttonIcon?item.buttonIcon:''" class="icon"></svg-icon>{{item.buttonName}}
      </el-button>
   </el-upload>
  <el-button v-else
    :type="item.buttonType"
    plain
    size="mini"
    @click="newButton(item.buttonCode)"
    :disabled="buttonMode(item.buttonMode)"
    class="custom_button"
  ><svg-icon :icon-class="item.buttonIcon?item.buttonIcon:''" class="icon"></svg-icon>{{item.buttonName}}</el-button>
</template>

<script>
import { uploadHaders } from '@/utils/auth'
export default {
  name: "ButtonTop",
  props: {
    item: {
      type: Object,
      default: {}
    },
    // 非单个禁用
    single: {
      type: Boolean,
      default: true
    },
    // 非多个禁用
    multiple: {
      type: Boolean,
      default: true
    },
    uploadUrl:{
      type:String,
      default:""
    },
   
  },
  data() {
    return {
       uploadHaders: uploadHaders(),
    };
  },
  methods: {
    newButton (buttonCode) {
      this.$emit('newButton', buttonCode)
    },
    buttonMode (buttonMode) {
      if(buttonMode){
        return buttonMode == '1'?this.single : this.multiple
      }else{
        return false
      }
    },
    uploadOnSuccess({ code, data, message }){
      this.$emit('uploadOnSuccess', code,data,message)
    },
    uploadOnError(){
      this.$emit('uploadOnError', buttonCode)
    },
    beforeUpload(file){
      this.$emit('beforeUpload', file)
    }
  }
};
</script>

<style lang="scss" scoped>
.custom_button {
  border: none;
  background: none ;
  font-size: 12px;
  color: #000000;
}
.icon{
  color: #1296db !important;
}
::v-deep.el-button.el-button--primary{
    // color: #409eff;
    color: #000000;
    background: none !important;
    border-color: #a3d3ff;
}
::v-deep.el-button.el-button--primary:hover{
    color: #000000;
  border-color: #b3d8ff !important;
  background: #ECF5FF !important;
}
::v-deep.el-button.el-button--danger{
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--danger:hover{
   color: #000000;
   border-color: #fbc4c4 !important;
  background:#FEF0F0 !important;
}
::v-deep.el-button.el-button--info{
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--info:hover{
   color: #000000;
  border-color: #d3d4d6!important;
  background:#F4F4F5 !important;
}
::v-deep.el-button.el-button--success{
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--success:hover{
   color: #000000;
   border-color: #c2e7b0 !important;
  background:#F0F9EB !important;
}
::v-deep.el-button.el-button--warning{
  color: #000000;
  background: none !important;
}
::v-deep.el-button.el-button--warning:hover{
   color: #000000;
   border-color: #f5dab1 !important;
  background:#FDF6EC !important;
}
</style>