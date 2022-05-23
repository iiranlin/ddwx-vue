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
              @change="unitCodeChange"
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
            label="卡号"
            prop="cardNumber"
          >
            <!-- {
      "id": "1528649574971404288",
      "unitCode": "11",
      "cardNumber": "1001002",
      "isMcard": "1",
      "carNumber": "京CP7939",
      "vinNumber": "GZ0000000628",
      "incomeMoney": 0,
      "outcomeMoney": 0,
      "balance": 0,
      "creator": "ADMIN",
      "createTime": 1653293434000,
      "modifyTime": 1653294898000,
      "enabled": "Y",
      "mCardNumber": "1001"
    } -->
            <el-select
              v-model="form.cardNumber"
              placeholder="请选择所卡号"
              clearable
              size="small"
              style="width:100%"
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
        <el-col :span="24">
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
              :default-time="['08:00:00']"
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
              placeholder="选择交易时间"
              clearable
              size="small"
              style="width:100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['08:00:00']"
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

import { getAllAvailableUnit } from "@/api/system/unit"
import {
  getAllETCCard,
} from "@/api/etc"
import {
  createETCCardRecord,
  updateETCCardRecord,
} from "@/api/etcRecord"
import { getVehicleInfoSelect } from "@/api/car"
import { ETC_CARD_RECORD_DICT } from "@/views/officialCar/etcManagement/constants/index"
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
      title: "",
      //类型
      type: "",
      //数据id
      id: "",
      //显示隐藏
      openDataScope: false,
      //表单数据
      form: {
        // 所属单位
        unitCode: '',
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
      //单位数据
      unitData: [],
      //表单校验
      rules: {
        unitCode: [
          { required: true, message: "所属单位不能为空", trigger: "change" }
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
          { required: true, message: "消费类型不能为空", trigger: "blur" }
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
      // 卡号下拉选择框数据
      cardNumberOptions: [],
      selectCarInfo: {},
      selectOptions: {
        incomeOrExp: [],
        expType: [],
      },
      currentETCInfo: {},
    }
  },
  computed: {

  },
  watch: {
    operateDialogFlag: {
      handler(val) {
        this.$nextTick(() => {
          console.log('elForm111', this.$refs.elForm);
        })
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
      console.log("🚀 ~ file: operate.vue ~ line 297 ~ init ~ id", id)
      this.type = type;
      this.id = id;
      this.$nextTick(async () => {
        await this.getUnitDictList();
        await this.handleETCCardDict(Object.keys(this.selectOptions));
        if (type === "create") {
          this.title = "新建ETC"
        } else if (type === "update") {
          this.title = "修改ETC"
          // this.getETCDetail(this.id);
        }
      })
    },
    //获取单位列表
    async getUnitDictList() {
      // this.loading = true;
      await getAllAvailableUnit().then(({ data }) => {
        // this.loading = false;
        this.unitData = data;
      }).catch((err) => {
        // this.loading = false;
      }).finally(() => {
        // this.loading = false;
      })
    },
    // 根据id获取ETC详情
    // async getETCDetail(id = '') {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: "加载中...",
    //   });
    //   try {
    //     const { data = {} } = await getETCCardDetail(id);
    //     this.currentETCInfo = data;
    //     await this.getCarSelectOptions(data.unitCode);
    //     // 当为副卡时  获取主卡号
    //     if (data.isMcard === '1') {
    //       await this.getAllMotherETCCard()
    //     }
    //     for (const item in this.form) {
    //       this.form[item] = data[item]
    //     }
    //   } catch (e) {
    //     throw new Error(e.message || "获取ETC详情失败");
    //   } finally {
    //     loading.close();
    //   }
    // },
    //新建
    handleCreate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            ...this.form,
            vinNumber: this.selectCarInfo.vinNumber,
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
            ...this.currentETCInfo,
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
    // 设置当前页面的通用字典下拉数据
    async handleETCCardDict(nameArr = []) {
      for (const item of nameArr) {
        const res = await this.getOperateDictList(ETC_CARD_RECORD_DICT[item].id);
        this.selectOptions[item] = res
      }
    },
    // 获取所有的ETC卡
    async getAllETCCardData() {
      try {
        const { data = [] } = await getAllETCCard();
        console.log('获取所有的ETC卡', data);
        this.cardNumberOptions = data;
      } catch (e) {
        throw new Error(e.message || "获取所有的ETC卡");
      } finally {
        // loading.close();
      }
    },
    // 单位发生变化时 获取卡片
    async unitCodeChange(val) {
      this.form.cardNumber = null;
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate('cardNumber')
      })
      this.getAllETCCardData(val)
    },
  },
}
</script>
<style scoped>
</style>>
