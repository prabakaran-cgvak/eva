<!-- =========================================================================================
    File Name: HighCharts.vue
    Description: High Charts Component
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
    <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import {Chart} from 'highcharts-vue'

export default {
  data () {
    return {}
  },
  components: {
    highcharts: Chart
  },
  props: {
      chartOptions: {
      type: Object,
      default: function () {
        return {}
      }
    }
  }
}
</script>
