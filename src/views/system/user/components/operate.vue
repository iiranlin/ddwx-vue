<template>
  <!-- 添加或修改部门对话框 -->
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="openDataScope" width="600px" append-to-body>
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="85px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户类型:" prop="userType">
            <el-select
              v-model="formData.userType"
              placeholder="请选择"
              clearable
              value-key="label"
            >
              <el-option
                v-for="dict in userTypeList"
                :key="dict.label"
                :label="dict.label"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门:" prop="deptId">
            <treeselect v-model="formData.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="选择所属部门"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户编号:" prop="userCode">
            <el-input v-model="formData.userCode" placeholder="请输入用户编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名:" prop="realName">
            <el-input v-model="formData.realName" placeholder="请输入姓名"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话:" prop="phone">
            <el-input v-model="formData.phone" @input="numberInput($event,'phone')" placeholder="请输入电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别:" prop="sex">
            <el-radio-group v-model="formData.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录名:" prop="username">
            <el-input v-model="formData.username" placeholder="请输入登录名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="type != 'update'">
          <el-form-item label="密码:" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="用户级别:" prop="rank">
            <!-- <el-radio-group v-model="formData.rank">
              <el-radio label="0">院级用户</el-radio>
              <el-radio label="1">所级用户</el-radio>
              <el-radio label="2">部级用户</el-radio>
            </el-radio-group> -->
            <el-select v-model="formData.rank" placeholder="请选择用户级别">
              <el-option v-for="item in userLevelOptions" 
                :key="item.value" 
                :label="item.name" 
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-button" type="text" @click="openDataScope = false">取 消</el-button>
      <el-button type="text" @click="type == 'create'?submitDataScope():userModify()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { userCreate, userDetail, userModify } from '@/api/system/user'
import { deptTree } from '@/api/system/dept'
import { getUserLevel } from '@/api/system/dict'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listPost } from '@/api/system/post'
import { numberInput } from '@/utils/index'
import md5 from 'js-md5'

export default {
  components: { Treeselect },
  data() {
    return {
      numberInput: numberInput,
      loading: false,
      title: '新增用户',
      type: 'add',
      id: '',
      openDataScope: false,
      deptOptions: [],
      positionOptions: [],
      userLevelOptions:[],
      formData: {
        username: '',
        password: '',
        deptId: undefined,
        userType: '',
        realName: '',
        phone: '',
        rank: '',
        userCode: '',
        sex: '',
        unitId: ''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' }
        ],
        userCode: [
          { required: true, message: '用户编号不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '用户性别不能为空', trigger: 'blur' }
        ],
        // password: [
        //   { required: true, message: "用户密码不能为空", trigger: "blur" }
        // ],
        deptId: [
          { required: true, message: '所属部门不能为空', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '用户电话不能为空', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '用户电话须为11位数字', trigger: 'blur' }
        ],
        rank: [
          { required: true, message: '用户级别不能为空', trigger: 'change' }
        ]
      },
      userTypeList: [
        { code: '0', label: '员工' },
      ]
    }
  },
  watch: {
    // 'formData.username': {
    //   handler: function(newUsername) {
    //     this.formData.username = newUsername.toLocaleUpperCase()
    //   }
    // }
  },
  created() {
    this.deptTree()
    this.getPositionOptions()
    this.getUserLevelOptions();
  },
  methods: {
    deptTree() {
      deptTree().then(({ data }) => {
        this.deptOptions = data
        // this.selectDepartData(this.deptOptions)
      })
    },
    /**获取岗位列表*/
    getPositionOptions() {
      listPost().then(res => {
        this.positionOptions = res.data.list
      })
    },
    //获取用户级别
    async getUserLevelOptions() {
      this.loading = true
      await getUserLevel().then(({ data }) => {
        this.loading = false
        this.userLevelOptions = data;
      }).catch((err) => {
        this.loading = false
      })
    },
    /** 提交按钮（数据权限） */
    init(type, id) {
      this.type = type
      this.openDataScope = true
      this.$nextTick(() => {
        this.$refs.elForm.resetFields()
        if (type === 'update') {
          this.id = id
          this.userDetail(id)
        } else if (type === 'create') {
          this.formData.deptId = id || undefined
        }
      })
    },
    /** 转换用户数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.deptName,
        children: node.children
      }
    },
    userDetail(id) {
      userDetail(id).then(({ data }) => {
        this.formData = data
        // this.formData.username = data.username;
        // this.formData.nickName = data.nickName;
        // this.formData.deptId = data.deptId || undefined;
        // this.formData.positionCode = data.positionCode || undefined;
      })
    },
    submitDataScope() {
      // 解析deptId的值
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          this.deptOptionsUnitId(this.deptOptions);
          let formData = Object.assign({}, this.formData, {password: this.formData.password?md5(this.formData.password):this.formData.password});
          userCreate(formData).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    userModify() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.deptOptionsUnitId(this.deptOptions);
          let formData = Object.assign({}, this.formData, { id: this.id })
          userModify(formData).then(({ message }) => {
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.loading = false
            this.$emit('operateSuccess')
          })
        }
      })
    },
    deptOptionsUnitId (deptOptions) {
      for(const item of deptOptions) {
        if(item.id == this.formData.deptId){
          this.formData.unitId = item.unitId;
          return
        }
        if(item.children && item.children.length > 0){
          this.deptOptionsUnitId(item.children);
        }
      }
    }
  }
}
</script>
