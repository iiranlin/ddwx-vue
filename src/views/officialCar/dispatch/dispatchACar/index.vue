<template>
    <div class="app-container" v-loading="loading">
        <!--申请信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_detail_unit.png"/>
                <span>申请信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <el-row>
                        <li class="li-item">
                            <span>用车事由：</span>
                            <span>{{checkReason(formData.reasonCode)}}</span>
                        </li>
                        <li class="li-item">
                            <span>用车需求：</span>
                            <span>{{checkDemand(formData.demandCode)}}</span>
                        </li>
                        <li class="li-item">
                            <span>是否长途：</span>
                            <span>{{checkLongDistanceTag(formData.longDistanceTag)}}</span>
                        </li>
                        <li class="li-item">
                            <span>乘坐人数：</span>
                            <span>{{formData.usagePersons}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>期望车型：</span>
                            <span>{{checkHopeBrand(formData.hopeBrand)}}</span>
                        </li>
                        <li class="li-item">
                            <span>优先保障：</span>
                            <span>{{checkGuarantee(formData.guarantee)}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item-all">
                            <span>备注：</span>
                            <span>{{formData.remark}}</span>
                        </li>
                    </el-row>
                </ul>
            </div>
        </div>
        <!--用车信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_dispatch_car.png"/>
                <span>用车信息</span>
            </div>
            <div class="ul-parent">
                <ul class="ul-container">
                    <el-row>
                        <li class="li-item">
                            <span>乘车人：</span>
                            <span>{{formData.userName}}</span>
                        </li>
                        <li class="li-item">
                            <span>出发地点：</span>
                            <span>{{formData.fromAddr}}</span>
                        </li>
                        <li class="li-item">
                            <span>前往地点：</span>
                            <span>{{formData.toAddr}}</span>
                        </li>
                        <li class="li-item">
                            <span>联系电话：</span>
                            <span>{{formData.phone}}</span>
                        </li>
                    </el-row>
                    <el-row>
                        <li class="li-item">
                            <span>出发日期：</span>
                            <span>{{formData.usageDate}}</span>
                        </li>
                        <li class="li-item">
                            <span>出发时间：</span>
                            <span>{{formData.usageTime}}</span>
                        </li>
                        <li class="li-item">
                            <span>预计时长：</span>
                            <span>{{formData.timeLength}} 小时</span>
                        </li>
                    </el-row>
                </ul>
            </div>
        </div>
        <!--派车信息-->
        <div class="item-content-container">
            <div class="title-container">
                <img src="/static/icon_use_car.png"/>
                <span>派车信息</span>
            </div>
            <div class="add-car-contaner">
                <div class="add-car-title">
                    <span>添加车辆：</span>
                    <div class="add-car" @click="handleAddCarClick()">
                        <img src="/static/icon_car.png" />
                        <span>选择车辆</span>
                    </div>
                </div>
                <dispatch-item ref="dispatchItem"/>
                <div class="button-container">
                    <el-button type="primary" round  @click="addRequest" size="small">保 存</el-button>
                    <el-button round @click="closeCurrentPage" size="small">关 闭</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getListByParentId } from "@/api/system/dict"
import dispatchItem from "./components/dispatchItem";

export default {
    name:'dispatchACar',
    components: { dispatchItem },

    data () {
        return {
            //遮罩层
            loading:false,

            //表单数据            
            formData:{
                usageDate:'',   //用车日期
                reasonCode:'',      //用车事由
                demandCode:'',      //用车需求
                longDistanceTag:'', //是否长途
                usagePersons:'',    //乘坐人数
                hopeBrand:'',       //期望车型
                guarantee:'',       //优先保障
                remark:'',          //备注
                userName:'',        //乘车人
                userId:'',          //乘车人id
                phone:'',           //乘车人电话
                fromAddr: '',       //出发地点
                fromAreaId: '',
                toAddr: '',         //前往地点
                toAreaIdd: '',
                usageTime:'',       //用车时间
                timeLength:'',     //预计时长
                source: 1,          //来源
                procDefId: '',
                assignee: '',
                candidateUser:[],
            },
            //用车事由数据
            reasonOptions:[],
            //用车需求数据
            demandOptions:[],
            //是否长途数据
            longDistanceTagOptions:[
                {
                    code:'1',
                    name:'是',
                },
                {
                    code:'0',
                    name:'否',
                }
            ],
            //期望车型数据
            hopeBrandOptions:[],
            //优先保障数据
            guaranteeOptions:[],
            //已选中乘车人数据
            defaultCheckedUser:[],
        }
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        }
    },
    created() {
        this.getReasonOptions();
        this.getDemandOptions();
        this.getHopeBrandOptions();
        this.getGuaranteeOptions();

        this.$nextTick( () => {
            if(this.$route.query.row){
                let row = JSON.parse(this.$route.query.row);
                this.formData = Object.assign({}, this.formData,row);
            }
        })
    },
    methods: {
        //获取用车事由数据
        getReasonOptions(){
            this.loading = true;

            getListByParentId('1016').then(({data}) => {
                this.loading = false;
                this.reasonOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取用车需求数据
        getDemandOptions(){
            this.loading = true;

            getListByParentId('10018').then(({data}) => {
                this.loading = false;
                this.demandOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取期望车型数据
        getHopeBrandOptions(){
            this.loading = true;

            getListByParentId('101801').then(({data}) => {
                this.loading = false;
                this.hopeBrandOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //获取优先保障数据
        getGuaranteeOptions(){
            this.loading = true;

            getListByParentId('1679651627836055552').then(({data}) => {
                this.loading = false;
                this.guaranteeOptions = data;
            }).catch((err) => {
                this.loading = false;
            })
        },
        //判断用车事由
        checkReason(reasonCode){
            let obj = this.reasonOptions.find((item) => {
                return item.code = reasonCode;
            })
            return !!obj?obj.name:"";
        },
        //判断用车需求
        checkDemand(demandCode){
            let obj = this.demandOptions.find((item) => {
                return item.code = demandCode;
            })
            return !!obj?obj.name:"";
        },
        //判断是否长途
        checkLongDistanceTag(longDistanceTag){
            let obj = this.longDistanceTagOptions.find((item) => {
                return item.code = longDistanceTag + "";
            })
            return !!obj?obj.name:"";
        },
        //判断期望车型
        checkHopeBrand(hopeBrand){
            let obj = this.hopeBrandOptions.find((item) => {
                return item.code = hopeBrand;
            })
            return !!obj?obj.name:"";
        },
        //判断优先保障
        checkGuarantee(guarantee){
            let obj = this.guaranteeOptions.find((item) => {
                return item.code = guarantee;
            })
            return !!obj?obj.name:"";
        },
        //添加车辆
        handleAddCarClick(){
            this.$refs.dispatchItem.addCarItem();
        },
        //保存
        addRequest(){
            this.$refs.dispatchItem.addRequest();
        },
        //关闭当前页面
        closeCurrentPage() {
            this.visitedViews.forEach((item) => {
                if (item.name === this.$route.name) {
                    this.$tab.closePage(item).then(({ visitedViews }) => {
                        this.$router.back();
                    })
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.app-container {
    box-sizing: border-box;
    padding: 7px 9px;
    background-color: #f1f3f8;
    overflow-y: auto;

    .item-content-container {
        background-color: #ffffff;
        border-radius: 5px;
        margin-bottom: 7px;
        padding-bottom: 18px;

        .title-container {
            width: 100%;
            height: 41px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f3f5f7;

            img {
                margin-left: 4px;
                width: 23px;
                height: 23px;
            }
            span {
                font-size: 14px;
                color: #1b1e22;
            }
        }
        .ul-parent {
            overflow: hidden;
            padding: 7px 20px 0px 40px;

            .ul-container {
                padding: 0px;
                margin: 0px;
                list-style: none;

                .li-item {
                    float: left;
                    min-height: 24px;
                    line-height: 24px;
                    min-width: 24%;
                    max-width: 24%;
                    font-size: 12px;
                    display: flex;
                    color: #000000;
                    margin-right: 10px;

                    & span:nth-child(1) {
                        width: 60px;
                    }
                    & span:nth-child(2) {
                        width: calc(100% - 60px);
                    }
                } 
                .li-item-all {
                    width: 100%;
                    font-size: 12px;
                    color: #000000;
                }
                .li-button {
                    width: 100%;
                    position: relative;

                    .button-container {
                        margin: 0 auto;
                        width:  200px;
                        display: flex;
                        justify-content: space-around;

                        .el-button {
                            width: 100px;
                        }
                    }
                }
            }
        }
        .add-car-contaner {
            padding-top: 10px;
            overflow: hidden;
            position: relative;

            .add-car-title {
                display: flex;
                line-height: 24px;
                line-height: 31px;
                font-size: 12px;
                border-bottom: 1px solid #f3f5f7;
                padding-left: 40px;

                .add-car {
                    margin-left: 5px;
                    width: 120px;
                    border: 1px solid #f0f0f0;
                    border-radius: 50px;
                    text-align: center;
                    margin-bottom: 10px;

                    & :hover {
                        cursor: pointer;
                    }
                    img {
                        width: 16px;
                        height: 16px;
                        margin-right: 5px;
                        transform: translateY(3px);
                    }
                    span {
                        font-size: 12px;
                    }
                }
                .add-car-info {
                    width: 100%;
                    display: flex;
                }
            }
            .button-container {
                margin: 0 auto;
                margin-top: 20px;
                width:  200px;
                display: flex;
                justify-content: space-around;

                .el-button {
                    width: 100px;
                }
            }
        }
    }
}
</style>