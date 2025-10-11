<template>
  <div class="order-filter">
    <div class="d-flex">
      <div
        v-for="(value, key) in TOP_FILTER"
        :key="key"
        class="filter-item"
        :class="{
          selected: filterType === value.id,
          active: activeTopFilter(value.id),
          'mr-5': key === TOP_FILTER.MONEY.id
        }"
        @click="showModalFilter(value.id)"
      >
        {{ $t(value.name) }} <span class="icon-triangle-down" />
      </div>
    </div>
    <div class="filter-item" :class="{active: activeFilter()}" @click="openFilter">
      {{ $t('merchant.list_order.order_filter.filter') }}
      <span class="icon-filter" />
    </div>
    <ModalFilterTop
      :amount="amount"
      :filter-selected="filterType"
      :transfer-code="transferCode"
      @hide="filterType=''"
      @confirm-amount="$emit('confirm-amount', $event)"
      @confirm-transfercode="$emit('confirm-transfercode', $event)"
    />
    <ModalFilter
      :type="type"
      :amount="amount"
      :order-status="orderStatus"
      :transfer-code="transferCode"
      :order-direction="orderDirection"
      @submit="$emit('on-filter', $event)"
    />
  </div>
</template>

<script>
import ModalFilterTop from '@/components/mobile/modal/modal-orders-filter-top.vue';
import ModalFilter from '@/components/mobile/modal/modal-orders-filter.vue';
import { MODAL } from '@/resources/modal.js';
import { TOP_FILTER } from '@/resources/merchant/orders-filter.js';
export default {
  components: { ModalFilter, ModalFilterTop },
  props: {
    transferCode: {
      type: String,
      default: ''
    },
    orderStatus: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    orderDirection: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      MODAL,
      TOP_FILTER,
      filterType: ''
    }
  },
  methods: {
    showModalFilter (value) {
      this.filterType = value
      this.$bvModal.show(MODAL.ORDERS_FILTER_TOP)
    },
    openFilter () {
      this.$bvModal.hide(MODAL.ORDERS_FILTER_TOP)
      this.$bvModal.show(MODAL.ORDERS_FILTER)
    },
    activeTopFilter (value) {
      return (this.amount && value === TOP_FILTER.MONEY.id) || (this.transferCode && value === TOP_FILTER.TRANSFER_CODE.id)
    },
    activeFilter () {
      return this.amount || this.transferCode || this.type
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/orders-management/orders-filter.scss" />
