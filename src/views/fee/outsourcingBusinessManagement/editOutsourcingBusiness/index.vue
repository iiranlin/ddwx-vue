<template>
  <div
    class="container-calendar"
    :style="{'--theme':theme}"
  >
    <el-form
      ref="elForm"
      style="margin-left: 20px;"
      label-suffix=":"
      :model="formData"
      :rules="rules"
      label-width="85px"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <i :class="calcIconClass('1')" />
            <span class="title-right">合同信息</span>
          </template>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="使用单位"
                prop="unitCode"
              >
                <el-select
                  v-model="formData.unitCode"
                  placeholder="请选择使用单位"
                  clearable
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
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="合同编号"
                prop="contractCode"
              >
                <el-input
                  v-model="formData.contractCode"
                  maxlength="200"
                  placeholder="请输入合同编号"
                />
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="合同金额"
                prop="contractAmount"
              >
                <el-input
                  v-model="formData.contractAmount"
                  maxlength="200"
                  placeholder="请输入合同金额"
                  @change="inputNumberChange(formData.contractAmount, 'contractAmount')"
                >
                  <span slot="append">元</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="合同周期"
                prop="contractDate"
              >
                <el-date-picker
                  v-model="formData.contractDate"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                  type="daterange"
                  range-separator="至"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="车辆用途"
                prop="useType"
              >
                <el-select
                  v-model="formData.useType"
                  placeholder="请选择车辆用途"
                  clearable
                >
                  <el-option
                    v-for="item in selectOptions.useType"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <i :class="calcIconClass('2')" />
            <span class="title-right">线路明细</span>
            <span
              class="title-right-button"
              @click.stop.prevent="addCarButton"
            >
              <el-button type="text"> <i class="el-icon-plus"></i> 添加路线</el-button>
            </span>
          </template>
          <div
            v-for="(item, index) in formData.details"
            :key="`uniqueId${item.uniqueId}`"
          >
            <div class="divider-line" />
            <el-row :gutter="24">
              <el-col>
                <span class="title-right">线路{{index+1}}</span>
                <el-button
                  class="delete-color"
                  type="text"
                  :disabled="addLineDetailInfoList.length === 1"
                  @click="deleteCar(index)"
                >
                  <i class="el-icon-delete" />
                  删 除
                </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="车辆类型"
                  :prop="`details.${index}.carTypeCode`"
                >
                  <el-select
                    v-model="item.carTypeCode"
                    placeholder="请选择车辆类型"
                    clearable
                  >
                    <el-option
                      v-for="item in selectOptions.carTypeCode"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="往返里程"
                  :prop="`details.${index}.lineKm`"
                >
                  <el-input
                    v-model="item.lineKm"
                    maxlength="200"
                    placeholder="请输入往返里程"
                    @change="inputNumberChange(item.lineKm, 'lineKm', index)"
                  >
                    <span slot="append">公里</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="线路起点"
                  :prop="`details.${index}.lineStart`"
                >
                  <el-input
                    v-model="item.lineStart"
                    maxlength="200"
                    placeholder="请输入线路起点"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="线路终点"
                  :prop="`details.${index}.lineEnd`"
                >
                  <el-input
                    v-model="item.lineEnd"
                    maxlength="200"
                    placeholder="请输入线路终点"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="每天趟数"
                  :prop="`details.${index}.lineTripnum`"
                >
                  <el-input
                    v-model="item.lineTripnum"
                    maxlength="200"
                    placeholder="请输入每天趟数"
                  >
                    <span slot="append">趟</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="车辆数"
                  :prop="`details.${index}.carNum`"
                >
                  <el-input-number
                    v-model="item.carNum"
                    placeholder="请输入车辆数"
                    controls-position="right"
                    :min="1"
                  >
                    <span slot="append">辆</span>
                  </el-input-number>
                  <!-- <el-input
                    type="number"
                    v-model="item.carNum"
                    maxlength="200"
                    placeholder="请输入车辆数"
                  /> -->
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="通勤人数"
                  :prop="`details.${index}.commute`"
                >
                  <el-input-number
                    v-model="item.commute"
                    placeholder="请输入通勤人数"
                    controls-position="right"
                    :min="1"
                  >
                    <span slot="append">人</span>
                  </el-input-number>
                  <!-- <el-input
                    v-model="item.commute"
                    maxlength="200"
                    placeholder="请输入通勤人数"
                  /> -->
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="准载人数"
                  :prop="`details.${index}.quasiCarrier`"
                >
                  <el-input
                    v-model="item.quasiCarrier"
                    maxlength="200"
                    placeholder="请输入准载人数"
                  >
                    <span slot="append">人</span>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
              >
                <el-form-item
                  label="备注"
                  :prop="`details.${index}.remark`"
                >
                  <el-input
                    v-model="item.remark"
                    maxlength="200"
                    placeholder="请输入备注"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div class="footer-area-btn">
      <el-button
        type="primary"
        :loading="loading"
        @click="addCarContract"
      >
        确 定
      </el-button>
      <el-button @click="cancelBtn">
        取 消
      </el-button>
    </div>
  </div>
</template>

<script>
import { numToFixed2 } from '@/utils/index'
import { getAllAvailableUnit } from "@/api/system/unit"
import { createCarContract } from "@/api/fee";
import getDict from "@/views/mixins/getDict"
import { OUTSOURCING_BUSINESS_DICT } from '../constants/index'

export default {
  name: "editOutsourcingBusiness",
  mixins: [getDict],
  components: {},
  data() {
    const isValidate = true
    return {
      loading: false,
      activeNames: ['1', '2'],
      // 使用单位下拉选择框
      unitData: [],
      formData: {
        // 使用单位
        unitCode: '',
        // 合同编号
        contractCode: '',
        // 合同金额
        contractAmount: '',
        // 合同周期
        contractDate: [],
        // 车辆用途
        useType: '',
        // 线路明细
        details: []
      },
      rules: {
        unitCode: [
          { required: isValidate, message: "请选择使用单位", trigger: "change" }
        ],
        contractCode: [
          { required: isValidate, message: "请输入合同编号", trigger: "blur" }
        ],
        contractAmount: [
          { required: isValidate, message: "请输入合同金额", trigger: "blur" }
        ],
        contractDate: [
          { required: isValidate, message: "请选择合同周期", trigger: "change" }
        ],
        useType: [
          { required: isValidate, message: "请选择车辆用途", trigger: "change" }
        ],
        // hopeBrand: [
        //   { required: isValidate, message: "请选择期望车型", trigger: "change" }
        // ],
        // 线路明细数组
        details: []
      },
      // 唯一key
      uniqueId: 1,
      // 每一个车辆信息 表单
      addLineDetailInfoFormeExample: {
        // 车辆类型
        carTypeCode: '',
        // 往返里程
        lineKm: '',
        // 线路起点
        lineStart: '',
        // 线路终点
        lineEnd: '',
        // 每天趟数
        lineTripnum: '',
        // 车辆数
        carNum: '',
        // 通勤人数
        commute: '',
        // 准载人数
        quasiCarrier: '',
        // 备注
        remark: '',
      },
      // 每一个车辆信息 表单 校验规则
      addLineDetailInfoFormRuleExample: {
        // 车辆类型
        carTypeCode: [
          { required: isValidate, message: "请选车辆类型", trigger: "change" }
        ],
        // 往返里程
        lineKm: [
          { required: isValidate, message: "请输入往返里程", trigger: "blur" }
        ],
        // 线路起点
        lineStart: [
          { required: isValidate, message: "请输入线路起点", trigger: "blur" }
        ],
        // 线路终点
        lineEnd: [
          { required: isValidate, message: "请输入线路终点", trigger: "blur" }
        ],
        // 每天趟数
        lineTripnum: [
          { required: isValidate, message: "请输入每天趟数", trigger: "blur" }
        ],
        // 车辆数
        carNum: [
          { required: isValidate, message: "请输入车辆数", trigger: "blur" }
        ],
        // 通勤人数
        commute: [
          { required: isValidate, message: "请输入通勤人数", trigger: "blur" }
        ],
        // 准载人数
        // quasiCarrier: [
        //   { required: isValidate, message: "请输入准载人数", trigger: "blur" }
        // ],
      },
      // 用车信息的uniqueId的集合
      addLineDetailInfoList: [],
      // 新建列表中的下拉选择框数据
      selectOptions: {
        // 车辆用途 合同用途
        useType: [],
        // 车辆类型
        carTypeCode: [],
      }
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  activated() {
    // this.handleSystemDict(Object.keys(this.selectOptions));
    // this.addCarButton();
    // this.getUnitDictList();
  },
  created() {
    this.handleSystemDict(Object.keys(this.selectOptions));
    this.getUnitDictList();
  },
  mounted() {
    this.addCarButton();
  },
  beforeRouteLeave(_to, from, next) {
    this.$refs.elForm.resetFields();
    this.$tab.closePage(from);
    next();
  },
  methods: {
    // 获取当前页面的通用字典下拉数据
    async handleSystemDict(nameArr = []) {
      for (const item of nameArr) {
        const res = await this.getOperateDictList(OUTSOURCING_BUSINESS_DICT[item].id);
        this.selectOptions[item] = res
      }
    },
    // 确定 确 定按钮 新增业务外包费用台账管理
    addCarContract() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "加载中...",
          });
          try {
            const params = { ...this.formData };
            params.contractBegindate = params.contractDate[0];
            params.contractEnddate = params.contractDate[1];
            params.carTypeName = (this.selectOptions.carTypeCode.find(item => params.carTypeCode === item.carTypeCode))?.name || '';
            delete params.contractDate
            const res = await createCarContract(params);
            if (res?.code !== 0) {
              this.$message.error(res?.message || '操作失败，请稍后重试');
              return;
            }
            this.$message.success(res?.message || '操作成功');
            this.$router.push({ name: 'outsourcingBusiness', query: { time: new Date().toString } });
          } catch (e) {

          } finally {
            loading.close()
          }
        }
      })
    },
    // 取消 取 消按钮
    cancelBtn() {
      this.$router.push({ name: 'outsourcingBusiness', query: { time: new Date().toString } });
    },
    // 根据面板是否折叠  来计算左侧三角形的方向
    calcIconClass(name) {
      return this.activeNames.includes(name) ? `el-icon-caret-bottom` : `el-icon-caret-right`;
    },
    // 添加车辆按钮
    addCarButton() {
      this.formData.details.push({
        ...this.addLineDetailInfoFormeExample,
        uniqueId: this.uniqueId,
      });
      this.rules.details.push(this.addLineDetailInfoFormRuleExample)
      this.addLineDetailInfoList.push(this.uniqueId);
      this.uniqueId++
    },
    // 删除车辆
    deleteCar(index) {
      this.formData.details.splice(index, 1);
      this.rules.details.splice(index, 1);
      this.addLineDetailInfoList.splice(index, 1)
    },
    // 获取使用单位列表 当前用户有权限的单位
    async getUnitDictList() {
      await getAllAvailableUnit().then(({ data }) => {
        this.unitData = data;
      }).catch((err) => {
      }).finally(() => {
      })
    },
    // 处理输入的数字
    inputNumberChange(val, label, index) {
      if (index >= 0) {
        // 是路线明细里面的数据变动 则更改index对应的表单值
        this.formData.details[index][label] = numToFixed2(val);
        return;
      }
      this.formData[label] = numToFixed2(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.container-calendar {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .is-selected {
    color: #{"var(--theme)"};
  }
  .el-icon-caret-right {
    font-size: 20px;
    color: #{"var(--theme)"};
  }
  .el-icon-caret-bottom {
    font-size: 20px;
    color: #{"var(--theme)"};
  }
  ::v-deep .el-select,
  .el-input,
  .el-date-editor,
  .el-input-number {
    width: 95%;
  }
  // 分割线
  .divider-line {
    width: 98%;
    height: 0;
    border-bottom: 1px dashed #ccc;
    margin-bottom: 20px;
  }
  .delete-color {
    color: #ff4949;
  }
}
</style>
