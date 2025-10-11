<template>
  <div class="filter-header-table">
    <filter-head-table
      class="pending-order__filter-head"
      :disabled="loading"
      :disabled-reset-filter="disableResetFilter"
      :is-visible-refresh="isVisibleRefresh"
      @refresh="$emit('on-refresh', $event)"
      @reset-filter="onResetFilter"
    >
      <template #actions>
        <DropdownFilter
          :title="$t('merchant.list_order.order_filter.type')"
          :list-filter="listPostType"
          :selected="postTypeSelected"
          @on-select="onFilterPostType"
        />
        <DropdownFilter
          :title="$t('merchant.list_order.order_filter.asset_type')"
          :list-filter="listAsset"
          :selected="assetSelected"
          @on-select="onFilterAssetType"
        />
        <template v-if="isVisibleStatus">
          <DropdownFilter
            :title="$t('merchant.list_order.order_filter.status')"
            :list-filter="listStatus"
            :selected="statusSelected"
            @on-select="onFilterStatusType"
          />
        </template>
        <template v-if="isVisibleSupporterProcess">
          <DropdownFilter
            v-if="isSupportersNotEmpty"
            :title="$t('merchant.list_order.order_filter.supporter_process')"
            :list-filter="listSupporter"
            :selected="supporter"
            @on-select="onFilterSupporterProcess"
          />
          <DropdownFilter
            v-else
            :title="$t('merchant.list_order.order_filter.supporter_process')"
            :list-filter="listSupporterEmpty"
          />
        </template>
        <date-picker-custom v-if="isVisibleDatePicker" v-model="dateRange" @change="onSelectDateRange" />
        <template v-if="isVisibleSearch">
          <search-multiple-group
            :is-reset-search="searchValue === ''"
            :visible-fields="visibleFields"
            @on-search="onSearchWithFieldValue"
            @on-blur="onBlurSearchInput"
          />
        </template>
      </template>
    </filter-head-table>
  </div>
</template>
<script>
import { LIST_POST_TYPE, LIST_PENDING_STATUS, LIST_STATUS_HISTORY } from '@/resources/order-filters'
import dayjs from 'dayjs'
import { mapState } from 'vuex';
import { isEnableAssetNetwork } from '@/helper/wallet-address'

export default {
  components: {
    DatePickerCustom: () => import('~/components/common/date-picker-custom.vue'),
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchMultipleGroup: () => import('~/components/desktop/orders/search-multiple-group/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    visibleFields: {
      type: Array,
      default: () => []
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
    },
    isVisibleRefresh: {
      type: Boolean,
      default: true
    },
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)

    return {
      listPostType: LIST_POST_TYPE,
      postTypeSelected: {},
      statusSelected: {},
      assetSelected: {},
      supporter: {},
      searchField: '',
      searchValue: '',
      isResetFilters: false,
      dateRange: {
        startDate,
        endDate
      }
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    ...mapState('user', ['user']),
    ...mapState('merchant-orders', ['supporters']),
    listAsset () {
      return this.assets.filter(e => isEnableAssetNetwork(this.user?.walletAddress, e.network)).map(asset => ({
        ...asset,
        value: asset.id,
        name: `${asset.name} (${asset.network})`
      }))
    },
    postType () {
      return Object.keys(this.postTypeSelected).length ? this.postTypeSelected.value : ''
    },
    listStatus () {
      return this.isHistory ? LIST_STATUS_HISTORY : LIST_PENDING_STATUS
    },
    listSupporter () {
      return this.supporters?.map((supporter) => {
        return {
          value: supporter.id,
          name: supporter?.nickName || this.$options.filters.formatHash(supporter.walletAddress)
        }
      })
    },
    listSupporterEmpty () {
      return [{
        name: this.$t('order_filter.empty_select'),
        value: null
      }]
    },
    isSupportersNotEmpty () {
      return this.supporters?.length !== 0
    },
    statusOrder () {
      return Object.keys(this.statusSelected).length ? this.statusSelected.value : ''
    },
    asset () {
      return Object.keys(this.assetSelected).length ? this.assetSelected.value : ''
    },
    supporterId () {
      return this.supporter?.value
    },
    disableResetFilter () {
      const isDisabled = !this.postType && !this.statusOrder && !this.asset && !this.searchValue && !this.supporterId
      if (this.isVisibleDatePicker) {
        return isDisabled && !this.dateRange.startDate && !this.dateRange.endDate
      }
      return isDisabled
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
        type: this.postType,
        orderStatus: this.statusOrder,
        asset: this.asset,
        ...((this.searchField && this.searchValue) && { searchField: this.searchField }),
        ...(this.searchValue && { searchValue: this.searchValue }),
        ...(this.isVisibleDatePicker && { startDate: this.startDate }),
        ...(this.isVisibleDatePicker && { endDate: this.endDate }),
        supporterId: this.supporterId
      }
    }
  },
  methods: {
    onFilterPostType (type) {
      this.postTypeSelected = type
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterAssetType (type) {
      this.assetSelected = type
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterStatusType (type) {
      this.statusSelected = type
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
      this.postTypeSelected = this.statusSelected = this.assetSelected = {}
      this.searchField = ''
      this.searchValue = ''
      this.dateRange.startDate = null
      this.dateRange.endDate = null
      this.isResetFilters = true
      this.supporter = null
      setTimeout(() => {
        this.isResetFilters = false
      }, 1000)
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterSupporterProcess (supporter) {
      this.supporter = supporter
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/filter-head-table/index.scss">
</style>
