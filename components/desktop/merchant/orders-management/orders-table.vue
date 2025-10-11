<template>
  <div class="orders-table">
    <div class="t-head">
      <div class="t-col order-info" @click="setOrderField('id')">
        <div class="t-col__cnt">
          {{ $t('merchant.list_order.order_table.order_code') }}
          <svg>
            <use :xlink:href="getUrlIcon('id')" />
          </svg>
        </div>
      </div>
      <div class="t-col amount" @click="setOrderField('amount')">
        <div class="t-col__cnt">
          {{ $t('merchant.list_order.order_table.amount') }}
          <img :src="getUrlIcon('amount')">
        </div>
        <div class="t-col__cnt">{{ $t('merchant.list_order.order_table.crypto') }}</div>
      </div>
      <div class="t-col transfer-content">
        <div class="t-col__cnt">{{ $t('merchant.list_order.order_table.transfer_code') }}</div>
      </div>
      <div class="t-col progressing">
        <div class="t-col__cnt">{{ $t('merchant.list_order.order_table.progressing') }}</div>
      </div>
      <div class="t-col action">
        <div class="t-col__cnt justify-content-end">{{ $t('merchant.list_order.order_table.action') }}</div>
      </div>
    </div>
    <div :class="['t-body', {'t-body__empty': isEmptyOrders }]">
      <div v-if="isEmptyOrders">
        <no-data />
      </div>
      <Item
        v-for="order in orders"
        :key="order.orderId"
        :active-item="activeItem === order.orderId"
        :order="order"
        @onselect="activeItem = order.orderId"
        @cancel="activeItem = 0"
      />
    </div>
  </div>
</template>

<script>
import Item from './order-item.vue';
export default {
  components: {
    Item,
    NoData: () => import('@/components/common/no-data.vue')
  },
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeItem: 0,
      orderField: '',
      orderDirection: ''
    };
  },
  computed: {
    isEmptyOrders () {
      return this.orders.length === 0 && !this.isLoading
    }
  },
  methods: {
    setOrderField (value) {
      if (this.orderField !== value) {
        this.orderField = value
        this.orderDirection = ''
      }
      this.setOrderDirection()
      this.$emit('setOrderField', {
        orderField: this.orderField,
        orderDirection: this.orderDirection
      })
      this.$emit('set-order-field', this.orderField)
      this.$emit('set-order-direction', this.orderDirection)
    },
    resetData () {
      this.activeItem = 0
      this.orderField = ''
      this.orderDirection = ''
    },
    setOrderDirection () {
      if (this.orderDirection === '') {
        this.orderDirection = 'ASC'
      } else if (this.orderDirection === 'ASC') {
        this.orderDirection = 'DESC'
      } else {
        this.orderDirection = ''
      }
    },
    getUrlIcon (value) {
      if (this.orderField === value) {
        if (this.orderDirection === '') {
          return 'sort'
        }
        return this.orderDirection === 'ASC' ? '#sort-asc' : '#sort-desc'
      } else {
        return '#sort'
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/orders-table.scss" />
