<template>
  <div class="filter-header-table">
    <filter-head-table
      class="pending-order__filter-head"
      :disabled="loading"
      :disabled-reset-filter="disableResetFilter"
      :is-visible-reset="false"
      @refresh="$emit('on-refresh', $event)"
    >
      <template #actions>
        <search-multiple-group
          :is-reset-search="searchValue === ''"
          :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
          @on-search="onSearchWithFieldValue"
          @on-blur="onBlurSearchInput"
        />
      </template>
    </filter-head-table>
  </div>
</template>
<script>
import { trimMultipleSpaceStartEndString } from '@/helper';
import { ORDER_FIELD_SEARCH_DEFAULT, ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'

export default {
  components: {
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
      isResetFilters: false,
      ORDER_FIELD_SEARCH_DEFAULT
    }
  },
  computed: {
    disableResetFilter () {
      return !this.searchValue
    },
    filterOptions () {
      return {
        search: this.searchValue
      }
    }
  },
  methods: {
    onBlurSearchInput ({ searchValue }) {
      this.searchValue = searchValue
    },
    onSearchWithFieldValue ({ searchField, searchValue }) {
      if (!this.isResetFilters) {
        this.searchValue = searchValue
        this.$emit('on-search', {
          searchField,
          searchValue: searchField === ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE ? searchValue : trimMultipleSpaceStartEndString(searchValue)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/filter-head-table/search.scss">
</style>
