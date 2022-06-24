<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="carModelDialog"
    width="92%"
  >
    <div class="carModel">
      <div id="carBg">
        <img class="carLogo" :src="logoPath" alt="暂无此车辆信息">
        <h2>{{ carName }}</h2>
        <img class="ground" src="@/assets/images/car/MainBg@2x.jpg" alt="">
        <div class="closeBtn" @click="visible=false"></div>
      </div>
      <div id="showCar">
        <img v-for="(path,index) in imgPathList" v-show="index===current" :src="path" alt="">
      </div>
    </div>
  </el-dialog>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'carModel',
  data() {
    return {
      visible: false,
      totalFrame: 36,
      carName: '',
      logoPath: '',
      // 模型图片文件夹路径
      pngUrl: '',
      imgPathList: [],
      mouseStart: 0,
      mouseMove: 0,
      mouseTimer: 0,
      // 要播放几帧, 正数为向前，负数为向后
      playIndex: 0,
      // 为当前显示的帧,0为第一帧
      current: 0,
      // 0为不播放, 1为指定播放， 2为入场自动播放
      state: 2,
      goto: 0,
      autoTimes: 0
    }
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    init(carName) {
      this.carName = carName
      this.logoPath = '/carModel/' + carName + '/logo.png'
      this.pngUrl = '/carModel/' + carName + '/png/'
      this.loadImg()
      this.visible = true
      this.$nextTick(() => {
        this.autoPlay()
        this.bindRotation()
      })
    },
    // 加载图片资源
    loadImg() {
      for (let i = 1; i <= this.totalFrame; i++) {
        if (i < 10) {
          i = '0' + i
        }
        let carImgPath = this.pngUrl + i + '.png'
        this.imgPathList.push(carImgPath)
      }
    },
    // 绑定鼠标事件
    bindRotation() {
      let _this = this
      let $showCar = $('#showCar')
      $showCar.mousedown(function(event) {
        _this.mouseStart = event.pageX
        _this.mouseTimer = 1
        _this.playIndex = 0
        _this.state = 1
      })
      $showCar.mouseup(function() {
        _this.mouseTimer = 1
        _this.state = 0
        _this.playIndex = _this.goto
      })
      $showCar.mouseleave(function() {
        _this.mouseTimer = 1
        _this.state = 0
        _this.playIndex = _this.goto
      })
      $showCar.mousemove(function(event) {
        if ((event.pageX - _this.mouseMove) * _this.goto >= 0) {
          _this.mouseMove = event.pageX
        } else {
          _this.mouseStart = _this.mouseMove
          _this.mouseMove = event.pageX
        }
        if (_this.state === 1) {
          _this.goto = Math.round((_this.mouseMove - _this.mouseStart) / 30)
          _this.playFrame()
          if (_this.mouseTimer > 20) {
            _this.mouseTimer = 1
            _this.playIndex = 0
            _this.mouseStart = _this.mouseMove
          }
        }
      })
    },
    //修改各个状态值
    playNext() {
      if (this.goto < 0) {
        this.playIndex -= 1
        this.current -= 1
        if (this.current < 0) {
          this.current = this.totalFrame - 1
        }
      }
      if (this.goto > 0) {
        this.playIndex += 1
        this.current += 1
        if (this.current >= this.totalFrame) {
          this.current = 0
        }
      }
    },
    //根据鼠标事件，播放旋转动画
    playFrame() {
      if (this.state === 0) {
        return
      }
      if (!(this.playIndex === this.goto)) {
        this.playNext()
      }
      this.mouseTimer++
      window.requestAnimationFrame(this.playFrame)
    },
    autoPlay() {
      if (this.state !== 2) {
        return
      }
      this.current += 1
      if (this.current >= this.totalFrame) {
        this.current = 0
        this.autoTimes++
      }
      if (this.autoTimes > 0 && this.current > 8) {
        this.state = 0
        return
      }
      window.requestAnimationFrame(this.autoPlay)
    }
  }

}
</script>

<style scoped lang="scss">
.carModelDialog {
  ::v-deep .el-dialog {
    height: 90%;
  }
}

.carModelDialog ::v-deep .el-dialog__header {
  padding: 0;
}

.carModelDialog::v-deep .el-dialog__body {
  height: 100%;
  padding: 0;
}

.carModel {
  height: 100%;

  #carBg {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 4;

    .carLogo {
      display: block;
      position: absolute;
      left: 50%;
      top: 21%;
      width: 240px;
      height: 100px;
      transform: translate(-50%, -100px);
      z-index: 5;
    }


    h2 {
      position: absolute;
      left: 50%;
      top: 21%;
      transform: translate(-50%, -32px);
      line-height: 34px;
      font-size: 24px;
      color: #fff;
      font-family: Heiti, "Microsoft YaHei", serif;
      letter-spacing: 3px;
      z-index: 5;
    }

    .ground {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 1920px;
      height: 1920px;
      transform: translate(-50%, -50%);
    }

    .closeBtn {
      position: absolute;
      right: 18px;
      top: 12px;
      width: 24px;
      height: 24px;
      background: url("../../../../assets/images/car/CloseBtn@2x.png") no-repeat left top;
      background-size: contain;
      z-index: 999;
      cursor: pointer;
      opacity: .6;
    }

    .closeBtn:hover {
      opacity: 1;
    }

  }

  #showCar {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 800px;
    user-select: none;
    cursor: pointer;
    z-index: 4;

    img {
      position: absolute;
      display: block;
      left: 0;
      top: 0;
      //width: 100%;
      //height: 100%;
      //opacity: 0;
      user-select: none;
    }
  }

  #showCar:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
}


@media screen and (max-width: 1440px) {
  #showCar {
    width: 900px;
    height: 600px;
  }
  #carBg .ground {
    width: 1440px;
    height: 1440px;
  }
  #carBg .carLogo {
    width: 180px;
    height: 75px;
    top: 19.5%;
    transform: translate(-50%, -75px);
  }
  #carBg h2 {
    top: 19.5%;
    transform: translate(-50%, 0);
    line-height: 20px;
    font-size: 16px;
  }
}

</style>
