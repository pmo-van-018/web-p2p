<template>
  <div class="filter-header-table">
    <filter-head-table
      class="filter-header-table__filter-head"
      :disabled="loading"
      :is-visible-refresh="!isHistory"
      :disabled-reset-filter="disableResetFilter"
      @refresh="$emit('on-refresh', $event)"
      @reset-filter="onResetFilter"
    >
      <template #actions>
        <DropdownFilter
          :title="$t('postings.table.post_type')"
          :list-filter="listPostType"
          :selected="postTypeSelected"
          @on-select="onFilterPostType"
        />
        <DropdownFilter
          :title="$t('postings.table.post_asset')"
          :list-filter="listAsset"
          :selected="assetSelected"
          @on-select="onFilterAssetType"
        />
        <DropdownFilter
          v-if="isVisibleStatus"
          :title="$t('postings.table.status')"
          :list-filter="listStatus"
          :selected="statusSelected"
          @on-select="onFilterStatusType"
        />
      </template>
      <template v-if="!isHistory" #other>
        <div class="filter-head-table__action">
          <n-link to="/merchant/create-ad" class="filter-head-table__create d-flex align-items-center grey-900 font-t16m">
            <img src="/assets/images/common/add-post.svg" alt="Add Post">
            <span class="create-text">{{ $t('postings.create') }}</span>
          </n-link>
          <n-link class="filter-head-table__view" to="/merchant/postings-history">
            <img class="filter-head-table__button" src="/assets/images/common/history-post.svg" alt="History Post">
            <b-tooltip target="view-history" triggers="hover">
              {{ $t('postings.view') }}
            </b-tooltip>
          </n-link>
        </div>
      </template>
    </filter-head-table>
  </div>
</template>
<script>
import { LIST_POST_TYPE } from '@/resources/order-filters'
import { LIST_STATUS_POSTING_FILTER, STATUS_AVAILABLE_FILTER } from '@/resources/postings-management'
import dayjs from 'dayjs'
import { DATE_TIME_FORMAT } from '@/config/constant'
import { mapState } from 'vuex'

export default {
  components: {
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue')
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
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)

    return {
      listPostType: LIST_POST_TYPE,
      postTypeSelected: {},
      statusSelected: {},
      assetSelected: {},
      dateRange: {
        startDate,
        endDate
      }
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
      return !this.postType && this.status === '' && !this.asset
    },
    startDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.startDate).format(DATE_TIME_FORMAT.DATE_ONLY)
    },
    endDate () {
      if (!this.dateRange.startDate) {
        return ''
      }
      return dayjs(this.dateRange.endDate).format(DATE_TIME_FORMAT.DATE_ONLY)
    },
    filterOptions () {
      return {
        page: 1,
        postType: this.postType,
        status: this.status !== '' ? this.status : STATUS_AVAILABLE_FILTER,
        assetId: this.asset,
        startDate: this.startDate,
        endDate: this.endDate
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
      this.$emit('on-filters', this.filterOptions)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/posting-filter.scss">
</style>
