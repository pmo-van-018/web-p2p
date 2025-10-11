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
        <search-input
          v-model="searchValue"
          :placeholder="`${$t('role_management.label.search_input')}`"
          @input="handleSearch"
        />
        <DropdownFilter
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
          <base-button variants="outlined" color="primary" @click="$emit('on-create')">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              <span class="text">{{ $t('merchant_managers.create') }}</span>
            </div>
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
export default {
  components: {
    DatePickerCustom: () => import('~/components/common/date-picker-custom.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    ModalAdd: () => import('~/components/common/merchant-managers/modal-add.vue'),
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
      searchValue: null,
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
        search: this.searchValue,
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
    handleSearch: debounce(function (searchValue) {
      // The case the search value is existed and click the refresh button, skip triggering the on-filters function
      if (this.isRefreshed) {
        this.isRefreshed = false;
        return;
      }
      this.searchValue = searchValue;
      this.$emit('on-filters', this.filterOptions);
    }, 500),
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
