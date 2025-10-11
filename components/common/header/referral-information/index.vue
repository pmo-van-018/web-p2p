<template>
  <div class="referral-information">
    <div class="referral-information__wrapper">
      <div class="referral-information__inner">
        <div class="referral-information__text">{{ $t('referral_code.code_text') }}</div>
        <div class="referral-information__value">
          <span>{{ referralCode }}</span>
          <copy-button
            :id="`code-${referralCode}`"
            :value="referralCode"
            :show-text-copied="false"
            @on-copied="$emit('on-copied', $event)"
          />
        </div>
      </div>
      <div class="referral-information__inner">
        <div class="referral-information__text">{{ $t('referral_code.number_referral') }}</div>
        <div class="referral-information__value">{{ totalReferred }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  computed: {
    ...mapState('user', ['user']),
    referralCode () {
      return this.user?.referralCode || ''
    },
    totalReferred () {
      return this.user?.totalReferred || 0
    }
  }
}
</script>
<style lang="scss" scoped>
.referral-information {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__inner {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  &__text {
    @include font-t12m;
    color: var(--mode-light-dark-600);
   flex: 0 0 110px;
  }
  &__value {
    @include font-t14m;
    color: var(--mode-light-dark-1000);
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
