<template>
  <div class="doughnut-chart">
    <div class="doughnut-chart__container">
      <canvas :id="chartId" :width="width" :height="height" />
      <div v-show="!items.length" class="doughnut-chart__text-empty">{{ $t('overview.doughnut_chart.empty') }}</div>
    </div>
  </div>
</template>
<script>
import {
  Chart as ChartJS,
  DoughnutController,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale
} from 'chart.js'
import { formatPercentage } from '@/helper';

ChartJS.register(DoughnutController, Title, Tooltip, ArcElement, CategoryScale)

export default {
  props: {
    width: {
      type: Number,
      default: 180
    },
    height: {
      type: Number,
      default: 180
    },
    chartId: {
      type: String,
      default: 'doughnut-chart'
    },
    labels: {
      type: Array,
      default: () => []
    },
    datasets: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chartJs: null
    }
  },
  computed: {
    isEmpty () {
      return this.items.length === 0;
    },
    chartOptions () {
      return {
        responsive: true,
        maintainAspectRatio: false,
        events: this.isEmpty ? [] : ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            position: 'nearest',
            callbacks: {
              labelColor: tooltipItem => ({
                borderColor: tooltipItem.dataset.backgroundColor[tooltipItem.dataIndex],
                backgroundColor: tooltipItem.dataset.backgroundColor[tooltipItem.dataIndex],
                borderWidth: 0,
                borderRadius: 1
              }),
              label: (tooltipItem) => {
                const percent = formatPercentage(tooltipItem.parsed, tooltipItem.dataset.total);
                return `${tooltipItem.label}: ${percent}%`;
              },
              footer: tooltipItems => `${this.$t('overview.total_trans.title')} đ${tooltipItems[0].formattedValue}`
            }
          }
        }
      };
    }
  },
  watch: {
    items: {
      immediate: true,
      handler () {
        this.$nextTick(() => {
          this.updateChartData()
        })
      }
    }
  },
  async mounted () {
    await this.initializeChart()
  },
  methods: {
    initializeChart () {
      const ctx = document.getElementById(this.chartId);
      if (!this.chartJs && ctx) {
        this.chartJs = new ChartJS(ctx, {
          type: 'doughnut',
          data: { labels: this.labels, datasets: this.datasets },
          options: this.chartOptions
        });
      }
    },
    updateChartData () {
      if (this.chartJs) {
        this.chartJs.data.labels = this.labels;
        this.chartJs.data.datasets = this.datasets;
        this.chartJs.options.events = this.isEmpty ? [] : ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'];
        this.chartJs.options.plugins.tooltip.enabled = !this.isEmpty;
        this.chartJs.update(this.isEmpty ? 'none' : '');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.doughnut-chart {
  &__container {
    position: relative;
    overflow: auto;
    canvas {
      width: 100% !important;
    }
  }
  &__text-empty {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    left: 0;
    margin: 0 auto;
    text-align: center;
    max-width: 156px;
    @include font-t14r;
    color: var(--mode-light-dark-800);
  }
}
</style>
