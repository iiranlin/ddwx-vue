<template>
    <!-- 添加或修改部门对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="800px" append-to-body>
        <el-form ref="elForm" :inline="true" :model="formData" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用车事由:" prop="reasonCode">
                        <el-select
                        v-model="formData.reasonCode"
                        placeholder="请选择用车事由"
                        clearable
                        filterable
                        >
                        <el-option v-for="item in dictionariesObj['1016']" 
                            :key="item.code" 
                            :label="item.name" 
                            :value="item.code"
                            @click.native="handleReasonChange(item)">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用车需求:" prop="demandCode">
                        <el-select
                        v-model="formData.demandCode"
                        placeholder="请选择用车需求"
                        clearable
                        filterable
                        >
                        <el-option v-for="item in dictionariesObj['10018']"
                            :key="item.code" 
                            :label="item.name" 
                            :value="item.code"
                             @click.native="handleDemandChange(item)">
                        </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="乘坐人数:" prop="usagePersons">
                        <el-input  v-model="formData.usagePersons" style="width: 217px" maxlength="200" placeholder="请输入乘坐人数" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="乘 车 人:" prop="userName">
                        <el-input  v-model="formData.userName" style="width: 217px" maxlength="200" placeholder="请输入乘车人" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出发时间:" prop="usageTime">
                        <el-time-picker
                        v-model="formData.usageTime"
                        value-format="HH:mm"
                        format="HH:mm"
                        
                        placeholder="请输入出发时间">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预计时长:" prop="timeLength">
                        <el-input  v-model="formData.timeLength" style="width: 217px" maxlength="10" placeholder="请输入预计时长" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="出发地点:" prop="fromAddr">
                        <form-address ref="formAddress1" :name="'出发地'" @addressSuccess="addressSuccessOut" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="前往地点:" prop="toAddr">
                        <form-address ref="formAddress2" :name="'目的地'" @addressSuccess="addressSuccessTo" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="'备\u3000\u3000注：'">
                        <el-input  v-model="formData.remark" type="textarea" style="width: 600px" maxlength="200" placeholder="请输入备注" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateVeh" :loading="loading">确 定</el-button>
            <el-button @click="openDataScope = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { gcjcTurnUnitListAll } from '@/api/gcjcTurnUnit'
import { updateVeh } from '@/api/gcywVehicleRequest'
import getDict from "@/views/mixins/getDict"
import formAddress from "./formAddress";
export default {
  mixins: [getDict],
  components: { formAddress },
  data() {
    var checkfromAddr = (rule, value, callback) => {
      if(value.indexOf('null') == -1 && value){
        return callback();
      }else{
        return callback(new Error('请选择出发地点'));
      }
    }
    var checktoAddr = (rule, value, callback) => {
      if(value.indexOf('null') == -1 && value){
        return callback();
      }else{
        return callback(new Error('请选择前往地点'));
      }
    }
    return {
        loading: false,
        title: '编辑',
        openDataScope: false,
        dictionariesCode: [1016, 10018],
        dictionariesObj: {},
        formData: {
            reasonCode: '',
            reason:'',
            demandCode: '',
            demand:'',
            usagePersons: '',
            userName: '',
            phone: '',
            usageDate: '',
            usageTime: '',
            timeLength: '',
            fromAddr: '',
            fromAreaId: '',
            toAddr: '',
            toAreaIdd: '',
            hopeBrand: '',
            remark: '',
        },
      // 表单校验
        rules: {
            reasonCode:[
                {required:true,message:"请选择用车事由",trigger:"change"}
            ],
            demandCode:[
                {required:true,message:"请选择用车需求",trigger:"change"}
            ],
            usagePersons:[
                {required:true,message:"请输入乘坐人数",trigger:"blur"}
            ],
            userName:[
                {required:true,message:"请输入乘车人",trigger:"blur"}
            ],
            usageTime:[
                {required:true,message:"请输入出发时间",trigger:"change"}
            ],
            timeLength:[
                {required:true,message:"请输入预计时长",trigger:"blur"}
            ],
            fromAddr:[
                {required:true,validator: checkfromAddr,trigger:"change"}
            ],
            toAddr:[
                {required:true,validator: checktoAddr,trigger:"change"}
            ],
        },
        row: null,
    }
  },
  created() {
    for(const item of this.dictionariesCode){
        this.getOperateDict(item);
    }
  },
  methods: {
    async getOperateDict (code) {
        const res = await this.getOperateDictList(code);
        this.dictionariesObj[code] = res;
    },
    /** 提交按钮（数据权限） */
    init (row) {
        this.row = row;
        this.openDataScope = true;
        this.$nextTick( () => {
            this.formData = row;
            this.$refs.formAddress1.init(row.fromAddr);
            this.$refs.formAddress2.init(row.toAddr);
        })
    },
    gcjcTurnUnitListAll () {
      gcjcTurnUnitListAll().then(({data}) => {
        this.unitList = data;
      })
    },
    addressSuccessOut (row) {
        let {id, name} = row;
        this.formData.fromAreaId = id;
        this.formData.fromAddr = name;
    },
    addressSuccessTo (row) {
        let {id, name} = row;
        this.formData.toAreaIdd = id;
        this.formData.toAddr = name;
    },
    updateVeh () {
      this.$refs["elForm"].validate(valid => {
        if(valid){
            this.loading = true;
            updateVeh(this.formData).then(({message}) => {
                this.$modal.msgSuccess(message);
                this.openDataScope = false;
                this.loading = false;
                this.$emit('updateSuccess')
            }).finally(() => {
                this.loading = false;
            });
        }
      })
    },
    handleReasonChange(item){
        this.formData.reasonCode = item.code;
        this.formData.reason = item.name;
    },
    handleDemandChange(item){
        console.log(item)
        this.formData.demandCode = item.code;
        this.formData.demand = item.name;
    }
  }
};
</script>