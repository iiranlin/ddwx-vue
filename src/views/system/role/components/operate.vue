<template>
    <!-- 分配角色数据权限对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="500px" append-to-body v-loading="loading">
      <el-form ref="elForm" :model="form" :rules="rules" label-width="85px">
        <!-- <el-form-item label="角色编号:" prop="roleCode">
          <el-input v-model="form.roleCode" maxlength="50" />
        </el-form-item> -->
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="form.roleName" maxlength="20" />
        </el-form-item>
        <el-form-item label="分组:" prop="groupId">
          <el-select
          v-model="form.groupId"
          placeholder="角色分组"
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="group in roleGroup"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          />
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-button" type="text" @click="openDataScope = false">取 消</el-button>
        <el-button type="text" @click="type == 'create'?submitDataScope():roleModify()">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {roleCreate, roleDetail, roleModify, roleGroupList} from '@/api/system/role'
export default {
  data() {
    return {
      loading: false,
      title: '新增角色',
      type: 'add',
      openDataScope: false,
      id:"",
      form: {
          roleCode: '',
          roleName: '',
          groupId: '',
          groupName:""
      },
      roleGroup: [],
      // 表单校验
      rules: {
        roleCode: [
          { required: false, message: "角色编号不能为空", trigger: "blur" }
        ],
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.roleGroupList()
  },
  methods: {
    /** 提交按钮（数据权限） */
    init (type, id) {
        this.type = type;
        this.id = id;
        this.openDataScope = true;
        this.$nextTick(() => {
            this.$refs.elForm.resetFields();
            if(type === 'update'){
              this.title = "修改角色";
              this.roleDetail(id);
            }
        })
    },
    roleGroupList(){
      roleGroupList().then( ({data}) => {
        this.roleGroup = data;
        // this.form.groupId = data[0].id;
        this.form.groupId = data[0].id;
      })
    },
    roleDetail (id) {
      roleDetail(id).then( ({data}) => {
        this.form.roleCode = data.roleCode;
        this.form.roleName = data.roleName;
        this.form.groupId = data.groupId;
        this.form.groupName = data.groupName;
      })
    },
    submitDataScope () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          let formData = JSON.parse(JSON.stringify(this.form))
              formData.groupId = this.form.groupId;
              formData.groupName = this.roleGroup.find(item=>item.id===this.form.groupId).name;
          roleCreate(formData).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          }).catch((err) => {
             this.loading = false;
          });
        }
      })
    },
    roleModify () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
          this.loading = true;
          let formData = JSON.parse(JSON.stringify(this.form))
              formData.groupId = this.form.groupId;
              formData.groupName = this.roleGroup.find(item=>item.id===this.form.groupId).name;
          roleModify(Object.assign({}, formData, {id: this.id})).then(({message}) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.loading = false;
            this.$emit('operateSuccess')
          }).catch((err) => {
             this.loading = false;
          });
        }
      })
    }
  }
};
</script>