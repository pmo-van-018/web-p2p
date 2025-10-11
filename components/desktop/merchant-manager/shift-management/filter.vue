<template>
  <div class="management-filter">
    <div class="management-filter__container">
      <div class="management-filter__left">
        <div class="management-filter__filter-option">
          <search-multiple-group
            :is-reset-search="searchValue === ''"
            :search-options="searchOptions"
            @on-search="onSearchWithFieldValue"
            @on-blur="onBlurSearchInput"
            @on-focus="isPreventSearchEvent = false"
          />
          <date-picker-multiple-group
            :search-options="datePickerOptions"
            :date-range="dateRange"
            icon="icon-search-outline"
            opens="center"
            @change="onSelectDateRange"
          />
          <base-button variants="outlined" color="primary" :disabled="disabledResetFilter" @click="onResetFilter">
            {{ $t('user_orders.setting_filter') }}
          </base-button>
        </div>
      </div>
      <div v-if="isVisibleApprovedAll" class="management-filter__right">
        <base-button
          variants="contained"
          color="primary"
          :disabled="disabledApprovedAll || loading"
          @click="$emit('on-approve-shift', { shift: null, type: 'all' })"
        >
          <div class="management-filter__action-inner">
            <span class="icon-lightning" />
            <span>{{ $t('action.approve_all') }}</span>
          </div>
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { DATE_RANGE_FIELD_SEARCH_GROUP, ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/config/constant';

export default {
  components: {
    DatePickerMultipleGroup: () => import('~/components/common/date-picker-multiple-group.vue'),
    SearchMultipleGroup: () => import('~/components/common/search-multiple-group/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isVisibleApprovedAll: {
      type: Boolean,
      default: true
    },
    disabledApprovedAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dateRange: {},
      searchField: '',
      searchValue: '',
      isPreventSearchEvent: false,
      datePickerOptions: [
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
      ],
      searchOptions: [
        {
          icon: 'icon-wallet-address',
          title: this.$t('order_filter.wallet_address'),
          placeholder: this.$t('placeholder.wallet_address'),
          field: ORDER_FIELD_SEARCH_GROUP.WALLET_ADDRESS
        },
        {
          icon: 'icon-nickname',
          title: this.$t('order_filter.nickname'),
          placeholder: this.$t('placeholder.nickname'),
          field: ORDER_FIELD_SEARCH_GROUP.NICK_NAME
        }
      ]
    }
  },
  computed: {
    filterOptions () {
      return {
        searchField: this.searchField,
        searchValue: this.searchValue,
        startDate: this.dateRange?.startDate ? dayjs(this.dateRange?.startDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
        endDate: this.dateRange?.endDate ? dayjs(this.dateRange?.endDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
        filterDateType: (this.dateRange?.startDate && this.dateRange?.endDate && this.dateRange?.field) ? this.dateRange?.field : null
      }
    },
    disabledResetFilter () {
      return !this.dateRange?.startDate && !this.dateRange?.endDate && !this.searchValue
    }
  },
  methods: {
    onSelectDateRange (range) {
      this.dateRange = {
        startDate: range.startDate,
        endDate: range.endDate,
        field: range.field
      }
      this.$emit('on-filters', this.filterOptions)
    },
    onResetFilter () {
      this.isPreventSearchEvent = true
      this.dateRange = {
        startDate: null,
        endDate: null
      }
      this.searchField = ''
      this.searchValue = ''
      this.$emit('on-filters', this.filterOptions)
      debounce(() => {
        this.isPreventSearchEvent = false;
      }, 600)()
    },
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    onSearchWithFieldValue: debounce(function ({ searchField, searchValue }) {
      if (this.isPreventSearchEvent) {
        this.isPreventSearchEvent = false;
        return;
      }
      this.searchField = searchValue ? searchField : ''
      this.searchValue = searchValue
      this.$emit('on-filters', this.filterOptions)
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.management-filter {
  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__left {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  &__filter-option {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  &__text {
    @include font-t20m;
    color: #000;
  }
  &__action-inner {
    display: flex;
    align-items: center;
    gap: 4px;
    .icon-lightning {
      font-size: 20px;
      &:before {
        color: #fff;
      }
    }
  }
  ::v-deep {
    .date-picker-multiple-group__range {
      flex: 1;
    }

    .date-picker-multiple-group__container {
      min-width: 310px;
    }
  }
}
</style>
