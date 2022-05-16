<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="600px" append-to-body>
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户类型:" prop="userType">
              <el-select
                v-model="form.userType"
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
              <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="选择所属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户编号:" prop="userCode">
              <el-input v-model="form.userCode" placeholder="请输入用户编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名:" prop="username">
              <el-input v-model="form.username" placeholder="请输入登录名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码:" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户级别:" prop="rank">
              <el-radio-group v-model="form.rank">
                <el-radio label="0">院级用户</el-radio>
                <el-radio label="1">所级用户</el-radio>
                <el-radio label="2">部级用户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():userModify()">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {userCreate, userDetail, userModify} from '@/api/system/user'
import { deptTree } from '@/api/system/dept'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listPost} from "@/api/system/post";
export default {
  components: { Treeselect },
  data() {
    return {
      loading: false,
      title: '新增用户',
      type: 'add',
      id: '',
      openDataScope: false,
      deptOptions: [],
      positionOptions: [],
      form: {
          username: '',
          password: '',
          deptId: undefined,
          userType:'',
          realName:'',
          phone:'',
          rank:'2',
          userCode: '',
          sex:''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户账号不能为空", trigger: "blur" }
        ],
        userCode: [
          { required: true, message: "用户编号不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "用户性别不能为空", trigger: "blur" }
        ],
        // password: [
        //   { required: true, message: "用户密码不能为空", trigger: "blur" }
        // ],
        deptId:  [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        userType:  [
          { required: true, message: "用户类型不能为空", trigger: "blur" }
        ]
      },
      userTypeList:[
        {code: "0",label: '员工'},
        {code: "1",label: '司机'},
        {code: "2",label: '司机兼员工'},
      ]
    }
  },
  watch: {
    'form.username': {
      handler: function (newUsername){
        this.form.username = newUsername.toLocaleUpperCase();
      }
    }
  },
  created() {
    this.deptTree();
    this.getPositionOptions()
  },
  methods: {
    deptTree () {
      deptTree().then( ({data}) => {
        this.deptOptions = data;
        // this.selectDepartData(this.deptOptions)
      })
    },
    /**获取岗位列表*/
    getPositionOptions(){
      listPost().then(res => {
        this.positionOptions = res.data.list
      })
    },
    /** 提交按钮（数据权限） */
    init (type, id) {
        this.type = type;
        this.id = id;
        this.openDataScope = true;
        this.$nextTick(() => {
            this.$refs.elForm.resetFields();
            if(type === 'update'){
                this.userDetail(id);
            }
        })
    },
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
        userDetail(id).then( ({data}) => {
          this.form = data
            // this.form.username = data.username;
            // this.form.nickName = data.nickName;
            // this.form.deptId = data.deptId || undefined;
            // this.form.positionCode = data.positionCode || undefined;
        })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          userCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    userModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          userModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    }
  }
};
</script>
