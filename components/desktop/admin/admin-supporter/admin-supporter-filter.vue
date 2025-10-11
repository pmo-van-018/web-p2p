<template>
  <div class="filter-header-table">
    <filter-head-table
      class="filter-header-table__filter-head"
      :disabled="loading"
      :disabled-reset-filter="disableResetFilter"
      @refresh="$emit('on-refresh', $event)"
      @reset-filter="handleResetFilter"
    >
      <template #actions>
        <search-multiple-group
          :is-reset-search="!searchValue"
          :visible-fields="[ORDER_FIELD_SEARCH_GROUP.WALLET_ADDRESS, ORDER_FIELD_SEARCH_GROUP.NICK_NAME]"
          @on-search="onSearchWithFieldValue"
          @on-blur="onBlurSearchInput"
        />
        <dropdown-filter
          :title="$t('role_management.label.status')"
          :list-filter="statusOptions"
          :selected="selectedStatus"
          name-attribute="label"
          value-attribute="id"
          @on-select="handleFilterStatus"
        />
        <date-picker-custom
          v-model="dateRange"
          :placeholder-start-date="$t('role_management.label.datepicker.start')"
          :placeholder-end-date="$t('role_management.label.datepicker.end')"
          @change="handleSelectDateRange"
        />
      </template>
      <template #other>
        <div class="filter-head-table__action">
          <base-button variants="contained" color="primary">
            <span
              class="filter-head-table__action-inner d-flex align-items-center"
              @click="$emit('on-create')"
            >
              <span class="filter-head-table__icon-add-white icon-add-primary" />
              <span class="filter-head-table__action-text">{{ $t('admin_supporter.create') }}</span>
            </span>
          </base-button>
        </div>
      </template>
    </filter-head-table>

    <ModalAdd @on-reset="handleResetFilter" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'
export default {
  components: {
    DatePickerCustom: () => import('~/components/common/date-picker-custom.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchMultipleGroup: () => import('~/components/desktop/orders/search-multiple-group/index.vue'),
    ModalAdd: () => import('~/components/desktop/admin/modal/admin-supporter/modal-add.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    statusOptions: {
      type: Array,
      default: () => []
    },
    defaultDateRange: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const startDate = this.defaultDateRange?.startDate;
    const endDate = this.defaultDateRange?.endDate;

    return {
      selectedStatus: {},
      searchField: null,
      searchValue: null,
      ORDER_FIELD_SEARCH_GROUP,
      dateRange: {
        startDate,
        endDate
      },
      isRefreshed: false
    }
  },
  computed: {
    disableResetFilter () {
      return isEmpty(this.selectedStatus) &&
          !this.searchValue &&
          !this.dateRange.startDate &&
          !this.dateRange.endDate;
    },
    filterOptions () {
      return {
        status: this.selectedStatus?.id,
        searchField: this.searchField,
        searchValue: this.searchValue,
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate
      }
    }
  },
  methods: {
    handleFilterStatus (status) {
      this.selectedStatus = status;
      this.$emit('on-filters', this.filterOptions);
    },
    onSearchWithFieldValue: debounce(function ({ searchField, searchValue }) {
      if (this.isRefreshed) {
        this.isRefreshed = false;
        return;
      }
      this.searchField = searchValue ? searchField : ''
      this.searchValue = searchValue
      this.$emit('on-filters', this.filterOptions)
    }, 500),
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    handleSelectDateRange (range) {
      this.dateRange = {
        startDate: range.startDate,
        endDate: range.endDate
      };
      this.$emit('on-filters', this.filterOptions);
    },
    handleResetFilter () {
      this.isRefreshed = true;
      this.selectedStatus = {}
      this.searchField = null;
      this.searchValue = null;
      this.dateRange.startDate = null;
      this.dateRange.endDate = null;
      this.$emit('on-reset');
      // Delay and reset the value of isRefreshed
      debounce(() => {
        this.isRefreshed = false;
      }, 600)();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/filter.scss">
</style>
