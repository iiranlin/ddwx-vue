<template>
  <div class="content">
   <baidu-map class="map"  :mapClick="false" :center="startLocation" :zoom="zoom" style="height:100%" :scroll-wheel-zoom="true" @zoomend="syncCenterAndZoom" @ready="initMap">
       <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" ></bm-navigation>
			    <bm-polyline :path="polylinePath" stroke-color="red" :stroke-opacity="1" :stroke-weight="6" :editing="false"></bm-polyline>
			    <bm-marker :icon="startIcon" :position="{lng: startLocation.lng, lat: startLocation.lat}"></bm-marker>
			    <bm-marker :icon="endIcon" :position="{lng: endLocation.lng, lat: endLocation.lat}"></bm-marker>
				<bml-lushu
					@stop="reset"
          @pause="pause"
          :path="trackPath"
          :icon="icon"
          :play="play"
          :speed="speed"
          :rotation="true"
          :autoView="true" 
          :infoWindow="true">
				  </bml-lushu>
			</baidu-map>

            <el-button class="button" @click="handleClick">开始</el-button>
            <!-- <iframe :src="url" style="width:100%;height:100%"></iframe> -->
  </div>
</template>

<script>
import {BmlLushu} from 'vue-baidu-map'

export default {
    components: {
			BmlLushu
		},
  data() {
    return {
      // 设置中心点 经度纬度
      center: {
        // lng: 116.396874, 
        // lat: 39.907491
      },
      // 中心点缩放大小
      zoom: 12,
      //起点坐标
      startLocation:{
          lng: 116.355503, 
          lat: 39.93777
      },
      //终点坐标
      endLocation:{
          lng: 116.422451, 
          lat: 39.868767
      },
      //行驶轨迹
      polylinePath:[
        {lng: 116.355503, lat: 39.93777},
        {lng: 116.357563, lat: 39.906174},
        {lng: 116.418675, lat: 39.906701},
        {lng: 116.422451, lat: 39.868767},
      ],
      //起点图片
      startIcon:{
        url: '/static/startPoint.png',
        size: {
            width: 40,
            height: 40
        },
      },
      //终点图片
      endIcon:{
        url: '/static/endPoint.png',
        size: {
            width: 40,
            height: 40
        },
      },
      //路书图片
      icon:{
 url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
        size: {width: 52, height: 26},
        opts: {anchor: {width: 27, height:13}}
      },
      //路书坐标
      trackPath:[],
      //是否开始
      play:false,
      //速度
      speed:1000,
    };
  },
  created(){
    // this.$nextTick(() => {
    //     this.createMap();
    // });
  },
  methods:{
      createMap(){
        // let BMap = window.BMap;
        // this.trackPath=this.polylinePath.map((item) => {
        //     return new BMap.Point(item.lng, item.lat);
        // })
      },
      initMap({ BMap, map }) {
        this.trackPath=this.polylinePath.map((item) => {
            return new BMap.Point(item.lng, item.lat);
        })
        console.log(this.trackPath)
      },
      start(){

      },
      reset(){
          this.play = false;
      },
      pause(){

      },
      handleClick(){
          this.play=true;
      },
      syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    }
  }
};
</script>
<style lang='scss' scoped>
.content {
  width: 100%;
  height: 100vh;
  .bm-view {
    width: 100%;
    height: 100vh;
  }
}
::v-deep .BMap_Marker img {
    width: 100% ;
}
.button {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999 !important;
}
::v-deep .BMap_cpyCtrl {
    display: none;
}
::v-deep .anchorBL {
    display: none;
}
</style>
