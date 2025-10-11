<template>
  <div class="order-detail" :class="{ active: active }">
    <OrderOverview :order-detail="orderDetail" :active="active" @click="$emit('click')" />
    <div class="content">
      <OrderInfo :order-detail="orderDetail" />
      <div class="divider" />
      <OrderMethod :order-detail="orderDetail" />
      <div class="divider" />
      <OrderListTx :order-detail="orderDetail" />
    </div>
    <FooterBuyOrder :order-detail="orderDetail" @confirm="$emit('confirm')" />
  </div>
</template>

<script>
import OrderInfo from '../order-detail/order-info.vue';
import OrderMethod from '../order-detail/order-method.vue';
import OrderListTx from '../order-detail/order-list-tx.vue';
import FooterBuyOrder from '../order-detail/order-footer.vue';
import OrderOverview from '../order-detail/order-overview.vue';
export default {
  components: { OrderInfo, OrderOverview, OrderListTx, OrderMethod, FooterBuyOrder },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    };
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/order-detail.scss" />
