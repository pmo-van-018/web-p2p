<template>
  <div class="container-chart">
    <div class="chart">
      <div class="chart__title">
        <span class="title font-t16b grey-900 mb-0 d-flex align-items-center">
          <img src="/assets/icons/dashboard/chart.svg" alt="chart" class="mr-2">
          {{ $t('overview.chart_transaction') }}</span>
        <span class="note">{{ $t('merchant.overview.note_chart') }}</span>
      </div>
      <div class="chart__action action">
        <div class="action_btn grey-900 font-t14m" @click="handleClick('day')">
          <div :class="{selected: status === 'day'}">{{ $t('merchant.overview.day') }}</div>
        </div>
        <div class="action_btn grey-900 font-t14m" @click="handleClick('week')">
          <div :class="{selected: status === 'week'}">{{ $t('merchant.overview.week') }}</div>
        </div>
        <div class="action_btn grey-900 font-t14m mr-0" @click="handleClick('month')">
          <div :class="{selected: status === 'month'}">{{ $t('merchant.overview.month') }}</div>
        </div>
        <div v-if="$device.isDesktop && isShowButton" class="action__export grey-900 font-t14m" @click="handleExportFile('ChartData', status, 'CHART')">
          <span class="icon-download" />
          {{ $t('merchant.overview.action_export') }}
        </div>
      </div>
    </div>
    <div class="wrap-chart">
      <canvas id="myChart" :width="width" :height="height" />
    </div>
  </div>
</template>

<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  BarController
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, LineController, BarController, BarElement, Title, Tooltip, Legend, LineElement, PointElement)

export default {
  mixins: [dashboardMixin],
  props: {
    isShowButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      chartjs: {},
      datasets: [],
      status: 'day',
      width: this.$device.isMobileOrTablet ? 400 : 680,
      height: this.$device.isMobileOrTablet ? 250 : 300
    }
  },
  async mounted () {
    await this.getDataChartReport()
    const myChart = document.getElementById('myChart');
    const million = Math.pow(10, 6);
    const billion = Math.pow(10, 9);
    await this.initChartData();
    // chart config
    ChartJS.defaults.font.family = 'Roboto Condensed';
    this.chartjs = await new ChartJS(myChart, {
      type: 'bar',
      data: {
        // label x-axis
        labels: this.dataChart[0]?.datasets?.map(item => item.key),
        datasets: [...this.datasets]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        lineTension: 1,
        // stack for bar chart by vertical
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              display: true,
              borderDash: [4, 4],
              color: '#E4E4E7'
            },
            ticks: {
              // label y-axis
              callback: (value) => {
                if (value >= billion) {
                  return value / billion + 'B'
                } else if (value >= million) {
                  return value / million + 'M'
                }
                return value
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
              boxWidth: 8,
              boxHeight: 8,
              textAlign: 'center',
              usePointStyle: true
            },
            onHover: (e) => {
              document.getElementById('myChart').style.cursor = 'pointer';
            }
          }
        }
      }
    });
  },
  methods: {
    initChartData () {
      this.datasets = this.dataChart?.map((item) => {
        item.data = item.datasets?.map(el => el.value);
        if (item.type === 'line') {
          item.borderColor = item.color;
          item.pointRadius = 5;
          item.pointBackgroundColor = item.color;
          item.borderDashOffset = 0.2;
          item.tension = 1;
          item.lineTension = 0.4;
        } else if (item.type === 'bar') {
          item.categoryPercentage = 1
          item.barPercentage = 0.5;
          item.backgroundColor = item.color
        }
        return item;
      })
    },
    async handleClick (value) {
      switch (value) {
        case 'day': await this.getDataChartReport('day');
          break;
        case 'week': await this.getDataChartReport('week');
          break;
        case 'month': await this.getDataChartReport('month')
      }
      await this.initChartData();
      // update chart data
      this.chartjs.data.labels = this.dataChart[0]?.datasets.map(item => item.key);
      this.chartjs.data.datasets = [...this.datasets];
      // excute updating data
      this.chartjs.update();
      // change status for chart
      this.status = value;
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/line-area-chart/index.scss" />
