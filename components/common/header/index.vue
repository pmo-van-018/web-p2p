<template>
  <header class="header">
    <div class="container-xl header__container" :class="{'header__no-container': noContainer }">
      <div
        class="header__inner"
      >
        <div class="wrapper-logo">
          <nuxt-link to="/" event="" class="logo" aria-label="ANOTRADE" @click.native="redirectByRole">
            <img class="logo" src="/assets/images/common/header/logo-ano.svg" alt="ANOTRADE">
          </nuxt-link>
          <span v-if="roleName" class="role-name">{{ roleName }}</span>
        </div>
        <div v-if="user" class="menu">
          <template v-if="isRolesOperation">
            <shift-status v-if="isShiftProcessing !== null" class="only-desktop" />
            <DropdownMenu :menu="ORDER_MENU" class="only-desktop" />
            <DropdownMenu :menu="ADS_MENU" class="only-desktop" />
          </template>
          <template v-if="isRolesEndUser">
            <nuxt-link class="menu__link only-desktop" to="/">{{ $t('menu.account_menu.about') }}</nuxt-link>
            <nuxt-link class="menu__link only-desktop" to="/user/orders">{{ $t('menu.order_menu.name') }}</nuxt-link>
          </template>
          <template v-if="isVisibleNotification">
            <DropdownNotify />
          </template>
          <client-only>
            <DropdownAccount class="only-desktop" />
          </client-only>
        </div>
        <div class="header__right">
          <svg-icon
            v-if="isVisibleSupportChat"
            :icon="chatNoti ? 'chat-support-active' : 'chat-support'"
            class="header__chat-support only-mobile"
            @click="onOpenChatSupport"
          />
          <sidebar class="icon only-mobile" />
          <template v-if="isVisibleConnectWallet">
            <nuxt-link class="menu__link only-desktop" to="/">{{ $t('menu.account_menu.about') }}</nuxt-link>
            <base-button
              :disabled="isShowCfVerify"
              variants="contained"
              color="primary"
              class="header__connect-wallet"
              @click="onConnectUserWallet"
            >
              {{ $t('header.btn_wallet') }}
            </base-button>
          </template>
        </div>
      </div>
    </div>
    <client-only>
      <ModalCfTurnstile
        :verify="isShowCfVerify"
        :modal-name="modalCfTurnstile"
        @challenge="onCfChallengeResultLogin"
      />
    </client-only>
    <modal-setup-2fa v-if="!isRolesEndUser" />
  </header>
</template>
<script>
import { USER_ROLE } from '@/config/constant.js'
import auth from '@/mixins/auth'
import { ADS_MENU, ORDER_MENU } from '@/resources/menu.js'
import { mapActions, mapState } from 'vuex'
import DropdownMenu from './dropdown-menu.vue'

export default {
  components: {
    DropdownMenu,
    ModalSetup2fa: () => import('@/components/common/modal/modal-setup-2fa.vue'),
    DropdownAccount: () => import('~/components/common/header/dropdown-account.vue'),
    DropdownNotify: () => import('~/components/common/header/dropdown-notify.vue'),
    Sidebar: () => import('~/components/common/header/sidebar.vue'),
    ModalCfTurnstile: () => import('~/components/common/modal/modal-cf-turnstile.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    ShiftStatus: () => import('~/components/desktop/shift/status.vue')
  },
  mixins: [auth],
  props: {
    triggerLogin: {
      type: Number,
      default: 0
    },
    noContainer: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      USER_ROLE,
      ORDER_MENU,
      ADS_MENU,
      isVisibleSupportChat: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'isShiftProcessing']),
    ...mapState('chat-support-request', ['chatNoti']),
    isRolesOperation () {
      return this.user?.type === USER_ROLE.MERCHANT_OPERATOR
    },
    isRolesEndUser () {
      return this.user?.type === USER_ROLE.USER
    },
    isVisibleNotification () {
      return this.user?.type !== USER_ROLE.SYSTEM_ADMIN
    },
    isVisibleConnectWallet () {
      return !this.user && !['lock'].includes(this.$route.name)
    },
    roleName () {
      const roleNames = {
        [USER_ROLE.MERCHANT_OPERATOR]: 'Giao dịch viên',
        [USER_ROLE.MERCHANT_SUPPORTER]: 'Hỗ trợ viên',
        [USER_ROLE.MERCHANT_MANAGER]: 'Thương gia',
        [USER_ROLE.SUPER_ADMIN]: 'Quản trị viên',
        [USER_ROLE.ADMIN_SUPPORTER]: 'Nhân viên CSKH',
        [USER_ROLE.SYSTEM_ADMIN]: 'Quản trị viên hệ thống'
      };

      return roleNames[this.user?.type] || '';
    }
  },
  watch: {
    triggerLogin (value) {
      if (value) {
        this.onConnectUserWallet()
      }
    }
  },
  mounted () {
    if (window.location.host === this.$config.USER_DOMAIN) {
      this.isVisibleSupportChat = true
    }
  },
  methods: {
    ...mapActions('chat', ['setVisibleChat']),
    ...mapActions({
      setVisibleChatSupportRequest: 'chat-support-request/setVisibleChat'
    }),
    onOpenChatSupport () {
      this.setVisibleChatSupportRequest(!this.isVisibleChat)
      this.setVisibleChat(false)
    },
    onConnectUserWallet () {
      if (this.$device.isMobileOrTablet && !this.user) {
        this.$_authMixin_connect()
        return
      }
      if (!this.isShowCfVerify) {
        this.isShowCfVerify = true
        this.$bvModal.show(this.modalCfTurnstile)
        return
      }
      this.isShowCfVerify = false
      if (this.cfToken && !this.user) {
        this.$_authMixin_connect()
      }
    },
    redirectByRole () {
      let targetPath = ''
      switch (this.user?.type) {
        case USER_ROLE.SUPER_ADMIN: {
          targetPath = '/dashboard'
          break
        }
        case USER_ROLE.MERCHANT_MANAGER: {
          targetPath = '/merchant-manager/dashboard'
          break
        }
        case USER_ROLE.MERCHANT_SUPPORTER: {
          targetPath = '/supporter/orders?status=pending'
          break
        }
        case USER_ROLE.MERCHANT_OPERATOR: {
          targetPath = '/merchant/dashboard'
          break
        }
        case USER_ROLE.ADMIN_SUPPORTER: {
          targetPath = '/admin-supporter/list-appeals'
          break
        }
        case USER_ROLE.SYSTEM_ADMIN: {
          targetPath = '/system-admin/system-settings'
          break
        }
        default: {
          targetPath = '/marketplace'
        }
      }
      if (this.$route.path === targetPath) {
        window.location.reload()
        return
      }
      this.$router.push(targetPath)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/index.scss" />
