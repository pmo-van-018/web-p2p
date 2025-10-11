<template>
  <b-modal
    :id="MODAL.MODAL_REVENUE_CHART"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    @show="resetModalData()"
  >
    <div class="revenue-chart">
      <span class="icon-cancel" @click="$bvModal.hide(MODAL.MODAL_REVENUE_CHART)" />
      <div class="revenue-chart__header">
        <div class="title">
          <img src="/assets/images/components/desktop/admin/revenue-icon.svg" alt="revenue-icon">
          <p>{{ $t('admin.revenue_chart.title') }}</p>
        </div>
        <div class="date-picker-filter">
          <div
            :class="['filter-option', { active: filter.date_type === RANGE_DATE_TYPE_CHART.DAY }]"
            @click="changeFilterDateType(RANGE_DATE_TYPE_CHART.DAY)"
          >
            {{ $t('admin.revenue_chart.filter.day') }}
          </div>
          <div
            :class="['filter-option', { active: filter.date_type === RANGE_DATE_TYPE_CHART.MONTH }]"
            @click="changeFilterDateType(RANGE_DATE_TYPE_CHART.MONTH)"
          >
            {{ $t('admin.revenue_chart.filter.month') }}
          </div>
          <div
            :class="['filter-option', { active: filter.date_type === RANGE_DATE_TYPE_CHART.YEAR }]"
            @click="changeFilterDateType(RANGE_DATE_TYPE_CHART.YEAR)"
          >
            {{ $t('admin.revenue_chart.filter.year') }}
          </div>
          <div class="filter-custom">
            <report-date-picker-custom
              v-model="dateRange"
              :type="dateRangeType"
              :format="dateRangeFormat"
              class="w-100"
              :class="{ active: filter.date_type === RANGE_DATE_TYPE_CHART.CUSTOM }"
              @input="handleSelectDateRange"
            />
            <span class="icon-caret-down" />
          </div>
        </div>
      </div>
      <div class="revenue-chart__body">
        <div class="btn-group">
          <div
            class="btn-tab bullish-green"
            :class="{ active: filter.type === POST_TYPE.BUY }"
            @click="changeRevenueType(POST_TYPE.BUY)"
          >
            {{ $t("home.buy") }}
          </div>
          <div
            class="btn-tab bearish-red"
            :class="{ active: filter.type === POST_TYPE.SELL }"
            @click="changeRevenueType(POST_TYPE.SELL)"
          >
            {{ $t("home.sell") }}
          </div>
        </div>
        <div class="chart-legend">
          <div
            id="revenue-tooltip"
            v-b-tooltip.focus
            tabindex="0"
            class="legend-note"
          >
            <span :class="`${isBuyRevenue ? 'buy' : 'sell'}-revenue chart-color`" />
            {{ revenueLegendText }}
            <b-tooltip target="revenue-tooltip" triggers="hover" placement="top">
              {{ $t('admin.revenue_chart.tooltip.revenue') }}
            </b-tooltip>
          </div>
          <div
            id="price-tooltip"
            v-b-tooltip.focus
            tabindex="0"
            class="legend-note"
          >
            <span class="price chart-color" />
            <b-tooltip target="price-tooltip" triggers="hover" placement="top">
              {{ $t('admin.revenue_chart.tooltip.price') }}
            </b-tooltip>
            {{ $t('admin.revenue_chart.price') }}
          </div>
        </div>
      </div>
      <div v-show="noData" :class="['no-data', { 'error': invalidDateRange }]">
        {{ noDataText }}
      </div>
      <canvas v-show="!noData" id="revenue-chart" :height="300" :width="1290" />
    </div>
  </b-modal>
</template>
<script>
import BigNumber from 'bignumber.js'
import { MODAL } from '@/resources/modal.js'
import Chart from 'chart.js/auto';
import {
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Chart as ChartJs,
  LineController, LineElement, PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { POST_TYPE } from '@/config/constant';
import { RANGE_DATE_TYPE_CHART } from '@/constants/datetime';
import { ADMIN_API } from '@/api/admin';
import dayjs from 'dayjs';
import { mapState } from 'vuex';
import REPORTER_API from '@/api/reporter';

Chart.register(CategoryScale, LinearScale, LineController, BarController, BarElement, Title, Tooltip, Legend, LineElement, PointElement)

export default {
  components: {
    ReportDatePickerCustom: () => import('~/components/desktop/reports/report-datepicker.vue')
  },
  data () {
    return {
      MODAL,
      chartJs: null,
      chartData: null,
      POST_TYPE,
      dateRange: [],
      noData: true,
      loading: false,
      invalidDateRange: false,
      filter: {
        type: POST_TYPE.BUY,
        date_range: null,
        date_type: RANGE_DATE_TYPE_CHART.DAY
      },
      RANGE_DATE_TYPE_CHART
    }
  },
  computed: {
    ...mapState({
      reporterInfo: state => state.reporter.user
    }),
    isBuyRevenue () {
      return this.filter.type === POST_TYPE.BUY
    },
    revenueColor () {
      return this.isBuyRevenue ? '#45B957' : '#FF2E2E'
    },
    dateRangeType () {
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH) {
        return 'month'
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR) {
        return 'year'
      }
      return 'datetime'
    },
    dateRangeFormat () {
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH) {
        return 'MM/YYYY'
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR) {
        return 'YYYY'
      }
      return 'DD/MM/YYYY'
    },
    revenueLegendText () {
      return `${this.$t('admin.revenue_chart.revenue')} ${this.isBuyRevenue ? this.$t('home.buy').toLocaleLowerCase() : this.$t('home.sell').toLocaleLowerCase()}`
    },
    noDataText () {
      return this.loading ? this.$t('admin.revenue_chart.loading') : (
        this.invalidDateRange ? this.$t('admin.revenue_chart.invalid_date_range', this.getMaxDateRangeValue()) : this.$t('admin.revenue_chart.no_data')
      )
    }
  },
  created () {
    this.getDefaultDateRange()
    this.initChartData()
  },
  methods: {
    resetModalData () {
      this.chartJs?.destroy()
      this.chartJs = null
      this.filter.type = POST_TYPE.BUY
      this.getDefaultDateRange()
      this.initChartData()
      this.getRevenueData()
    },
    initializeChart () {
      if (this.chartJs) {
        this.chartJs.data = this.chartData
        this.chartJs.update()
        return
      }
      const revenueScaleText = {
        id: 'revenueText',
        afterDraw (chart, args, options) {
          const { ctx, chartArea: { top } } = chart
          ctx.save()
          ctx.font = 'bold 12px/12px Roboto Condensed'
          ctx.fillText('Doanh thu', 0, top - 25)
          ctx.restore()
        }
      }
      const priceScaleText = {
        id: 'priceText',
        afterDraw (chart, args, options) {
          const { ctx, chartArea: { top, right } } = chart
          ctx.save()
          ctx.font = 'bold 12px/12px Roboto Condensed'
          ctx.fillText('Tỷ giá', right - 5, top - 25)
          ctx.restore()
        }
      }
      const revenueUnitScaleText = {
        id: 'revenueUnitScaleText',
        afterDraw (chart, args, options) {
          const { ctx, chartArea: { top } } = chart
          ctx.save()
          ctx.font = '10px/12px Roboto Condensed'
          ctx.fillText('(VND)', 60, top - 25)
          ctx.restore()
        }
      }
      const priceUnitScaleText = {
        id: 'priceUnitScaleText',
        afterDraw (chart, args, options) {
          const { ctx, chartArea: { top, right } } = chart
          ctx.save()
          ctx.font = '10px/12px Roboto Condensed'
          ctx.fillText('(VND)', right + 30, top - 25)
          ctx.restore()
        }
      }
      const ctx = document.getElementById('revenue-chart');
      ChartJs.defaults.font.family = 'Roboto Condensed';

      this.chartJs = new ChartJs(ctx.getContext('2d'), {
        type: 'line',
        data: this.chartData,
        plugins: [revenueScaleText, priceScaleText, revenueUnitScaleText, priceUnitScaleText],
        options: {
          responsive: false,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 50,
              right: 50,
              left: 50
            }
          },
          plugins: {
            revenueText: {},
            priceText: {},
            legend: {
              display: false
            },
            resizeLegend: {}
          },
          scales: {
            revenue: {
              position: 'left',
              ticks: { beginAtZero: true, color: '#303646' },
              grid: {
                display: true,
                borderDash: [4, 4],
                color: '#E4E4E7',
                drawOnChartArea: true
              }
            },
            price: {
              position: 'right',
              beginAtZero: true,
              ticks: { beginAtZero: true, color: '#303646', min: 0 },
              grid: { display: false }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    },
    async getRevenueData () {
      try {
        this.loading = true
        let url = null
        if (this.reporterInfo) {
          url = REPORTER_API.REVENUE_AND_PRICE_BY_PERIOD
        } else {
          url = ADMIN_API.GET_REVENUE
        }
        const { data } = await this.$axios.$get(url, {
          params: {
            from: dayjs(this.dateRange[0]).startOf(this.filter.date_type).format(),
            to: dayjs(this.dateRange[1]).endOf(this.filter.date_type).format(),
            groupType: this.filter.date_type.toUpperCase(),
            tradeType: this.filter.type
          }
        })
        this.loading = false
        this.noData = !data.items.length
        if (data.items.length) {
          this.convertToDataset(data.items)
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    changeRevenueType (type) {
      if (this.filter.type !== type) {
        this.filter.type = type
        if (!this.invalidDateRange) {
          this.initChartData()
          this.getRevenueData()
        }
      }
    },
    changeFilterDateType (type) {
      if (this.filter.date_type !== type) {
        this.filter.date_type = type
        this.getDefaultDateRange()
        this.getRevenueData()
      }
    },
    getMaxDateRangeValue () {
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH) {
        return { max: 12, unit: this.$t('admin.revenue_chart.filter.month').toLocaleLowerCase() }
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR) {
        return { max: 6, unit: this.$t('admin.revenue_chart.filter.year').toLocaleLowerCase() }
      }
      return { max: 15, unit: this.$t('admin.revenue_chart.filter.day').toLocaleLowerCase() }
    },
    getDefaultDateRange () {
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.DAY) {
        this.dateRange = [
          dayjs().subtract(14, 'days').toDate(),
          dayjs().toDate()
        ]
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH) {
        this.dateRange = [
          dayjs().subtract(11, 'months').toDate(),
          dayjs().toDate()
        ]
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR) {
        this.dateRange = [
          dayjs().subtract(5, 'years').toDate(),
          dayjs().toDate()
        ]
      }
      this.invalidDateRange = false
    },
    initChartData () {
      this.chartData = {
        labels: [],
        datasets: [
          {
            yAxisID: 'price',
            label: 'Tỷ giá',
            data: [],
            backgroundColor: '#007EC5',
            borderColor: '#007EC5',
            order: 0
          },
          {
            yAxisID: 'revenue',
            label: `Doanh thu ${this.isBuyRevenue ? 'mua' : 'bán'}`,
            data: [],
            borderWidth: 1,
            backgroundColor: this.revenueColor,
            borderColor: this.revenueColor,
            type: 'bar',
            order: 1
          }
        ]
      };
    },
    handleSelectDateRange (range) {
      if (
        (this.filter.date_type === RANGE_DATE_TYPE_CHART.DAY && dayjs(range[1]).diff(range[0], 'days') > 14) ||
        (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH && dayjs(range[1]).diff(range[0], 'months') > 11) ||
        (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR && dayjs(range[1]).diff(range[0], 'years') > 5)
      ) {
        this.noData = true
        this.invalidDateRange = true
        return
      }
      this.invalidDateRange = false
      this.dateRange = range
      this.getRevenueData()
    },
    convertToDataset (data) {
      let unit = 'days'
      let format = 'DD/MM'
      let apiFormat = 'YYYY-MM-DD'
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.MONTH) {
        unit = 'months'
        format = 'MM/YYYY'
        apiFormat = 'YYYY-MM'
      }
      if (this.filter.date_type === RANGE_DATE_TYPE_CHART.YEAR) {
        unit = 'years'
        format = 'YYYY'
        apiFormat = 'YYYY'
      }
      this.chartData.labels = []
      this.chartData.datasets[0].data = []
      this.chartData.datasets[1].data = []
      let startDay = dayjs(this.dateRange[0])
      while (dayjs(startDay).diff(this.dateRange[1], unit, true) <= 0) {
        const date = startDay.format(apiFormat)
        const revenue = data.find(e => e.date === date)
        this.chartData.labels.push(startDay.format(format))
        this.chartData.datasets[0].data.push(revenue?.priceAvg || 0)
        this.chartData.datasets[1].data.push(revenue ? new BigNumber(revenue.totalFee).plus(revenue.totalPenaltyFee).toNumber() : 0)
        startDay = startDay.add(1, unit)
      }
      this.initializeChart()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-revenue-chart.scss">
</style>
