<template>
  <date-picker
    v-model="value"
    :type="type"
    placeholder="Select datetime range"
    range
    :clearable="false"
    :open="isOpenDatePicker"
    :show-time-panel="false"
    :disabled-date="disabledDate"
    :append-to-body="false"
    :popup-style="{ width: '100%' }"
    @open="$emit('open')"
    @close="onCloseDatePicker"
    @change="onCloseDatePicker"
  >
    <template v-slot:input>
      <div class="datepicker-custom" @click="onToggleDatePicker">
        <span class="datepicker-custom__icon icon-calendar" />
        <span class="datepicker-custom__value">{{ startDate }} - {{ endDate }}</span>
      </div>
    </template>
    <template v-slot:icon-calendar>
      <span class="datepicker-custom__icon-arrow icon-arrow" />
    </template>
  </date-picker>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/vi';
import dayjs from 'dayjs'
export default {
  components: {
    DatePicker
  },
  model: {
    prop: 'dateRange',
    event: 'input'
  },
  props: {
    dateRange: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'datetime'
    },
    format: {
      type: String,
      default: 'DD.MM.YYYY'
    }
  },
  data () {
    return {
      isOpenDatePicker: false
    }
  },
  computed: {
    startDate () {
      return dayjs(this.dateRange[0]).format(this.format)
    },
    endDate () {
      return dayjs(this.dateRange[1]).format(this.format)
    },
    value: {
      get () {
        return this.dateRange
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    disabledDate (date, currentValue) {
      const dateAfter = dayjs(currentValue[0]).subtract(12, 'month').toDate()
      return date > new Date() || (date < dateAfter && this.type === 'datetime')
    },
    onToggleDatePicker () {
      this.isOpenDatePicker = !this.isOpenDatePicker;
    },
    onCloseDatePicker () {
      this.isOpenDatePicker = false
    }
  }
}
</script>
<style lang="scss" src="static/assets/scss/components/desktop/reports/report-datepicker.scss">
</style>
