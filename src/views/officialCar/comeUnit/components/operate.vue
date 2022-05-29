<template>
  <el-dialog :title="title" :visible.sync="openDataScope" width="800px" append-to-body center @close="handleDialogClose">
    <el-form :model="form" :rules="rules" label-suffix="：" ref="elForm" label-width="120px" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位类型" prop="unitCategory">
            <el-select v-model="form.unitCategory" placeholder="请选择单位类型" clearable size="small" style="width:100%">
              <el-option v-for="item in unitCategoryList" :key="item.id" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位编号" prop="unitCode">
            <el-input v-model="form.unitCode" placeholder="请输入单位编号" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位名称" prop="unitName">
            <el-input v-model="form.unitName" placeholder="请输入单位名称" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务范围" prop="businessLine">
            <el-input v-model="form.businessLine" placeholder="请输入业务范围" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="全国信息代码" prop="unitNumber">
            <el-input v-model="form.unitNumber" placeholder="请输入全国信息代码" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="linkMan">
            <el-input v-model="form.linkMan" placeholder="请输入联系人" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="linkPhone">
            <el-input v-model="form.linkPhone" placeholder="请输入联系方式" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="单位地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入单位地址" type="textarea" clearable size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="type==='create'? handleCreate():handleUpdate()">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getListByParentId } from '@/api/system/dict'
import { addComeUnit, updateComeUnit } from '@/api/comeUnit'

export default {
  name: '',
  data() {
    return {
      //遮罩层
      loading: false,
      //标题
      title: '',
      //类型
      type: '',
      //数据id
      id: '',
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        id: '',
        unitCategory: '',
        unitCode: '',
        unitName: '',
        businessLine: '',
        unitNumber: '',
        linkMan: '',
        linkPhone: '',
        address: ''
      },
      //表单校验
      rules: {
        unitCategory: [
          { required: true, message: '单位类型不能为空', trigger: 'blur' }
        ],
        unitCode: [
          { required: true, message: '单位编号不能为空', trigger: 'blur' }
        ],
        unitName: [
          { required: true, message: '单位名称不能为空', trigger: 'blur' }
        ],
        unitNumber: [
          { required: true, message: '全国信息代码不能为空', trigger: 'blur' }
        ],
        linkMan: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        linkPhone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' }
        ]
      },
      unitCategoryList: []
    }
  },
  mounted() {
    getListByParentId('1001').then(res => {
      this.unitCategoryList = res.data
    })
  },
  watch: {
    openDataScope(newVal) {
      if (!newVal) {
        this.form = {
          id: '',
          unitCategory: '',
          unitCode: '',
          unitName: '',
          businessLine: '',
          unitNumber: '',
          linkMan: '',
          linkPhone: '',
          address: ''
        }
        this.$refs.elForm.clearValidate()
      }
    }
  },
  methods: {
    //初始化
    init(type, data) {
      this.type = type
      if (type === 'create') {
        this.title = '新建往来单位'
      } else if (type === 'update') {
        this.title = '修改往来单位'
        Object.keys(this.form).forEach(key => {
          this.form[key] = data[key]
        })
      }
      this.openDataScope = true
    },
    //新建
    handleCreate() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addComeUnit(this.form).then(({ message }) => {
            this.loading = false
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.$emit('operateSuccess')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    //编辑
    handleUpdate() {
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          updateComeUnit(this.form).then(({ message }) => {
            this.loading = false
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.$emit('operateSuccess')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    //取消
    handleCancel() {
      this.openDataScope = false
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elForm.resetFields()
    }
  }
}
</script>
<style scoped>
</style>>
