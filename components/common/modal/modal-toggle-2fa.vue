<template>
  <ModalCommon
    :id="MODAL.TOGGLE_2FA"
    :ref="MODAL.TOGGLE_2FA"
    @show-modal="shownPopup"
  >
    <div class="toggle-2fa">
      <div class="toggle-2fa__header">
        <img :src="`/assets/images/components/desktop/modal/2fa/${imageName}.png`" alt="toggle-2fa">
        <p class="title">{{ title }}</p>
        <p class="desc">{{ desc }}</p>
      </div>
      <div class="toggle-2fa__input-otp">
        <input
          v-model="otp"
          :placeholder="$t('2fa.input')"
          :maxlength="6"
          type="text"
          @input="validateOtp"
          @keyup.enter="submit"
        >
      </div>
      <div class="toggle-2fa__action">
        <base-button variants="contained" full-width color="grey" @click="closePopup">
          {{ $t('action.cancel') }}
        </base-button>
        <base-button variants="contained" full-width :disabled="!enableSubmitOtp" color="primary" @click="submit">
          {{ $t('home.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import twoFactorAuth from '@/mixins/2fa'
import { RESPONSE_ICON } from '@/resources/message';
import { MODAL } from '@/resources/modal';
import { mapActions, mapState } from 'vuex';
import API_2FA from '@/api/2fa';
import { TWO_FA_STATUS, USER_ROLE } from '@/config/constant';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('@/components/common/base-button/index.vue')
  },
  mixins: [twoFactorAuth],
  data () {
    return {
      success: false
    };
  },
  computed: {
    ...mapState('user', ['user']),
    isTurnOn2fa () {
      return this.user?.twoFactorAuth?.totpStatus === TWO_FA_STATUS.ENABLED
    },
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
    title () {
      return this.isTurnOn2fa ? this.$t('2fa.turn_off_title') : this.$t('2fa.turn_on_title')
    },
    desc () {
      return this.isTurnOn2fa ? this.$t('2fa.turn_off_desc') : this.$t('2fa.turn_on_desc')
    },
    imageName () {
      return this.isTurnOn2fa ? 'turn-off-2fa' : 'turn-on-2fa'
    }
  },
  watch: {
    show (newValue, oldValue) {
      if (!newValue && oldValue && this.isAuthen2fa && this.otpProcessing) {
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
      this.otp = '';
      this.$refs[MODAL.TOGGLE_2FA].show();
    },
    shownPopup () {
      this.otp = '';
      this.setOtpProcessing(false)
    },
    closePopup () {
      this.$refs[MODAL.TOGGLE_2FA].close();
    },
    async submit () {
      if (!this.enableSubmitOtp) {
        return
      }
      this.closePopup();
      this.setOtpProcessing(true)
      try {
        const apis = this.isMerchant ? [API_2FA.MERCHANT_REGISTER_2FA, API_2FA.MERCHANT_UNREGISTER_2FA] : [API_2FA.ADMIN_REGISTER_2FA, API_2FA.ADMIN_UNREGISTER_2FA];
        const api = this.isTurnOn2fa ? apis[1] : apis[0];
        const { data, errors } = await this.$axios.$post(api, { code: this.otp })
        if (errors?.length || !data.success) {
          this.showResult(
            this.$t('2fa.otp_invalid'),
            RESPONSE_ICON.SETUP_2FA_FAIL,
            'error'
          )
          return
        }
        this.showResult(
          this.isTurnOn2fa ? this.$t('2fa.turn_off_success') : this.$t('2fa.turn_on_success'),
          RESPONSE_ICON.SETUP_2FA_SUCCESS,
          'success'
        )
        this.success = true
      } catch (e) {
        const errorKey = e.response?.data?.errors?.[0]?.key || 'system_error'
        let content = this.$t('modal.message.system_failed')
        if (errorKey === 'TOO_MANY_REQUEST') {
          this.setOtpProcessing(false)
          content = this.$t('2fa.exceed_limit')
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
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-toggle-2fa.scss"></style>
