<template>
  <div :class="['countdown', { 'warning': isWarning }]">
    <div v-if="title" class="countdown__title">{{ title }}</div>
    <div v-if="timeLeft !== null" class="countdown__inner">
      <div class="countdown__container">
        <span class="countdown__item">{{ firstDigitM }}</span><span class="countdown__item">{{ secondDigitM }}</span>
        <span class="countdown__mark">:</span>
        <span class="countdown__item">{{ firstDigitS }}</span><span class="countdown__item">{{ secondDigitS }}</span>
      </div>
      <span v-show="isVisibleMercyLoading && isVisibleLoader" class="countdown__loader" />
    </div>
    <p v-if="appealEndTime && !isMobile" class="appeal-limit">{{ appealEndTime }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    timeLeft: {
      type: [String, Number],
      default: ''
    },
    pauseCountdown: {
      type: Boolean,
      default: false
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
    isVisibleMercyLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timeCount: 0,
      interval: null,
      isVisibleLoader: false
    };
  },
  computed: {
    minuteLeft () {
      if (this.timeCount > 0) {
        const oneHour = 1000 * 60 * 60;
        const oneMin = 1000 * 60;
        const minute = Math.floor((this.timeCount % oneHour) / oneMin);
        return minute > 9 ? minute : `0${minute}`;
      }
      return '00';
    },
    secondLeft () {
      if (this.timeCount > 0) {
        const oneMin = 1000 * 60;
        const oneSec = 1000;
        const second = Math.floor((this.timeCount % oneMin) / oneSec);
        return second > 9 ? second : `0${second}`;
      }
      return '00';
    },
    firstDigitM () {
      return this.minuteLeft.toString().charAt(0);
    },
    secondDigitM () {
      return this.minuteLeft.toString().charAt(1);
    },
    firstDigitS () {
      return this.secondLeft.toString().charAt(0);
    },
    secondDigitS () {
      return this.secondLeft.toString().charAt(1);
    }
  },
  watch: {
    timeLeft () {
      clearInterval(this.interval);
      this.startCountdown()
    }
  },
  mounted () {
    this.startCountdown();
  },
  destroyed () {
    clearInterval(this.interval);
  },
  methods: {
    startCountdown () {
      this.timeCount = this.timeLeft;
      this.isVisibleLoader = false
      const self = this;
      self.$emit('on-start-countdown')
      this.interval = setInterval(() => {
        if (self.timeCount > 0) {
          if (!this.pauseCountdown) {
            self.timeCount -= 1000;
          }
          self.$emit('get-current-time', self.timeCount)
        } else {
          self.$emit('time-out')
          this.isVisibleLoader = true
          clearInterval(self.interval)
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/countdown.scss" />
