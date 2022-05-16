<template>
  <div class="app-container">
     <el-row :gutter="10" class="mb8"> 
         <el-col :span="1.5">
             <el-button type="primary" plain size="mini" @click="saveUser">保存</el-button>
         </el-col>
          
     </el-row>  
     <el-row style="margin:15px 0px">
        <el-col :span="24">
          <i class="el-icon-caret-right title-icon"></i><span>职工基本信息</span>   
        </el-col>  
     </el-row>  
     <el-form :model="formData" ref="userForm" label-width="100px" :rules="rules">
     <el-row>
       <el-col :span="24" :xs="24">
            <el-row>
              <el-col :span="8">
                <el-form-item label="职工编号:" prop="userCode">
                    <el-input v-model="formData.userCode" size="mini" style="width:80%" :disabled="isUpdate"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职工姓名:" prop="realName">
                    <el-input v-model="formData.realName" size="mini" style="width:80%"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="工种:" prop="workType" >
                    <el-select v-model="formData.workType" size="mini" style="width:80%">
                      <el-option v-for="item in wokTypeList"
                      :key="item.id"
                      :label="item.workTypeName"
                      :value="item.workTypeCode">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="性别:" prop="sex">
                      <el-radio-group v-model="formData.sex">
                          <el-radio :label="0">男</el-radio>
                          <el-radio :label="1">女</el-radio>
                      </el-radio-group>
                    </el-form-item>
                </el-col>
                  <el-col :span="8">
                    <el-form-item label="职务:">
                        <el-select  v-model="formData.positionCode" size="mini" style="width:80%">
                            <el-option v-for="item in positonList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所属部门:" prop="deptId">
                    <treeselect v-model="formData.deptId" :options="treeOptions" :normalizer="normalizer" placeholder="选择所属部门" style="width:80%" />
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="手机号:">
                      <el-input  v-model="formData.phone" size="mini" style="width:80%"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出生日期:" >
                        <el-date-picker style="width:80%"
                        v-model="formData.birthdaystr"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        size="mini"
                        
                      >
                      </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="入职日期:" prop="entryDatestr">
                      <el-date-picker style="width:80%"
                        v-model="formData.entryDatestr"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期"
                        size="mini"
                      >
                      </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
         </el-col>
     </el-row>
   
     <el-row style="margin:15px 0px">
        <el-col :span="24">
          <i class="el-icon-caret-right title-icon"></i><span>系统账号信息</span>   
        </el-col>  
     </el-row>
     <el-row>
        <el-col :span="24" :xs="24">
              <el-col :span="8">
                <el-form-item label="登录账号:" prop="username">
                   <el-input v-model="formData.username" size="mini" style="width:80%"></el-input>
                 </el-form-item>
              </el-col>
              <el-col :span="8" v-if="!isUpdate">
               <el-form-item label="登录密码:">
                   <el-input  v-model="formData.password" size="mini" style="width:80%"></el-input>
                 </el-form-item>
              </el-col>
              <el-col :span="8">
                 <el-form-item label="确认密码:" v-if="!isUpdate">
                     <el-input v-model="confirmPwd" size="mini" style="width:80%"></el-input>
                 </el-form-item>
              </el-col>
          </el-col>
     </el-row>
     <el-row style="margin:25px 0px 10px 0px">
        <el-col :span="22">
          <i class="el-icon-caret-right title-icon"></i><span>劳保相关信息</span>   
        </el-col>  
        <el-col :span="1">
            <i class="el-icon-plus custom-plus" @click="addTableItem"></i>  
        </el-col>  
     </el-row>
     <el-row style="padding:0px 0px 0px 15px">
       <el-col :span="23" :xs="24">
         <el-table ref="elTable" :data="formData.userLabors" size="mini" border>
          <el-table-column label="品类" prop="category">
            <template slot-scope="scope">
            <el-form-item :prop="'userLabors.'+scope.$index+'.category'" :rules="rules.category">
              <el-select v-model="formData.userLabors[scope.$index].category" size="mini" @change="categoryChange($event,scope.$index)">
                <el-option v-for="item in formData.userLabors[scope.$index].categoryList" :label="item.name" :value="item.code" :key="item.code"></el-option>
               </el-select> 
            </el-form-item>     
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="laborType">
              <template slot-scope="scope">
                  <el-form-item :prop="'userLabors.'+scope.$index+'.laborType'" :rules="rules.laborType">
                    <el-select v-model="formData.userLabors[scope.$index].laborType" size="mini">
                      <el-option v-for="item in formData.userLabors[scope.$index].laborTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>    
               </template>    
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="delLabor(scope.$index)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
       </el-col>
     </el-row>
    </el-form>
  </div>
</template>

<script>
import { deptTree } from '@/api/system/dept'
// import { getCookie } from '@/utils/auth'
import {workTypeDictList,getTreeByParent} from "@/api/labor"
import {userCreate,userDetailUL,userModify} from "@/api/system/user"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import md5 from "js-md5";
export default {
    watch: {
    'formData.username': {
      handler: function (newUsername){
        this.formData.username = newUsername.toLocaleUpperCase();
      }
    }
  },
  components:{Treeselect},
  data(){
    return{
      isUpdate:false,
      userId:'',
      treeOptions: [],
      formData:{
        id:'',
        userCode:'',
        realName:'',
        workType:'',
        sex:'',
        deptId:undefined,        
        positionCode:'',
        phone:'',
        birthdaystr:'',
        entryDatestr:'',
        username:'',
        password:'',
        userLabors:[{category:'',laborType:'',categoryList:[],laborTypeList:[]}]        
      },
      rules:{
          userCode:[{required:true,message:'请输入职工编号',trigger:'blur'}],
          realName:[{required:true,message:'请输入职工姓名',trigger:'blur'}],
          workType:[{required:true,message:'请选择工种',trigger:'change'}],
          sex:[{required:true,message:'请选择性别',trigger:'change'}],
          deptId:[{ required: true, message: "所属部门不能为空", trigger: "blur" }],
          username:[{required:true,message:'请输入登录账号',trigger:'blur'}],
          // category:[{required:true,message:'请选择品类',trigger:'change'}],
          // laborType:[{required:true,message:'请选择规格',trigger:'change'}],
          entryDatestr:[{ required: true, message: "入职日期不能为空", trigger: "blur" }]
      },
      confirmPwd:'',
      wokTypeList:[],
      positonList:[],
      categoryList:[]
      // laborTypeList:[]
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },

  created(){
    this.isUpdate = false
    // this.formData.deptId = getCookie("unitCode")
    this.formData.deptId = this.$route.query.deptId==""?undefined:this.$route.query.deptId
    this.userId = this.$route.query.id
    // this.getTreeByParent2(40)
    // console.log(this.userId)
    if(this.userId){      
      this.$route.meta.title="修改用户"
      this.isUpdate = true
      this.userDetail(this.userId)
    }else{
      this.$route.meta.title="新增用户"
      this.getTreeByParent(40,0,'categoryList')
    }
    // if(typeof(this.userId) == undefined){
    //   this.$route.meta.title="新增用户"
    //   this.getTreeByParent(40,0,'categoryList')
    // }else{
    //   this.$route.meta.title="修改用户"
    //   this.userDetail(this.userId)
    // }
    // console.log(this.userId && this.userId != '')
    // if(this.userId && this.userId != ''){
      
     
    // }else{
      
    // }
    this.deptTree()
    this.workTypeDictList()
    
  },
  methods:{
    /** 转换用户数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      };
    },
    userDetail (id) {
      userDetailUL(id).then( ({data}) => {        
        let birthStr = this.parseTime(data.birthday,'{y}-{m}-{d}')
        let entryDateStr = this.parseTime(data.entryDate,'{y}-{m}-{d}')
        this.formData={
        id:data.id,
        userCode:data.userCode,
        realName:data.realName,
        workType:data.workType,
        sex:data.sex,
        deptId:data.deptId || undefined,        
        positionCode:data.positionCode || undefined,
        phone:data.phone,
        birthdaystr:birthStr,
        entryDatestr:entryDateStr,
        username:data.username,
        // password:data.password,
        userLabors:[]
      }

      let userLabors = data.userLabors
      let userLaborsArray = []
      userLabors.forEach((item,index)=>{       
        this.formData.userLabors.push({
          category:item.categoryCode,
          laborType:item.laborTypeId,
          categoryList:[],
          laborTypeList:[]
        })
        this.getTreeByParent(item.categoryCode,index,'laborTypeList')
        this.getTreeByParent(40,index,'categoryList')

        
  
      })

    })
    },
    delLabor(index){
        let userLabors = this.formData.userLabors;
        this.$modal.confirm('是否确认删除?').then(function () {
          userLabors.splice(index,1)
        }).then(() => {
          this.formData.userLabors = userLabors
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
     
    },
    delMalt(row){
    },
    deptTree () {
      deptTree().then( ({data}) => {
        this.treeOptions = data;
      })
    },
    categoryChange(dataId,index){
      let list = JSON.parse(JSON.stringify(this.formData.userLabors[index]['categoryList']))
      let code = ''
      list.forEach(item=>{
        if(item.code = dataId){
            code = item.code              
        }
      })
      this.formData.userLabors[index]['laborType'] = ''
      this.getTreeByParent(code,index,'laborTypeList')  
    },
    getTreeByParent(code,index,listName){
        getTreeByParent(code).then(({data})=>{        
            this.formData.userLabors[index][listName] = (data && data.children) || [];
        })
    },
    workTypeDictList(){
      workTypeDictList().then(({data})=>{
        this.wokTypeList = data;
      })
    },
    addTableItem(){
      this.formData.userLabors.push({category:'',laborType:'',categoryList:[],laborTypeList:[]})
      this.getTreeByParent(40,this.formData.userLabors.length-1,'categoryList')
    },
    computeUserLabors(userLabors){
      let userLaborsArray = []
      if(userLabors.length>0){
        userLabors.forEach(item=>{
          let userLaborsObj = {}
          if(item.category !="" && item.laborType !=""){
            item.categoryList.forEach(citem=>{
              if(item.category == citem.code){
                userLaborsObj.categoryId = citem.id;
                userLaborsObj.categoryName = citem.name
                userLaborsObj.categoryCode = citem.code
              }
            })
            item.laborTypeList.forEach(litem=>{
              if(item.laborType == litem.id){
                userLaborsObj.laborTypeId = item.laborType
                userLaborsObj.laborType = litem.name
                userLaborsObj.laborTypeCode = litem.code
              }
            })
            userLaborsArray.push(userLaborsObj)
            }
        })  
      }
      return userLaborsArray;

    },
    saveUser(){      
      this.$refs["userForm"].validate((valid)=>{
        if (!valid) return false
        if(!this.userId && this.formData.password != this.confirmPwd){   
          this.$modal.msgError("两次密码输入不一致！");
          return false
        }
        
        let userLabors = JSON.parse(JSON.stringify(this.formData.userLabors))
        let formData = {
          id:this.formData.id,
          userCode:this.formData.userCode,
          realName:this.formData.realName,
          workType:this.formData.workType,
          sex:this.formData.sex,
          deptId:this.formData.deptId,
          positionCode:this.formData.positionCode,
          phone:this.formData.phone,
          birthdaystr:this.formData.birthdaystr,
          entryDatestr:this.formData.entryDatestr,
          username:this.formData.username,
          }
          if(!this.isUpdate){
            formData.password = md5(this.formData.password)
          }
          formData.userLabors =  this.computeUserLabors(userLabors)
          if(this.formData.id != ''){
            userModify(formData).then(({data})=>{
               this.$modal.msgSuccess("修改成功");
              this.colseCurrentPage()
            })
          }else{
            userCreate(formData).then(({data})=>{
              this.$modal.msgSuccess("保存成功");
              this.colseCurrentPage()
            })
          }
         
      })
    },
    colseCurrentPage(){
      this.visitedViews.forEach(item => {
        if(item.name == this.$route.name){
          this.$tab.closePage(item).then(({ visitedViews }) => {
            // this.$router.go('-1')
            this.$router.push({name:'user',query:{name:"list"}});
          })
        }
      })
    }
  }

}
</script>

<style scoped>
.app-container{
  padding: 10px 15px;
  overflow: auto;
}
.el-form-item__content .el-input-group{
  vertical-align: middle;
}
.title-icon{
  color: rgb(64, 158, 255);
  margin-right: 5px;
}
.custom-plus{
  color: rgb(64, 158, 255);
  float:right;
  cursor: pointer;
}
</style>