<template>
  <el-dialog
    :title="title"
    :visible.sync="openDataScope"
    width="600px"
    append-to-body
    center
    @close="handleDialogClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      label-suffix="："
      ref="elForm"
      label-width="100px"
      v-loading="loading"
    >
      <el-row
        :span="24"
        :gutter="20"
      >
        <el-col :span="24">
          <el-form-item
            label="所属单位"
            prop="unitCode"
          >
            <el-select
              v-model="form.unitCode"
              placeholder="请选择所属单位"
              clearable
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="所属车辆"
            prop="carNumber"
          >
            <el-select
              v-model="form.carNumber"
              placeholder="请选择所属车辆"
              clearable
              size="small"
              style="width:100%"
            >
              <!-- <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
              >
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="ETC类型"
            prop="isMcard"
          >
            <el-select
              v-model="form.isMcard"
              placeholder="请选择ETC类型"
              clearable
              size="small"
              style="width:100%"
            >
              <!-- <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
              >
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="主卡号"
            prop="mCardNumber"
          >
            <el-select
              v-model="form.mCardNumber"
              placeholder="请选择主卡号"
              clearable
              size="small"
              style="width:100%"
            >
              <!-- <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
              >
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="卡号"
            prop="cardNumber"
          >
            <el-input
              v-model="form.cardNumber"
              clearable
              size="small"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="是否有效"
            prop="enabled"
          >
            <el-select
              v-model="form.enabled"
              placeholder="请选是否有效"
              clearable
              size="small"
              style="width:100%"
            >
              <!-- <el-option
                v-for="item in unitData"
                :key="item.value"
                :label="item.unitName"
                :value="item.unitCode"
              >
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="type==='create'?handleCreate():handleUpdate()"
      >
        确定
      </el-button>
      <el-button @click="handleCancel">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getUnitDictList } from "@/api/driver"
import { createETCCard } from "@/api/etc"

export default {
  name: '',

  components: {

  },
  filters: {

  },
  props: {
    rowId: {
      default: '',
    },
    buttonCode: {
      type: String,
      default: ''
    },
    operateDialogFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //遮罩层
      loading: false,
      //标题
      title: "",
      //类型
      type: "",
      //数据id
      id: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        // 单位
        unitCode: '',
        // 车牌号 所属车辆
        carNumber: '',
        // 是否主卡 母卡 ETC类型
        isMcard: '',
        // 主卡号 母卡号
        mCardNumber: '',
        // 卡号
        cardNumber: '',
        // 是否有效
        enabled: '',
      },
      //单位数据
      unitData: [],
      //表单校验
      rules: {
        unitCode: [
          { required: true, message: "所属单位不能为空", trigger: "change" }
        ],
        carNumber: [
          { required: true, message: "所属车辆不能为空", trigger: ["change", 'blur'] }
        ],
        isMcard: [
          { required: true, message: "ETC类型不能为空", trigger: "change" }
        ],
        mCardNumber: [
          { required: true, message: "主卡号不能为空", trigger: "change" }
        ],
        cardNumber: [
          { required: true, message: "卡号不能为空", trigger: "blur" }
        ],
        enabled: [
          { required: true, message: "是否有效不能为空", trigger: "change" }
        ],
      },
    }
  },
  computed: {

  },
  watch: {
    operateDialogFlag: {
      handler(val) {
        if (val) {
          this.openDataScope = true;
          this.init(this.buttonCode)
        }
      }
    },
    openDataScope: {
      handler(val) {
        this.$emit('update:operateDialogFlag', val)
      }
    }
  },
  created() {
  },
  mounted() {
    this.getUnitDictList();
  },
  methods: {
    //初始化
    init(type, id) {
      this.type = type;
      this.id = id;
      this.$nextTick(() => {
        if (type === "create") {
          this.title = "新建ETC"
        } else if (type === "update") {
          this.title = "修改ETC"
          this.getFleetDetail();
        }
      })
    },
    //获取单位列表
    async getUnitDictList() {
      this.loading = true;
      await getUnitDictList().then(({ data }) => {
        this.loading = false;
        this.unitData = data;
      }).catch((err) => {
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      })
    },
    //获取车队详细信息
    async getFleetDetail() {
      this.loading = true;
      await gcjcFleetDetail(this.id).then(({ data }) => {
        this.loading = false;
        this.form = Object.assign(this.form, data);
      }).catch((err) => {
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      })
    },
    //新建
    handleCreate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await createETCCard(Object.assign({}, this.form)).then(({ message }) => {
            this.loading = false;
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess')
          }).catch((err) => {
            this.loading = false;
          })
        }
      })
    },
    //编辑
    handleUpdate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          await gcjcFleetModify(Object.assign({}, this.form)).then(({ message }) => {
            this.loading = false;
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess')
          }).catch((err) => {
            this.loading = false;
          })
        }
      })
    },
    //取消
    handleCancel() {
      this.openDataScope = false;
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elForm.resetFields();
    }
  },
}
</script>
<style scoped>
</style>>
