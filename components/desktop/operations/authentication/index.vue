<template>
  <section class="authentication">
    <div class="authentication__wrapper">
      <div class="container authentication__container">
        <div class="authentication__inner">
          <div class="authentication__head">
            <div class="authentication__logo">
              <img :src="require('~imageRoot/common/header/logo-ano.svg')" alt="Logo Ano">
            </div>

            <div class="authentication__content">
              {{ $t('operations.login.welcome_title') }}
            </div>

            <div class="authentication__note">
              <div class="content-note">
                <div class="content-note__container">
                  <div class="content-note__inner">
                    <div class="content-note__head">{{ $t('operations.login.please_connect') }}</div>
                    <div class="content-note__desc">{{ $t('operations.login.note_content') }}</div>
                    <base-button
                      variants="contained"
                      color="primary"
                      :disabled="isShowCfVerify"
                      @click="onConnectWallet"
                    >
                      {{ $t('header.btn_wallet') }}
                    </base-button>
                    <div v-if="isShowCfVerify" class="authentication__verify">
                      <cf-turnstile :verify="isShowCfVerify" @challenge="onChangeVerifiedCfToken" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="authentication__footer">
            <div class="authentication__footer-text">{{ $t('operations.login.interested') }}:</div>
            <div class="authentication__footer-content">
              <p>{{ $t('operations.login.note') }}</p>
              <p>{{ $t('operations.login.note_last') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-section is-dark />
    <client-only>
      <modal-message ref="popupMessage" />
      <modal-sign-nonce @on-close="$_authMixin_onCloseSignNonce" />
      <ModalWalletAppStore />
      <ModalLogin2fa is-merchant />
    </client-only>
  </section>
</template>
<script>
import authMixin from '@/mixins/auth';
import { LOGIN_TYPE_ROLE } from '@/config/constant'
import loadScript from '@/helper/script-loader'
import { CLOUDFLARE_CDN } from '@/constants/external-link'
import ModalWalletAppStore from '@/components/common/modal/modal-open-wallet-store.vue'
import ModalLogin2fa from '@/components/common/modal/modal-login-2fa.vue';
import { mapActions } from 'vuex';
import FooterSection from '~/components/common/footer/index.vue'

export default {
  components: {
    ModalLogin2fa,
    FooterSection,
    ModalWalletAppStore,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalMessage: () => import('~/components/common/modal/modal-message.vue'),
    CfTurnstile: () => import('~/components/common/cf-turnstile/index.vue'),
    ModalSignNonce: () => import('~/components/common/modal/modal-sign-nonce.vue')
  },
  mixins: [authMixin],
  async created () {
    await Promise.all([
      this.getMaintenance(),
      this.getResources()
    ])
  },
  mounted () {
    loadScript(CLOUDFLARE_CDN, false)
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenance']),
    ...mapActions('resources', ['getResources']),
    onChangeVerifiedCfToken (cfToken) {
      this.onCfChallengeResultLogin(cfToken, LOGIN_TYPE_ROLE.OPERATION)
    },
    onConnectWallet () {
      if (this.$device.isMobileOrTablet) {
        this.onCfChallengeResultLogin(this.cfToken, LOGIN_TYPE_ROLE.OPERATION)
        return
      }
      if (!this.isShowCfVerify) {
        this.isShowCfVerify = true
        return
      }
      this.onCfChallengeResultLogin(this.cfToken, LOGIN_TYPE_ROLE.OPERATION)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/operations/authentication/index.scss">
</style>
