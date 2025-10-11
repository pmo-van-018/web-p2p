<template>
  <div class="orders-filter">
    <div class="d-flex gap-12">
      <DropdownFilter
        :title="$t('merchant.list_order.order_filter.type')"
        :list-filter="LIST_POST_TYPE"
        :selected="postTypeSelected"
        @on-select="onSelectPostType"
      />
      <DropdownFilter
        :title="$t('merchant.list_order.order_filter.status')"
        :list-filter="listStatus"
        :selected="statusSelected"
        @on-select="onSelectStatus"
      />
      <div class="search">
        <input
          v-model="searchValue"
          :placeholder="$t('merchant.list_order.order_filter.placeholder')"
          class="search__input"
        >
        <b-tooltip
          target="delete-search"
          triggers="hover"
          placement="top"
        >
          <span class="search-delete-label">{{ $t("home.delete") }}</span>
        </b-tooltip>
        <span
          v-show="isShowIconClose"
          id="delete-search"
          class="icon icon-close-circle-outline"
          @click="delSearchValue"
        />
        <span v-show="isShowIconSearch" class="icon icon-search-outline" />
      </div>
      <button class="link" :disabled="isDisableReset" @click="resetFilter">Thiết lập lại bộ lọc</button>
    </div>
    <div class="refresh-btn" @click="$emit('refresh')">
      <span class="icon-loading"><span class="path1" /><span class="path2" /></span>
      {{ $t('merchant.list_order.order_filter.refresh') }}
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { LIST_STATUS_BUY_PENDING, LIST_STATUS_SELL_PENDING, LIST_POST_TYPE } from '@/resources/merchant/orders-filter.js';
import DropdownFilter from '~/components/desktop/commons/dropdown-filter/index.vue';

const DELAY_SEARCH_TIME = 500;

export default {
  components: { DropdownFilter },
  data () {
    return {
      LIST_POST_TYPE,
      LIST_STATUS_BUY_PENDING,
      LIST_STATUS_SELL_PENDING,
      searchValue: '',
      statusSelected: {},
      postTypeSelected: {}
    };
  },
  computed: {
    isShowIconSearch () {
      return !this.searchValue.trim().length;
    },
    isShowIconClose () {
      return this.searchValue.trim().length;
    },
    isDisableReset () {
      return this.searchValue === '' &&
      isEmpty(this.statusSelected) &&
      isEmpty(this.postTypeSelected)
    },
    listStatus () {
      return this.postTypeSelected?.value === ORDER_TYPE.SELL
        ? LIST_STATUS_SELL_PENDING
        : LIST_STATUS_BUY_PENDING;
    }
  },
  watch: {
    searchValue (value, oldValue) {
      this.onSearch(value);
    }
  },
  methods: {
    delSearchValue () {
      this.searchValue = '';
    },
    resetFilter () {
      this.searchValue = ''
      this.postTypeSelected = {}
      this.statusSelected = {}
      this.onSelectPostType = {}
      this.$emit('on-reset-filter')
    },
    onSearch: debounce(function (amount) {
      this.$emit('on-search', amount)
    }, DELAY_SEARCH_TIME),
    onSelectStatus (e) {
      this.statusSelected = e
      this.$emit('on-selected-status', e.value)
    },
    onSelectPostType (e) {
      this.postTypeSelected = e
      this.statusSelected = {}
      this.$emit('on-selected-type', e.value)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/orders-filter.scss" />
