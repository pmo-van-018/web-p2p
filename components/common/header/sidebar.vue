<template>
  <div class="sidebar-menu">
    <svg-icon
      icon="menu"
      class="sidebar-menu__icon-menu"
      @click="showSideBar = !showSideBar"
    />

    <b-sidebar
      id="sidebar-backdrop"
      v-model="showSideBar"
      backdrop
      no-header
      right
      lazy
      backdrop-variant=""
      class="sidebar-menu"
    >
      <div class="sidebar-menu__content">
        <div v-if="user" class="account-info">
          <div class="account-info__wrapper" @click="goToProfile">
            <img
              v-if="avatar"
              class="avatar rounded-circle"
              :src="avatar"
              alt="avatar"
            >
            <div v-else class="avatar">{{ firstCharNickName }}</div>
            <div class="d-flex flex-column ml-2">
              <div class="name">{{ nickName }}</div>
              <div class="account-id">{{ walletAddress | formatHash }}</div>
            </div>
            <span class="icon-chevron-right" />
          </div>
          <referral-information v-if="isVisibleReferralInformation" />
        </div>
        <div v-else class="intro">
          <div class="title">{{ $t('header.wellcome') }}</div>
          <div class="desc">{{ $t('header.slogan') }}</div>
        </div>
        <div :class="['menu__wrapper-list', { 'menu__wrapper-list--no-border': !user }]">
          <template
            v-for="(item, index) in menu"
            @mouseover="activeMenu = item"
            @mouseleave="activeMenu = null"
          >
            <a
              v-if="item.externalDomainUser"
              :key="index"
              :href="item.url"
              target="_blank"
              class="menu__item"
              :class="activeClass(item)"
            >
              <img
                :src="inActiveIcon(item)"
                alt="icon"
                width="30"
                height="30"
                class="menu__icon-inactive"
                loading="lazy"
              >
              <img
                :src="item.iconActive"
                alt="icon"
                width="30"
                height="30"
                class="menu__icon-active"
                loading="lazy"
              >
              {{ $t(item.title) }}
            </a>
            <nuxt-link
              v-else
              :key="index"
              :to="item.url"
              :exact="exactLink(item)"
              class="menu__item"
              :class="activeClass(item)"
            >
              <img
                :src="inActiveIcon(item)"
                alt="icon"
                width="30"
                height="30"
                class="menu__icon-inactive"
                loading="lazy"
              >
              <img
                :src="item.iconActive"
                alt="icon"
                width="30"
                height="30"
                class="menu__icon-active"
                loading="lazy"
              >
              {{ $t(item.title) }}
            </nuxt-link>
          </template>
        </div>
        <div v-if="user" class="menu__logout">
          <base-button
            full-width
            :loading="isLogoutLoading"
            :disabled="isLogoutLoading"
            variants="outlined"
            color="info"
            @click="logOut"
          >
            <span class="d-flex align-items-center">
              <span class="icon-exit mr-2" />
              <span>{{ $t('menu.account_menu.logout') }}</span>
            </span>
          </base-button>
        </div>
      </div>
      <div v-if="isMobileOrTablet" class="menu__version">
        <span class="menu-version__sign">{{ $t('footer.sign', { year }) }}</span>
        <span class="menu-version__dot" />
        <span class="menu-version__ver"> v{{ appVersion }} </span>
      </div>
    </b-sidebar>
  </div>
</template>
<script>
import auth from '@/mixins/auth';
import darkMModeMixin from '@/mixins/dark-mode.js';
import { SIDEBAR_RIGHT_MENU } from '@/resources/menu.js';
import dayjs from 'dayjs';
import { mapGetters, mapState } from 'vuex';
import { getAvatar } from '@/helper/avatar-util';
import { USER_ROLE } from '~/config/constant';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    ReferralInformation: () => import('~/components/common/header/referral-information/index.vue')
  },
  mixins: [auth, darkMModeMixin],
  data () {
    return {
      isMobileOrTablet: this.$device.isMobileOrTablet,
      appVersion: this.$config.APP_VERSION,
      showSideBar: false,
      activeMenu: null,
      SIDEBAR_RIGHT_MENU
    };
  },
  computed: {
    ...mapGetters('user', ['enableLightDarkMode']),
    ...mapState('user', ['user']),
    ...mapState('end-user', ['buyOrderInfo']),
    menu () {
      let sidebarMenu = []
      const domainUser = this.$config.STATIC_DOMAIN || ''
      if (this.user) {
        sidebarMenu = SIDEBAR_RIGHT_MENU.filter(item => !item?.permission?.length || item.permission.includes(this.user?.type))
      } else {
        sidebarMenu = SIDEBAR_RIGHT_MENU.filter(item => !item.isRequiredLogin)
      }
      return sidebarMenu.map((item) => {
        if (item.externalDomainUser) {
          return { ...item, url: domainUser + item.url }
        }
        return item
      })
    },
    isRoleUser () {
      return this.user?.type === USER_ROLE.USER
    },
    avatar () {
      if (this.user?.avatar) {
        return getAvatar(this.user?.avatar, this.user?.type)
      }
      return null
    },
    nickName () {
      return this.user?.nickName || this.user?.walletAddress
    },
    walletAddress () {
      return this.user?.walletAddress || ''
    },
    firstCharNickName () {
      return this.user?.nickName ? this.nickName?.charAt(0) : this.nickName?.charAt(3)
    },
    isReferralCodeEnabled () {
      return this.$config.ENABLE_REFERRAL_CODE
    },
    isVisibleReferralInformation () {
      return this.isRoleUser && this.isReferralCodeEnabled
    },
    year () {
      return dayjs().year()
    }
  },
  methods: {
    inActiveIcon (item) {
      return this.isDarkMode && this.enableLightDarkMode && item.iconDarkInActive ? item.iconDarkInActive : item.iconInActive
    },
    logOut () {
      this.$_authMixin_logout()
      this.showSideBar = false
    },
    goToProfile () {
      this.showSideBar = false
      if (this.isRoleUser && this.$route.name !== 'user-profile') {
        this.$router.push('/user/profile')
      }
    },
    activeClass (item) {
      return item.url === this.$route.fullPath || item.url === this.activeMenu?.url ? 'active' : null
    },
    exactLink (item) {
      return item.url === '/'
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/sidebar.scss" />
