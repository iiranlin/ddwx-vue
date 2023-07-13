<template>
  <el-dialog
    :title="title" :close-on-click-modal="false"
    :visible.sync="openDataScope"
    width="600px"
    center
    @close="handleDialogClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      label-suffix="："
      ref="elForm"
      label-width="100px"
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
              filterable
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
            label="卡类型"
            prop="isMcard"
          >
            <el-select
              v-model="form.isMcard"
              placeholder="请选择卡类型"
              clearable
              size="small"
              style="width:100%"
              @change="cardTypeChange"
            >
              <el-option
                v-for="item in selectOptions.isMcard"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- ETC类型 为主卡时  不展示主卡号， 为副卡时才展示  即 form.isMcard 为 1 时 展示该项-->
        <el-col
          :span="24"
          v-if="form.isMcard === '1'"
        >
          <el-form-item
            label="主卡号"
            prop="mCardNumber"
          >
            <!-- ETC类型 为副卡时 必须选择主卡号 即 form.isMcard 为 0 时 展示该项  -->
            <el-select
              v-if="form.isMcard === '1'"
              v-model="form.mCardNumber"
              placeholder="请选择主卡号"
              clearable
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in mCardNumberOptions"
                :key="item.id"
                :label="item.cardNumber"
                :value="item.cardNumber"
              >
              </el-option>
            </el-select>
            <!-- <el-input
              v-else
              v-model="form.mCardNumber"
              placeholder="请输入卡号"
              clearable
              size="small"
            ></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="卡号"
            prop="cardNumber"
          >
            <el-input
              v-model="form.cardNumber"
              maxlength="20"
              clearable
              size="small"
            ></el-input>
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
              filterable
              style="width:100%"
            >
              <el-option
                v-for="item in carNumberOptions"
                :key="item.carId"
                :label="item.carNumber"
                :value="item.carNumber"
                @click.native="handleCarNumberChange(item)">
              </el-option>
            </el-select>
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
              <el-option
                v-for="item in selectOptions.enabled"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
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
  createFuelCard,
  getAllFuelMainCard,
  getFuelCardDetail,
  updateFuelCard,
} from "@/api/fuelCardManagement/fuelCard"
import { getVehicleInfoSelect } from "@/api/car"
import getDict from "@/views/mixins/getDict"
import { ETC_CARD_DICT } from "@/views/fee/etcManagement/constants/index"
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
        // 单位
        unitCode: '',
        // 是否主卡
        isMcard: '',
        // 车牌号 所属车辆
        carNumber: '',
        // 主卡号 母卡号
        mCardNumber: '',
        // 卡号
        cardNumber: '',
        // 是否有效
        enabled: 'Y',
        //发动机号
        vinNumber:'',
      },
      //单位数据
      unitData: [],
      //表单校验
      rules: {
        unitCode: [
          { required: true, message: "所属单位不能为空", trigger: "change" }
        ],
        isMcard: [
          { required: true, message: "加油卡类型不能为空", trigger: "change" }
        ],
        mCardNumber: [
          { required: true, message: "主卡号不能为空", trigger: "change" }
        ],
        cardNumber: [
          { required: true, message: "卡号不能为空", trigger: "blur" },
          { trigger: 'blur', pattern: /^[0-9]*$/, message: '只能输入数字' }
        ],
        enabled: [
          { required: true, message: "是否有效不能为空", trigger: "change" }
        ],
      },
      // 主卡下拉选择框数据
      mCardNumberOptions: [],
      // 车辆下拉选择框数据
      carNumberOptions: [],
      selectOptions: {
        isMcard: [],
        enabled: [],
      },
      currentFuelInfo: {},
    }
  },
  computed: {

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
    //添加所属车辆验证
    addRules() {
      const newRules = [{ required: true, trigger: "change", message: "所属车辆不能为空" }];
      this.rules = { ...this.rules, carNumber: newRules };
    },
    //删除所属车辆验证
    removeRules() {
      // 清除指定校验规则
      this.$refs.elForm.clearValidate("carNumber");
      // 这行必须 
      this.rules = { ...this.rules, carNumber: [] };
    },
    //初始化
    init(type, id) {
      this.type = type;
      this.id = id;
      this.$nextTick(async () => {
        const loading = this.$loading({
          lock: true,
          text: "加载中...",
        });
        try {
          if (type === "create") {
            this.title = "新建油卡"
          } else if (type === "update") {
            this.title = "修改油卡"
            this.getCardDetail(this.id);
          }
          await this.getUnitDictList();
          await this.handleSystemDict(Object.keys(this.selectOptions));
        } catch (e) {

        } finally {
          loading.close();
        }
      })
    },
    //获取单位列表
    async getUnitDictList() {
      await getAllAvailableUnit().then(({ data }) => {
        this.unitData = data;
      }).catch((err) => {
      }).finally(() => {
      })
    },
    // 根据id获取加油卡详情
    async getCardDetail(id = '') {
      try {
        const { data = {} } = await getFuelCardDetail(id);
        this.currentFuelInfo = data;
        for (const item in this.form) {
          this.form[item] = data[item]
        }
        await this.getCarSelectOptions(data.unitCode);
        // 当为副卡时  获取主卡号
        if (data.isMcard === '1') {
          await this.getAllMotherCard()
        }
      } catch (e) {
        throw new Error(e.message || "获取加油卡详情失败");
      }
    },
    // 获取当前页面的通用字典下拉数据
    async handleSystemDict(nameArr = []) {
      for (const item of nameArr) {
        const res = await this.getOperateDictList(ETC_CARD_DICT[item].id);
        this.selectOptions[item] = res
      }
    },
    // 加油卡类型发生变化是 0——主卡 1——副卡
    async cardTypeChange(val) {
      if (val !== '1') {
        this.form.mCardNumber = null;
        this.removeRules();
        return;
      }
      this.addRules();
      this.getAllMotherCard()
    },
    // 获取所有的主卡
    async getAllMotherCard() {
      // const loading = this.$loading({
      //   lock: false,
      //   text: "加载中...",
      // });
      try {
        const { data = [] } = await getAllFuelMainCard();
        this.mCardNumberOptions = data;
      } catch (e) {
        throw new Error(e.message || "获取所有的主卡失败");
      } finally {
        // loading.close();
      }
    },
    //新建
    handleCreate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "加载中...",
          });
          const params = {
            ...this.form,
          }
          await createFuelCard(Object.assign(params)).then(({ message }) => {
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess')
          }).catch((err) => {
          }).finally(() => {
            loading.close();
          })
        }
      })
    },
    //编辑
    handleUpdate() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.currentFuelInfo.id,
            ...this.form
          }
          // const loading = this.$loading({
          //   lock: false,
          //   text: "加载中...",
          // });
          try {
            const { message } = await updateFuelCard(params);
            this.$modal.msgSuccess(message);
            this.openDataScope = false;
            this.$emit('operateSuccess');
          } catch (e) {
            throw new Error(e.message);
          } finally {
            // loading.close();
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
    // 单位发生变化时
    async unitCodeChange(val) {
      this.form.carNumber = null;
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate('carNumber')
      })
      this.getCarSelectOptions(val)
    },
    // 获取车辆下拉选择框
    async getCarSelectOptions(unitCode = '') {
      if (!unitCode) {
        this.carNumberOptions = [];
        return;
      }
      // const loading = this.$loading({
      //   lock: false,
      //   text: "加载中...",
      // });
      const params = {
        unitCode,
      }
      try {
        const { data = [] } = await getVehicleInfoSelect(params);
        // TODO 调试阶段用了去重函数
        this.carNumberOptions = _.uniqBy(data, 'carId');
      } catch (e) {
        throw new Error(e.message || "获取车辆下拉选择框失败");
      } finally {
        // loading.close();
      }
    },
    //所属车辆变更
    handleCarNumberChange(item){
      this.form.vinNumber = item.vinNumber;
    },
  },
}
</script>
<style scoped>
</style>>
