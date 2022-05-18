<template>
  <div class='distribute'>

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
              label="主卡号"
              prop="mCardNumber"
            >
              <el-input
                v-model="form.mCardNumber"
                placeholder="请选择主卡号"
                readonly
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="主卡余额"
              prop="balance"
            >
              <el-input
                v-model="form.balance"
                placeholder="主卡余额"
                readonly
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="分配副卡"
              prop="cardNumber"
            >
              <el-select
                v-model="form.cardNumber"
                placeholder="请选副卡"
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
              label="分配金额"
              prop="money"
            >
              <el-input
                v-model="form.money"
                placeholder="请输入分配金额"
                @change="inputNumberChange(form.money, 'money')"
                clearable
              >
              </el-input>
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
          @click="confirmButton"
        >
          确定
        </el-button>
        <el-button @click="openDataScope = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { numToFixed2 } from '@/utils/index'
export default {
  // 油卡分配
  name: 'Distribute',
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
    distributeDialogFlag: {
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
        // 主卡号 母卡号
        mCardNumber: '',
        // 余额
        balance: '',
        // 分配副卡 卡号
        cardNumber: '',
        // 分配金额
        money: '',

      },
      //单位数据
      unitData: [],
      //表单校验
      rules: {
        mCardNumber: [
          { required: true, message: "主卡号", trigger: "blur" },
        ],
        balance: [
          { required: true, message: "主卡余额", trigger: "blur" },
        ],
        cardNumber: [
          { required: true, message: "请选择分配副卡", trigger: "change" },
        ],
        money: [
          { required: true, message: "分配金额不能为空", trigger: "change" },
        ]
      },
    };
  },
  computed: {

  },
  watch: {
    distributeDialogFlag: {
      handler(val) {
        if (val) {
          this.openDataScope = true;
          this.init(this.buttonCode)
        }
      }
    },
    openDataScope: {
      handler(val) {
        this.$emit('update:distributeDialogFlag', val)
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    //初始化
    init(type, id) {
      this.type = type;
      this.id = id;
      this.$nextTick(() => {
        this.title = "分配金额"
      })
    },
    confirmButton() {
      this.$message.error('确定按钮')
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elForm.resetFields();
    },
    // 处理输入的数字
    inputNumberChange(val, label) {
      this.form[label] = numToFixed2(val);
    }
  },
};
</script>

<style scoped lang="scss">
</style>
