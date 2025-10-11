<template>
  <div class="message-order">
    <div class="message-order__content">{{ content }}</div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/message-order/index.scss">
</style>
