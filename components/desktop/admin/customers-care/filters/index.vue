<template>
  <div class="filter-header-table">
    <filter-head-table
      :disabled="loading"
      :disabled-reset-filter="disableResetFilter"
      :is-visible-refresh="isVisibleRefresh"
      @refresh="$emit('on-refresh', $event)"
      @reset-filter="onResetFilter"
    >
      <template #actions>
        <template v-if="isVisibleSearch">
          <search-multiple-group
            :is-reset-search="searchValue === ''"
            @on-search="onSearchWithFieldValue"
            @on-blur="onBlurSearchInput"
          />
        </template>
        <date-picker-custom v-if="isVisibleDatePicker" v-model="dateRange" @change="onSelectDateRange" />
        <template v-if="isVisibleTopic">
          <dropdown-filter
            :title="$t('common.topic')"
            :list-filter="customerRequestType"
            :selected="customerRequestTypeSelected"
            @on-select="onFilterCustomerRequestType"
          />
        </template>
        <template v-if="isVisibleStep">
          <dropdown-filter
            :title="$t('customer_care.step')"
            :list-filter="customerRequestSteps"
            :selected="customerRequestStepsSelected"
            @on-select="onFilterCustomerRequestStep"
          />
        </template>
        <template v-if="isVisibleState">
          <dropdown-filter
            :title="$t('customer_care.state')"
            :list-filter="customerRequestStates"
            :selected="customerRequestStateSelected"
            @on-select="onFilterCustomerRequestState"
          />
        </template>
      </template>
    </filter-head-table>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { CUSTOMER_SUPPORT_TYPE, CUSTOMER_SUPPORT_STEP, CUSTOMER_SUPPORT_STATE } from '@/constants/customer-support'

export default {
  components: {
    DatePickerCustom: () => import('~/components/common/date-picker-custom.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchMultipleGroup: () => import('~/components/desktop/admin/customers-care/filters/search.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isVisibleDatePicker: {
      type: Boolean,
      default: true
    },
    isVisibleTopic: {
      type: Boolean,
      default: true
    },
    isVisibleSearch: {
      type: Boolean,
      default: false
    },
    isVisibleStatus: {
      type: Boolean,
      default: true
    },
    isVisibleRefresh: {
      type: Boolean,
      default: true
    },
    isVisibleStep: {
      type: Boolean,
      default: false
    },
    isVisibleState: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      searchField: '',
      searchValue: '',
      isResetFilters: false,
      dateRange: {
        startDate: null,
        endDate: null
      },
      stateTime: {
        startDate: null,
        endDate: null
      },
      customerRequestTypeSelected: {},
      customerRequestStepsSelected: {},
      customerRequestStateSelected: {},
      customerRequestType: [
        {
          name: 'customer_care.types.order',
          value: CUSTOMER_SUPPORT_TYPE.ORDER,
          imageUrl: '/assets/images/common/customer-request/transfer.svg'
        },
        {
          name: 'customer_care.types.transaction',
          value: CUSTOMER_SUPPORT_TYPE.TRANSACTION,
          imageUrl: '/assets/images/common/customer-request/transaction.svg'
        },
        {
          name: 'customer_care.types.appeal',
          value: CUSTOMER_SUPPORT_TYPE.APPEAL,
          imageUrl: '/assets/images/common/customer-request/appeal.svg'
        },
        {
          name: 'customer_care.types.manager',
          value: CUSTOMER_SUPPORT_TYPE.REGISTRATION_MANAGER,
          imageUrl: '/assets/images/common/customer-request/register-merchant.svg'
        },
        {
          name: 'customer_care.types.system',
          value: CUSTOMER_SUPPORT_TYPE.SYSTEM,
          imageUrl: '/assets/images/common/customer-request/system.svg'
        },
        {
          name: 'customer_care.types.other',
          value: CUSTOMER_SUPPORT_TYPE.OTHER,
          imageUrl: '/assets/images/common/customer-request/other.svg'
        }
      ],
      customerRequestSteps: [
        {
          name: 'customer_care.received',
          value: CUSTOMER_SUPPORT_STEP.RECEIVED
        },
        {
          name: 'customer_care.pending',
          value: CUSTOMER_SUPPORT_STEP.PENDING
        }
      ],
      customerRequestStates: [
        {
          name: 'common.new',
          value: CUSTOMER_SUPPORT_STATE.NEW
        },
        {
          name: 'common.old',
          value: CUSTOMER_SUPPORT_STATE.OLD
        }
      ]
    }
  },
  computed: {
    requestType () {
      return Object.keys(this.customerRequestTypeSelected).length ? this.customerRequestTypeSelected.value : ''
    },
    requestStep () {
      return Object.keys(this.customerRequestStepsSelected).length ? this.customerRequestStepsSelected.value : ''
    },
    requestState () {
      return Object.keys(this.customerRequestStateSelected).length ? this.customerRequestStateSelected.value : ''
    },
    disableResetFilter () {
      return !this.searchValue && !this.requestType && !this.requestStep && !this.dateRange.startDate && !this.dateRange.endDate && !this.requestState
    },
    startDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.startDate).startOf('days').format()
    },
    endDate () {
      if (!this.dateRange.endDate) {
        return ''
      }
      return dayjs(this.dateRange.endDate).endOf('days').format()
    },
    filterOptions () {
      return {
        ...((this.searchField && this.searchValue) && { searchField: this.searchField }),
        ...(this.searchValue && { searchValue: this.searchValue }),
        ...(this.requestType && { type: this.requestType }),
        ...(this.requestStep && { step: this.requestStep }),
        startDate: this.stateTime.startDate ? this.stateTime.startDate : this.startDate,
        endDate: this.stateTime.endDate ? this.stateTime.endDate : this.endDate
      }
    }
  },
  methods: {
    onFilterCustomerRequestType (type) {
      this.customerRequestTypeSelected = type
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterCustomerRequestStep (step) {
      this.customerRequestStepsSelected = step
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterCustomerRequestState (state) {
      this.customerRequestStateSelected = state
      this.stateTime.startDate = null;
      this.stateTime.endDate = null;
      if (state?.value === CUSTOMER_SUPPORT_STATE.NEW) {
        this.stateTime.startDate = dayjs().subtract(12, 'hours').format()
      } else {
        this.stateTime.endDate = dayjs().subtract(12, 'hours').format()
      }
      this.$emit('on-filters', this.filterOptions)
    },
    onSelectDateRange (range) {
      this.dateRange = {
        startDate: range.startDate,
        endDate: range.endDate
      }
      this.$emit('on-filters', this.filterOptions)
    },
    onResetFilter () {
      this.customerRequestTypeSelected = {}
      this.searchField = ''
      this.searchValue = ''
      this.dateRange.startDate = null
      this.dateRange.endDate = null
      this.isResetFilters = true
      this.customerRequestStepsSelected = {}
      this.customerRequestStateSelected = {}
      this.stateTime.startDate = null
      this.stateTime.endDate = null
      setTimeout(() => {
        this.isResetFilters = false
      }, 1000)
      this.$emit('on-filters', this.filterOptions)
    },
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    onSearchWithFieldValue ({ searchField, searchValue }) {
      if (!this.isResetFilters) {
        this.searchField = searchField
        this.searchValue = searchValue
        this.$emit('on-search', this.filterOptions)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/customer-care/filters/index.scss">
</style>
