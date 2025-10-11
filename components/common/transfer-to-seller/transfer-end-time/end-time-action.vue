<template>
  <div class="transfer-seller-end-time-action">
    <div class="transfer-seller-end-time-action__header">
      <Countdown v-if="timeLeft > 0" :title="$t('transfer_seller.end_time.label.auto_cancel')" :time-left="timeLeft" @time-out="$emit('time-out')" />
    </div>
    <div class="transfer-seller-end-time-action__content">
      <button class="primary transfer-seller-end-time-action__submit">{{ $t('action.complain') }}</button>
      <button class="link" @click="$emit('cancel-payment')">{{ $t('action.cancel_transaction') }}</button>
    </div>
  </div>
</template>

<script>
import Countdown from '@/components/common/countdown.vue';

export default {
  components: { Countdown },
  props: {
    timeLeft: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-end-time/end-time-action.scss" />
