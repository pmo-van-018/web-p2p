<template>
  <div class="status-change">
    <div class="status-change__inner" :class="{ 'status-change__online': status }">
      {{ status ? $t('customer_care.online') : $t('customer_care.offline') }}
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/status.scss">
</style>
<script>
export default {
  props: {
    status: {
      type: Boolean,
      default: false
    }
  }
}
</script>
