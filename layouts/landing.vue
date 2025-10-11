<template>
  <main :class="['main d-flex flex-column min-vh-100 landing-section']">
    <SpriteSvg />
    <client-only>
      <div v-if="isEnableMaintenance" class="landing-section__maintenance">
        <maintenance-notion />
      </div>
    </client-only>
    <header-landing ref="pageHeader" class="landing-section__header is-sticky" :class="isEnableMaintenance ? 'landing-section__header-top' : null" @on-open-wallet="handleConnectWallet" />
    <nav-bar-landing ref="pageNavBar" class="landing-section__navbar is-sticky" :class="isEnableMaintenance ? 'landing-section__header-top' : null" @on-open-wallet="handleConnectWallet" />
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <nuxt />
      </keep-alive>
    </transition>
    <footer-landing />
    <client-only v-if="!isBotChromeLighthouse">
      <div class="landing-section__chat-supporter">
        <div class="landing-section__chat-supporter-inner">
          <icon-chat
            v-if="isVisibleSupportChat"
            :unread="chatNotiSupport"
            :icon="chatNotiSupport ? 'support-unread' : 'support-read'"
            @click="onOpenChatSupport"
          />
        </div>
      </div>
      <customer-care-chat-desktop v-if="$device.isDesktop" @on-support-request="handleConnectWallet" />
      <customer-care-chat-mobile v-else @on-support-request="handleConnectWallet" />
    </client-only>
  </main>
</template>
<script>
import SpriteSvg from 'static/assets/images/common/icon-sprite.svg?inline'
import { mapActions, mapGetters, mapState } from 'vuex'
import authMixin from '@/mixins/auth';
import FooterLanding from '~/components/common/footer-landing/index.vue'
import HeaderLanding from '~/components/common/header-landing/index.vue'
import NavBarLanding from '~/components/common/navbar-landing/index.vue'
import MaintenanceNotion from '~/components/desktop/maintenance/index.vue'

export default {
  components: {
    HeaderLanding,
    FooterLanding,
    NavBarLanding,
    SpriteSvg,
    IconChat: () => import('~/components/common/icons/icon-chat.vue'),
    CustomerCareChatDesktop: () => import('~/components/desktop/customer-care/index.vue'),
    CustomerCareChatMobile: () => import('~/components/mobile/customer-care/index.vue'),
    MaintenanceNotion
  },
  mixins: [authMixin],
  data () {
    return {
      isVisibleSupportChat: false
    }
  },
  computed: {
    ...mapGetters('user', ['enableLightDarkMode']),
    ...mapState('user', ['user']),
    ...mapState('chat-support-request', ['isVisibleChat']),
    ...mapState({
      chatNotiSupport: state => state['chat-support-request']?.chatNoti
    }),
    ...mapGetters('maintenance', ['hasMaintenance']),
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    },
    isEnableMaintenance () {
      return !this.isBotChromeLighthouse && this.hasMaintenance
    }
  },
  created () {
    if (this.$route.name !== 'index') {
      Promise.all([
        this.getMaintenance(),
        this.getResources()
      ])
    }
  },
  mounted () {
    if (window.location.host === this.$config.USER_DOMAIN) {
      this.setVisibleChatSupportRequest(false)
      this.isVisibleSupportChat = true
    }
  },
  beforeDestroy () {
    this.setVisibleChatSupportRequest(false)
  },
  methods: {
    ...mapActions({
      setVisibleChatSupportRequest: 'chat-support-request/setVisibleChat'
    }),
    ...mapActions('maintenance', ['getMaintenance']),
    ...mapActions('resources', ['getResources']),
    ...mapActions('web3-onboard', ['setVisibleWeb3Onboard']),
    onOpenChatSupport () {
      this.setVisibleChatSupportRequest(!this.isVisibleChat)
    },
    handleConnectWallet () {
      this.setVisibleChatSupportRequest(false)
      if (!this.user) {
        this.setVisibleWeb3Onboard(true)
      }
      this.$router.push('/marketplace')
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
<style lang="scss" scoped src="static/assets/scss/layout/landing.scss">
</style>
