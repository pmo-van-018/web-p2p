<template>
  <div class="countdown-action">
    <div class="countdown-action__header">
      <countdown
        :title="title"
        :time-left="timeLeft"
        :class="classCountdown"
        :is-visible-time-out="isVisibleTimeOut"
        :pause-countdown="pauseCountdown"
        :appeal-end-time="appealEndTime"
        :is-mobile="isMobile"
        :is-warning="isWarning"
        is-visible-mercy-loading
        @get-current-time="$emit('get-current-time', $event)"
        @time-out="$emit('time-out')"
      />
    </div>
    <div class="countdown-action__desc" :class="{ 'appeal-limit': isShowAppealTime }">
      {{ subTitle }}
      <span v-if="isShowAppealTime">{{ appealEndTime }}</span>
    </div>
    <slot />
  </div>
</template>

<script>
import Countdown from '@/components/common/countdown.vue';
export default {
  components: {
    Countdown
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    timeLeft: {
      type: [Number, null],
      required: false,
      default: null
    },
    pauseCountdown: {
      type: Boolean,
      default: false
    },
    classCountdown: {
      type: String,
      default: ''
    },
    appealEndTime: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    isWarning: {
      type: Boolean,
      default: false
    },
    isVisibleTimeOut: {
      type: Boolean,
      default: false
    },
    isVisibleMercyLoading: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isShowAppealTime () {
      return this.appealEndTime && this.isMobile
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/countdown-action.scss" />
