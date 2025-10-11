<template>
  <div class="menu-bottom">
    <div
      :class="[
        'menu-bottom__inner',
        {
          'menu-bottom__inner--max-width' : menuItems.length <= 2,
          'justify-content-center' : menuItems.length === 1,
        }
      ]"
    >
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        :class="{ active: activeRouteSelected(item) }"
        class="menu-item"
        @click="clickMenu(item)"
      >
        <div class="menu-item__inner">
          <span v-if="item.isCountOrder && hasOrderWaiting" class="menu-item__count">{{ orderWaitingCount }}</span>
          <span
            v-if="item.isCountOrderWaitingOfMerchantManager && isHasOrderWaitingOfMerchantManager"
            class="menu-item__icon-top icon-info-circle1"
          />
          <img
            :src="inActiveIcon(item)"
            alt="icon"
            width="30"
            height="30"
            class="menu-item__icon-inactive"
          >
          <img :src="item.iconActive" alt="icon" width="30" height="30" class="menu-item__icon-active">
          <div v-if="item?.isRequestCount && requestCount > 0" class="right-icon d-flex">
            <span class="icon-info-circle1" />
          </div>
        </div>
        <div class="title">{{ $t(item.title) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import authMixin from '@/mixins/auth';
import darkMModeMixin from '@/mixins/dark-mode.js';
import { mapActions, mapGetters, mapState } from 'vuex';
export default {
  mixins: [authMixin, darkMModeMixin],
  props: {
    menuItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapGetters('user', ['enableLightDarkMode']),
    ...mapState('statistics', ['statistics']),
    ...mapState('admin-support', ['requestCount']),
    orderWaitingCount () {
      const count = this.statistics?.orderWaitingCount || 0
      if (count >= 100) {
        return '99+'
      }
      return count
    },
    orderAppealCount () {
      return this.statistics?.orderAppealCount || 0
    },
    orderWaitingUserCount () {
      return this.statistics?.orderWaitingUserCount || 0
    },
    isHasOrderWaitingOfMerchantManager () {
      return (this.statistics?.orderWaitingCount || 0) + this.orderAppealCount + this.orderWaitingUserCount
    },
    hasOrderWaiting () {
      return this.statistics?.orderWaitingCount || 0
    }
  },
  methods: {
    ...mapActions('wallet', ['setOpenConnectWallet']),
    inActiveIcon (item) {
      return this.isDarkMode && this.enableLightDarkMode && item.iconDarkInActive ? item.iconDarkInActive : item.iconInActive
    },
    openWallet () {
      this.setOpenConnectWallet(false)
      setTimeout(() => { this.setOpenConnectWallet(true) }, 100)
    },
    activeRouteSelected (item) {
      return item.activeRoutes.includes(this.$route.name)
    },
    clickMenu (item) {
      if (!this.user) {
        this.$_authMixin_onConnectUserWallet()
      } else {
        this.$router.push(item.url)
      }
    }
  }
};
</script>

<style scoped lang="scss" src="static/assets/scss/components/common/footer/menu-bottom.scss"></style>
