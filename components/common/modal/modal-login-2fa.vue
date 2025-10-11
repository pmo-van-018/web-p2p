<template>
  <ModalCommon
    :id="MODAL.LOGIN_2FA"
    :ref="MODAL.LOGIN_2FA"
    @show-modal="shownPopup"
  >
    <div class="login-2fa">
      <div class="login-2fa__header">
        <img src="/assets/images/components/desktop/modal/2fa/login-2fa.png" alt="login-2fa">
        <p class="desc">{{ $t("2fa.get_otp") }}</p>
      </div>
      <div class="login-2fa__input-otp">
        <input
          v-model="otp"
          :placeholder="$t('2fa.input')"
          :maxlength="6"
          type="text"
          @input="validateOtp"
          @keyup.enter="submit"
        >
      </div>
      <div class="login-2fa__action">
        <base-button variants="contained" full-width :disabled="!enableSubmitOtp" color="primary" @click="submit">
          {{ $t('home.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import auth from '@/mixins/auth';
import twoFactorAuth from '@/mixins/2fa'
import { RESPONSE_ICON } from '@/resources/message';
import { MODAL } from '@/resources/modal';
import { mapActions } from 'vuex';
import API_2FA from '@/api/2fa';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('@/components/common/base-button/index.vue')
  },
  mixins: [auth, twoFactorAuth],
  props: {
    isMerchant: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      exceedLimit: false
    };
  },
  watch: {
    show (newValue, oldValue) {
      if (!newValue && oldValue && !this.exceedLimit && this.otpProcessing) {
        this.showPopup()
      }
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('2fa', ['setOtpProcessing']),
    showPopup () {
      this.$refs[MODAL.LOGIN_2FA].show();
    },
    shownPopup () {
      this.otp = '';
      this.setOtpProcessing(false)
    },
    closePopup () {
      this.$refs[MODAL.LOGIN_2FA].close();
    },
    async submit () {
      if (!this.enableSubmitOtp) {
        return
      }
      this.closePopup();
      this.setOtpProcessing(true)
      try {
        const api = this.isMerchant ? API_2FA.MERCHANT_LOGIN_2FA : API_2FA.ADMIN_LOGIN_2FA;
        const { errors } = await this.$axios.$post(api, { code: this.otp })
        if (errors?.length) {
          this.showResult(
            this.$t('2fa.otp_invalid'),
            RESPONSE_ICON.SETUP_2FA_FAIL,
            'error'
          )
          return
        }
        this.setOtpProcessing(false)
        window.location.reload()
      } catch (e) {
        const errorKey = e.response?.data?.errors?.[0]?.key || 'system_error'
        let content = this.$t('modal.message.system_failed')
        if (errorKey === 'TOO_MANY_REQUEST') {
          content = this.$t('2fa.exceed_limit')
          this.exceedLimit = true
        }
        this.showResult(
          content,
          RESPONSE_ICON.SETUP_2FA_FAIL,
          'error'
        )
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-login-2fa.scss"></style>
