<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
  >
    <div class="referral-code">
      <div class="referral-code__container">
        <div class="referral-code__thumbnail">
          <img :src="require('~imageRoot/common/referral-code/gift-succeed.svg')" alt="Referral Code">
        </div>
        <div class="referral-code__content">
          <div class="referral-code__title">{{ $t('referral_code.title_success') }}</div>
          <div class="referral-code__description">{{ $t('referral_code.description_success') }}</div>
        </div>
        <div v-if="referralCode" class="referral-code__footer">
          <div class="referral-code__copy">
            <div class="referral-code__copy-text">{{ referralCode }}</div>
            <div class="referral-code__copy-action">
              <copy-button :id="`referral-code-${referralCode}`" :value="referralCode" :show-text-copied="false" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { mapState } from 'vuex'
import { MODAL } from '~/resources/modal'

export default {
  components: {
    ModalCommon,
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  data () {
    return {
      modalId: MODAL.REFERRAL_CODE_SUCCEED
    }
  },
  computed: {
    ...mapState('user', ['user']),
    referralCode () {
      return this.user?.referralCode || ''
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/referral-code/success.scss">
</style>
