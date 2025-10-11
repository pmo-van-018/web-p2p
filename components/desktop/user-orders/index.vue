<template>
  <div class="user-orders">
    <div class="user-orders__header">
      <div class="user-orders__header-container">
        <div class="user-orders__header-title">
          {{ $t('user_orders.title') }}
        </div>
        <div class="user-orders__header-tab">
          <div
            class="user-orders__header-tab-item"
            :class="{'user-orders__header-tab-item--active': tabActive === 0}"
            @click="tabActive = 0"
          >
            {{ $t('user_orders.status_pending') }}
            <span v-if="numberOrderPending" class="pill-number font-t14b text-center ml-1">{{ numberOrderPending }}</span>
          </div>
          <div
            class="user-orders__header-tab-item"
            :class="{'user-orders__header-tab-item--active': tabActive === 1}"
            @click="tabActive = 1"
          >
            {{ $t('user_orders.status_done') }}
          </div>
        </div>
      </div>
    </div>
    <div class="user-orders__content">
      <OrderPending v-if="tabActive === 0" @fetch-number-order="fetchNumberOrder" />
      <History v-if="tabActive === 1" />
    </div>
  </div>
</template>

<script>
import History from '@/components/desktop/user-orders/history.vue';
import OrderPending from '@/components/desktop/user-orders/order-pending.vue';
export default {
  components: {
    History,
    OrderPending
  },
  data () {
    return {
      tabActive: 0,
      numberOrderPending: 0
    }
  },
  mounted () {
    if (this.$route.query.tab === 'completed') {
      this.tabActive = 1
    }
  },
  methods: {
    fetchNumberOrder (value) {
      this.numberOrderPending = value
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-orders/index.scss" />
