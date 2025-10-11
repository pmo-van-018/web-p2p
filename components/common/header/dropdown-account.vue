<template>
  <b-dropdown
    ref="dropdownAccount"
    right
    class="dropdown-account"
    @show="lazyShowDropdown = true"
    @hide="onHideDropdown"
  >
    <template #button-content>
      <div class="account-action">
        <div :class="['account-action__network', {'account-action__network--show': !isLoadingIconNetwork}]">
          <template v-if="!isLoadingIconNetwork">
            <img :src="iconNetworkFormatter" alt="Network icon">
          </template>
          <template v-else>
            <b-skeleton type="avatar" />
          </template>
        </div>
        <div class="account-action__address">{{ walletAddress | formatHash(4) }}</div>
        <span class="account-action__arrow icon-arrow" />
      </div>
    </template>
    <div v-if="lazyShowDropdown" class="dropdown-account__wrapper">
      <div class="menu__header">
        <div class="menu__header-inner" :class="{ 'hover': isRoleMerchantManager || isRoleUser }">
          <div class="d-flex align-items-center">
            <div class="avatar" @click="goToProfile">
              <img
                v-if="avatar"
                class="w-100 rounded-circle"
                :src="avatar"
                alt="avatar"
              >
              <span v-else>
                {{ firstCharNickName }}
              </span>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex align-items-center">
                <div class="name" @click="goToProfile">
                  {{ nickName }}
                </div>
                <template v-if="!isRoleUser">
                  <base-button
                    v-if="isUnAuthor2FA"
                    full-width
                    :loading="isLogoutLoading"
                    :disabled="isLogoutLoading"
                    variants="contained"
                    color="primary"
                    class="button-2fa"
                    @click="openVerify2FA"
                  >
                    {{ $t('2fa.verify') }}
                  </base-button>
                  <img v-else src="/assets/images/common/header/2fa.svg" alt="icon-2fa" class="ml-1">
                </template>
              </div>
              <div class="wallet-address" @click="goToProfile">{{ walletAddress }}</div>
            </div>
          </div>
          <span v-if="isRoleMerchantManager || isRoleUser" class="icon-chevron-right-bordered" />
        </div>
        <div v-if="!isRoleUser && !isUnAuthor2FA" class="toggle-2fa">
          Xác thực 2 yếu tố
          <switch-checkbox :value="isEnabled2FA" switch-class="sm" @click="handleToggle2FA" />
        </div>
        <referral-information v-if="isVisibleReferralInformation" @on-copied="onCopiedText" />
      </div>
      <div class="menu__wrapper-list">
        <div
          v-for="(item, index) in menu"
          :key="index"
          @click="onCloseDropdown"
          @mouseover="activeMenu = item"
          @mouseleave="activeMenu = null"
        >
          <a v-if="item.externalDomainUser" :href="item.url" class="menu__item" target="_blank" :class="activeClass(item)">
            <img :src="inActiveIcon(item)" alt="icon" width="30" height="30" class="menu__icon-inactive">
            <img :src="item.iconActive" alt="icon" width="30" height="30" class="menu__icon-active">
            {{ $t(item.title) }}
          </a>
          <nuxt-link v-else :to="item.url" :exact="exactLink(item)" class="menu__item" :class="activeClass(item)">
            <img :src="inActiveIcon(item)" alt="icon" width="30" height="30" class="menu__icon-inactive">
            <img :src="item.iconActive" alt="icon" width="30" height="30" class="menu__icon-active">
            {{ $t(item.title) }}
          </nuxt-link>
        </div>
      </div>
      <div class="menu__logout">
        <base-button
          full-width
          :loading="isLogoutLoading"
          :disabled="isLogoutLoading"
          variants="contained"
          color="info"
          @click="$_authMixin_logout"
        >
          <span class="d-flex align-items-center">
            <span class="icon-exit mr-2" />
            <span>{{ $t('menu.account_menu.logout') }}</span>
          </span>
        </base-button>
      </div>
      <div class="menu__version">
        <span class="menu-version__sign">{{ $t('footer.sign', { year }) }}</span>
        <span class="menu-version__dot" />
        <span class="menu-version__ver"> v{{ appVersion }}</span>
      </div>
    </div>
    <ModalToggle2fa />
  </b-dropdown>
</template>
<script>
import { ICON_ASSET_NETWORK_DEFAULT, USER_ROLE, TWO_FA_STATUS } from '@/config/constant';
import { getAvatar } from '@/helper/avatar-util';
import auth from '@/mixins/auth';
import darkMModeMixin from '@/mixins/dark-mode.js';
import { ACCOUNT_MENU } from '@/resources/menu.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { MODAL } from '@/resources/modal'
import ModalToggle2fa from '@/components/common/modal/modal-toggle-2fa.vue';

export default {
  components: {
    ModalToggle2fa,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    ReferralInformation: () => import('~/components/common/header/referral-information/index.vue')
  },
  mixins: [auth, darkMModeMixin],
  data () {
    return {
      appVersion: this.$config.APP_VERSION,
      menu: [],
      activeMenu: null,
      closeDropdownMenu: false,
      lazyShowDropdown: false,
      isDisable2FA: false
    }
  },
  computed: {
    ...mapState('user', ['user', 'iconNetwork', 'isLoadingIconNetwork']),
    ...mapState('end-user', ['buyOrderInfo']),
    ...mapGetters('user', ['enableLightDarkMode']),
    nickName () {
      return this.user?.nickName || this.user?.walletAddress
    },
    avatar () {
      return getAvatar(this.user?.avatar, this.user?.type)
    },
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    year () {
      return new Date().getFullYear()
    },
    isEnabled2FA () {
      return this.user?.twoFactorAuth?.totpStatus === TWO_FA_STATUS.ENABLED
    },
    isUnAuthor2FA () {
      return this.user?.twoFactorAuth?.totpStatus === TWO_FA_STATUS.UNAUTHORIZED
    },
    isRoleMerchantManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER
    },
    firstCharNickName () {
      return this.user?.nickName ? this.nickName?.charAt(0) : this.nickName?.charAt(3)
    },
    walletAddress () {
      return this.user?.walletAddress || ''
    },
    iconNetworkFormatter () {
      return this.iconNetwork ? this.iconNetwork : ICON_ASSET_NETWORK_DEFAULT
    },
    isReferralCodeEnabled () {
      return this.$config.ENABLE_REFERRAL_CODE
    },
    isVisibleReferralInformation () {
      return this.isRoleUser && this.isReferralCodeEnabled
    }
  },
  mounted () {
    const domainUser = this.$config.STATIC_DOMAIN || '';
    this.menu = ACCOUNT_MENU
      .filter(item => !item?.permission?.length || item.permission.includes(this.user?.type))
      .map((item) => {
        if (item.externalDomainUser) {
          return { ...item, url: domainUser + item.url }
        }
        return item
      })
  },
  methods: {
    ...mapActions('2fa', ['setOtpProcessing']),
    handleToggle2FA () {
      this.setOtpProcessing(true)
      this.$bvModal.show(MODAL.TOGGLE_2FA)
    },
    openVerify2FA () {
      this.onCloseDropdown()
      this.$bvModal.show(MODAL.SETUP_2FA)
    },
    inActiveIcon (item) {
      return this.isDarkMode && this.enableLightDarkMode && item.iconDarkInActive ? item.iconDarkInActive : item.iconInActive
    },
    onCloseDropdown () {
      this.closeDropdownMenu = true
      this.$refs?.dropdownAccount?.hide(true)
    },
    activeClass (item) {
      return item.url === this.$route.fullPath || item.url === this.activeMenu?.url ? 'active' : null
    },
    exactLink (item) {
      return item.url === '/'
    },
    onCopiedText () {
      this.closeDropdownMenu = false
    },
    onHideDropdown (event) {
      if (!this.closeDropdownMenu) {
        event.preventDefault()
        setTimeout(() => {
          this.closeDropdownMenu = true
        })
      }
    },
    goToProfile () {
      this.onCloseDropdown()
      if (this.isRoleMerchantManager && this.$route.name !== 'merchant-manager-profile') {
        this.$router.push('/merchant-manager/profile')
        return
      }
      if (this.isRoleUser && this.$route.name !== 'user-profile') {
        this.$router.push('/user/profile')
      }
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/dropdown-account.scss" />
