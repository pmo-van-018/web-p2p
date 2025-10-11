<template>
  <div class="date-picker-custom">
    <date-range-picker
      ref="picker"
      v-model="value"
      opens="center"
      :max-date="enableFutureDate ? null : new Date()"
      auto-apply
      :date-format="dateFormat"
      :ranges="false"
      :locale-data="{ firstDay: 1, format: 'dd/mm/yyyy' }"
      @update="updateValues"
    >
      <template v-slot:input="picker">
        <div
          :class="['date-picker-custom__date', {
            'date-picker-custom__date--grey': !picker.startDate && !picker.endDate
          }]"
        >
          {{ startDate(picker.startDate) }}  -  {{ endDate(picker.endDate) }}
        </div>
      </template>
    </date-range-picker>
  </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
import dayjs from 'dayjs'

export default {
  components: {
    DateRangePicker
  },
  model: {
    prop: 'dateRange',
    event: 'input'
  },
  props: {
    dateRange: {
      type: Object,
      default: () => {}
    },
    placeholderStartDate: {
      type: String,
      default: ''
    },
    placeholderEndDate: {
      type: String,
      default: ''
    },
    enableFutureDate: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'DD/MM/YYYY'
    }
  },
  computed: {
    value: {
      get () {
        return this.dateRange
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    placeholderStart () {
      return this.placeholderStartDate || this.$t('placeholder.date_picker.start_date')
    },
    placeholderEnd () {
      return this.placeholderEndDate || this.$t('placeholder.date_picker.end_date')
    }
  },
  methods: {
    updateValues (value) {
      this.$emit('change', value)
    },
    dateFormat (classes, date) {
      if (!classes.disabled) {
        classes.disabled = (date.getTime() - 86400000) > new Date()
      }
      return classes
    },
    startDate (value) {
      if (!value) {
        return this.placeholderStart
      }
      return dayjs(value).format(this.format)
    },
    endDate (value) {
      if (!value) {
        return this.placeholderEnd
      }
      return dayjs(value).format(this.format)
    }
  }
};
</script>
<style lang="scss">
@import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
</style>
<style lang="scss" scoped src="static/assets/scss/components/common/date-picker-custom.scss" />
