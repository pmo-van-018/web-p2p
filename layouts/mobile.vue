<template>
  <main
    :class="[
      'main d-flex flex-column min-vh-100 main-mobile',
      { 'main-mobile--logged': !!userType && !isHideMenuBottom && menu.length },
      { 'main-mobile--background-secondary': backgroundSecondary },
    ]"
  >
    <SpriteSvg />
    <div v-if="hasMaintenance" class="main__maintenance"><maintenance-notion /></div>
    <Header class-name="mobile" :trigger-login="triggerLogin" :class="hasMaintenance ? 'main__header-top' : null" />
    <transition name="fade" mode="out-in">
      <nuxt />
    </transition>
    <template v-if="!isBotChromeLighthouse">
      <client-only>
        <MenuBottom v-if="!isHideMenuBottom && menu.length" :menu-items="menu" />
        <ModalMessage ref="popupMessage" class-name="mobile" />
        <ModalSignNonce modal-class="mobile" @on-close="$_authMixin_onCloseSignNonce" />
        <ModalSystemNote />
        <ModalWarningLogout @on-close="$_authMixin_onCloseWarningLogout" />
        <modal-response />
        <ModalWalletAppStore />
        <customer-care @on-support-request="++triggerLogin" />
        <template v-if="isVisibleGiftBox">
          <gift-box @close="isOpenGiftBox = false" />
        </template>
        <modal-referral-code v-if="isReferralCodeEnabled" />
        <modal-referral-code-success />
      </client-only>
    </template>
  </main>
</template>
<script>
import Header from '@/components/common/header/index';
import SpriteSvg from 'static/assets/images/common/icon-sprite.svg?inline'
import userBuyOrderMixin from '@/mixins/user-buy-order';
import MenuBottom from '@/components/common/footer/menu-bottom.vue';
import auth from '@/mixins/auth';
import { mapActions, mapState, mapGetters } from 'vuex';
import notificationMixin from '@/mixins/notification';
import { BOTTOM_BAR_MENU } from '@/resources/menu';
import { USER_ROLE } from '@/config/constant';
import loadScript from '@/helper/script-loader'
import { CLOUDFLARE_CDN } from '@/constants/external-link'
import notificationListMixin from '~/mixins/notification/notification-list';
import web3OnboardMixin from '~/mixins/web3-onboard/index.js';
import chatExceptionHandlerMixin from '~/mixins/chat/exception-handler';

export default {
  components: {
    Header,
    SpriteSvg,
    ModalMessage: () => import('@/components/common/modal/modal-message.vue'),
    ModalSystemNote: () => import('@/components/common/modal/modal-system-note.vue'),
    ModalSignNonce: () => import('@/components/common/modal/modal-sign-nonce.vue'),
    MenuBottom,
    ModalWalletAppStore: () => import('@/components/common/modal/modal-open-wallet-store.vue'),
    ModalWarningLogout: () => import('@/components/common/modal/modal-warning-logout.vue'),
    ModalResponse: () => import('~/components/common/modal/modal-response.vue'),
    CustomerCare: () => import('~/components/mobile/customer-care/index.vue'),
    GiftBox: () => import('~/components/common/gift-box/index.vue'),
    ModalReferralCode: () => import('~/components/common/modal/referral-code/index.vue'),
    ModalReferralCodeSuccess: () => import('~/components/common/modal/referral-code/success.vue'),
    MaintenanceNotion: () => import('~/components/desktop/maintenance/index.vue')
  },
  mixins: [userBuyOrderMixin, auth, notificationMixin, notificationListMixin, web3OnboardMixin, chatExceptionHandlerMixin],
  data () {
    return {
      qrSrc: '',
      titleModalQr: '',
      triggerLogin: 0,
      isOpenGiftBox: true
    };
  },
  head () {
    return {
      bodyAttrs: {
        class: `${this.isVisibleCustomerCare ? 'overflow-hidden' : ''} ${this.enableLightDarkMode ? 'theme-light-dark' : ''}`
      }
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('wallet', ['showV99Qr']),
    ...mapState('chat-support-request', ['isVisibleChat', 'chatNoti']),
    ...mapState('resources', ['assets', 'fiats']),
    ...mapGetters('user', ['enableLightDarkMode']),
    ...mapGetters('maintenance', ['hasMaintenance']),
    hasResources () {
      return !!this.assets.length && !!this.fiats.length
    },
    isHideMenuBottom () {
      return ['supporter-orders', 'type-order-detail-orderRefId'].includes(this.$route.name)
    },
    backgroundSecondary () {
      return ['user-dashboard'].includes(this.$route.name)
    },
    userType () {
      return this.user?.type || null
    },
    menu () {
      if (!this.userType) {
        return []
      }
      return BOTTOM_BAR_MENU[this.userType] || []
    },
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    isReferralCodeEnabled () {
      return this.$config.ENABLE_REFERRAL_CODE
    },
    isRouterMarketplace () {
      return ['marketplace', 'marketplace-type'].includes(this.$route.name)
    },
    isVisibleGiftBox () {
      return this.isRoleUser &&
          !this.user?.isReferred &&
          this.isOpenGiftBox &&
          this.isReferralCodeEnabled &&
          this.isRouterMarketplace
    },
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  },
  watch: {
    showV99Qr (value) {
      if (value) {
        this.$refs.popupConnectWallet.show()
        this.qrSrc = value.link
        this.titleModalQr = value.title || ''
      } else {
        this.$refs.popupConnectWallet.close()
      }
    }
  },
  async created () {
    if (!this.hasResources && !this.isRouterMarketplace) {
      await this.getResources()
    }
    if (process.client && !this.isBotChromeLighthouse) {
      await this.getMaintenance()
      await this.$_web3Onboard_initWalletOnboard()
      await this.$checkDisconnectedSession();
      await this.$_authMixin_checkCurrentAccount()
    }
  },
  mounted () {
    this.$_authMixin_checkShowSystemNote();
    this.$_authMixin_onSocket();
    loadScript(CLOUDFLARE_CDN, false)
    if (this.$store.state.user?.user) {
      this.getNotification();
    }
  },
  beforeDestroy () {
    this.$_authMixin_offSocket();
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenance']),
    ...mapActions('resources', ['getResources'])
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/layout/mobile.scss">
</style>
