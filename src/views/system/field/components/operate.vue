<template>
  <!-- 添加或修改部门对话框 -->
  <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="700px" append-to-body>
    <el-form ref="elForm" :model="form" :rules="rules" label-width="105px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属页面:" prop="menuId">
            <treeselect v-model="form.menuId" :options="menuOptions" :normalizer="normalizer" :disable-branch-nodes="true"
                        placeholder="请选择所属页面"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序:" prop="seq">
            <el-input-number v-model="form.seq" controls-position="right" :min="1" :max="99"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段编号:" prop="fieldCode">
            <el-input v-model="form.fieldCode" placeholder="请输入字段编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段名称:" prop="fieldName">
            <el-input v-model="form.fieldName" placeholder="请输入字段名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段宽度:" prop="fieldWidth">
            <el-input v-model="form.fieldWidth" placeholder="请输入字段宽度"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对齐方式:" prop="align">
            <el-select
              v-model="form.align"
              placeholder="请选择对齐方式"
              clearable
            >
              <el-option
                v-for="align in alignList"
                :key="align.code"
                :label="align.name"
                :value="align.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字段类型:" prop="fieldType">
            <el-select
              v-model="form.fieldType"
              placeholder="请选择"
              clearable
              @change="changeFieldType"
            >
              <el-option
                v-for="dict in fieldTypeList"
                :key="dict.code"
                :label="dict.label"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.fieldType === 'dict' || form.fieldType === 'date'">
          <el-form-item label="字典:" prop="fieldFormatDict" v-if="form.fieldType === 'dict'">
            <treeselect v-model="form.fieldFormatDict" :options="commonTreeList" :normalizer="normalizera" @select="selectDict"
                        @input="inputDict" placeholder="请选择字典"
            />
          </el-form-item>
          <el-form-item label="日期格式:" prop="fieldFormat" v-else>
            <el-select v-model="form.fieldFormat" placeholder="请选择" clearable>
              <el-option
                v-for="dict in fieldFormatList"
                :key="dict.code"
                :label="dict.label"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="展示方式:" prop="fieldFormat">
            <el-input v-model="form.fieldFormat" disabled placeholder="请输入展示方式"/>
            <!--<span>{{ form.fieldFormat }}</span>-->
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.fieldType === 'dict'">
          <el-form-item label="启用多选:" prop="isMultiple">
            <el-checkbox v-model="form.isMultiple" :true-label="1" :false-label="0">是</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="启用搜索:" prop="isSearch">
            <el-checkbox v-model="form.isSearchHeader" :true-label="1" :false-label="0">列表表头</el-checkbox>
            <el-checkbox v-model="form.isSearchArea" :true-label="1" :false-label="0">查询区域</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用排序:" prop="isOrder">
            <el-checkbox v-model="form.isOrder" :true-label="1" :false-label="0">是</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="隐藏字段:" prop="isHide">
            <el-checkbox v-model="form.isHide" :true-label="1" :false-label="0">是</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用:" prop="status">
            <el-checkbox v-model="form.status" :true-label="0" :false-label="1">是</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="链接页面:" prop="link">
            <el-input v-model="form.link" placeholder="请输入链接页面"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="type === 'create'?submitDataScope():fieldModify()">确 定</el-button>
      <el-button @click="openDataScope = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { menuFieldCreate, menuFieldDetail, menuFieldModify } from '@/api/system/menu-field'
import { menuTree } from '@/api/system/menu'
import { commonTree } from '@/api/system/dict/common'
import { alignList } from '@/utils/constant'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    menuId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      title: '新增字段',
      type: 'add',
      id: '',
      openDataScope: false,
      menuOptions: [],
      commonTreeList: [],
      fieldTypeList: [
        { code: 'String', label: '字符串' },
        { code: 'Number', label: '数字' },
        { code: 'date', label: '日期' },
        { code: '4', label: '枚举' },
        { code: 'dict', label: '字典' }
      ],
      fieldFormatList: [
        { code: '{y}', label: '年' },
        { code: '{y}-{m}', label: '年-月' },
        { code: '{y}-{m}-{d}', label: '年-月-日' }
      ],
      alignList,
      form: {
        fieldCode: '',
        fieldName: '',
        fieldWidth: '',
        menuId: undefined,
        parentId: undefined,
        fieldType: '',
        status: 0,
        seq: 0,
        isHide: 0,
        alignCode: '',
        fieldFormat: '',
        link: '',
        fieldFormatDict: '',
        isMultiple: 0
      },
      // 表单校验
      rules: {
        fieldCode: [
          { required: true, message: '字段编号不能为空', trigger: 'blur' }
        ],
        fieldName: [
          { required: true, message: '字段名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.fieldType'(newVal) {
      if (newVal !== 'dict') {
        this.form.fieldFormatDict = ''
        this.form.isMultiple = 0
      }
    }
  },
  created() {
  },
  methods: {
    getMenuTree() {
      menuTree().then(({ data }) => {
        this.menuOptions = data
        this.form.menuId = this.menuId || undefined
      })
    },
    /** 提交按钮（数据权限） */
    init(type, id) {
      this.type = type
      this.id = id
      this.openDataScope = true
      this.$nextTick(() => {
        this.getMenuTree()
        this.$refs.elForm.resetFields()
        if (type === 'update') {
          this.title = '修改字段'
          this.fieldDetail(id)
        }
      })
    },
    /** 转换字段数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      }
    },
    /** 转换字段数据结构 */
    normalizera(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    fieldDetail(id) {
      menuFieldDetail(id).then(({ data }) => {
        this.form = data
        if (data.fieldType === 'dict') {
          this.commonTree()
        }
      })
    },
    submitDataScope() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          this.loading = true
          menuFieldCreate(this.form).then(({ message }) => {
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.loading = false
            this.$emit('operateSuccess')
          })
        }
      })
    },
    fieldModify() {
      this.$refs['elForm'].validate(valid => {
        if (valid) {
          this.loading = true
          menuFieldModify(Object.assign({}, this.form, { id: this.id })).then(({ message }) => {
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.loading = false
            this.$emit('operateSuccess')
          })
        }
      })
    },
    commonTree() {
      commonTree().then(({ data }) => {
        this.commonTreeList = data
      })
    },
    changeFieldType() {
      let fieldType = this.form.fieldType
      this.form.fieldFormatDict = undefined
      this.form.fieldFormat = ''
      if (fieldType === 'dict') {
        this.commonTree()
      }
    },
    inputDict(value, instanceId) {
      if (!value) {
        this.form.fieldFormat = ''
      }
    },
    selectDict(node, instanceId) {
      const child = node.children
      let format = {}
      if (child) {
        for (const dict of child) {
          format[dict['code']] = dict['name']
        }
      }
      this.form.fieldFormat = JSON.stringify(format)
    }
  }
}
</script>
<style lang="scss" scoped>
.cautious {
  color: red;
  margin-left: 10px;
}
</style>
