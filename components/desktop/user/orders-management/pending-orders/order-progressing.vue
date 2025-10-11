<template>
  <div class="order-progressing">
    <progressing-countdown
      :is-visible-time-out="isVisibleTimeOut"
      :text="processDescriptionCountdown"
      :pause-countdown="pauseCountdown"
      :time-out="timeoutMilliSeconds"
      :is-warning="isWarningTimeOut"
      is-vertical
      @time-out="onTimeOut"
    />
  </div>
</template>
<script>
import countdownActionMixin from '~/mixins/user/orders/countdown-action'

export default {
  components: {
    ProgressingCountdown: () => import('@/components/desktop/orders/progressing-countdown')
  },
  mixins: [countdownActionMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-progressing.scss">
</style>
