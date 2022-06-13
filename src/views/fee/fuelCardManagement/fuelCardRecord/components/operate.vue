<template>
  <el-dialog
    :title="title" :close-on-click-modal="false"
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
            label="所属车辆"
            prop="carNumber"
          >
            <el-select
              v-model="form.carNumber"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="selectLoading"
              placeholder="请选择所属车辆"
              clearable
              size="small"
              style="width:100%"
              @change="carNumberChange"
            >
              <el-option
                v-for="item in carNumberOptions"
                :key="item.carNumber"
                :label="item.carNumber"
                :value="item.carNumber"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="卡号"
            prop="cardNumber"
          >
            <el-select
              v-model="form.cardNumber"
              placeholder="请选择所卡号"
              clearable
              size="small"
              style="width:100%"
              @change="cardNumberChange"
            >
              <el-option
                v-for="item in cardNumberOptions"
                :key="item.id"
                :label="item.cardNumber"
                :value="item.cardNumber"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="交易类型"
            prop="incomeOrExp"
          >
            <!-- 充值或消费；Y充值；N消费 -->
            <el-select
              v-model="form.incomeOrExp"
              placeholder="请选择交易类型"
              clearable
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in selectOptions.incomeOrExp"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 消费类型  0为过桥过路费 1为停车费 -->
        <el-col
          :span="24"
          v-if="calcIncomeOrExpIsY"
        >
          <el-form-item
            label="油品类型"
            prop="gasGrade"
          >
            <el-select
              v-model="form.gasGrade"
              placeholder="请选择油品类型"
              clearable
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in selectOptions.gasGrade"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="交易金额"
            prop="transFee"
            :rules="[{ required: true, message: '交易金额不能为空', trigger: 'blur' },validateNumber8I2F]"
          >
            <el-input
              v-model="form.transFee"
              placeholder="请输入交易金额"
              clearable
              size="small"
              @change="inputNumberChange(form.transFee, 'transFee')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="交易时间"
            prop="transDate"
          >
            <el-date-picker
              v-model="form.transDate"
              type="datetime"
              placeholder="选择交易时间"
              clearable
              size="small"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="08:00:00"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="余额"
            prop="balance"
          >
            <el-input
              v-model="form.balance"
              readonly
              disabled
              size="small"
              @change="inputNumberChange(form.balance, 'balance')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="记账时间"
            prop="bookTime"
          >
            <el-date-picker
              v-model="form.bookTime"
              type="datetime"
              placeholder="选择记账时间"
              clearable
              size="small"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="08:00:00"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="calcIncomeOrExpIsY"
        >
          <el-form-item
            label="数量"
            prop="oilVolume"
            :rules="[{ required: true, message: '数量不能为空', trigger: 'blur' },validateNumber8I2F]"
          >
            <el-input
              v-model="form.oilVolume"
              placeholder="请输入数量"
              size="small"
              @change="inputNumberChange(form.oilVolume, 'oilVolume')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          v-if="calcIncomeOrExpIsY"
          :rules="[{ required: true, message: '单价不能为空', trigger: 'blur' },validateNumber8I2F]"
        >
          <el-form-item
            label="单价"
            prop="oilPrice"
          >
            <el-input
              v-model="form.oilPrice"
              placeholder="请输入单价"
              size="small"
              @change="inputNumberChange(form.oilPrice, 'oilPrice')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="摘要"
            prop="remark"
          >
            <el-input
              v-model="form.remark"
              placeholder="请输入摘要"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              maxlength="200"
              size="small"
            ></el-input>
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
        @click="handleCreate()"
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

import { numToFixed2 } from '@/utils/index'
import { searchCarSelectInfo } from '@/api/car'
import {
  getFuelCardByCarNumber
} from '@/api/fuelCardManagement/fuelCard'
import {
  createFuelCardRecord
} from '@/api/fuelCardManagement/fuelCardRecord'
import { FUEL_CARD_RECORD_DICT } from '@/views/fee/fuelCardManagement/constants/index'
import getDict from '@/views/mixins/getDict'
import _ from 'lodash'
import mixins from '@/views/mixins'

export default {
  name: '',
  mixins: [getDict,mixins],
  components: {},
  filters: {},
  props: {
    rowId: {
      default: ''
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
      title: '新建加油卡交易记录',
      //类型
      type: '',
      //数据id
      id: '',
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        // 所属车辆
        carNumber: '',
        // 卡号
        cardNumber: '',
        // 交易类型
        incomeOrExp: '',
        // 油品类型 92 95 98
        gasGrade: '',
        // 交易金额
        transFee: '',
        // 交易时间
        transDate: '',
        // 余额
        balance: '',
        // 记账时间
        bookTime: '',
        // 数量
        oilVolume: '',
        // 单价
        oilPrice: '',
        // 摘要
        remark: ''
      },
      //单位数据
      unitData: [],
      //表单校验
      rules: {
        carNumber: [
          { required: true, message: '所属车辆不能为空', trigger: 'change' }
        ],
        // 卡号
        cardNumber: [
          { required: true, message: '卡号不能为空', trigger: 'change' }
        ],
        // 交易类型
        incomeOrExp: [
          { required: true, message: '交易类型不能为空', trigger: 'change' }
        ],
        // 油品类型  汽油标号 92 95 98
        gasGrade: [
          { required: true, message: '油品类型不能为空', trigger: 'change' }
        ],
        // // 交易金额
        // transFee: [
        //   { required: true, message: '交易金额不能为空', trigger: 'blur' }
        // ],
        // 交易时间
        transDate: [
          { required: true, message: '交易时间不能为空', trigger: 'change' }
        ],
        // 余额
        balance: [
          { required: false, message: '余额不能为空', trigger: 'change' }
        ],
        // 记账时间
        bookTime: [
          { required: true, message: '记账时间不能为空', trigger: 'change' }
        ],
        // // 数量
        // oilVolume: [
        //   { required: true, message: '数量不能为空', trigger: 'blur' }
        // ],
        // // 单价
        // oilPrice: [
        //   { required: true, message: '单价不能为空', trigger: 'blur' }
        // ],
        // 摘要
        remark: ''
      },
      // 下拉搜索框的loading
      selectLoading: false,
      // 车辆下拉选择框数据
      carNumberOptions: [],
      // 卡号下拉选择框数据
      cardNumberOptions: [],
      // 选中卡号信息
      selectCardInfo: {},
      selectOptions: {
        incomeOrExp: [],
        gasGrade: []
      }
    }
  },
  computed: {
    // 交易类型为圈存时  返回false  隐藏交易相关输入框
    calcIncomeOrExpIsY() {
      return this.form.incomeOrExp === 'Y' ? false : true
    }
  },
  watch: {
    operateDialogFlag: {
      handler(val) {
        if (val) {
          this.openDataScope = true
          this.init(this.buttonCode, this.rowId)
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
  },
  methods: {
    //初始化
    init(type, id) {
      this.type = type
      this.id = id
      this.$nextTick(async() => {
        if (type === 'create') {
          this.title = '新建加油卡交易记录'
        }
        // else if (type === "update") {
        //   this.title = "修改ETC交易记录"
        //   // this.getETCDetail(this.id);
        // }
        await this.handleSystemCardDict(Object.keys(this.selectOptions))
        await this.remoteMethod('')
      })
    },
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(nameArr = []) {
      for (const item of nameArr) {
        const res = await this.getOperateDictList(FUEL_CARD_RECORD_DICT[item].id)
        this.selectOptions[item] = res
      }
      // 去掉'转存'选项
      let list = this.selectOptions.incomeOrExp
      this.selectOptions['incomeOrExp'] = list.slice(0, 2)
    },
    // 模糊搜索车牌号码
    async remoteMethod(carNumber) {
      // if (!carNumber) {
      //   this.carNumberOptions = [];
      //   return;
      // }
      const params = {
        carNumber,
        cardType: 'fuel'
      }
      this.selectLoading = true
      try {
        const { data = [] } = await searchCarSelectInfo(params)
        this.carNumberOptions = (data ?? []) || []
      } catch (e) {
        throw new Error(e.message || '获取车辆下拉选择框失败')
      } finally {
        this.selectLoading = false
      }
    },
    // 车辆发生变化时  获取卡号
    async carNumberChange(val) {
      this.form.cardNumber = null
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate('cardNumber')
      })
      this.getFuelCard(val)
    },
    // 根据车牌号码获取油卡
    async getFuelCard(cardNumber = '') {
      if (!cardNumber) {
        this.cardNumberOptions = []
        return
      }
      try {
        const { data = [] } = await getFuelCardByCarNumber(cardNumber)
        this.cardNumberOptions = data
      } catch (e) {
        throw new Error(e.message || '获取所有的加油卡失败')
      } finally {
        // loading.close();
      }
    },
    // 卡号变化时
    cardNumberChange(v) {
      if (!v) {
        this.selectCardInfo = {},
          this.form.balance = ''
        return
      }
      this.selectCardInfo = this.cardNumberOptions.find(item => item.cardNumber === v) ?? {}
      this.form.balance = this.selectCardInfo.balance ?? 0
    },
    //新建
    handleCreate() {
      this.$refs.elForm.validate(async(valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          const loading = this.$loading({
            lock: true,
            text: '加载中...'
          })
          try {
            const { message } = await createFuelCardRecord(params)
            this.$modal.msgSuccess(message)
            this.openDataScope = false
            this.$emit('operateSuccess')
          } catch (e) {
            throw new Error(e.message)
          } finally {
            loading.close()
          }
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
    },
    // 处理输入的数字
    inputNumberChange(val, label) {
      this.form[label] = numToFixed2(val)
    }
  }
}
</script>
<style scoped>
</style>
