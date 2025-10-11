<template>
  <div class="left-menu">
    <nuxt-link
      v-for="(item, index) in menu"
      :key="index"
      :to="item.url"
      class="menu-item left-menu__item"
      :class="{ 'nuxt-link-exact-active': checkActive(item) }"
    >
      <img :src="inActiveIcon(item)" alt="icon" width="30" height="30" class="left-menu__icon-inactive">
      <img :src="item.iconActive" alt="icon" width="30" height="30" class="left-menu__icon-active">
      <div class="title">{{ $t(item.title) }}</div>
      <span v-if="notification[item.counterNotify]" class="menu-item__number">{{ notification[item.counterNotify] }}</span>
    </nuxt-link>
  </div>
</template>
<script>
import darkMModeMixin from '@/mixins/dark-mode.js';
import notificationListMixin from '@/mixins/notification/notification-list';
import { LEFT_MENU_NOTIFICATION } from '@/resources/menu.js';
import { mapGetters } from 'vuex';
export default {
  mixins: [notificationListMixin, darkMModeMixin],
  data () {
    return {
      menu: LEFT_MENU_NOTIFICATION
    }
  },
  computed: {
    ...mapGetters('user', ['enableLightDarkMode'])
  },
  methods: {
    inActiveIcon (item) {
      return this.isDarkMode && this.enableLightDarkMode && item.iconDarkInActive ? item.iconDarkInActive : item.iconInActive
    },
    checkActive (item) {
      const { tab } = this.$route?.query
      return item.activeUrls.includes(tab || 'all')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/left-menu-notication.scss" />
