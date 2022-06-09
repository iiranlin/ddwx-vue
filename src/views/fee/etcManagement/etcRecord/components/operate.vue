<template>
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
            label="消费类型"
            prop="expType"
          >
            <el-select
              v-model="form.expType"
              placeholder="请选择消费类型"
              clearable
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in selectOptions.expType"
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
              size="small"
            ></el-input>
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

import { numToFixed2 } from '@/utils/index'
import {
  getETCCardByCarNumber,
} from "@/api/etc"
import {
  createETCCardRecord,
  updateETCCardRecord,
} from "@/api/etcRecord"
import { searchCarSelectInfo } from "@/api/car";
import { ETC_CARD_RECORD_DICT } from "@/views/fee/etcManagement/constants/index"
import getDict from "@/views/mixins/getDict"
import _ from "lodash"

export default {
  name: '',
  mixins: [getDict],
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
      title: "新建ETC交易记录",
      //类型
      type: "",
      //数据id
      id: "",
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
        // 消费类型
        expType: '',
        // 交易金额
        transFee: '',
        // 交易时间
        transDate: '',
        // 余额
        balance: '',
        // 记账时间
        bookTime: '',
        // 摘要
        remark: '',
      },
      //表单校验
      rules: {
        carNumber: [
          { required: true, message: "所属车辆不能为空", trigger: "change" }
        ],
        // 卡号
        cardNumber: [
          { required: true, message: "卡号不能为空", trigger: "change" }
        ],
        // 交易类型
        incomeOrExp: [
          { required: true, message: "交易类型不能为空", trigger: "change" }
        ],
        // 消费类型
        expType: [
          { required: true, message: "消费类型不能为空", trigger: "change" }
        ],
        // 交易金额
        transFee: [
          { required: true, message: "交易金额不能为空", trigger: "blur" }
        ],
        // 交易时间
        transDate: [
          { required: true, message: "交易时间不能为空", trigger: "change" }
        ],
        // 余额
        balance: [
          { required: false, message: "余额不能为空", trigger: "change" }
        ],
        // 记账时间
        bookTime: [
          { required: true, message: "记账时间不能为空", trigger: "change" }
        ],
        // 摘要
        remark: '',
      },
      // 下拉搜索框的loading
      selectLoading: false,
      // 模糊搜索的车辆数据 车辆下拉框数据
      carNumberOptions: [],
      // 卡号下拉选择框数据
      cardNumberOptions: [],
      selectCardInfo: {},
      selectOptions: {
        incomeOrExp: [],
        expType: [],
      },
      currentETCInfo: {},
    }
  },
  computed: {
    // 交易类型为充值是  返回false  隐藏消费类型
    calcIncomeOrExpIsY() {
      return this.form.incomeOrExp === 'Y' ? false : true
    }
  },
  watch: {
    operateDialogFlag: {
      handler(val) {
        if (val) {
          this.openDataScope = true;
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
      this.type = type;
      this.id = id;
      this.$nextTick(async () => {
        if (type === "create") {
          this.title = "新建ETC交易记录"
        } else if (type === "update") {
          this.title = "修改ETC交易记录"
          // this.getETCDetail(this.id);
        }
        await this.remoteMethod('');
        await this.handleETCCardDict(Object.keys(this.selectOptions));
      })
    },
    // 根据id获取ETC详情
    async getETCDetail(id = '') {
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
      });
      try {
        const { data = {} } = await getETCCardDetail(id);
        this.currentETCInfo = data;
        for (const item in this.form) {
          this.form[item] = data[item]
        }
        await this.getAllETCCardByCarNumber(data.unitCode);
        await this.cardNumberChange(data.cardNumber)
      } catch (e) {
        throw new Error(e.message || "获取ETC详情失败");
      } finally {
        loading.close();
      }
    },
    //新建
    handleCreate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.form,
          }
          const loading = this.$loading({
            lock: true,
            text: "加载中...",
          });
          try {
            const { message } = await createETCCardRecord(params);
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess');
          } catch (e) {
            throw new Error(e.message);
          } finally {
            loading.close();
          }
        }
      })
    },
    //编辑
    handleUpdate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.currentETCInfo.id,
            ...this.form
          }
          const loading = this.$loading({
            lock: true,
            text: "加载中...",
          });
          try {
            const { message } = await updateETCCardRecord(params);
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess');
          } catch (e) {
            throw new Error(e.message);
          } finally {
            loading.close();
          }
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
    },
    // 获取当前页面的通用字典下拉数据
    async handleETCCardDict(nameArr = []) {
      for (const item of nameArr) {
        const res = await this.getOperateDictList(ETC_CARD_RECORD_DICT[item].id);
        this.selectOptions[item] = res
      }
    },
    // 根据车牌 取所ETC卡
    async getAllETCCardByCarNumber(cardNumber) {
      try {
        if (!cardNumber) {
          this.cardNumberOptions = [];
          return;
        }
        const { data = [] } = await getETCCardByCarNumber(cardNumber);
        this.cardNumberOptions = data;
      } catch (e) {
        throw new Error(e.message || "获取所有的ETC卡");
      } finally {
        // loading.close();
      }
    },
    // 所属车辆发生变化时 获取卡片
    async carNumberChange(val) {
      this.form.cardNumber = null;
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate('cardNumber')
      })
      this.getAllETCCardByCarNumber(val)
    },
    // 卡片发生变化时
    cardNumberChange(v) {
      if (!v) {
        this.selectCardInfo = {};
        this.form.balance = '';
        return;
      }
      this.selectCardInfo = this.cardNumberOptions.find(item => item.cardNumber === v) ?? {};
      this.form.balance = this.selectCardInfo.balance ?? 0;
    },
    // 模糊搜索车牌号码
    async remoteMethod(carNumber) {
      // if (!carNumber) {
      //   this.carNumberOptions = [];
      //   return;
      // }
      const params = {
        carNumber,
        cardType: 'etc',
      }
      this.selectLoading = true;
      try {
        const { data = [] } = await searchCarSelectInfo(params);
        this.carNumberOptions = (data ?? []) || [];
      } catch (e) {
        throw new Error(e.message || "获取车辆下拉选择框失败");
      } finally {
        this.selectLoading = false;
      }
    },
    // 处理输入的数字
    inputNumberChange(val, label) {
      this.form[label] = numToFixed2(val);
    }
  },
}
</script>
<style scoped>
</style>
