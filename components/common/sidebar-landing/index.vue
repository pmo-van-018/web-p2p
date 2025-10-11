<template>
  <div class="sidebar-menu">
    <span class="sidebar-menu__icon icon-bars-staggered" @click="showSideBar = !showSideBar" />
    <client-only>
      <b-sidebar
        v-if="!isBotChromeLighthouse"
        v-model="showSideBar"
        backdrop-variant="dark"
        backdrop
        shadow
        no-header
        no-header-close
        left
      >
        <div class="sidebar-menu__wrapper">
          <div class="sidebar-menu__action">
            <base-button variants="contained" color="primary" @click="$router.push('/marketplace')">Tham gia ngay</base-button>
          </div>
        </div>
        <nav class="navbar-content">
          <ul class="navbar-content__list">
            <li v-for="(item, index) in sidebarLanding" :key="`sidebar_${index}`" class="navbar-content__item">
              <nuxt-link
                :to="item.url"
                :exact="exactLink(item)"
                class="navbar-content__link"
                :class="activeClass(item)"
              >
                <img :src="item.iconInActive" alt="icon" width="30" height="30" class="navbar-content__icon navbar-content__icon-inactive">
                <img :src="item.iconActive" alt="icon" width="30" height="30" class=" navbar-content__icon navbar-content__icon-active">
                <span>{{ $t(item.title) }}</span>
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </b-sidebar>
    </client-only>
  </div>
</template>
<script>
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      showSideBar: false,
      activeMenu: null,
      sidebarLanding: [
        {
          title: 'menu.account_menu.about',
          url: '/',
          iconInActive: '/assets/icons/menu/inactive/home.svg',
          iconActive: '/assets/icons/menu/active/home.svg'
        },
        {
          title: 'menu.account_menu.about_us',
          url: '/about',
          iconInActive: '/assets/icons/menu/inactive/about.svg',
          iconActive: '/assets/icons/menu/active/about.svg'
        },
        {
          title: 'menu.account_menu.security',
          url: '/privacy-principles',
          permission: [],
          iconInActive: '/assets/icons/menu/inactive/policy.svg',
          iconActive: '/assets/icons/menu/active/policy.svg'
        },
        {
          title: 'menu.account_menu.rule',
          url: '/terms',
          iconInActive: '/assets/icons/menu/inactive/rule.svg',
          iconActive: '/assets/icons/menu/active/rule.svg'
        },
        {
          title: 'menu.account_menu.help',
          url: '/faq',
          iconInActive: '/assets/icons/menu/inactive/help.svg',
          iconActive: '/assets/icons/menu/active/help.svg'
        }
      ]
    }
  },
  computed: {
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  },
  methods: {
    reloadPage () {
      if (this.$route.path === '/') {
        window.location.reload()
        return
      }
      this.$router.push('/')
    },
    activeClass (item) {
      return item.url === this.$route.fullPath || item.url === this.activeMenu?.url ? 'active' : null
    },
    exactLink (item) {
      return item.url === '/'
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/sidebar-landing/index.scss">
</style>
