<template>
  <b-dropdown toggle-class="text-decoration-none" no-caret>
    <template #button-content>
      <report-action
        :item="quarterActive"
        :active="active"
        @click="$emit('click', $event)"
      />
    </template>
    <div class="quarter">
      <div class="quarter__head">
        <div class="quarter__left" @click="onSetPrevYear">
          <span class="quarter__icon icon-chevron-right1" />
        </div>
        <div class="quarter__content">{{ $t('date_picker.quarter') }} {{ selectedQuarter }}, {{ year }}</div>
        <div class="quarter__right" @click="onSetNextYear">
          <span class="quarter__icon icon-chevron-right" />
        </div>
      </div>
      <div class="quarter__list">
        <b-dropdown-item
          v-for="option in formatDropdownOptions"
          :key="option.value"
          class="quarter__item"
          :class="{
            'quarter__item--disabled': isDisabled(option.value),
            'quarter__item--selected': isSelected(option.value)
          }"
          @click="onSelectQuarter(option.value)"
        >
          {{ $t('date_picker.quarter') }} {{ option.value }}
        </b-dropdown-item>
      </div>
    </div>
  </b-dropdown>
</template>
<script>
import { RANGE_DATE_TYPE } from '@/constants/datetime'

export default {
  components: {
    ReportAction: () => import('~/components/desktop/reports/report-action.vue')
  },
  props: {
    dropdownOptions: {
      type: Array,
      default: () => ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4']
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    minDate: {
      type: [String, Date],
      default: ''
    },
    maxDate: {
      type: [String, Date],
      default: ''
    },
    format: {
      type: Function,
      default: (year, quarter, date) => {
        return `Quý ${quarter} (${year})`
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedQuarter: '',
      quarterContentActive: {
        title: this.$t('date_picker.quarter'),
        key: RANGE_DATE_TYPE.QUARTER
      },
      formatValue: '',
      selected: false,
      year: new Date().getFullYear(),
      selectedYear: new Date().getFullYear()
    }
  },
  computed: {
    formatDropdownOptions () {
      return this.dropdownOptions.map((item, index) => ({
        label: item,
        value: index + 1
      }))
    },
    quarterActive () {
      return this.selected && this.active ? {
        title: `${this.$t('date_picker.quarter')} ${this.selectedQuarter}, ${this.year}`,
        key: RANGE_DATE_TYPE.QUARTER
      } : this.quarterContentActive
    }
  },
  watch: {
    active () {
      if (this.active) {
        this.onSelectQuarter(this.getQuarter(new Date()))
      }
    }
  },
  mounted () {
    if (this.defaultValue) {
      this.year = this.getYear(this.defaultValue)
      this.setDate(this.getQuarter(this.defaultValue))
    }
  },
  methods: {
    isSelected (quarter) {
      return this.year === this.selectedYear && quarter === this.selectedQuarter
    },
    onSelectQuarter (value) {
      !this.isDisabled(value) && this.setDate(value)
      this.selected = true
    },
    autoParseDate (...agu) {
      if (agu.length === 1 && typeof agu[0] === 'string') {
        const agu1 = agu[0].replace(/-/g, '/')
        return new Date(agu1)
      } else {
        return new Date(...agu)
      }
    },
    getYear (date) {
      return typeof date === 'string'
        ? this.autoParseDate(date).getFullYear()
        : date.getFullYear()
    },
    getQuarter (date) {
      const _date = typeof date === 'string'
        ? this.autoParseDate(date)
        : date
      return Math.ceil((_date.getMonth() + 1) / 3)
    },
    setDate (quarter) {
      const startDate = this.autoParseDate(this.year, (quarter - 1) * 3)
      let endDate = this.autoParseDate(
        startDate.getFullYear(),
        startDate.getMonth() + 3,
        startDate.getDate() - 1
      )
      if (new Date() < endDate) {
        endDate = this.autoParseDate(new Date())
      }
      this.selectedYear = this.year
      this.selectedQuarter = quarter
      this.transformValue(quarter)
      this.$emit('on-done', [startDate, endDate])
    },
    transformValue (quarter) {
      this.formatValue = this.format(this.year, quarter)
    },
    onSetPrevYear () {
      const minYear = this.minDate && this.getYear(this.minDate)
      const curYear = +this.year
      if (curYear <= minYear) {
        return
      }
      this.year = this.year - 1
    },
    onSetNextYear () {
      const maxYear = this.maxDate && this.getYear(this.maxDate)
      const curYear = +this.year
      if (curYear >= maxYear) {
        return
      }
      this.year = this.year + 1
    },
    isDisabled (quarter) {
      const minQuarter = this.minDate && this.getQuarter(this.minDate)
      const maxQuarter = this.maxDate && this.getQuarter(this.maxDate)
      const minYear = this.minDate && this.getYear(this.minDate)
      const maxYear = this.maxDate && this.getYear(this.maxDate)
      const curYear = +this.year

      if (this.minDate && !this.maxDate) {
        if (minYear > curYear) {
          return true
        }
        return minYear === curYear && quarter < minQuarter;
      }

      if (this.maxDate && !this.minDate) {
        if (maxYear < curYear) {
          return true
        }
        return maxYear === curYear && quarter > maxQuarter;
      }

      if (this.minDate && this.maxDate) {
        if (minYear > curYear || maxYear < curYear) {
          return true
        }
        return (minYear === curYear && quarter < minQuarter) ||
            (maxYear === curYear && quarter > maxQuarter);
      }

      return false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-quarter.scss">
</style>
