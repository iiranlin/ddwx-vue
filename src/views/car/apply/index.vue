<template>
  <div class="container-calendar">
    <el-calendar>
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
        </p>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { vehicleInfoGetAssignCount } from "@/api/vehicleInfo";
export default {
  name: "apply",
  data() {
    return {
      dateList: []
    };
  },
  created() {
    this.vehicleInfoGetAssignCount();
  },
  mounted() {
  },
  methods: {
    vehicleInfoGetAssignCount () {
      vehicleInfoGetAssignCount().then(({data}) => {
        // this.dateList = data;
      })
    }
  },
};
</script>
<style lang="scss" scoped>
  .container-calendar{
    width: 100%;
    height: 50%;
    .is-selected {
      color: #1989FA;
    }
  }
</style>