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
          :placeholder="`${$t('blacklist.search_input')}`"
          @input="handleSearch"
        />
        <DropdownFilter
          :title="$t('blacklist.placeholder_type')"
          :list-filter="typeOptions"
          :selected="selectedType"
          name-attribute="label"
          value-attribute="id"
          @on-select="handleFilterType"
        />
      </template>
      <template #other>
        <div class="filter-head-table__action">
          <base-button variants="outlined" color="primary" @click="$emit('on-create')">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              <span class="text">{{ $t('action.add_wallet_address') }}</span>
            </div>
          </base-button>
        </div>
      </template>
    </filter-head-table>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { BLACKLIST_TYPE } from '@/constants/blacklist';
export default {
  components: {
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedType: {},
      searchValue: null,
      isRefreshed: false,
      typeOptions: [
        { id: BLACKLIST_TYPE.MANUAL, name: '', label: 'blacklist.type.manual' },
        { id: BLACKLIST_TYPE.CRAWL, name: '', label: 'blacklist.type.crawl' }
      ]
    }
  },
  computed: {
    disableResetFilter () {
      return isEmpty(this.selectedType) &&
          !this.searchValue
    },
    filterOptions () {
      return {
        type: this.selectedType?.id,
        search: this.searchValue
      }
    }
  },
  methods: {
    handleFilterType (type) {
      this.selectedType = type;
      this.$emit('on-filters', this.filterOptions);
    },
    handleSearch: debounce(function (searchValue) {
      if (this.isRefreshed) {
        this.isRefreshed = false;
        return;
      }
      this.searchValue = searchValue;
      this.$emit('on-filters', this.filterOptions);
    }, 500),
    handleResetFilter () {
      this.isRefreshed = true;
      this.selectedType = {}
      this.searchValue = null;
      this.$emit('on-reset');
      debounce(() => {
        this.isRefreshed = false;
      }, 600)();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/blacklists/blacklist-filter.scss">
</style>
