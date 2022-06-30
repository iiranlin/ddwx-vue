<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top:15px;">
      <el-form :model="form" :rules="rules" ref="elform" label-width="140px">
        <el-row style="width:80%">
          <el-col :span="24" :xs="24">
            <el-col :span="12">
              <el-form-item label="用车单位：" prop="usageUnitCode">
                <el-select v-model="form.usageUnitCode" :loading="loading" placeholder="请选择用车单位" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.unitCode"
                    @click.native="handleUnitCodeChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用车部门：" prop="usageDept">
                <el-select v-model="form.usageDept" :loading="loading" placeholder="请选择用车部门" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in departmentOptions"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁类型：" prop="vehicleProperties">
                <el-select v-model="form.vehicleProperties" :loading="loading" placeholder="请选择租赁类型" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in vehiclePropertiesOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车牌号：" prop="carNumber">
                <el-input v-model="form.carNumber" size="mini" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁公司：" prop="rentUnit">
                <el-input v-model="form.rentUnit" size="mini" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁公司执照：" prop="rentUnitCode">
                <el-input v-model="form.rentUnitCode" size="mini" maxlength="15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="起租日期：" prop="rentBeginDate">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="form.rentBeginDate"
                  type="date"
                  placeholder="请选择起租日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到期日期：" prop="rentEndDate">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="form.rentEndDate"
                  type="date"
                  placeholder="请选择到期日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆类型Ⅰ：" prop="carType">
                <el-select v-model="form.carType" :loading="loading" placeholder="请选择车辆类型" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in vehicleTypeOneOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    @click.native="handleVehicleTypeOneChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆类型Ⅱ：" prop="carType2">
                <el-select v-model="form.carType2" :loading="loading" placeholder="请选择车辆类型" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in vehicleTypeTwoOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌型号：" prop="carBrand">
                <el-input v-model="form.carBrand" size="mini" clearable maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车架号：" prop="vinNumber">
                <el-input v-model="form.vinNumber" size="mini" clearable maxlength="17"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发动机号：" prop="engineNumber">
                <el-input v-model="form.engineNumber" size="mini" clearable maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资金来源：" prop="carMoneySource">
                <el-input v-model="form.carMoneySource" size="mini" clearable maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="座位数：" prop="maxMens">
                <el-input v-model="form.maxMens" size="mini" clearable maxlength="3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排气量：" prop="capacity">
                <el-input v-model="form.capacity" size="small" clearable maxlength="20">
                  <template slot="suffix">升</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排放标准：" prop="emission">
                <el-select v-model="form.emission" :loading="loading" placeholder="请选择排放标准" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in emissionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="核准载重：" prop="maxWeight">
                <el-input v-model="form.maxWeight" size="small" clearable maxlength="10">
                  <template slot="suffix">吨</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="车辆用途：" prop="carUsing">
                <el-select v-model="form.carUsing" :loading="loading" placeholder="请选择车辆用途" size="mini" style="width:100%;">
                  <el-option
                    v-for="item in carUsingOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初登日期：" prop="registerDate">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="form.registerDate"
                  type="date"
                  placeholder="请选择初登日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="购车价格：" prop="originalValue">
                <el-input v-model="form.originalValue" size="mini" clearable maxlength="11" @input="handleNumberLimit(form,'originalValue')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租赁价格：" prop="rentPrice">
                <el-input v-model="form.rentPrice" size="mini" clearable placeholder="录入总包价" maxlength="11"
                          @input="handleNumberLimit(form,'rentPrice')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同号：" prop="rentAgreement">
                <el-input v-model="form.rentAgreement" size="mini" clearable maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="租金描述：" prop="rentMoneyDesc">
                <el-input v-model="form.rentMoneyDesc " size="mini" clearable maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="'申请理由\u3000\n及用途：'" prop="rentApplydesc" class="fold_label">
                <el-input type="textarea" :rows="3" maxlength="200" v-model="form.rentApplydesc" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" maxlength="200" v-model="form.remark" size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <!--弹出框-->
    <operate ref="operate" @operateSuccess="operateSuccess"></operate>
  </div>
</template>
<script>
import { vehicleInfoUpdGVC, activitiAssigneeListByType } from '@/api/driver'
import { getListByParentCode, getListByParentId } from '@/api/system/dict'
import { getAllAvailableDept } from '@/api/dept'
import { getAllAvailableUnit } from '@/api/system/unit'
import operate from './components/operate'
import { handleNumberLimit } from '@/utils'

export default {
  name: 'leaseEdit',
  components: { operate },

  data() {
    return {
      handleNumberLimit: handleNumberLimit,
      //loading框
      loading: false,
      //回显数据
      echoData: {},
      //单位信息
      unitOptions: [],
      //部门信息
      departmentOptions: [],
      //租赁类型信息：
      vehiclePropertiesOptions: [],
      //车辆类型Ⅰ信息
      vehicleTypeOneOptions: [],
      //车辆类型Ⅱ信息
      vehicleTypeTwoOptions: [],
      //排放标准信息
      emissionOptions: [],
      //车辆用途信息
      carUsingOptions: [],

      //表单数据
      form: {
        usageUnitCode: '',    //用车单位
        usageDept: '',   //用车部门
        vehicleProperties: '',    //租赁类型
        carNumber: '',    //车牌号
        rentUnit: '',    //租赁公司
        rentUnitCode: '',    //租赁公司营业执照
        rentBeginDate: '',   //起租日期
        rentEndDate: '',     //到期日期
        carType: '',     //车辆类型Ⅰ
        carType2: '',    //车辆类型Ⅱ
        carBrand: '',    //品牌
        vinNumber: '',   //车架号
        engineNumber: '',    //发动机号
        carMoneySource: '',  //资金来源
        maxMens: '', //座位数
        capacity: '',    //排气量
        emission: '', //排放标准
        maxWeight: '',   //核准载重
        carUsing: '',    //车辆用途
        registerDate: '',    //初登日期
        originalValue: '',   //购车价格
        rentPrice: '',   //租赁价格
        rentMoneyDesc: '', //租金描述
        rentAgreement: '',   //合同号
        rentApplydesc: '',   //申请理由及用途
        remark: '',   //备注
        usageFlag: '0',
        status: '1',
        procDefId: '',
        assignee: ''
      },
      rules: {
        usageUnitCode: [
          { required: true, message: '用车单位不能为空', trigger: 'change' }
        ],
        usageDept: [
          { required: true, message: '用车部门不能为空', trigger: 'change' }
        ],
        vehicleProperties: [
          { required: true, message: '租赁类型不能为空', trigger: 'change' }
        ],
        carNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            pattern: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
            message: '请输入规范的车牌号'
          }
        ],
        rentUnit: [
          { required: true, message: '租赁公司不能为空', trigger: 'blur' }
        ],
        rentUnitCode: [
          { required: true, message: '租赁公司营业执照不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            pattern: /^\d{15}$/,
            message: '请输入规范的15位营业执照'
          }
        ],
        rentBeginDate: [
          { required: true, message: '起租日期不能为空', trigger: 'change' }
        ],
        rentEndDate: [
          { required: true, message: '到期日期不能为空', trigger: 'change' }
        ],
        carType: [
          { required: true, message: '车辆类型Ⅰ不能为空', trigger: 'change' }
        ],
        carType2: [
          { required: true, message: '车辆类型Ⅱ不能为空', trigger: 'change' }
        ],
        carBrand: [
          { required: true, message: '品牌型号不能为空', trigger: 'blur' }
        ],
        vinNumber: [
          { required: true, message: '车架号不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            pattern: /^[A-Za-z0-9]{17}$/,
            message: '请输入规范的17位车架号'
          }
        ],
        engineNumber: [
          { required: true, message: '发动机号不能为空', trigger: 'blur' },
          { trigger: 'blur', pattern: /^[A-Za-z0-9]+$/, message: '只能输入数字或字母' }
        ],
        carMoneySource: [
          { required: true, message: '资金来源不能为空', trigger: 'blur' }
        ],
        maxMens: [
          { required: true, message: '座位数不能为空', trigger: 'blur' },
          { trigger: 'blur', pattern: /^[0-9]*$/, message: '只能输入数字' }
        ],
        capacity: [
          { required: true, message: '排气量不能为空', trigger: 'blur' },
          { trigger: 'blur', pattern: /^[0-9]*$/, message: '只能输入数字' }
        ],
        emission: [
          { required: true, message: '排放标准不能为空', trigger: 'change' }
        ],
        maxWeight: [
          { required: true, message: '核准载重不能为空', trigger: 'blur' },
          { trigger: 'blur', pattern: /^[0-9]*$/, message: '只能输入数字' }
        ],
        carUsing: [
          { required: true, message: '车辆用途不能为空', trigger: 'change' }
        ],
        registerDate: [
          { required: true, message: '初登日期不能为空', trigger: 'change' }
        ],
        rentPrice: [
          { required: true, message: '租赁价格不能为空', trigger: 'blur' }
        ],
        rentApplydesc: [
          { required: true, message: '申请理由及用途不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  activated() {
    this.echoData = this.$route.params.row
    this.$refs.elform.resetFields()
    this.getUnitOptions()
    this.getVehiclePropertiesOptions()
    this.getVehicleTypeOne()
    this.getEmissionOptions()
    this.getCarUsingOptions()
    this.echoView()
  },
  methods: {
    //回显数据
    echoView() {
      this.echoData.rentBeginDate = this.parseTime(this.echoData.rentBeginDate, '{y}-{m}-{d}')
      this.echoData.rentEndDate = this.parseTime(this.echoData.rentEndDate, '{y}-{m}-{d}')
      this.echoData.registerDate = this.parseTime(this.echoData.registerDate, '{y}-{m}-{d}')
      this.form = Object.assign({}, this.echoData)
    },
    //获取单位信息
    async getUnitOptions() {
      this.loading = true
      await getAllAvailableUnit().then(({ data }) => {
        this.loading = false
        this.unitOptions = data

        //回显部门信息
        if (this.unitOptions.length != 0) {
          let obj = this.unitOptions.find((item) => {
            return item.unitCode = this.echoData.usageUnitCode
          })
          this.getDepartmentOptions(obj.id)
        }
      }).catch((err) => {
        this.loading = false
      })
    },
    //单位信息选择回调
    handleUnitCodeChange(value) {
      this.form.usageDept = ''
      this.getDepartmentOptions(value.id)
    },
    //获取部门信息
    async getDepartmentOptions(id) {
      this.loading = true
      await getAllAvailableDept({ unitId: id }).then(({ data }) => {
        this.loading = false
        this.departmentOptions = data;
      }).catch((err) => {
        this.loading = false
      })
    },
    //获取租赁类型
    async getVehiclePropertiesOptions() {
      this.loading = true
      await getListByParentCode('10017').then(({ data }) => {
        this.loading = false
        this.vehiclePropertiesOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //获取车辆类型Ⅰ
    async getVehicleTypeOne() {
      this.loading = true
      await getListByParentCode('1018').then(({ data }) => {
        this.loading = false
        this.vehicleTypeOneOptions = data

        //回显车辆类型Ⅱ数据
        if (this.vehicleTypeOneOptions.length != 0) {
          let obj = this.vehicleTypeOneOptions.find((item) => {
            return item.name = this.echoData.carType
          })
          this.getVehicleTypeTwo(obj.id)
        }
      }).catch((err) => {
        this.loading = false
      })
    },
    //车辆类型Ⅰ选择回调
    handleVehicleTypeOneChange(value) {
      this.form.carType2 = ''
      this.getVehicleTypeTwo(value.id)
    },
    //获取车辆类型Ⅱ
    async getVehicleTypeTwo(id) {
      this.loading = true
      await getListByParentId(id).then(({ data }) => {
        this.loading = false
        this.vehicleTypeTwoOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //获取排放标准
    async getEmissionOptions() {
      this.loading = true
      await getListByParentCode('1019').then(({ data }) => {
        this.loading = false
        this.emissionOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //获取车辆用途
    async getCarUsingOptions() {
      this.loading = true
      await getListByParentCode('1004').then(({ data }) => {
        this.loading = false
        this.carUsingOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //检查工作流
    handleSave() {
      this.$refs.elform.validate(async(result) => {
        if (result) {
          if (this.checkDate()) {
            this.$modal.msgWarning('起租日期应小于到期日期，请从新选择!')
            return
          }
          this.loading = true
          activitiAssigneeListByType({ type: '公车租赁' }).then(({ data }) => {
            this.loading = false
            if (!data.procDefId) {
              this.vehicleInfoUpdate()
            } else if (!!data.procDefId) {
              this.form.procDefId = data.procDefId
              if (!!data.assignee) {
                this.form.assignee = data.assignee
                this.vehicleInfoUpdate()
              } else {
                this.$refs.operate.init(data.assigneeList)
              }
            }
          }).catch((err) => {
            this.loading = false
          })
        }
      })
    },
    //检查起租日期和到期日期范围
    checkDate() {
      let beginData = new Date(this.form.rentBeginDate).getTime()
      let endData = new Date(this.form.rentEndDate).getTime()

      return beginData > endData
    },
    //保存数据
    async vehicleInfoUpdate() {
      this.loading = true
      await vehicleInfoUpdGVC(this.form).then(({ message }) => {
        this.loading = false
        this.$modal.msgSuccess(message)
        this.closeCurrentPage()
      }).catch((err) => {
        this.loading = false
      })
    },
    //选择审批人后回调
    operateSuccess(assignee) {
      this.form.assignee = assignee
      this.vehicleInfoUpdate()
    },
    //关闭当前页面
    closeCurrentPage() {
      this.visitedViews.forEach((item) => {
        if (item.name == this.$route.name) {
          this.$tab.closePage(item).then(({ visitedViews }) => {
            this.$router.push({ name: 'lease' })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 10px 15px;
  overflow: auto;
}

::v-deep .fold_label .el-form-item__label {
  white-space: pre-line;
  line-height: 30px;
}
</style>
