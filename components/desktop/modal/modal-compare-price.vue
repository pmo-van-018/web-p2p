<template>
  <b-modal
    :id="modalId"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
    @show="onOpenModal"
    @hidden="resetModalData"
  >
    <div class="compare-price">
      <span class="icon-cancel" @click="$bvModal.hide(modalId)" />
      <div class="compare-price__container">
        <div class="compare-price__inner">
          <div class="compare-price__head">
            <div class="compare-price__left">
              <div class="compare-price__context">
                <div class="compare-price__icon">
                  <img src="/assets/icons/chart-data.svg" alt="icon chart data">
                </div>
                <div class="compare-price__title">{{ $t('price_statistic.title') }}</div>
              </div>
              <div class="compare-price__desc">{{ $t('price_statistic.description') }}</div>
            </div>
            <div class="compare-price__right">
              <div class="compare-price__filter">
                <div class="btn-group">
                  <div
                    class="btn-tab bullish-green"
                    :class="{ active: type === ORDER_TYPE.BUY }"
                    @click="onChangeOrderType(ORDER_TYPE.BUY)"
                  >
                    {{ $t("home.buy") }}
                  </div>
                  <div
                    class="btn-tab bearish-red"
                    :class="{ active: type === ORDER_TYPE.SELL }"
                    @click="onChangeOrderType(ORDER_TYPE.SELL)"
                  >
                    {{ $t("home.sell") }}
                  </div>
                </div>
                <client-only>
                  <date-picker
                    v-model="datePicker"
                    :open="isOpenDatePicker"
                    format="YYYY-MM-DD"
                    type="date"
                    :clearable="false"
                    placeholder=""
                    :disabled="isLoadingPriceStatistics"
                    prefix-class="compare-price-date"
                    :disabled-date="disabledDate"
                    @input="onInputDatePicker"
                    @close="onCloseDatePicker"
                  >
                    <template v-slot:input>
                      <div class="compare-price__date-content" @click="onToggleDatePicker">
                        <span class="compare-price__icon-date icon-calendar" />
                        <span class="compare-price__date-text">{{ formatDate }}</span>
                        <span class="icon-caret-down" />
                      </div>
                    </template>
                  </date-picker>
                </client-only>
              </div>
            </div>
          </div>
        </div>
        <div class="compare-price__inner">
          <div v-if="isLoadingPriceStatistics" class="compare-price__waiting">
            <loader />
            <span class="compare-price__waiting-text">{{ $t('common.loading') }}</span>
          </div>
          <div v-if="!isLoadingPriceStatistics && !priceStatistics.length" class="compare-price__waiting">
            <span class="compare-price__waiting-text">{{ $t('common.no_data') }}</span>
          </div>
          <div v-show="!isLoadingPriceStatistics && priceStatistics.length" class="compare-price__chart-wrapper">
            <canvas id="compareChartPrice" :height="300" :width="1290" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
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
import zoomPlugin from 'chartjs-plugin-zoom';
import dayjs from 'dayjs';
import map from 'lodash/map';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/vi';
import BigNumber from 'bignumber.js';
import MERCHANT_ORDER_API from '~/api/merchant-order';
import { ORDER_TYPE } from '~/resources/order-type';
import { DATE_TIME_FORMAT } from '~/config/constant';
import { MODAL } from '~/resources/modal';

ChartJS.register(CategoryScale, LinearScale, LineController, BarController, BarElement, Title, Tooltip, Legend, LineElement, PointElement, zoomPlugin)

export default {
  components: {
    DatePicker,
    Loader: () => import('~/components/common/loader.vue')
  },
  data () {
    return {
      chartJs: null,
      datePicker: new Date(),
      isOpenDatePicker: false,
      priceStatistics: [],
      ORDER_TYPE,
      type: ORDER_TYPE.BUY,
      modalId: MODAL.COMPARE_PRICE_STATISTIC,
      isLoadingPriceStatistics: false
    }
  },
  computed: {
    labelChartJs () {
      return [0, ...map(this.priceStatistics, 'refId')]
    },
    priceStatisticsDuplicateFirstItems () {
      if (!this.priceStatistics.length) {
        return []
      }
      return [this.priceStatistics[0], ...this.priceStatistics]
    },
    dataLinePrice () {
      return map(this.priceStatisticsDuplicateFirstItems, 'price')
    },
    dataBenchmarkPriceAtCreated () {
      return map(this.priceStatisticsDuplicateFirstItems, 'benchmarkPriceAtCreated')
    },
    dataBenchmarkPriceAtSent () {
      return map(this.priceStatisticsDuplicateFirstItems, 'benchmarkPriceAtSent')
    },
    startDate () {
      if (!this.datePicker) {
        return ''
      }
      return dayjs(this.datePicker).startOf('days').format()
    },
    endDate () {
      if (!this.datePicker) {
        return ''
      }
      return dayjs(this.datePicker).endOf('days').format()
    },
    formatDate () {
      return dayjs(this.datePicker).format(DATE_TIME_FORMAT.DATE_VIEW);
    },
    colorPriceWithOrderType () {
      return this.type === ORDER_TYPE.BUY ? '#45B957' : '#FF2E2E'
    }
  },
  methods: {
    async onChangeOrderType (type) {
      if (this.isLoadingPriceStatistics) {
        return;
      }
      this.type = type
      this.priceStatistics = []
      await this.onGetPriceStatistics()
      this.updateDataChart()
    },
    async onInputDatePicker (day) {
      this.datePicker = day
      this.priceStatistics = []
      await this.onGetPriceStatistics()
      this.updateDataChart()
    },
    updateDataChart () {
      if (this.chartJs) {
        this.chartJs.data.labels = this.labelChartJs
        this.chartJs.data.datasets[0].data = this.dataLinePrice
        this.chartJs.data.datasets[0].borderColor = this.colorPriceWithOrderType
        this.chartJs.data.datasets[0].backgroundColor = this.colorPriceWithOrderType
        this.chartJs.data.datasets[1].data = this.dataBenchmarkPriceAtCreated
        this.chartJs.data.datasets[2].data = this.dataBenchmarkPriceAtSent
        this.chartJs.update()
      }
    },
    onToggleDatePicker () {
      this.isOpenDatePicker = !this.isOpenDatePicker;
    },
    onCloseDatePicker () {
      this.isOpenDatePicker = false
    },
    disabledDate (date, currentValue) {
      const currentDate = dayjs(new Date()).toDate()
      return date > currentDate
    },
    resetModalData () {
      if (this.chartJs) {
        this.chartJs?.destroy()
        this.chartJs = null
      }
      this.type = ORDER_TYPE.BUY
      this.datePicker = dayjs(new Date()).format()
    },
    async onGetPriceStatistics () {
      try {
        this.isLoadingPriceStatistics = true
        const { data } = await this.$axios.$get(MERCHANT_ORDER_API.COMPARE_PRICE_STATISTIC, {
          params: {
            type: this.type,
            from: this.startDate,
            to: this.endDate
          }
        })
        this.priceStatistics = data?.items || []
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoadingPriceStatistics = false
      }
    },
    async onOpenModal () {
      if (this.isLoadingPriceStatistics) {
        return;
      }
      await this.onGetPriceStatistics()
      await this.initializeChart()
    },
    async initializeChart () {
      if (this.chartJs) {
        return
      }
      const myChart = document.getElementById('compareChartPrice');
      const self = this
      ChartJS.defaults.font.family = 'Roboto Condensed';
      this.chartJs = await new ChartJS(myChart, {
        type: 'line',
        plugins: [],
        data: {
          labels: this.labelChartJs,
          datasets: [
            {
              label: self.$t('price_statistic.price_order'),
              data: this.dataLinePrice,
              borderColor: this.colorPriceWithOrderType,
              backgroundColor: this.colorPriceWithOrderType,
              tension: 0.4,
              pointRadius (data) {
                return data.dataIndex === 0 ? 0 : 3
              },
              hitRadius (data) {
                return data.dataIndex === 0 ? 0 : 3
              },
              pointStyle (data) {
                return data.dataIndex === 0 ? false : 'circle'
              }
            },
            {
              label: self.$t('price_statistic.benchmark_created'),
              data: this.dataBenchmarkPriceAtCreated,
              borderColor: '#009EF6',
              backgroundColor: '#009EF6',
              tension: 0.4,
              pointRadius: 0,
              hitRadius: 0,
              fill: false,
              pointStyle: false
            },
            {
              label: self.$t('price_statistic.benchmark_sent'),
              data: this.dataBenchmarkPriceAtSent,
              borderColor: '#712FFF',
              backgroundColor: '#712FFF',
              tension: 0.4,
              pointRadius: 0,
              hitRadius: 0,
              fill: false,
              pointStyle: false
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: true,
                borderDash: [4, 4],
                color: '#E4E4E7'
              },
              title: {
                color: '#303646',
                display: true,
                text: 'Giao dịch',
                font: {
                  size: 12,
                  family: 'Roboto Condensed',
                  weight: 400
                }
              }
            },
            y: {
              grid: {
                display: true,
                borderDash: [4, 4],
                color: '#E4E4E7'
              },
              title: {
                color: '#303646',
                display: true,
                text: 'Tỷ giá (VND)',
                font: {
                  size: 12,
                  family: 'Roboto Condensed',
                  weight: 400
                }
              }
            }
          },
          plugins: {
            legend: { display: true, position: 'top', align: 'center' },
            zoom: {
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: 'x'
              }
            },
            tooltip: {
              enabled: false,
              position: 'average',
              callbacks: {
                usePointStyle: true,
                title () {},
                labelColor (context) {
                  return {
                    borderColor: self.colorPriceWithOrderType,
                    backgroundColor: self.colorPriceWithOrderType,
                    borderWidth: 2,
                    borderDash: [2, 2],
                    borderRadius: 2
                  };
                },
                label: (tooltipItem, d) => {
                  return `Mã giao dịch: ${tooltipItem.label}`;
                },
                afterBody (data) {
                  const dataIndex = data?.[0]?.dataIndex ?? null
                  return self.getDifferencePercentAndPrice(dataIndex)
                }
              },
              external: (context) => {
                const { chart, tooltip } = context;
                const getOrCreateTooltip = (chart) => {
                  let tooltipEl = chart.canvas.parentNode.querySelector('div');

                  if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.style.background = '#090B0E';
                    tooltipEl.style.borderRadius = '8px';
                    tooltipEl.style.width = '330px';
                    tooltipEl.style.padding = '8px';
                    tooltipEl.style.color = '#F3F4F7';
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.pointerEvents = 'none';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.transform = 'translate(-50%, 0)';
                    tooltipEl.style.transition = 'all .1s ease';

                    const table = document.createElement('table');
                    table.style.margin = '0px';

                    tooltipEl.appendChild(table);
                    chart.canvas.parentNode.appendChild(tooltipEl);
                  }

                  return tooltipEl;
                };
                const tooltipEl = getOrCreateTooltip(chart);
                if (tooltip.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                if (tooltip.body) {
                  const titleLines = tooltip.title || [];
                  const bodyLines = tooltip.body.map(b => b.lines);
                  const tableHead = document.createElement('thead');

                  titleLines.forEach((title) => {
                    const tr = document.createElement('tr');
                    tr.style.borderWidth = 0;

                    const th = document.createElement('th');
                    th.style.borderWidth = 0;
                    const text = document.createTextNode(title);

                    th.appendChild(text);
                    tr.appendChild(th);
                    tableHead.appendChild(tr);
                  });

                  const tableBody = document.createElement('tbody');
                  bodyLines.forEach((body, i) => {
                    const colors = tooltip.labelColors[i];

                    const span = document.createElement('span');
                    span.style.background = colors.backgroundColor;
                    span.style.borderColor = colors.borderColor;
                    span.style.borderWidth = '2px';
                    span.style.marginRight = '10px';
                    span.style.height = '8px';
                    span.style.width = '8px';
                    span.style.display = 'inline-block';

                    const tr = document.createElement('tr');
                    tr.style.backgroundColor = 'inherit';
                    tr.style.borderWidth = 0;

                    const td = document.createElement('td');
                    td.style.borderWidth = 0;
                    td.style.fontSize = '12px';
                    td.style.lineHeight = '18px';
                    td.style.fontWeight = '600'
                    td.style.fontFamily = 'Roboto Condensed'

                    const text = document.createTextNode(body);
                    td.appendChild(span);
                    td.appendChild(text);
                    tr.appendChild(td);
                    tableBody.appendChild(tr);
                  });
                  tooltip.afterBody.forEach((body, i) => {
                    const tr = document.createElement('tr');
                    tr.style.backgroundColor = 'inherit';
                    tr.style.borderWidth = 0;

                    const td = document.createElement('td');
                    td.style.borderWidth = 0;
                    td.style.fontSize = '12px';
                    td.style.lineHeight = '18px';
                    td.style.fontWeight = '400'
                    td.style.fontFamily = 'Roboto Condensed'

                    const text = document.createTextNode(body?.item);
                    td.appendChild(text);
                    if (body?.icon) {
                      const span = document.createElement('span');
                      span.className = body.icon
                      span.style.marginLeft = '7px';
                      span.style.display = 'inline-block';
                      td.appendChild(span)
                    }
                    tr.appendChild(td);
                    tableBody.appendChild(tr);
                  })

                  const tableRoot = tooltipEl.querySelector('table');

                  // Remove old children
                  while (tableRoot.firstChild) {
                    tableRoot.firstChild.remove();
                  }
                  tableRoot.appendChild(tableHead);
                  tableRoot.appendChild(tableBody);
                }

                const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                tooltipEl.style.font = tooltip.options.bodyFont.string;
                tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
              },
              backgroundColor: '#090B0E',
              borderColor: '#090B0E',
              borderWidth: 1,
              titleFontColor: '#F3F4F7',
              titleFontStyle: 'medium',
              displayColors: false,
              bodyFontColor: '#F3F4F7',
              bodyFont: 'bold 12px/18px Roboto Condensed',
              bodySpacing: 4
            }
          }
        }
      })
    },
    getDifferencePercentAndPrice (dataIndex) {
      const priceStatistics = this.priceStatisticsDuplicateFirstItems[dataIndex] || null
      if (!priceStatistics) {
        return [
          { item: `${this.$t('price_statistic.price_order')}: --`, icon: null },
          { item: `${this.$t('price_statistic.benchmark_created')}: --`, icon: null },
          { item: `${this.$t('price_statistic.benchmark_sent')}: --`, icon: null }
        ]
      }
      const { price, benchmarkPriceAtCreated, benchmarkPriceAtSent } = priceStatistics
      const calculatePercent = (benchmarkPrice) => {
        const bigPrice = new BigNumber(price);
        const bigBenchmarkPrice = new BigNumber(benchmarkPrice);
        if (bigBenchmarkPrice.isEqualTo(0)) {
          return 0
        }
        const percent = bigBenchmarkPrice.minus(bigPrice).dividedBy(bigPrice).multipliedBy(100).toFixed(2)
        return percent.endsWith('.00') ? percent.slice(0, -3) : percent
      };
      const getIconPrice = (value) => {
        if (Number(value) === 0) { return null }
        return Number(value) > 0 ? 'icon-line-up' : 'icon-line-down'
      }
      const percentBenchmarkPriceAtCreated = calculatePercent(benchmarkPriceAtCreated)
      const percentBenchmarkPriceAtSent = calculatePercent(benchmarkPriceAtSent)

      const priceNumber = this.$options.filters.formatCrypto(price, 0, 'ceil')
      const benchmarkPriceAtCreatedFormatted = this.$options.filters.formatCrypto(benchmarkPriceAtCreated, 0, 'ceil')
      const benchmarkPriceAtSentFormatted = this.$options.filters.formatCrypto(benchmarkPriceAtSent, 0, 'ceil')

      const getTextBenchmarkTooltip = (text, benchmarkFormatted, percent) => {
        if (Number(benchmarkFormatted) === 0) {
          return `${text}: --`
        }
        return Number(percentBenchmarkPriceAtCreated) !== 0
          ? `${text}: đ${benchmarkFormatted} (${percent}%)`
          : `${text}: đ${benchmarkFormatted}`
      };
      return [
        {
          item: priceNumber ? `${this.$t('price_statistic.price_order')}: đ${priceNumber}` : `${this.$t('price_statistic.price_order')}: --`,
          icon: null
        },
        {
          item: getTextBenchmarkTooltip(this.$t('price_statistic.benchmark_created'), benchmarkPriceAtCreatedFormatted, percentBenchmarkPriceAtCreated),
          icon: getIconPrice(percentBenchmarkPriceAtCreated)
        },
        {
          item: getTextBenchmarkTooltip(this.$t('price_statistic.benchmark_sent'), benchmarkPriceAtSentFormatted, percentBenchmarkPriceAtSent),
          icon: getIconPrice(percentBenchmarkPriceAtSent)
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-compare-price.scss">
</style>
<style lang="scss">
$default-color: $grey-900;
$primary-color: $main-600;
$namespace: 'compare-price-date';
@import '~vue2-datepicker/scss/index.scss';
button {
  min-width: auto;
}
.compare-price-date-datepicker {
  width: auto;
}
.compare-price-date-icon-calendar {
  display: none;
}
</style>
