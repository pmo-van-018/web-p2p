<template>
  <div class="detail-note">
    <div class="detail-note__inner">
      <ul class="detail-note__list">
        <li class="detail-note__item">
          {{ $t('merchant.detail_cancelled.count_order', { count: cancelOrderCount }) }}
        </li>
        <li class="detail-note__item">
          {{ $t('merchant.detail_cancelled.count_appeal_order', { count: cancelOrderAppealCount }) }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cancelOrderCount: {
      type: Number,
      default: 0
    },
    cancelOrderAppealCount: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/detail-note.scss">
</style>
