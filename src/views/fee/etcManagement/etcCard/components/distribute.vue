<template>
  <div class="distribute">

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
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
            >
              <span>{{ masterCard.cardNumber }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="主卡余额"
            >
              <span>{{ masterCard.balance }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="分配副卡"
            >
              <span>{{ secondaryCard.cardNumber }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="分配金额"
              prop="assignMoney"
            >
              <el-input
                v-model="form.assignMoney"
                placeholder="请输入分配金额"
                @change="inputNumberChange(form.assignMoney, 'assignMoney')"
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

import { numToFixed2 } from '@/utils'
import { gcjcEtcCardUpdETCs } from '@/api/etc'

export default {
  // 油卡分配
  name: 'Distribute',
  components: {},
  filters: {},
  data() {
    const checkAssignMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('分配金额不能为空'))
      }
      if (value > this.masterCard.balance) {
        return callback(new Error('分配金额不得高于主卡余额'))
      }
      callback()
    }
    return {
      //遮罩层
      loading: false,
      //标题
      title: '',
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        // 分配金额
        assignMoney: ''

      },
      //主卡
      masterCard:{},
      //副卡
      secondaryCard:{},
      //表单校验
      rules: {
        assignMoney: [
          { required: true, message: '分配金额不能为空', trigger: 'change' },
          { validator: checkAssignMoney, trigger: 'change' }
        ]
      },
      cardNumberOptions: []
    }
  },
  computed: {},
  created() {

  },
  mounted() {

  },
  methods: {
    //初始化
    init(secondaryCard,masterCard) {
      this.masterCard = masterCard;
      this.secondaryCard= secondaryCard;
      this.$nextTick(() => {
        this.title = '分配金额'
        this.openDataScope = true
      })
    },
    confirmButton() {
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          this.masterCard.balance = parseInt(this.masterCard.balance) - parseInt(this.form.assignMoney);
          this.secondaryCard.balance = parseInt(this.secondaryCard.balance) + parseInt(this.form.assignMoney);
          // this.secondaryCard.incomeMoney = parseInt(this.secondaryCard.incomeMoney) + parseInt(this.form.assignMoney);
          this.secondaryCard.transFee = this.form.assignMoney;

          this.loading = true;
          const paramArr = [this.masterCard,this.secondaryCard];

          gcjcEtcCardUpdETCs(paramArr).then(({message}) => {
              this.loading = false;
              this.$modal.msgSuccess(message)
              this.openDataScope = false
              this.$emit('distributeSuccess')
          }).catch((err) => {
              this.loading = false;
          })
        }
      })
    },
    //关闭dialog回调
    handleDialogClose() {
      this.$refs.elForm.resetFields()
    },
    // 处理输入的数字
    inputNumberChange(val, label) {
      this.form[label] = numToFixed2(val)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
