<template>
  <div class="order-info">
    <div class="order-info__id">
      {{ $t('transfer_seller.label.order_number') }}
      <span>{{ '#' + orderId }}</span>
    </div>
    <div class="order-info__time">
      {{ $t("transfer_seller.label.time_create") }}
      <span>{{ time }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: [String, Number],
      default: ''
    },
    time: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/order-info.scss" />
