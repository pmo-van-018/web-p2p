<template>
  <div class="filter-header-table">
    <filter-head-table
      class="filter-header-table__filter-head"
      :disabled="loading"
      :is-visible-refresh="false"
      :disabled-reset-filter="disableResetFilter"
      @reset-filter="onResetFilter"
    >
      <template #actions>
        <search-multiple-group
          :is-reset-search="searchValue === ''"
          :search-options="searchOptions"
          @on-search="onSearchWithFieldValue"
          @on-blur="onBlurSearchInput"
          @on-focus="isPreventSearchEvent = false"
        />
        <dropdown-filter
          :title="$t('postings.table.post_type')"
          :list-filter="listPostType"
          :selected="postTypeSelected"
          @on-select="onFilterPostType"
        />
        <dropdown-filter
          :title="$t('postings.table.post_asset')"
          :list-filter="listAsset"
          :selected="assetSelected"
          @on-select="onFilterAssetType"
        />
        <dropdown-filter
          v-if="isVisibleStatus"
          :title="$t('postings.table.status')"
          :list-filter="listStatus"
          :selected="statusSelected"
          @on-select="onFilterStatusType"
        />
      </template>
    </filter-head-table>
  </div>
</template>
<script>
import { LIST_POST_TYPE } from '@/resources/order-filters'
import { LIST_STATUS_POSTING_FILTER, STATUS_AVAILABLE_FILTER } from '@/resources/postings-management'
import { mapState } from 'vuex'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders';
import debounce from 'lodash/debounce';

export default {
  components: {
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchMultipleGroup: () => import('~/components/common/search-multiple-group/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isVisibleDatePicker: {
      type: Boolean,
      default: false
    },
    isVisibleStatus: {
      type: Boolean,
      default: true
    },
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listPostType: LIST_POST_TYPE,
      postTypeSelected: {},
      statusSelected: {},
      assetSelected: {},
      searchValue: '',
      searchField: '',
      isPreventSearchEvent: false,
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
        },
        {
          icon: 'icon-hashtag-square',
          title: this.$t('order_filter.ref_post'),
          placeholder: this.$t('placeholder.ref_post'),
          field: ORDER_FIELD_SEARCH_GROUP.POST_REFID
        }
      ]
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    listAsset () {
      return this.assets.map(asset => ({
        ...asset,
        value: asset.id,
        name: `${asset.name} (${asset.network})`
      }))
    },
    postType () {
      return Object.keys(this.postTypeSelected).length ? this.postTypeSelected.value : ''
    },
    listStatus () {
      return LIST_STATUS_POSTING_FILTER
    },
    status () {
      return Object.keys(this.statusSelected).length ? this.statusSelected.value : ''
    },
    asset () {
      return Object.keys(this.assetSelected).length ? this.assetSelected.value : ''
    },
    disableResetFilter () {
      return !this.postType && this.status === '' && !this.asset && this.searchValue === ''
    },
    filterOptions () {
      return {
        page: 1,
        postType: this.postType,
        status: this.status !== '' ? this.status : STATUS_AVAILABLE_FILTER,
        assetId: this.asset,
        searchField: this.searchField,
        searchValue: this.searchValue
      }
    }
  },
  methods: {
    onFilterPostType (type) {
      this.postTypeSelected = type
      this.isPreventSearchEvent = false
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterAssetType (type) {
      this.assetSelected = type
      this.isPreventSearchEvent = false
      this.$emit('on-filters', this.filterOptions)
    },
    onFilterStatusType (type) {
      this.statusSelected = type
      this.isPreventSearchEvent = false
      this.$emit('on-filters', this.filterOptions)
    },
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    onSearchWithFieldValue: debounce(function ({ searchField, searchValue }) {
      if (!this.isPreventSearchEvent) {
        this.searchField = searchValue ? searchField : ''
        this.searchValue = searchValue
        this.isPreventSearchEvent = false
        this.$emit('on-filters', this.filterOptions)
      }
    }, 500),
    onResetFilter () {
      this.searchValue = ''
      this.searchField = ''
      this.isPreventSearchEvent = true
      this.postTypeSelected = this.statusSelected = this.assetSelected = {}
      this.$emit('on-filters', this.filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/posting-filter.scss">
</style>
