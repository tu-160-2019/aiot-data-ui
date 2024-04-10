<template>
  <v-chart class="chart" ref="chart" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  name: 'PropertyChart',
  props: {
    name: {
      type: String,
      default() {
        return ''
      },
    },
    properties: {
      type: Array,
      default() {
        return []
      },
    },
  },
  components: {
    VChart,
  },
  data() {
    return {}
  },
  mounted() {
    this.refreshData()
  },
  watch: {
    properties: function (newV) {
      if (newV) this.refreshData()
    },
  },
  methods: {
    refreshData: function () {
      let dataX = []
      let dataY = []
      this.properties.forEach((p) => {
        dataX.push(new Date(p.time).toLocaleString())
        dataY.push(p.value)
      })
      console.log(this.$refs.chart.setOption)
      this.$refs.chart.setOption({
        animation: true,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
        },
        xAxis: {
          name: '时间',
          data: dataX,
        },
        yAxis: {
          name: this.name,
        },
        series: [
          {
            data: dataY,
            type: 'line',
            smooth: true,
            animationDelay: function (idx) {
              return idx * 10
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped>
.chart {
  width: 800px;
  height: 400px;
}
</style>
