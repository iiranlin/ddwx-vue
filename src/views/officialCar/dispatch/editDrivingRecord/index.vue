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
            <span class="title-right">单位信息</span>
          </template>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车单位"
                prop="unitCode"
              >
                <el-select
                  ref="unitCodeRef"
                  v-model="formData.unitCode"
                  placeholder="请选择用车单位"
                  clearable
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
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车部门"
                prop="deptId"
              >
                <el-select
                  ref="deptIdRef"
                  v-model="formData.deptId"
                  placeholder="请选择用车部门"
                  clearable
                  @change="deptIdChange"
                >
                  <el-option
                    v-for="item in deptData"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <i :class="calcIconClass('2')" />
            <span class="title-right">用车信息</span>
          </template>
          <el-row :gutter="24">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
            >
              <el-form-item
                label="用车事由"
                prop="reasonCode"
              >
                <el-select
                  v-model="formData.reasonCode"
                  placeholder="请选择用车事由"
                  clearable
                >
                  <el-option
                    v-for="item in dictionariesObj['1016']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
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
                label="用车需求"
                prop="demandCode"
              >
                <el-select
                  v-model="formData.demandCode"
                  placeholder="请选择用车需求"
                  clearable
                >
                  <el-option
                    v-for="item in dictionariesObj['10018']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
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
                label="是否长途"
                prop="longDistanceTag"
              >
                <el-radio-group v-model="formData.longDistanceTag">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
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
                label="乘坐人数"
                prop="usagePersons"
              >
                <el-input
                  v-model="formData.usagePersons"
                  maxlength="200"
                  placeholder="请输入乘坐人数"
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
                label="乘车人"
                prop="userName"
              >
                <el-input
                  v-model="formData.userName"
                  maxlength="200"
                  placeholder="请输入乘车人"
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
                label="联系电话"
                prop="phone"
              >
                <el-input
                  v-model="formData.phone"
                  maxlength="200"
                  placeholder="请输入联系电话"
                />
              </el-form-item>
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
                label="用车日期"
                prop="usageDate"
              >
                <el-date-picker
                  ref="usageDateRef"
                  v-model="formData.usageDate"
                  type="date"
                  placeholder="选择用车日期"
                  clearable
                  size="small"
                  value-format="yyyy-MM-dd"
                  @change="usageDateChange"
                >
                </el-date-picker>
                <!-- <el-input
                  v-model="formData.usageDate"
                  maxlength="200"
                  placeholder="请选择用车日期"
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
                label="出发时间"
                prop="usageTime"
              >
                <el-date-picker
                  v-model="formData.usageTime"
                  type="datetime"
                  placeholder="选择出发时间"
                  clearable
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="08:00:00"
                >
                </el-date-picker>
                <!-- <el-input
                  v-model="formData.usageTime"
                  maxlength="200"
                  placeholder="请输入出发时间"
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
                label="预计时长"
                prop="timeLength"
              >
                <el-input
                  v-model="formData.timeLength"
                  maxlength="200"
                  placeholder="请输入预计时长"
                >
                  <span slot="append">小时</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="出发地点"
                prop="fromAddr"
              >
                <form-address
                  ref="formAddress1"
                  :name="'出发地'"
                  @addressSuccess="addressSuccessOut"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="前往地点"
                prop="toAddr"
              >
                <form-address
                  ref="formAddress2"
                  :name="'目的地'"
                  @addressSuccess="addressSuccessTo"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="期望车型"
                prop="hopeBrand"
              >
                <el-select
                  v-model="formData.hopeBrand"
                  placeholder="请选择期望车型"
                  clearable
                >
                  <el-option
                    v-for="item in dictionariesObj['1018']"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="remark"
              >
                <el-input
                  type="textarea"
                  v-model="formData.remark"
                  maxlength="200"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <i :class="calcIconClass('3')" />
            <span class="title-right">派车信息</span>
            <span
              class="title-right-button"
              @click.stop.prevent="addCarButton"
            >
              <el-button type="text"> <i class="el-icon-plus"></i> 新增车辆</el-button>
            </span>
          </template>
          <div
            v-for="(item, index) in formData.newCarInfo"
            :key="`uniqueId${item.uniqueId}`"
          >
            <div class="divider-line" />
            <el-row :gutter="24">
              <el-col>
                <span class="title-right">车辆{{index+1}}</span>
                <el-button
                  class="delete-color"
                  type="text"
                  :disabled="addCarInfoList.length === 1"
                  @click="deleteCar(index)"
                >
                  <i class="el-icon-delete" />
                  删除
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
                  label="指派司机"
                  :prop="`newCarInfo.${index}.driverId`"
                >
                  <el-select
                    v-model="item.driverId"
                    placeholder="请选择指派司机"
                    clearable
                    @change="driverChange(item.driverId, item, index)"
                  >
                    <el-option
                      v-for="item in driverData"
                      :key="item.driverCode"
                      :label="item.driver"
                      :value="item.driverCode"
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
                  label="指派车辆"
                  :prop="`newCarInfo.${index}.carNumber`"
                >
                  <el-select
                    v-model="item.carNumber"
                    placeholder="请选择指派车辆"
                    clearable
                    value-key="carNumber"
                    @change="carNumberChange(item.carNumber, item, index)"
                  >
                    <el-option
                      v-for="item in carNumberOptions"
                      :key="item.carId"
                      :label="item.carNumber"
                      :value="item"
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
                  label="出场里程"
                  :prop="`newCarInfo.${index}.beginMiles`"
                >
                  <el-input
                    v-model="item.beginMiles"
                    readonly
                    maxlength="200"
                    placeholder="请输入出场里程"
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
                  label="还车里程"
                  :prop="`newCarInfo.${index}.endMiles`"
                >
                  <el-input
                    v-model="item.endMiles"
                    maxlength="200"
                    placeholder="请输入还车里程"
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
                  label="保养时间"
                  :prop="`newCarInfo.${index}.maintainDate`"
                >
                  <el-input
                    v-model="item.maintainDate"
                    readonly
                    maxlength="200"
                    placeholder="请输入保养时间"
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
                  label="保养里程"
                  :prop="`newCarInfo.${index}.maintainMiles`"
                >
                  <el-input
                    v-model="item.maintainMiles"
                    maxlength="200"
                    placeholder="请输入保养里程"
                  />
                  </el-select>
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
        @click="addRequest"
      >确 定</el-button>
      <el-button @click="closePush">关 闭</el-button>
    </div>
  </div>
</template>

<script>
import { getAllAvailableUnit } from "@/api/system/unit"
import { getAllAvailableDept } from "@/api/dept"
import { gcjcDriverClassList } from "@/api/driver"
import { getAllAvailableCar } from "@/api/car"
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
import { addVehicleRequest } from "@/api/gcywVehicleRequest";
import formAddress from "@/views/car/apply/components/formAddress";
import getDict from "@/views/mixins/getDict"
export default {
  name: "editDrivingRecord",
  mixins: [getDict],
  components: { formAddress },
  data() {
    var checkfromAddr = (rule, value, callback) => {
      if (value.indexOf('null') == -1 && value) {
        return callback();
      } else {
        return callback(new Error('请选择出发地点'));
      }
    }
    var checktoAddr = (rule, value, callback) => {
      if (value.indexOf('null') == -1 && value) {
        return callback();
      } else {
        return callback(new Error('请选择前往地点'));
      }
    }
    const isValidate = true
    return {
      loading: false,
      dateList: [],
      calendarVal: null,
      activeNames: ['1', '2', '3'],
      dictionariesCode: [1016, 10018, 1018],
      dictionariesObj: {},
      // 用车单位下拉选择框
      unitData: [],
      // 用车部门下拉选择框
      deptData: [],
      // 指派司机下拉选择框
      driverData: [],
      // 可用车辆
      carNumberOptions: [],
      formData: {
        // 用车单位
        unitCode: '11',
        // 用车部门
        deptId: '',
        reasonCode: '',
        demandCode: '',
        longDistanceTag: 0,
        usagePersons: '',
        userName: '',
        phone: '',
        usageDate: '2022-05-27',
        usageTime: '',
        timeLength: '',
        fromAddr: '',
        fromAreaId: '',
        toAddr: '',
        toAreaIdd: '',
        hopeBrand: '',
        remark: '',
        source: 1,
        newCarInfo: []
      },
      rules: {
        unitCode: [
          { required: isValidate, message: "请选择用车单位", trigger: "change" }
        ],
        deptId: [
          { required: isValidate, message: "请选择用车部门", trigger: "change" }
        ],
        reasonCode: [
          { required: isValidate, message: "请选择用车事由", trigger: "change" }
        ],
        demandCode: [
          { required: isValidate, message: "请选择用车需求", trigger: "change" }
        ],
        longDistanceTag: [
          { required: isValidate, message: "是否长途", trigger: "change" }
        ],
        usagePersons: [
          { required: isValidate, message: "请输入乘坐人数", trigger: "blur" }
        ],
        userName: [
          { required: isValidate, message: "请输入乘车人", trigger: "blur" }
        ],
        phone: [
          { required: isValidate, message: "请输入联系电话", trigger: "blur" }
        ],
        usageDate: [
          { required: isValidate, message: "请选择用车日期", trigger: "blur" }
        ],
        usageTime: [
          { required: isValidate, message: "请输入出发时间", trigger: "blur" }
        ],
        timeLength: [
          { required: isValidate, message: "请输入预计时长", trigger: "blur" }
        ],
        fromAddr: [
          { required: isValidate, validator: checkfromAddr, trigger: "change" }
        ],
        toAddr: [
          { required: isValidate, validator: checktoAddr, trigger: "change" }
        ],
        hopeBrand: [
          { required: isValidate, message: "请选择期望车型", trigger: "change" }
        ],
        newCarInfo: []
      },
      // 唯一key
      uniqueId: 1,
      addCarInfoExample: [
        {
          label: 'driverId',
          rule: [
            { required: isValidate, message: "请选择指派司机", trigger: "change" }
          ]
        },
        {
          label: 'carNumber',
          rule: [
            { required: isValidate, message: "请选择指派车辆", trigger: "change" }
          ]
        },
        {
          label: 'driverPhone',
          rule: []
        },
        // {
        //   label: 'beginMiles',
        //   rule: [
        //     { required: false, message: "请输入出场里程", trigger: "blur" }
        //   ]
        // },
        {
          label: 'endMiles',
          rule: [
            { required: isValidate, message: "请输入还车里程", trigger: "blur" }
          ]
        },
        // {
        //   label: 'maintainDate',
        //   rule: [
        //     { required: isValidate, message: "请选择保养时间", trigger: "blur" }
        //   ]
        // },
        // {
        //   label: 'maintainMiles',
        //   rule: [
        //     { required: isValidate, message: "请选择保养里程", trigger: "blur" }
        //   ]
        // },
      ],
      addCarInfoFormExample: {
        uniqueId: '',
        // 司机
        driver: '',
        // 司机电话
        driverPhone: '',
        // driverId 选中的司机的司机的driverCode
        driverId: '',
        // 车牌号
        carNumber: '',
        // 出场里程
        beginMiles: '',
        // 还车里程
        endMiles: '',
        // 保养时间
        maintainDate: '',
        // 保养里程
        maintainMiles: '',
      },
      addCarInfoFormRuleExample: {
        driverId: [
          { required: isValidate, message: "请选择指派司机", trigger: "change" }
        ],
        carNumber: [
          { required: isValidate, message: "请选择指派车辆", trigger: "change" }
        ],
        // beginMiles: [
        //   { required: false, message: "请输入出场里程", trigger: "blur" }
        // ],
        endMiles: [
          { required: false, message: "请输入还车里程", trigger: "blur" }
        ],
        // maintainDate: [
        //   { required: false, message: "请输入保养时间", trigger: "blur" }
        // ],
        // maintainMiles: [
        //   { required: isValidate, message: "请输入保养里程", trigger: "blur" }
        // ],
      },
      addCarInfoList: [],
      // 每个车辆信息例子
      everyCarFormExample: [
        {
          originLabel: 'carNumber',
        },
        {
          originLabel: 'beginMiles',
        },
        {
          originLabel: 'maintainDate',
        },
        {
          originLabel: 'maintainMiles',
        },
      ],
      // 每个司机信息
      everyDriverFormExample: [
        {
          originLabel: 'driver',
        },
        {
          originLabel: 'driverPhone',
        },
      ],
      // 选中的车辆数据
      selectedCarData: {},
      // 选中的车辆数据司机数据
      selectedDriverData: {},
      // 用车信息
      useCarData: []
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    this.vehicleInfoGetAssignCount();
    for (const item of this.dictionariesCode) {
      this.getOperateDict(item);
    }
    this.$nextTick(() => {
      if (this.$route.query.row) {
        let row = JSON.parse(this.$route.query.row);
        this.formData = {
          reasonCode: row.reasonCode,
          demandCode: row.demandCode,
          longDistanceTag: 0,
          usagePersons: row.usagePersons,
          userName: row.userName,
          phone: row.phone,
          usageDate: row.usageDate,
          usageTime: row.usageTime,
          timeLength: row.timeLength,
          fromAddr: row.fromAddr,
          fromAreaId: row.fromAreaId,
          toAddr: row.toAddr,
          toAreaIdd: row.toAreaIdd,
          hopeBrand: row.hopeBrand,
          remark: row.remark,
          source: 1,
        }
        this.$refs.formAddress1.init(row.fromAddr);
        this.$refs.formAddress2.init(row.toAddr);
      }
    })
  },
  async mounted() {
    await this.getUnitDictList();
  },
  methods: {
    async getOperateDict(code) {
      const res = await this.getOperateDictList(code);
      this.dictionariesObj[code] = res;
    },
    calendarClick(val) {
      this.formData.usageDate = val.day;
    },
    vehicleInfoGetAssignCount() {
      vehicleInfoGetAssignCount().then(({ data }) => {
        this.dateList = data;
      })
    },
    addressSuccessOut(row) {
      let { id, name } = row;
      this.formData.fromAreaId = id;
      this.formData.fromAddr = name;
    },
    addressSuccessTo(row) {
      let { id, name } = row;
      this.formData.toAreaIdd = id;
      this.formData.toAddr = name;
    },
    // 确定 确 定按钮 新增专用车补录
    addRequest() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          // addVehicleRequest(this.formData).then(({ message }) => {
          //   this.$modal.msgSuccess(message);
          //   this.$router.push({ name: 'myCar' });
          // })
        }
      })
    },
    // 处理选中的车辆数据
    dealSelectedCarData(selectCar) {
      console.log("🚀 ~ file: index.vue ~ line 780 ~ dealSelectedCarData ~ 处理选中的车辆数据", selectCar);
      if (selectCar) {

      }
    },
    // 处理选中的司机数据
    dealSelectedDriverData(selectDriver) {
      console.log("🚀 ~ file: index.vue ~ line 784 ~ dealSelectedCarData ~ 处理选中的司机数据", selectDriver);
    },
    // 处理请求的参数
    dealRequestParams() {
      console.log('处理请求的参数');
    },
    closePush() {
      this.$router.push({ name: 'myCar' });
    },
    calcIconClass(name) {
      return this.activeNames.includes(name) ? `el-icon-caret-bottom` : `el-icon-caret-right`;
    },
    // 添加车辆按钮
    addCarButton() {
      // TODO 当获取单位接口正常时  解开注释
      // if (!this.formData.unitCode) {
      //   this.$message.warning('请先选择用车单位!');
      //   this.$refs.unitCodeRef.focus();
      //   return;
      // }
      // TODO 当获取部门接口正常时  解开注释
      // if (!this.formData.deptId) {
      //   this.$message.warning('请先选择用车部门');
      //   this.$refs.deptIdRef.focus();
      //   return;
      // }
      // TODO 当获取日期接口正常时  解开注释
      // if (!this.formData.usageDate) {
      //   this.$message.warning('请先选择用车日期');
      //   this.$refs.usageDateRef.focus();
      //   return;
      // }
      this.formData.newCarInfo.push({
        ...this.addCarInfoFormExample,
        uniqueId: this.uniqueId,
      });
      this.rules.newCarInfo.push(this.addCarInfoFormRuleExample)
      this.addCarInfoList.push(this.uniqueId);
      this.uniqueId++
    },
    // 删除车辆
    deleteCar(index) {
      const currentUniqueId = this.addCarInfoList[index];
      const currentCarInfo = this.addCarInfoExample.map((item) => {
        return {
          originLabel: item.label,
          label: `${item.label}${currentUniqueId}`,
          rule: item.rule,
        }
      })
      currentCarInfo.forEach(item => {
        delete this.formData[item['label']]
        delete this.rules[item['label']]
      });
      // delete this.formData[`driver${currentUniqueId}`]
      // delete this.formData[`driverPhone${currentUniqueId}`]
      // delete this.formData[`driverId${currentUniqueId}`]
      this.addCarInfoList.splice(index, 1)
    },
    // 获取用车单位列表 当前用户有权限的单位
    async getUnitDictList() {
      await getAllAvailableUnit().then(({ data }) => {
        this.unitData = data;
      }).catch((err) => {
      }).finally(() => {
      })
    },
    // 获取用车部门列表
    async getDeptDictList(val) {
      try {
        const params = {
          unitCode: val
        }
        const { data } = await getAllAvailableDept(params);
        this.deptData = data;
      } catch (e) {

      } finally {

      }
    },
    // 用车单位发生变化时
    async unitCodeChange(val) {
      // 清除部门数据
      this.formData.deptId = '';
      this.formData.driverId = '';
      this.formData.carNumber = '';
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate(['deptId', 'driverId', 'carNumber'])
      })
      if (!val) {
        this.deptData = [];
        this.driverData = [];
        this.carNumberOptions = [];
        return;
      }
      this.getDeptDictList(val);
      this.getAllDriverData();
      this.getAllAvailableCarData();
    },
    // 用车部门发生变化时
    async deptIdChange(val) {
      this.formData.carNumber = '';
      this.$nextTick(() => {
        this.$refs.elForm.clearValidate('carNumber')
      })
      if (!val) {
        this.carNumberOptions = [];
        return;
      }
      this.getAllAvailableCarData();
    },
    // 用车时间发生变化时
    async usageDateChange(val) {
      this.formData.driverId = '';
      if (!val) {
        this.driverData = [];
        return;
      }
      this.getAllDriverData()
    },
    // 司机发生变化时
    driverChange(val, uniqueId, index) {
      console.log('driverChange---', 'val', val, 'uniqueId', uniqueId, 'index', index);
      // const curDriver = this.driverData.find(item => item.driverCode === val)
      // console.log("🚀 ~ file: index.vue ~ line 971 ~ driverChange ~ curDriver", curDriver)
      // const { driver = '', phone: driverPhone = '' } = curDriver;
      // this.formData[`driver${uniqueId}`] = driver;
      // this.formData[`driverPhone${uniqueId}`] = driverPhone;
    },
    // 车辆发生变化时
    carNumberChange(val, uniqueId, index) {
      console.log('carNumberChange---', 'val', val, 'uniqueId', uniqueId, 'index', index);
      this.everyCarFormExample.forEach((item) => {
        this.formData[`${item.originLabel}${uniqueId}`] = val[item.originLabel]
        console.log(' `${item.originLabel}${uniqueId}`', this.formData[`${item.originLabel}${uniqueId}`]);
      })
    },
    // 获取指派司机列表
    async getAllDriverData() {
      try {
        if (!this.formData.unitCode || !this.formData.usageDate) {
          return;
        }
        const params = {
          classId: 'none',
          flag: '0',
          unitCode: this.formData.unitCode,
          classDateStart: this.formData.usageDate,
          classDateEnd: this.formData.usageDate,
        }
        const { data: { list = [] } = {} } = await gcjcDriverClassList(params);
        this.driverData = list || [];
      } catch (e) {
      } finally {
      }
    },
    // 获取指派车辆列表
    async getAllAvailableCarData() {
      try {
        if (!this.formData.unitCode || !this.formData.deptId) {
          return;
        }
        const params = {
          unitCode: this.formData.unitCode,
          deptId: this.formData.deptId
        }
        const { data } = await getAllAvailableCar(params);
        this.carNumberOptions = data;
      } catch (e) {

      } finally {

      }
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
  .el-date-editor {
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
