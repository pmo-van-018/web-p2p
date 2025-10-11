<template>
  <section>
    <nav class="nav-top">
      <div class="nav-top__container">
        <div class="nav-top__inner">
          <nav-bar-landing />
          <nuxt-link to="/" class="nav-top__logo" event="" @click.native="onScrollToTopCurrentPage">
            <img class="logo" src="/assets/images/common/header/logo-ano.svg" alt="Logo Ano">
          </nuxt-link>
        </div>
        <div class="nav-top__left">
          <nuxt-link class="sidebar-menu__p2p" to="/marketplace">
            <img src="/assets/images/common/header/marketplace.svg" alt="marketplace">
            <div class="sidebar-menu__text">
              P2P
            </div>
            <div class="sidebar-menu__label">{{ $t('header.watch') }}</div>
          </nuxt-link>
          <div class="sidebar-menu__action">
            <base-button variants="contained" color="primary" :disabled="isResourceLoading" @click="$emit('on-open-wallet')">{{ $t('header.btn_wallet') }}</base-button>
          </div>
        </div>
      </div>
    </nav>
  </section>
</template>
<script>
import headerMixin from '@/mixins/header.js';
import { mapState } from 'vuex';

export default {
  components: {
    NavBarLanding: () => import('~/components/common/sidebar-landing/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [headerMixin],
  computed: {
    ...mapState('resources', ['isResourceLoading'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/navbar-landing/index.scss" />
