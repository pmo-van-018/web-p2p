<template>
  <div class="process-countdown">
    <div class="process-countdown__container">
      <div :class="['process-countdown__inner', {'process-countdown__inner--vertical': isVertical }]">
        <div v-if="text" class="process-countdown__text">
          <div v-html="text" />
        </div>
        <div class="process-countdown__content">
          <div v-if="isVisibleTimeOut" class="process-countdown__countdown">
            <count-down
              :time-left="timeOut"
              :is-warning="isWarning"
              is-visible-mercy-loading
              :pause-countdown="pauseCountdown"
              @time-out="$emit('time-out')"
            />
          </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    CountDown: () => import('~/components/common/countdown.vue')
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    isVertical: {
      type: Boolean,
      default: false
    },
    pauseCountdown: {
      type: Boolean,
      default: false
    },
    timeOut: {
      type: [Number, null],
      required: false,
      default: null
    },
    isVisibleTimeOut: {
      type: Boolean,
      default: false
    },
    isWarning: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/progressing-countdown/index.scss">
</style>
