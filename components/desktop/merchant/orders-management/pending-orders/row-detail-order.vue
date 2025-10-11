<template>
  <section class="detail-order">
    <detail-row-order
      :order="order"
      :joined-room="joinedRoom"
      :manager-view="managerView"
      :is-loading="isLoading"
      @on-transfer="$emit('on-transfer', $event)"
      @on-pay="$emit('on-pay', $event)"
      @close="$emit('close')"
      @on-confirmed-processed="$emit('on-confirmed-processed', $event)"
      @on-open-appeal="$emit('on-open-appeal', order)"
      @on-term-transfer="$emit('on-term-transfer', order)"
    />
  </section>
</template>
<script>
export default {
  components: {
    DetailRowOrder: () => import('~/components/desktop/orders/table/detail-row-order/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    joinedRoom: {
      type: Boolean,
      default: true
    },
    managerView: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
