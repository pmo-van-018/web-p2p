<template>
  <main :class="['main d-flex flex-column min-vh-100']">
    <SpriteSvg />
    <div v-if="hasMaintenance" class="main__maintenance"><maintenance-notion /></div>
    <Header :trigger-login="triggerLogin" :no-container="isRouterHasNoContainer" :class="hasMaintenance ? 'main__header-top' : null" />
    <template v-if="isShowNotificationMenu">
      <Menu class="nav-bar" :class="hasMaintenance ? 'main__nav-bar' : null" />
      <div class="management-container">
        <transition name="fade-transform" mode="out-in">
          <nuxt />
        </transition>
      </div>
    </template>
    <nuxt v-else class="flex-grow-1" />
    <Footer v-if="isVisibleFooter" />
    <client-only>
      <ModalSignNonce @on-close="$_authMixin_onCloseSignNonce" />
      <ModalResultConnectWallet ref="popupResultConnectWallet" />
      <ModalMessage ref="popupMessage" />
      <ModalSystemNote />
      <modal-response />
      <ModalWarningLogout @on-close="$_authMixin_onCloseWarningLogout" />
      <div class="management-container__chat-supporter">
        <div class="management-container__chat-supporter-inner">
          <icon-chat
            v-if="isVisibleChatFrame"
            class="user-order-detail__chat-action"
            :unread="chatNotiAppeal"
            bordered
            :icon="chatNotiAppeal ? 'unread-message' : 'read-message'"
            @click="onOpenChatAppeal"
          />
          <icon-chat
            v-if="isVisibleSupportChat"
            :unread="chatNotiSupport"
            :icon="chatNotiSupport ? 'support-unread' : 'support-read'"
            @click="onOpenChatSupport"
          />
        </div>
      </div>
      <customer-care-chat @on-support-request="++triggerLogin" />
      <template v-if="isVisibleGiftBox">
        <gift-box @close="isOpenGiftBox = false" />
      </template>
      <modal-referral-code v-if="isReferralCodeEnabled" />
      <modal-referral-code-success />
    </client-only>
  </main>
</template>
<script>
import Header from '@/components/common/header/index'
import Menu from '@/components/common/left-menu-notification.vue'
import Footer from '@/components/common/footer/index'
import userBuyOrderMixin from '@/mixins/user-buy-order'
import auth from '@/mixins/auth'
import notificationMixin from '@/mixins/notification'
import { mapState, mapActions, mapGetters } from 'vuex';
import { ORDER_STATUS, USER_ROLE } from '@/config/constant'
import loadScript from '@/helper/script-loader'
import { CLOUDFLARE_CDN } from '@/constants/external-link'
import SpriteSvg from 'static/assets/images/common/icon-sprite.svg?inline'
import notificationListMixin from '~/mixins/notification/notification-list';
import web3OnboardMixin from '~/mixins/web3-onboard/index.js';
import chatExceptionHandlerMixin from '~/mixins/chat/exception-handler';

export default {
  components: {
    Header,
    Menu,
    Footer,
    SpriteSvg,
    ModalResultConnectWallet: () => import('@/components/desktop/modal/result-connect-wallet.vue'),
    ModalMessage: () => import('@/components/common/modal/modal-message.vue'),
    ModalSignNonce: () => import('@/components/common/modal/modal-sign-nonce.vue'),
    ModalSystemNote: () => import('@/components/common/modal/modal-system-note.vue'),
    ModalWarningLogout: () => import('@/components/common/modal/modal-warning-logout.vue'),
    ModalResponse: () => import('~/components/common/modal/modal-response.vue'),
    IconChat: () => import('~/components/common/icons/icon-chat.vue'),
    CustomerCareChat: () => import('~/components/desktop/customer-care/index.vue'),
    GiftBox: () => import('~/components/common/gift-box/index.vue'),
    ModalReferralCode: () => import('~/components/common/modal/referral-code/index.vue'),
    ModalReferralCodeSuccess: () => import('~/components/common/modal/referral-code/success.vue'),
    MaintenanceNotion: () => import('~/components/desktop/maintenance/index.vue')
  },
  mixins: [
    userBuyOrderMixin,
    auth,
    notificationMixin,
    notificationListMixin,
    web3OnboardMixin,
    chatExceptionHandlerMixin
  ],
  data () {
    return {
      qrSrc: '',
      titleModalQr: '',
      checkRoute: '',
      isVisibleFooter: true,
      triggerLogin: 0,
      isOpenGiftBox: true,
      isVisibleSupportChat: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('wallet', ['showV99Qr']),
    ...mapState('chat-support-request', ['isVisibleChat']),
    ...mapState('end-user', ['buyOrderInfo']),
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState({
      chatNotiSupport: state => state['chat-support-request']?.chatNoti
    }),
    ...mapState({
      chatNotiAppeal: state => state.chat.chatNoti
    }),
    ...mapGetters('maintenance', ['hasMaintenance']),
    ...mapGetters('user', ['enableLightDarkMode']),
    isShowNotificationMenu () {
      return ['notification'].includes(this.$route.name)
    },
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    isOrderProcessing () {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.buyOrderInfo?.status)
    },
    isVisibleChatFrame () {
      return this.isRoleUser && this.isOrderProcessing && this.buyOrderInfo?.roomId && this.$route.name === 'type-order-detail-orderRefId'
    },
    isReferralCodeEnabled () {
      return this.$config.ENABLE_REFERRAL_CODE
    },
    isRouterMarketplace () {
      return ['marketplace', 'marketplace-type'].includes(this.$route.name)
    },
    isRouterHasNoContainer () {
      return ['notification'].includes(this.$route.name)
    },
    isVisibleGiftBox () {
      return this.isRoleUser &&
          !this.user?.isReferred &&
          this.isOpenGiftBox &&
          this.isReferralCodeEnabled &&
          this.isRouterMarketplace
    },
    hasResources () {
      return !!this.assets.length && !!this.fiats.length
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
    },
    '$route.name': {
      handler () {
        const router = ['marketplace', 'marketplace-type']
        this.isVisibleFooter = router.includes(this.$route.name)
      },
      immediate: true
    }
  },
  async created () {
    if (!this.hasResources && !this.isRouterMarketplace) {
      await this.getResources()
    }
    if (process.client) {
      await this.getMaintenance()
      await this.$_web3Onboard_initWalletOnboard()
      await this.$checkDisconnectedSession();
      await this.$_authMixin_checkCurrentAccount()
    }
  },
  mounted () {
    if (window.location.host === this.$config.USER_DOMAIN) {
      this.isVisibleSupportChat = true
    }
    this.$_authMixin_onSetChainChangedNetwork();
    this.$_authMixin_checkShowSystemNote();
    this.$_authMixin_onSocket();
    if (this.user) {
      this.getNotification()
    }
    loadScript(CLOUDFLARE_CDN, false)
  },
  beforeDestroy () {
    this.$_authMixin_offSocket();
    this.setVisibleChatSupportRequest(false)
  },
  methods: {
    ...mapActions('end-user', ['setBuyInfo']),
    ...mapActions('wallet', ['setResultConnectWallet']),
    ...mapActions('chat', ['setVisibleChat', 'toggleVisibleChat', 'setOrder']),
    ...mapActions('resources', ['getResources']),
    ...mapActions({
      setVisibleChatSupportRequest: 'chat-support-request/setVisibleChat'
    }),
    ...mapActions('maintenance', ['getMaintenance']),
    showResultConnect (res) {
      this.setResultConnectWallet(res)
      this.$refs.popupResultConnectWallet.show()
    },
    onOpenChatSupport () {
      this.setVisibleChatSupportRequest(!this.isVisibleChat)
      this.setVisibleChat(false)
    },
    onOpenChatAppeal () {
      this.setOrder(this.buyOrderInfo)
      this.toggleVisibleChat()
      this.setVisibleChatSupportRequest(false)
    }
  },
  head () {
    return {
      bodyAttrs: {
        class: `${this.enableLightDarkMode ? 'theme-light-dark' : ''}`
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/layout/desktop.scss">
</style>
