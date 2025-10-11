<template>
  <div class="trading-period">
    <div class="trading-period__container">
      <div class="trading-period__head">
        <div class="d-flex justify-content-between">
          <div class="trading-period__inner">
            <img src="/assets/icons/dashboard/doughnut-chart.svg" alt="chart" class="trading-period__chart-icon">
            <div class="trading-period__title">{{ $t('overview.doughnut_chart.title') }}</div>
          </div>
          <div class="trading-period__date">
            <client-only>
              <date-picker
                v-model="datePicker"
                :open="isOpenDatePicker"
                format="YYYY-MM-DD"
                type="date"
                :clearable="false"
                placeholder=""
                prefix-class="trading-date"
                :disabled-date="disabledDate"
                @input="onInputDatePicker"
                @close="onCloseDatePicker"
              >
                <template v-slot:input>
                  <span class="trading-period__icon icon-calendar" @click="onToggleDatePicker" />
                </template>
              </date-picker>
            </client-only>
          </div>
        </div>
        <p class="trading-period__text">{{ datePickerSelectedFormatted }}</p>
      </div>
      <div class="trading-period__body">
        <doughnut-chart
          :datasets="datasetsTradingPeriods"
          :labels="labels"
          :items="items"
        />
      </div>
      <div class="trading-period__footer">
        <div class="trading-content">
          <div class="trading-content__container">
            <div class="trading-content__title">{{ $t('overview.doughnut_chart.content') }}</div>
            <div class="trading-content__body">
              <div class="trading-content__inner">
                <div v-for="(item, index) in completedTradingsPeriodMapped" :key="index" class="trading-content__area">
                  <div class="trading-content__content">
                    <div class="trading-content__box" :style="{backgroundColor: item.colorValue }" />
                    <div class="trading-content__text">{{ item.completedGroupHour }}</div>
                  </div>
                  <div class="trading-content__value">{{ item.percent }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/vi';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import map from 'lodash/map';
import { formatPercentage } from '@/helper';
import { DATE_TIME_FORMAT } from '@/config/constant';

export default {
  components: {
    DoughnutChart: () => import('~/components/common/doughnut-chart/index.vue'),
    DatePicker
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      datePicker: dayjs(new Date()).subtract(1, 'day').format(),
      isOpenDatePicker: false,
      initCompletedTradings: [
        {
          completedGroupHour: '0-4h',
          totalPrice: null,
          colorValue: '#048686'
        },
        {
          completedGroupHour: '4-8h',
          totalPrice: null,
          colorValue: '#2FB8B8'
        },
        {
          completedGroupHour: '8-12h',
          totalPrice: null,
          colorValue: '#97E4E4'
        },
        {
          completedGroupHour: '12-16h',
          totalPrice: null,
          colorValue: '#FA5F07'
        },
        {
          completedGroupHour: '16-20h',
          totalPrice: null,
          colorValue: '#FB7F39'
        },
        {
          completedGroupHour: '20-24h',
          totalPrice: null,
          colorValue: '#FECFB5'
        }
      ]
    }
  },
  computed: {
    sumTotalPrice () {
      return BigNumber.sum.apply(null, this.totalPriceMapped).toNumber()
    },
    datePickerSelectedFormatted () {
      return dayjs(this.datePicker).format(DATE_TIME_FORMAT.DATE_VIEW)
    },
    completedTradingsPeriodMapped () {
      if (!this.items.length) {
        return this.initCompletedTradings.map(item => ({ ...item, percent: '--' }))
      }
      return this.initCompletedTradings.map((trading) => {
        const itemTradingExist = this.items.find(item => item.completedGroupHour === trading.completedGroupHour)
        const completedGroupHour = trading.completedGroupHour.split('-').join(' - ')

        if (itemTradingExist) {
          return {
            ...trading,
            completedGroupHour,
            totalPrice: itemTradingExist.totalPrice,
            percent: formatPercentage(itemTradingExist.totalPrice, this.sumTotalPrice) + '%'
          }
        }
        return {
          ...trading,
          completedGroupHour,
          percent: '--'
        }
      })
    },
    totalPriceMapped () {
      return map(this.items, 'totalPrice')
    },
    datasetsTradingPeriods () {
      if (!this.items.length) {
        return [
          {
            backgroundColor: ['#F3F4F7', '#F8F9FA', '#E8E9EF', '#F3F4F7', '#F8F9FA', '#E8E9EF'],
            data: [100, 200, 100, 100, 100, 200],
            total: 0
          }
        ]
      }
      return [{
        backgroundColor: this.filterHasTotalPriceItems.map(item => item.colorValue),
        data: this.filterHasTotalPriceItems.map(item => item.totalPrice),
        borderWidth: [0, 1, 1, 0],
        total: this.sumTotalPrice
      }]
    },
    filterHasTotalPriceItems () {
      return this.completedTradingsPeriodMapped.filter(item => item.totalPrice)
    },
    labels () {
      return this.filterHasTotalPriceItems.map(item => item.completedGroupHour)
    }
  },
  methods: {
    onInputDatePicker (day) {
      this.$emit('input', day)
    },
    onToggleDatePicker () {
      this.isOpenDatePicker = !this.isOpenDatePicker;
    },
    onCloseDatePicker () {
      this.isOpenDatePicker = false
    },
    disabledDate (date, currentValue) {
      const yesterday = dayjs(new Date()).subtract(1, 'day').toDate()
      return date > yesterday
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/dashboard/components/trading-period/index.scss">
</style>
<style lang="scss">
$default-color: $grey-900;
$primary-color: $main-600;
$namespace: 'trading-date';
@import '~vue2-datepicker/scss/index.scss';
button {
  min-width: auto;
}
.trading-date-datepicker {
  width: auto;
}
.trading-date-icon-calendar {
  display: none;
}
</style>
