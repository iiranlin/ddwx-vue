<template>
  <div class="app-container home">
     <img class="welcome-img" style="width: 350px;position: absolute;top: calc(50% - 175px);left: calc(50% - 175px);" src="@/assets/images/welcome.png" alt="404">
      <div class="welcome">欢迎使用公务用车管理信息系统</div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
.app-container.home{
  position:relative
}
.welcome{
  position: absolute;
  bottom: 20%;
  left: calc(50% - 132px);
  color: #76797d;
  font-size: 22px;
}
</style>

