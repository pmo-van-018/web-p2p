<template>
  <div class="left-menu" :class="{'collapse': isCollapseSidebarLeft}">
    <div class="left-menu__container">
      <div class="left-menu__list">
        <nuxt-link
          v-for="(item, index) in menu"
          :key="index"
          :to="item.url"
          :title="$t(item.title)"
          :class="[
            'menu-item',
            { 'nuxt-link-active': checkActive(item) }
          ]"
        >
          <img
            :tabindex="index"
            :src="item.iconInActive"
            alt="icon"
            class="left-menu__icon-inactive"
          >
          <img :src="item.iconActive" alt="icon" class="left-menu__icon-active">
          <span class="title">{{ $t(item.title) }}</span>
          <div v-if="item?.isCountOrder" class="circle-count-order">
            <div class="circle-count-order__text">
              {{ orderWaitingCount }}
            </div>
          </div>
          <div v-if="item?.rightIcon && totalOrderWaitingCount" class="right-icon d-flex">
            <span :class="['right-icon__context', item.rightIcon]" />
          </div>
          <div v-if="shouldShowIcon(item)" class="right-icon d-flex">
            <span class="icon-info-circle1" />
          </div>
        </nuxt-link>
      </div>
      <div class="left-menu__action">
        <base-button variants="text" @click="toggleExpandSidebar">
          <div class="d-flex align-items-center">
            <span
              class="left-menu__action-icon"
              :class="isCollapseSidebarLeft ? 'icon-arrow-right-to-line' : 'icon-arrow-left-to-line'"
            />
            <span v-show="!isCollapseSidebarLeft" class="font-t12m grey-400 left-menu__action-text">{{ $t('common.collapse') }}</span>
          </div>
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { LEFT_MENU, SIDEBAR_ADMIN_SUPPORTER, SIDEBAR_MERCHANT_SUPPORTER, SIDEBAR_SYSTEM_ADMIN } from '@/resources/menu.js'
import { SIDEBAR_ADMIN, SIDEBAR_MERCHANT_MANAGER } from '@/resources/menu';
import { USER_ROLE } from '@/config/constant'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    sidebarList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      LEFT_MENU
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('statistics', ['statistics']),
    ...mapState('admin-appeal', ['appealCount']),
    ...mapState('admin-support', ['requestCount', 'failedTransactionCount']),
    isCollapseSidebarLeft () {
      return this.$store.state.isCollapseSidebarLeft || false
    },
    orderWaitingCount () {
      return this.statistics?.orderWaitingCount || 0
    },
    orderAppealCount () {
      return this.statistics?.orderAppealCount || 0
    },
    orderWaitingUserCount () {
      return this.statistics?.orderWaitingUserCount || 0
    },
    totalOrderWaitingCount () {
      return this.orderWaitingCount + this.orderAppealCount + this.orderWaitingUserCount
    },
    totalAppealCount () {
      return this.appealCount
    },
    totalRequestCount () {
      return this.requestCount
    },
    menu () {
      switch (this.user?.type) {
        case USER_ROLE.ADMIN_SUPPORTER:
          return SIDEBAR_ADMIN_SUPPORTER
        case USER_ROLE.SYSTEM_ADMIN:
          return SIDEBAR_SYSTEM_ADMIN
        case USER_ROLE.SUPER_ADMIN:
          return SIDEBAR_ADMIN
        case USER_ROLE.MERCHANT_SUPPORTER:
          return SIDEBAR_MERCHANT_SUPPORTER
        case USER_ROLE.MERCHANT_MANAGER:
          return SIDEBAR_MERCHANT_MANAGER
        default:
          return LEFT_MENU.filter((item) => {
            return !item?.permission?.length || item.permission?.includes(this.user?.type)
          })
      }
    }
  },
  methods: {
    shouldShowIcon (item) {
      return (item?.isAppealCount && this.totalAppealCount > 0) ||
          (item?.isRequestCount && this.totalRequestCount > 0) ||
          (item?.isFailedTransactionCount && this.failedTransactionCount > 0);
    },
    checkActive (item) {
      return item.activeUrls.includes(this.$route.path) || item.activeUrls.includes(this.$route.name)
    },
    toggleExpandSidebar () {
      this.$store.commit('mutate', {
        property: 'isCollapseSidebarLeft',
        with: !this.isCollapseSidebarLeft
      })
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/left-menu.scss" />
