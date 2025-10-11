<template>
  <filter-head-table
    class="filter-head"
    :disabled="loading"
    :disabled-reset-filter="disabledResetFilter"
    :is-visible-refresh="false"
    @refresh="$emit('on-refresh', $event)"
    @reset-filter="onResetFilter"
  >
    <template #actions>
      <dropdown-filter
        ref="dropdownFilterMerchant"
        :title="$t('staff.filters.merchant')"
        width-content="350px"
        :selected="merchantManagerSelectedFormat"
        name-attribute="text"
      >
        <filter-search-list
          :loading="loading"
          :is-reset="isResetFilters"
          :selected="merchantManagersSelected"
          :options="merchantManagersFormatter"
          @on-applied="onFiltersMerchantManager"
          @on-search="onSearchMerchantManager"
        />
      </dropdown-filter>
      <search-input
        v-model="searchValue"
        :placeholder="$t('staff.placeholder.wallet_and_nickname')"
        @input="$emit('on-search', $event)"
      />
      <template v-if="isVisibleStatus">
        <dropdown-filter
          :title="$t('role_management.label.status')"
          name-attribute="label"
          value-attribute="id"
          :list-filter="listStatus"
          :selected="statusSelected"
          @on-select="onFilterStatus"
        />
      </template>
      <template v-if="isVisibleStatus">
        <dropdown-filter
          :title="$t('role_management.label.type')"
          name-attribute="label"
          value-attribute="id"
          :list-filter="staffOptions"
          :selected="staffRoleSelected"
          @on-select="onFilterStaffRole"
        />
      </template>
      <date-picker-custom
        v-model="dateRange"
        :placeholder-start-date="$t('role_management.label.datepicker.start')"
        :placeholder-end-date="$t('role_management.label.datepicker.end')"
        @change="onSelectDateRange"
      />
    </template>
  </filter-head-table>
</template>
<script>
import { LIST_STAFF, LIST_STATUS } from '@/resources/role-management';
import dayjs from 'dayjs';
import merchantManagerMixin from '@/mixins/admin/merchant-manager';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { USER_STATUS } from '~/config/constant';

export default {
  components: {
    DatePickerCustom: () => import('~/components/common/date-picker-custom.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    FilterSearchList: () => import('~/components/desktop/commons/filter-search-list/index.vue')
  },
  mixins: [merchantManagerMixin],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isVisibleDatePicker: {
      type: Boolean,
      default: false
    },
    isHistory: {
      type: Boolean,
      default: false
    },
    isVisibleSearch: {
      type: Boolean,
      default: false
    },
    isVisibleStatus: {
      type: Boolean,
      default: true
    }
  },
  data () {
    const statusOptions = Object.values(LIST_STATUS).map(item => ({
      ...item,
      label: this.$t(item?.label)
    })).filter(status => status.name !== USER_STATUS.DELETED)

    const staffOptions = Object.values(LIST_STAFF).map(item => ({
      ...item,
      label: this.$t(item?.label)
    }))

    return {
      searchValue: '',
      dateRange: {},
      statusSelected: {},
      staffRoleSelected: {},
      listStatus: statusOptions,
      staffOptions,
      isResetFilters: false,
      merchantManagerId: null,
      merchantManagersSelected: [],
      merchantManagerSelectedFormat: {}
    }
  },
  computed: {
    merchantManagersFormatter () {
      return this.merchantManagers.map((item) => {
        return {
          text: (item.nickName || '').substring(0, 30) + ((item.nickName?.length > 30) ? '...' : ''),
          value: item.id
        }
      })
    },
    statusActive () {
      return Object.keys(this.statusSelected).length ? this.statusSelected.id : ''
    },
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
        status: this.statusActive,
        type: this.staffRoleSelected?.id,
        search: this.searchValue,
        startDate: this.startDate,
        endDate: this.endDate
      }
    },
    disabledResetFilter () {
      return !this.searchValue && !this.startDate && !this.endDate && !this.merchantManagerId && isEmpty(this.statusSelected) && isEmpty(this.staffRoleSelected)
    }
  },
  async created () {
    await this.$_merchantManagerMixin_onResetFilter(true)
  },
  methods: {
    onSelectDateRange (range) {
      this.dateRange = {
        startDate: range.startDate,
        endDate: range.endDate
      }
      this.isResetFilters = false
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterStatus (selected) {
      this.statusSelected = selected
      this.isResetFilters = false
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterStaffRole (role) {
      this.staffRoleSelected = role
      this.isResetFilters = false
      this.$emit('on-filters', this.filterOptions)
    },
    onFiltersMerchantManager ({ ids, merchantManagers }) {
      this.$refs?.dropdownFilterMerchant?.$refs.dropdown.hide()
      this.isResetFilters = false
      this.merchantManagerId = ids
      this.merchantManagersSelected = merchantManagers
      this.merchantManagerSelectedFormat = { text: this.merchantManagersSelected.map(e => e.text).join(',') }
      this.$emit('on-filters', { ...this.filterOptions, ...{ merchantManagerId: this.merchantManagerId } })
    },
    onSearchMerchantManager: debounce(function (searchValue) {
      this.filter = { ...this.filter, ...{ search: searchValue } };
      this.page = 1;
      this.$_merchantManagerMixin_getMerchantManagers(false, true);
    }, 500),
    onResetFilter () {
      this.statusSelected = {}
      this.staffRoleSelected = {}
      this.searchValue = ''
      this.dateRange.startDate = null
      this.dateRange.endDate = null
      this.isResetFilters = true
      this.merchantManagerId = null
      this.merchantManagersSelected = []
      this.$emit('on-filters', this.filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="../../../../static/assets/scss/components/desktop/admin/staffs/filter-head.scss">
</style>
