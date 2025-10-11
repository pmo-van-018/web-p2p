<template>
  <div class="order-pending">
    <div class="order-pending__filter">
      <div class="order-pending__filter-item" :class="{'order-pending__filter-item--active': showAmountFilter || amountFilter}" @click="showFilter('amount')">
        {{ $t('user_orders.amount_mobile') }}
        <span class="icon-triangle-down" />
      </div>
      <div class="order-pending__filter-item" :class="{'order-pending__filter-item--active': showContentFilter || contentFilter}" @click="showFilter('content')">
        {{ $t('user_orders.transaction_info') }}
        <span class="icon-triangle-down" />
      </div>
      <div class="order-pending__filter-item" :class="{'order-pending__filter-item--active-no-rote': amountFilter || contentFilter}">
        {{ $t('user_orders.filter_title') }}
        <span class="icon-filter" />
      </div>
    </div>
    <ContentFilter v-if="showAmountFilter" key="amount-filter" v-model="amountFilter" amount />
    <ContentFilter v-if="showContentFilter" key="content-filter" v-model="contentFilter" />
    <div class="order-pending__list">
      <OrderItem v-for="order in listOrders" :key="order.orderId" :order="order" @go-detail="goDetail" />
    </div>
  </div>
</template>

<script>
import OrderItem from '@/components/mobile/user-orders/order-item.vue';
import ContentFilter from '@/components/mobile/user-orders/content-filter.vue';
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { mapActions } from 'vuex';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { convertToStringQuery } from '@/helper/index';
export default {
  components: {
    OrderItem,
    ContentFilter
  },
  mixins: [userBuyOrderMixin],
  data () {
    return {
      listOrders: [],
      firstFetch: true,
      showAmountFilter: false,
      showContentFilter: false,
      contentFilter: '',
      amountFilter: ''
    };
  },
  watch: {
    contentFilter: {
      handler (value) {
        this.showContentFilter = false
        if (value) {
          this.amountFilter = ''
        }
        this.fetchData();
      },
      deep: true
    },
    amountFilter: {
      handler (value) {
        this.showAmountFilter = false
        if (value) {
          this.contentFilter = ''
        }
        this.fetchData();
      },
      deep: true
    }
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    ...mapActions('end-user', ['setBuyInfo', 'getListOrder']),
    async fetchData () {
      const query = {
        orderStatus: [
          STATUS_ORDER_BUY.TO_BE_PAID.value,
          STATUS_ORDER_BUY.CONFIRM_PAID.value,
          STATUS_ORDER_BUY.PAID.value
        ],
        limit: 20,
        page: 1
      };
      if (this.contentFilter) {
        query.search = this.contentFilter
      }
      if (this.amountFilter) {
        query.search = this.$options.filters.formatMarkToNumber(this.amountFilter)
      }
      const result = await this.getListOrder(convertToStringQuery(query));
      if (result?.data) {
        this.totalOrders = result.data.total;
        this.listOrders = result.data.orders;
        if (this.firstFetch) {
          this.firstFetch = false
          this.$emit('fetch-number-order', result.data.total)
        }
      }
    },
    showFilter (filter) {
      if (filter === 'content') {
        this.showAmountFilter = false
        this.showContentFilter = !this.showContentFilter
      } else if (filter === 'amount') {
        this.showContentFilter = false
        this.showAmountFilter = !this.showAmountFilter
      }
    },
    goDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-orders/history.scss" />
