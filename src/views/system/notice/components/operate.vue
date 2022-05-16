<template>
    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body v-loading="loading">
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="通知标题:" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" />
        </el-form-item>
      <!-- </el-form> -->
      <!-- <el-form ref="elForm" :model="form" :rules="rules" label-width="85px"> -->
        <el-form-item label="通知内容:" prop="noticeMessage">
          <el-input v-model="form.noticeMessage" />
        </el-form-item>
      </el-form>
      <!-- <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="分组:" prop="groupCode">
          <el-select
          v-model="form.groupCode"
          placeholder="角色分组"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="group in roleGroup"
            :key="group.code"
            :label="group.name"
            :value="group.code"
          />
        </el-select>
        </el-form-item>
      </el-form> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="type == 'create'?submitDataScope():noticeModify()">确 定</el-button>
        <el-button @click="openDataScope = false">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {roleDetail, roleModify, roleGroupList} from '@/api/system/role'
import {noticeCreate,noticeDetail,noticeModify} from '@/api/system/notice'
export default {
  data() {
    return {
      loading: false,
      title: '新增通知',
      type: 'add',
      id: '',
      openDataScope: false,
      form: {
          noticeTitle: '',
          noticeMessage: ''
          // groupCode: '0'
      },
      roleGroup:[],
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "通知标题不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    // this.roleGroupList()
  },
  methods: {
    /** 提交按钮（数据权限） */
    init (type, id) {
        this.type = type;
        this.id = id;
        
        this.openDataScope = true;
      if(this.$refs.elForm)this.$refs.elForm.resetFields();
        this.$nextTick(() => {            
            if(type === 'update'){
              this.title = "修改通知";
              this.noticeDetail(id);
            }
        })
    },
    roleGroupList(){
      roleGroupList().then( ({data}) => {
        this.roleGroup = data;
      })
    },
    noticeDetail (id) {
      noticeDetail(id).then( ({data}) => {
        this.form = data;
      })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          noticeCreate(this.form).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          });
        }
      })
    },
    noticeModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          noticeModify(Object.assign({}, this.form, {id: this.id})).then(({message}) => {
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