<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-form :model="form" :rules="rules" ref="elform" label-width="120px" style="width:90%">
        <!--保险信息-->
        <el-row :gutter="20">
          <el-col style="margin: 15px 10px">
            <i class="el-icon-caret-right title-icon"></i><span>保险信息</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" :xs="24">
            <el-col :span="8">
              <el-form-item label="使用单位：" prop="unitCode">
                <el-select v-model="form.unitCode" style="width:100%" :loading="loading" placeholder="请选择使用单位" size="mini" :disabled="true">
                  <el-option
                    v-for="item in userUnitOptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.unitCode"
                    @click.native="handleUnitChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号：" prop="carNumber">
                <el-select v-model="form.carNumber" filterable style="width:100%" :loading="loading" placeholder="请选择车牌号" size="mini" :disabled="true">
                  <el-option
                    v-for="item in vehicleInfoOptions"
                    :key="item.id"
                    :label="item.carNumber"
                    :value="item.carNumber"
                    @click.native="handleVehicleChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保险公司：" prop="insrUnitCode">
                <el-select v-model="form.insrUnitCode" style="width:100%" :loading="loading" placeholder="请选择保险公司" size="mini">
                  <el-option
                    v-for="item in insuranceCompanyOptions"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.unitCode"
                    @click.native="handleInsuranceChange(item)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="保单号：" prop="insrNumber">
                <el-input v-model="form.insrNumber" size="mini" placeholder="请输入保单号" maxlength="32"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投保人：" prop="policyHolder">
                <el-input v-model="form.policyHolder" size="mini" placeholder="请输入投保人" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="投保金额：" prop="insrFee">
                <el-input v-model="form.insrFee" size="mini" placeholder="请输入投保金额" maxlength="11" @input="handleNumberLimit(form,'insrFee')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效日期：" prop="insrDate">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="form.insrDate"
                  type="date"
                  placeholder="请选择生效日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到期日期：" prop="dueDate">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  :picker-options="{firstDayOfWeek:1}"
                  v-model="form.dueDate"
                  type="date"
                  placeholder="请选择到期日期"
                  size="mini"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经办人：" prop="clerk">
                <el-input v-model="form.clerk" size="mini" placeholder="请输入经办人" clearable maxlength="6"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" maxlength="200" v-model="form.remark" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="保单照片：" prop="insrPath">
                <el-upload
                  v-model="form.insrPath"
                  class="avatar-uploader"
                  accept=".jpg,.png"
                  :action="uploadFileUrl"
                  :headers="headers"
                  :data="uploadData"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleUploadError"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="form.insrPath" :src="form.insrPath" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon">
                    <span style="font-size:12px;display:block;height:30px;line-height:30px;">上传照片</span>
                  </i>
                </el-upload>
                <span style="font-size:10px;color:#8c939d;">支持.jpg .png格式</span>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <!--保险明细-->
      <el-row :gutter="20">
        <el-col style="width:90%;margin: 15px 10px;">
          <i class="el-icon-caret-right title-icon"></i><span>保险明细</span>
          <i class="el-icon-plus title-icon" style="float:right;margin-right:10px;" @click="handleAddClick()"></i>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :xs="24" style="width:90%;padding: 0px 0px 40px 40px">
          <el-table ref="eltable" max-height="300px" :data="form.items" stripe border>
            <el-table-column label="险种" align="center">
              <template slot-scope="scope">
                <el-select v-model="form.items[scope.$index].insrType" placeholder="请选择险种">
                  <el-option v-for="item in insuranceTypeOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.code"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="保费" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.items[scope.$index].insrFee" maxlength="11"
                          @input="handleNumberLimit(form.items[scope.$index],'insrFee')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="保额" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.items[scope.$index].insrPaidAmount" maxlength="11"
                          @input="handleNumberLimit(form.items[scope.$index],'insrPaidAmount')"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a href="javascript:void(0)" @click="handleDeleteClick(scope.$index)" style="color:#1890ff;">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import { getAllAvailableUnit } from '@/api/system/unit'
import { gcywInsuranceRecordDetail} from "@/api/driver"
import { gcywInsuranceRecordModify, gcywComeUnitListAll } from '@/api/driver'
import { getListByParentCode } from '@/api/system/dict'
import { getVehicleInfoSelect } from '@/api/car'
import { getToken } from '@/utils/auth'
import { handleNumberLimit } from '@/utils'

export default {
  name: 'insuranceEdit',
  data() {
    return {
      handleNumberLimit: handleNumberLimit,
      //loading框
      loading: false,
      //id
      id:'',
      //使用单位数据
      userUnitOptions: [],
      //车辆数据
      vehicleInfoOptions: [],
      //保险险种数据
      insuranceTypeOptions: [],
      //保险公司数据
      insuranceCompanyOptions: [],
      //保险明细对象
      insurance: {
        insrType: '',
        insrFee: '',
        insrPaidAmount: ''
      },
      //图片上传路径
      uploadFileUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + '/minio/upload',
      //图片上传请求头参数
      headers: {
        Authorization: getToken()
      },
      //图片上传参数
      uploadData: { type: '5' },
      //表单数据
      form: {
        unitCode: '',    //使用单位
        unitName: '',    //使用单位名称
        carNumber: '',    //车牌号
        vinNumber: '',    //车架号
        insrUnit: '',    //保险公司名称
        insrUnitCode: '',    //保险公司
        insrNumber: '',  //保单号
        policyHolder: '',         //投保人
        insrFee: '',    //投保金额
        insrDate: '',       //生效日期
        dueDate: '',     //到期日期
        clerk: '',  //经办人
        insrPath: '',    //保单照片
        remark: '',   //备注
        items: []     //保险明细
      },
      rules: {
        unitCode: [
          { required: true, message: '使用单位不能为空', trigger: 'change' }
        ],
        carNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        insrUnitCode: [
          { required: true, message: '保险公司不能为空', trigger: 'change' }
        ],
        insrNumber: [
          { required: true, message: '保单号不能为空', trigger: 'blur' },
          { trigger: 'blur', pattern: /^[A-Za-z0-9]+$/, message: '只能输入数字或字母' }
        ],
        policyHolder: [
          { required: true, message: '投保人不能为空', trigger: 'blur' }
        ],
        insrFee: [
          { required: true, message: '投保金额不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            pattern: /^0\.[0-9]{1,2}$|^0$|^[1-9]\d{0,7}\.\d{1,2}$|^[1-9]\d{0,7}$/,
            message: '请最多输入八位整数和两位小数'
          }
        ],
        insrDate: [
          { required: true, message: '生效日期不能为空', trigger: 'change' }
        ],
        dueDate: [
          { required: true, message: '到期日期不能为空', trigger: 'change' }
        ],
        clerk: [
          { required: true, message: '经办人不能为空', trigger: 'blur' }
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
    this.$refs.elform.resetFields()
    this.form.items = []
    this.id = this.$route.params.id;
    this.getInsureanceDetail()
  },
  methods: {
    //获取保险详情信息
    async getInsureanceDetail(){
        this.loading = true;
        await gcywInsuranceRecordDetail(this.id).then(({data}) => {
            this.loading = false;
            data.insrDate = this.parseTime(data.insrDate,'{y}-{m}-{d}');
            data.dueDate = this.parseTime(data.dueDate,'{y}-{m}-{d}');
            this.form = Object.assign(this.form, data);

            this.getUnitOptions()
            this.getInsuranceCompanyOptions()
            this.getInsuranceTypeOptions()
            this.getVehicleInfo(this.form.unitCode)
        }).catch((err) => {
            this.loading = false;
        })
    },
    //获取单位信息
    async getUnitOptions() {
      this.loading = true
      await getAllAvailableUnit().then(({ data }) => {
        this.loading = false
        this.userUnitOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //使用单位选择回调
    handleUnitChange(value) {
      this.form.unitName = value.unitName
      this.getVehicleInfo(value.unitCode)
    },
    //获取车辆信息
    async getVehicleInfo(unitCode) {
      this.loading = true
      await getVehicleInfoSelect({ unitCode: unitCode }).then(({ data }) => {
        this.loading = false
        this.vehicleInfoOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //车辆信息选择回调
    handleVehicleChange(value) {
      this.form.vinNumber = value.vinNumber
    },
    //获取保险公司信息
    async getInsuranceCompanyOptions() {
      this.loading = true
      await gcywComeUnitListAll({ unitCategory: '100101' }).then(({ data }) => {
        this.loading = false
        this.insuranceCompanyOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //保险公司选择回调
    handleInsuranceChange(value) {
      this.form.insrUnit = value.unitName
    },
    //获取险种信息
    async getInsuranceTypeOptions() {
      this.loading = true
      await getListByParentCode('1006').then(({ data }) => {
        this.loading = false
        this.insuranceTypeOptions = data
      }).catch((err) => {
        this.loading = false
      })
    },
    //上传图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$modal.msgWarning('上传头像图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$modal.msgWarning('上传头像图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    //上传图片成功
    handleAvatarSuccess(res, file) {
      let { data } = res
      this.$modal.msgSuccess('上传成功')
      this.form.insrPath = data.url
    },
    //上传图片失败
    handleUploadError() {
      this.$modal.msgError('上传失败, 请重试')
    },
    //添加保险明细数据
    handleAddClick() {
      this.form.items.push(Object.assign({}, this.insurance))
    },
    //删除保险明细数据
    handleDeleteClick(index) {
      if (this.form.items.length === 1) {
        this.$modal.msgWarning('无法删除，必须保留一条保险明细数据!')
        return
      }
      this.form.items.splice(index, 1)
    },
    //保存数据
    handleSave() {
      this.$refs.elform.validate(async(result) => {
        for (let i = 0; i < this.form.items.length; i++) {
          if (!this.form.items[i].insrType) {
            this.$modal.msgWarning('请选择险种信息!')
            return
          }
          if (!this.form.items[i].insrFee) {
            this.$modal.msgWarning('请填写保费信息!')
            return
          }
          if (!this.form.items[i].insrPaidAmount) {
            this.$modal.msgWarning('请填写保额信息!')
            return
          }
        }
        if (result) {
          if (this.checkDate()) {
            this.$modal.msgWarning('生效日期应小于到期日期，请从新选择!')
            return
          }
          this.loading = true
          await gcywInsuranceRecordModify(Object.assign({}, {id:this.id},this.form)).then(({ message }) => {
            this.loading = false
            this.$modal.msgSuccess(message)
            this.closeCurrentPage()
          }).catch((err) => {
            this.loading = false
          })
        }
      })
    },
    //检查生效日期和到期日期范围
    checkDate() {
      let insrDate = new Date(this.form.insrDate).getTime()
      let dueDate = new Date(this.form.dueDate).getTime()

      return insrDate > dueDate
    },
    //关闭当前页面
    closeCurrentPage() {
      this.visitedViews.forEach((item) => {
        if (item.name == this.$route.name) {
          this.$tab.closePage(item).then(({ visitedViews }) => {
            this.$router.push({ name: 'insuranceManagement' })
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

.title-icon {
  color: rgb(64, 158, 255);
  margin-right: 5px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 70px;
  line-height: 70px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
