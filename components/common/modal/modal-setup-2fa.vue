<template>
  <ModalCommon
    :id="MODAL.SETUP_2FA"
    :ref="MODAL.SETUP_2FA"
    @hide-modal="close"
    @show-modal="shownPopup"
  >
    <div v-if="activeStep === steps.INSTALL" class="setup-2fa">
      <div class="setup-2fa__header">
        <img src="/assets/images/components/desktop/modal/2fa/google-2fa.png" alt="google-2fa">
        <p>{{ $t("2fa.download") }}</p>
      </div>
      <div class="setup-2fa__qrcode">
        <div class="qrcode">
          <div class="qrcode__image">
            <qrcode-vue :value="qrcode.google_play" class="image-content" />
          </div>
          <div class="qrcode__content">
            <p>{{ $t("2fa.get_app") }}</p>
            <p class="app-title">{{ $t("2fa.google_play") }}</p>
          </div>
        </div>
        <div class="qrcode">
          <div class="qrcode__image">
            <qrcode-vue :value="qrcode.apple_store" class="image-content" />
          </div>
          <div class="qrcode__content">
            <p>{{ $t("2fa.download_app") }}</p>
            <p class="app-title">{{ $t("2fa.apple_store") }}</p>
          </div>
        </div>
      </div>
      <div class="setup-2fa__action">
        <base-button
          class="confirm"
          variants="outlined"
          :loading="loading"
          @click="get2faKey"
        >
          {{ $t('2fa.continue') }}
        </base-button>
      </div>
    </div>
    <div v-if="activeStep === steps.REGISTER" class="setup-2fa">
      <div class="setup-2fa__qrcode">
        <div class="qrcode">
          <div class="qrcode__image register-step">
            <qrcode-vue :value="qrCodeUrl" class="image-content" :size="160" />
          </div>
          <div class="qrcode__content">
            <p class="register-title">{{ $t('2fa.register_title') }}</p>
            <p class="register-desc">{{ $t('2fa.register_note') }}</p>
          </div>
        </div>
      </div>
      <div class="setup-2fa__register-key">
        <span class="label">Key</span>
        <div class="key">
          <span>{{ keyDisplay }}</span>
          <span :class="iconToggleKey" @click="hideKey = !hideKey" />
        </div>
      </div>
      <div class="setup-2fa__action">
        <base-button class="confirm" variants="outlined" @click="activeStep = steps.INPUT_OTP">
          {{ $t('2fa.continue') }}
        </base-button>
      </div>
    </div>
    <div v-if="activeStep === steps.INPUT_OTP" class="setup-2fa">
      <div class="setup-2fa__header">
        <img src="/assets/images/components/desktop/modal/2fa/google-2fa.png" alt="google-2fa">
        <p class="input-otp">{{ $t("2fa.input_otp") }}</p>
      </div>
      <div class="setup-2fa__input-otp">
        <input
          v-model="otp"
          :placeholder="$t('2fa.input')"
          :maxlength="6"
          type="text"
          @input="validateOtp"
          @keyup.enter="submit"
        >
      </div>
      <div class="setup-2fa__action">
        <base-button variants="contained" full-width :disabled="!enableSubmitOtp" color="primary" @click="submit">
          {{ $t('home.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { REGISTER_STEPS } from '@/constants/2fa.js';
import auth from '@/mixins/auth';
import twoFactorAuth from '@/mixins/2fa'
import { RESPONSE_ICON } from '@/resources/message';
import { mapActions, mapState } from 'vuex';
import { TWO_FA_STATUS, USER_ROLE } from '@/config/constant';
import API_2FA from '@/api/2fa';
import { MODAL } from '@/resources/modal';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('@/components/common/base-button/index.vue'),
    QrcodeVue: () => import('qrcode.vue')
  },
  mixins: [auth, twoFactorAuth],
  data () {
    return {
      steps: REGISTER_STEPS,
      activeStep: REGISTER_STEPS.INSTALL,
      key: '',
      qrCodeUrl: '',
      success: false,
      hideKey: true,
      qrcode: {
        google_play: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=vi&gl=US',
        apple_store: 'https://apps.apple.com/us/app/google-authenticator/id388497605'
      }
    };
  },
  computed: {
    ...mapState('2fa', ['otpProcessing']),
    isAuthen2fa () {
      return [
        TWO_FA_STATUS.ENABLED,
        TWO_FA_STATUS.DISABLED
      ].includes(this.user?.twoFactorAuth?.totpStatus)
    },
    isMerchant () {
      return [
        USER_ROLE.MERCHANT_MANAGER,
        USER_ROLE.MERCHANT_SUPPORTER,
        USER_ROLE.MERCHANT_OPERATOR
      ].includes(this.user.type)
    },
    keyDisplay () {
      return this.hideKey ? Array(this.key.length).fill('*').join('') : this.key
    },
    iconToggleKey () {
      return this.hideKey ? 'icon-close-eye' : 'icon-open-eye'
    }
  },
  watch: {
    show (newValue, oldValue) {
      if (!newValue && oldValue && !this.isAuthen2fa && this.otpProcessing) {
        if (this.success) {
          window.location.reload()
        } else {
          this.showPopup()
        }
      }
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('2fa', ['setOtpProcessing']),
    showPopup () {
      if (this.otpProcessing) {
        this.activeStep = this.steps.INPUT_OTP
      }
      this.otp = '';
      this.$refs[MODAL.SETUP_2FA].show();
    },
    shownPopup () {
      this.otp = '';
      this.setOtpProcessing(false)
    },
    close () {
      this.activeStep = this.steps.INSTALL
    },
    async get2faKey () {
      this.loading = true
      const api = this.isMerchant ? API_2FA.MERCHANT_GENERATE_SECRET : API_2FA.ADMIN_GENERATE_SECRET;
      const response = await this.$axios.post(api)
      const { qrCodeUrl, secretKey } = response.data.data
      this.key = secretKey
      this.qrCodeUrl = qrCodeUrl
      this.activeStep = this.steps.REGISTER
      this.setOtpProcessing(true)
      this.loading = false
    },
    async submit () {
      if (!this.enableSubmitOtp) {
        return
      }
      this.loading = true
      this.setOtpProcessing(true)
      this.$bvModal.hide(MODAL.SETUP_2FA)
      try {
        const api = this.isMerchant ? API_2FA.MERCHANT_REGISTER_2FA : API_2FA.ADMIN_REGISTER_2FA;
        const { data } = await this.$axios.$post(api, { code: this.otp, secretKey: this.key })
        if (data.success) {
          this.showResult(
            this.$t('2fa.setup_success'),
            RESPONSE_ICON.SETUP_2FA_SUCCESS,
            'success'
          )
          this.success = true
          return
        }
        this.showResult(
          this.$t('2fa.otp_invalid'),
          RESPONSE_ICON.SETUP_2FA_FAIL,
          'error'
        )
      } catch (e) {
        const errorKey = e.response?.data?.errors?.[0]?.key || 'system_error'
        let content = this.$t('2fa.setup_fail')
        if (errorKey === 'TOO_MANY_REQUEST') {
          this.setOtpProcessing(false)
          content = this.$t('2fa.exceed_limit')
        }
        this.showResult(
          content,
          RESPONSE_ICON.SETUP_2FA_FAIL,
          'error'
        )
      } finally {
        this.loading = false
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-setup-2fa.scss"></style>
