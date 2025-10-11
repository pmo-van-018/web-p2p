<template>
  <div class="waiting-action">
    <div class="waiting-action__header">
      <Countdown v-if="timeLeft > 0" :title="$t('transfer_seller.waiting.label.problem_transaction')" :time-left="timeLeft" @time-out="$emit('time-out')" />
    </div>
    <div class="waiting-action__desc">
      {{ $t('transfer_seller.note.transfer_waiting.sub_title') }}
    </div>
    <div class="waiting-action__content">
      <button disabled class="primary waiting-action__submit">{{ $t('action.complain') }}</button>
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
<style lang="scss" scoped src="static/assets/scss/components/common/transfer-to-seller/transfer-waiting/waiting-action.scss" />
