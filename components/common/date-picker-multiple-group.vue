<template>
  <div class="date-picker-multiple-group">
    <div class="date-picker-multiple-group__container">
      <div class="date-picker-multiple-group__dropdown">
        <b-dropdown class="dropdown-action" variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <div v-if="selectedSearchOption">
              <div class="icon-selected">
                <span :class="selectedSearchOption.icon">
                  <span class="path1" /><span class="path2" /><span class="path3" /><span class="path4" /><span class="path5" /><span class="path6" /><span class="path7" />
                </span>
              </div>
            </div>
            <span class="icon-caret-down" />
          </template>
          <b-dropdown-item
            v-for="(option, index) in searchOptions"
            :key="`date-picker-option-${index}`"
            :active="option.field === selectedSearchOption.field"
            href="#"
            @click="onSelectSearchOption(option)"
          >
            <div class="dropdown-content" :class="{ 'active': option.field === selectedSearchOption.field }">
              <span :class="['dropdown-content__icon', option.icon]">
                <span class="path1" /><span class="path2" /><span class="path3" /><span class="path4" /><span class="path5" /><span class="path6" /><span class="path7" />
              </span>
              <span class="dropdown-content__title">{{ option.title }}</span>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="date-picker-multiple-group__range">
        <date-range-picker
          ref="picker"
          v-model="value"
          :opens="opens"
          :max-date="enableFutureDate ? null : new Date()"
          auto-apply
          :date-format="dateFormat"
          :ranges="false"
          :locale-data="{ firstDay: 1, format: 'dd/mm/yyyy' }"
          @update="updateValues"
        >
          <template v-slot:input>
            <div
              :class="['date-picker-multiple-group__date', {
                'date-picker-multiple-group__date--grey': !isShowClearSearch
              }]"
            >
              {{ rangeValue }}
            </div>
          </template>
        </date-range-picker>
      </div>
      <div class="date-picker-multiple-group__icon">
        <span v-if="isShowClearSearch" class="icon-close-circle-outline" @click="onClearSearch" />
        <span v-else :class="icon" />
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import DateRangePicker from 'vue2-daterange-picker'

export default {
  components: {
    DateRangePicker
  },
  props: {
    searchOptions: {
      type: Array,
      default: () => []
    },
    dateRange: {
      type: Object,
      default: () => {}
    },
    enableFutureDate: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    icon: {
      type: String,
      default: 'icon-calendar'
    },
    opens: {
      type: String,
      default: 'center'
    }
  },
  data () {
    return {
      selectedSearchOption: {}
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
    isShowClearSearch () {
      return this.dateRange.startDate && this.dateRange.endDate;
    },
    rangeValue () {
      if (this.isShowClearSearch) {
        return `${dayjs(this.dateRange.startDate).format(this.format)} - ${dayjs(this.dateRange.endDate).format(this.format)}`
      }
      return this.selectedSearchOption.placeholder
    }
  },
  created () {
    this.selectedSearchOption = this.searchOptions[0]
  },
  methods: {
    updateValues (value) {
      this.$emit('change', { ...value, field: this.selectedSearchOption.field })
    },
    dateFormat (classes, date) {
      if (!classes.disabled) {
        classes.disabled = (date.getTime() - 86400000) > new Date()
      }
      return classes
    },
    onSelectSearchOption (option) {
      this.selectedSearchOption = option
      if (this.isShowClearSearch) {
        this.$emit('change', {
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate,
          field: this.selectedSearchOption.field
        })
      }
    },
    onClearSearch () {
      this.$emit('change', {
        startDate: null,
        endDate: null,
        field: this.selectedSearchOption.field
      })
    }
  }
}
</script>
<style lang="scss">
@import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
</style>
<style lang="scss" scoped src="static/assets/scss/components/common/date-picker-multiple-group.scss">
</style>
