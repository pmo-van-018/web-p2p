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
      </template>
      <template #other>
        <div class="filter-head-table__action">
          <base-button variants="outlined" color="primary" @click="$emit('on-create')">
            <div class="d-flex align-items-center">
              <span class="icon-add-primary" />
              <span class="text">{{ $t('admin.create') }}</span>
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
import { MODAL } from '@/resources/modal.js';
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders';

export default {
  components: {
    FilterHeadTable: () => import('~/components/desktop/commons/filter-head-table/index.vue'),
    ModalAdd: () => import('~/components/desktop/system-admin/admins/modal-add.vue'),
    SearchMultipleGroup: () => import('~/components/desktop/orders/search-multiple-group/index.vue'),
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
      selectedStatus: {},
      searchValue: null,
      isRefreshed: false,
      MODAL,
      searchField: null,
      ORDER_FIELD_SEARCH_GROUP
    }
  },
  computed: {
    disableResetFilter () {
      return !this.searchValue
    },
    filterOptions () {
      return {
        searchField: this.searchField,
        searchValue: this.searchValue
      }
    }
  },
  methods: {
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
    handleResetFilter () {
      this.isRefreshed = true;
      this.searchField = null;
      this.searchValue = null;
      this.$emit('on-reset');
      // Delay and reset the value of isRefreshed
      debounce(() => {
        this.isRefreshed = false;
      }, 600)();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/filter.scss" />
