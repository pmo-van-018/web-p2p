<template>
  <div
    :class="['countdown-timer', {
      'warning': isWarning
    }
    ]"
  >
    <div class="countdown-timer__container">
      <div v-if="isLoader" class="countdown-timer__loader" />
      <div class="countdown-timer__content">
        <span class="countdown-timer__item">{{ firstDigitM }}</span><span class="countdown-timer__item">{{ secondDigitM }}</span>
        <span>:</span>
        <span class="countdown-timer__item">{{ firstDigitS }}</span><span class="countdown-timer__item">{{ secondDigitS }}</span>
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
    }
  },
  data () {
    return {
      timecount: 0,
      interval: null
    };
  },
  computed: {
    minuteLeft () {
      if (this.timecount > 0) {
        const oneHour = 1000 * 60 * 60;
        const oneMin = 1000 * 60;
        const minute = Math.floor((this.timecount % oneHour) / oneMin);
        return minute > 9 ? minute : `0${minute}`;
      }
      return '00';
    },
    secondLeft () {
      if (this.timecount > 0) {
        const oneMin = 1000 * 60;
        const oneSec = 1000;
        const second = Math.floor((this.timecount % oneMin) / oneSec);
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
    },
    isLoader () {
      return this.timeLeft !== 0
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
      this.timecount = this.timeLeft;
      const self = this;
      this.$emit('on-start-countdown')
      this.interval = setInterval(() => {
        if (self.timecount > 0) {
          if (!this.pauseCountdown) {
            self.timecount -= 1000;
          }
          self.$emit('get-current-time', self.timecount)
        } else {
          self.$emit('time-out')
          clearInterval(self.interval)
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/countdown-timer.scss">
</style>
