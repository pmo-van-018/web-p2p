<template>
  <div class="waiting-end-time-action">
    <div class="waiting-end-time-action__header">
      <div class="waiting-end-time-action__title">
        {{ $t('transfer_seller.waiting.label.auto_cancel') }}
      </div>
      <Countdown v-if="timeLeft > 0" :time-left="timeLeft" @time-out="$emit('action', 'timeOut')" />
    </div>
    <div class="waiting-end-time-action__content">
      <button class="primary waiting-end-time-action__submit" @time-out="$emit('action', 'complain')">{{ $t('action.complain') }}</button>
    </div>
  </div>
</template>

<script>
import Countdown from '@/components/common/countdown.vue';
import { mapState } from 'vuex';
export default {
  components: { Countdown },
  data () {
    return {
      step: 0,
      timeLeft: 0
    }
  },
  computed: {
    ...mapState('end-user', ['buyOrderInfo'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-waiting-end-time/waiting-end-time-action.scss" />
