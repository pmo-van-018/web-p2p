<template>
  <filter-head-table
    class="filter-head"
    :disabled="loading"
    :disabled-reset-filter="disabledResetFilter"
    :is-visible-refresh="true"
    @refresh="$emit('on-refresh', $event)"
    @reset-filter="onResetFilter"
  >
    <template #actions>
      <date-picker-multiple-group
        :search-options="searchOptions"
        :date-range="dateRange"
        @change="onSelectDateRange"
      />
      <search-multiple-group
        :is-reset-search="searchValue === ''"
        :visible-fields="[ORDER_FIELD_SEARCH_GROUP.WALLET_ADDRESS, ORDER_FIELD_SEARCH_GROUP.NICK_NAME]"
        @on-search="onSearchWithFieldValue"
        @on-blur="onBlurSearchInput"
      />
    </template>
  </filter-head-table>
</template>
<script>
import dayjs from 'dayjs';
import { DATE_RANGE_FIELD_SEARCH_GROUP, ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'

export default {
  components: {
    DatePickerMultipleGroup: () => import('~/components/common/date-picker-multiple-group.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    SearchMultipleGroup: () => import('~/components/desktop/orders/search-multiple-group/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchValue: '',
      searchField: '',
      dateRange: {},
      isResetFilters: false,
      ORDER_FIELD_SEARCH_GROUP,
      searchOptions: [
        {
          icon: 'icon-alarm-add-grey',
          title: this.$t('date_picker.created_at'),
          placeholder: this.$t('date_picker.created_at'),
          field: DATE_RANGE_FIELD_SEARCH_GROUP.CREATED_AT
        },
        {
          icon: 'icon-clock-trade',
          title: this.$t('date_picker.last_trade_at'),
          placeholder: this.$t('date_picker.last_trade_at'),
          field: DATE_RANGE_FIELD_SEARCH_GROUP.LAST_TRADE_AT
        },
        {
          icon: 'icon-clock-user',
          title: this.$t('date_picker.last_login_at'),
          placeholder: this.$t('date_picker.last_login_at'),
          field: DATE_RANGE_FIELD_SEARCH_GROUP.LAST_LOGIN_AT
        }
      ]
    }
  },
  computed: {
    startDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.startDate).format('YYYY-MM-DD')
    },
    endDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.endDate).format('YYYY-MM-DD')
    },
    filterOptions () {
      return {
        search: this.searchValue,
        field: this.searchField,
        startDate: this.startDate,
        endDate: this.endDate,
        fieldDate: this.dateRange.fieldDate
      }
    },
    disabledResetFilter () {
      return !this.searchValue && !this.startDate && !this.endDate
    }
  },
  methods: {
    onSelectDateRange (range) {
      this.dateRange = {
        startDate: range.startDate,
        endDate: range.endDate,
        fieldDate: range.field
      }
      this.$emit('on-filters', this.filterOptions)
    },
    onResetFilter () {
      this.searchValue = ''
      this.searchField = ''
      this.dateRange = {
        startDate: null,
        endDate: null,
        fieldDate: ''
      }
      this.$emit('on-filters', this.filterOptions)
    },
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    onSearchWithFieldValue ({ searchField, searchValue }) {
      this.searchField = searchValue ? searchField : ''
      this.searchValue = searchValue
      this.$emit('on-filters', this.filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/staffs/filter-head.scss">
</style>
