<template>
  <div class="management-filter">
    <div class="management-filter__container">
      <div class="management-filter__left">
        <div class="management-filter__text">{{ $t('shift_management.history_title') }}</div>
        <dropdown-filter
          :title="$t('shift_management.table.status')"
          :list-filter="listStatus"
          :selected="statusSelected"
          @on-select="onFilterStatus"
        />
        <date-picker-multiple-group
          :search-options="searchOptions"
          :date-range="dateRange"
          icon="icon-search-outline"
          opens="left"
          @change="onSelectDateRange"
        />
        <base-button variants="outlined" color="primary" :disabled="disabledResetFilter" @click="onResetFilter">
          {{ $t('common.setting_filter') }}
        </base-button>
      </div>
      <div class="management-filter__right" />
    </div>
  </div>
</template>
<script>
import { DATE_RANGE_FIELD_SEARCH_GROUP } from '@/constants/orders';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { SHIFT_STATUS } from '@/constants/shift';

export default {
  components: {
    DatePickerMultipleGroup: () => import('~/components/common/date-picker-multiple-group.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue')
  },
  data () {
    return {
      dateRange: {},
      statusSelected: null,
      listStatus: [
        {
          name: 'shift_management.status.processing',
          value: `${SHIFT_STATUS.PROCESSING},${SHIFT_STATUS.FINISHED}`
        },
        {
          name: 'shift_management.status.approved',
          value: SHIFT_STATUS.APPROVED
        }
      ],
      searchOptions: [
        {
          icon: 'icon-checkin',
          title: this.$t('shift_management.filter.check_in_date'),
          placeholder: this.$t('shift_management.placeholder.checkin'),
          field: DATE_RANGE_FIELD_SEARCH_GROUP.CHECK_IN
        },
        {
          icon: 'icon-checkout',
          title: this.$t('shift_management.filter.check_out_date'),
          placeholder: this.$t('shift_management.placeholder.checkout'),
          field: DATE_RANGE_FIELD_SEARCH_GROUP.CHECK_OUT
        }
      ]
    }
  },
  computed: {
    disabledResetFilter () {
      return !this.dateRange?.startDate && !this.dateRange?.endDate && this.statusSelected === null
    },
    statusActive () {
      return this.statusSelected ? this.statusSelected.value : ''
    },
    filterOptions () {
      return {
        status: this.statusActive,
        startDate: this.dateRange?.startDate ? dayjs(this.dateRange?.startDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
        endDate: this.dateRange?.endDate ? dayjs(this.dateRange?.endDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
        fieldDate: (this.dateRange?.startDate && this.dateRange?.endDate) ? this.dateRange?.field : null
      }
    }
  },
  methods: {
    onResetFilter () {
      this.dateRange = {
        startDate: null,
        endDate: null
      }
      this.statusSelected = null
      this.$emit('on-filters', this.filterOptions)
    },
    onSelectDateRange (range) {
      this.dateRange = range
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterStatus (option) {
      this.statusSelected = option
      this.$emit('on-filters', this.filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/shift-management/filter.scss">
</style>
