<template>
  <section>
    <div class="calendar-custom">
      <div v-if="isVisibleHeader" class="calendar-custom__head">
        <div class="calendar-custom__inner">
          <div class="calendar-custom__cancel" @click="onCancelDatePicker">{{ $t('action.cancel') }}</div>
          <h2 class="calendar-custom__title">{{ label.selectDate }}</h2>
          <div class="calendar-custom__confirm" @click="onConfirmDatePicker">{{ $t('action.confirm') }}</div>
        </div>
      </div>
      <div v-show="!isSingleDateTimePicker" class="calendar-custom__body">
        <div class="calendar-custom__selected">
          <b-form-radio-group v-model="datePickerSelected" name="selectedType">
            <radio-button value="custom">{{ $t('date_picker.custom') }}</radio-button>
            <radio-button value="month">{{ $t('date_picker.month') }}</radio-button>
            <radio-button value="quarter">{{ $t('date_picker.quarter') }}</radio-button>
          </b-form-radio-group>
        </div>

        <div class="calendar-custom__date-range">
          <div v-if="datePickerSelected === 'custom'" class="date-range">
            <div v-if="isShowNote" class="date-range__note">{{ $t('date_picker.note') }}</div>
            <div class="date-range__active-date">
              <div class="date-range__from">
                <div class="date-time-active" :class="{ active: activeFromDate }" @click="onActiveFromDatePicker">
                  <div class="date-time-active__inner">
                    {{ fromDateText }}
                  </div>
                </div>
              </div>
              <div class="date-range__text">{{ $t('date_picker.to') }}</div>
              <div class="date-range__to">
                <div class="date-time-active" :class="{ active: activeToDate }" @click="onActiveToDatePicker">
                  <div class="date-time-active__inner">
                    {{ toDateText }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="date-range">
            <div class="date-time-active active">
              <div class="date-time-active__inner">
                {{ dateTimeMonthOrQuarterText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="picker-group">
      <van-datetime-picker
        :key="keyDateTime"
        v-model="currentDate"
        :type="typeDatePicker"
        :show-toolbar="false"
        :columns-order="columnsOrderFormatter"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatterDatePickerSelected"
        :filter="filterDatePicker"
      />
    </div>
  </section>
</template>
<script>
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import take from 'lodash/take'
import chunk from 'lodash/chunk'
import VanDatetimePicker from 'vant/lib/datetime-picker'
import 'vant/lib/datetime-picker/style'

dayjs.extend(quarterOfYear)

export default {
  components: {
    VanDatetimePicker,
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue')
  },
  props: {
    isSingleDateTimePicker: {
      type: Boolean,
      default: false
    },
    dateRange: {
      type: Object,
      default: () => ({
        startDate: null,
        endDate: null
      })
    },
    label: {
      type: Object,
      default: () => ({
        selectDate: ''
      })
    },
    isOpenDatePicker: {
      type: Boolean,
      default: true
    },
    isVisibleHeader: {
      type: Boolean,
      default: true
    },
    isWatchChangeCurrent: {
      type: Boolean,
      default: false
    },
    isShowNote: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      datePickerSelected: 'custom',
      minDate: dayjs(new Date(2021, 0, 1)).toDate(),
      maxDate: dayjs().toDate(),
      startCustomDate: null,
      endCustomDate: null,
      activeFromDate: true,
      activeToDate: false,
      currentDate: null,
      singleDate: null, // for month and quarter
      keyDateTime: 'from_date'
    };
  },
  computed: {
    fromDateText () {
      return dayjs(this.startCustomDate).format('DD - MM - YYYY')
    },
    toDateText () {
      return dayjs(this.endCustomDate).format('DD - MM - YYYY')
    },
    dateTimeMonthText () {
      return `${this.$t('date_picker.month')} ${dayjs(this.singleDate).format('M - YYYY')}`
    },
    dateTimeQuarterText () {
      const dateFormat = dayjs(this.currentDate).format()
      const quarterStart = dayjs(dateFormat).startOf('quarter').format('TM')
      const quarterEnd = dayjs(dateFormat).endOf('quarter').format('TM')
      const quarterNumber = dayjs(this.currentDate).quarter()
      const yearDate = dayjs(this.currentDate).format('YYYY')
      return `${this.$t('date_picker.quarter')} ${quarterNumber} (${quarterStart}-${quarterEnd}) - ${yearDate}`
    },
    dateTimeMonthOrQuarterText () {
      return this.datePickerSelected === 'month' ? this.dateTimeMonthText : this.dateTimeQuarterText
    },
    isCustomDatePicker () {
      return this.datePickerSelected === 'custom'
    },
    columnsOrderFormatter () {
      if (this.isCustomDatePicker) {
        return ['day', 'month', 'year']
      }
      return ['month', 'year']
    },
    typeDatePicker () {
      if (this.isCustomDatePicker) {
        return 'date'
      }
      return 'year-month'
    }
  },
  watch: {
    isOpenDatePicker: {
      handler (value) {
        if (value) {
          this.onShowModalDatePicker()
        }
      },
      immediate: true
    },
    currentDate: {
      handler (date) {
        if (this.isCustomDatePicker) {
          if (this.activeFromDate) {
            this.startCustomDate = date
          }
          if (this.activeToDate) {
            this.endCustomDate = date
          }
        } else {
          this.singleDate = date
        }
        if (this.isWatchChangeCurrent) {
          this.$emit('on-change', {
            startDate: this.startCustomDate,
            endDate: this.endCustomDate
          })
        }
      }
    },
    datePickerSelected: {
      handler () {
        if (this.isCustomDatePicker) {
          this.setDatePickerCustomDefault()
        } else {
          this.singleDate = this.currentDate = dayjs().toDate()
          this.formatDatPickerWithUnit(this.singleDate, this.datePickerSelected)
        }
      }
    }
  },
  methods: {
    onActiveFromDatePicker () {
      if (!this.activeFromDate) {
        this.activeFromDate = true
        this.activeToDate = false
        this.keyDateTime = 'from_date'
        this.currentDate = this.startCustomDate
        if (this.startCustomDate) {
          this.minDate = dayjs(new Date(2021, 0, 1)).toDate()
          this.maxDate = this.endCustomDate
        }
      }
    },
    onActiveToDatePicker () {
      if (!this.activeToDate) {
        this.activeFromDate = false
        this.activeToDate = true
        this.keyDateTime = 'to_date'
        this.currentDate = this.endCustomDate
        if (this.startCustomDate) {
          this.minDate = this.startCustomDate
          this.maxDate = dayjs().toDate()
        }
      }
    },
    onShowModalDatePicker () {
      this.datePickerSelected = 'custom'
      this.onActiveFromDatePicker()
      this.setDatePickerCustomDefault()
    },
    setDatePickerCustomDefault () {
      if (this.dateRange?.startDate && this.dateRange?.endDate) {
        this.startCustomDate = dayjs(this.dateRange?.startDate).toDate()
        this.endCustomDate = dayjs(this.dateRange?.endDate).toDate()
        this.currentDate = this.startCustomDate
      } else {
        this.startCustomDate = dayjs().subtract(3, 'month').toDate()
        this.endCustomDate = dayjs().toDate()
        this.currentDate = this.startCustomDate
      }
    },
    onConfirmDatePicker () {
      if (!this.isCustomDatePicker) {
        this.formatDatPickerWithUnit(this.currentDate, this.datePickerSelected)
      }
      this.$emit('on-confirm', {
        startDate: this.startCustomDate,
        endDate: this.endCustomDate
      })
    },
    onCancelDatePicker () {
      this.$emit('on-close')
    },
    formatterDatePickerSelected (type, val) {
      if (this.datePickerSelected === 'month') {
        if (type === 'year') {
          return `${val}`
        }
        if (type === 'month') {
          return `${this.$t('date_picker.month')} ${val}`
        }
        return val
      }
      if (this.datePickerSelected === 'quarter') {
        if (type === 'year') {
          return `${val}`
        }
        if (type === 'month') {
          const quarterMonth = ['T1-T3', 'T4-T6', 'T7-T9', 'T10-T12']
          const quarter = Math.ceil(val / 3)
          return `${this.$t('date_picker.quarter')} ${quarter} (${quarterMonth[quarter - 1]})`
        }
        return val
      }
      return val
    },
    formatDatPickerWithUnit (date, unit = 'month') {
      const dateFormat = dayjs(date).format()
      const quarterStart = dayjs(dateFormat).startOf(unit).toDate()
      const quarterEnd = dayjs(dateFormat).endOf(unit)
      this.startCustomDate = quarterStart
      this.endCustomDate = dayjs(quarterEnd).isAfter(dayjs()) ? dayjs().toDate() : quarterEnd
      this.maxDate = dayjs().toDate()
      this.keyDateTime = unit
    },
    filterDatePicker (type, options) {
      if (this.datePickerSelected === 'quarter') {
        if (type === 'month') {
          const monthOfQuarters = ['03', '06', '09', '12']
          if (options.length < 11) { // nhỏ hơn tháng 12 thì hiển thị theo quý của năm đó.
            return take(monthOfQuarters, dayjs().quarter())
          }
          return take(monthOfQuarters, chunk(options).length)
        }
      }
      return options
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/modal/date-picker/index.scss">
</style>
