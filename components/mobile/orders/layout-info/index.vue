<template>
  <div class="layout-info">
    <div class="layout-info__container">
      <div class="layout-info__head">{{ title }}</div>
      <div class="layout-info__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/layout-info/index.scss">
</style>
