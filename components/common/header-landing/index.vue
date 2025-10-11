<template>
  <header class="header-landing">
    <div class="header-landing__container container">
      <div class="container-xl  header-landing__inner">
        <nuxt-link to="/" event="" class="header-landing__logo" @click.native="onScrollToTopCurrentPage">
          <img class="logo" src="/assets/images/common/header/logo-ano.svg" alt="Logo Ano">
        </nuxt-link>
        <div class="header-landing__right">
          <div class="header-landing__nav">
            <nav class="navbar-landing">
              <nuxt-link class="navbar-landing__link navbar-landing__link--fade-up" to="/" event="" @click.native="onScrollToTopCurrentPage">Trang chủ</nuxt-link>
              <nuxt-link class="navbar-landing__link navbar-landing__link--fade-up" to="/marketplace">
                Giao dịch P2P
                <div class="navbar-landing__label">
                  {{ $t('header.watch') }}
                </div>
              </nuxt-link>
              <nuxt-link class="navbar-landing__link navbar-landing__link--fade-up" to="/about">Về chúng tôi</nuxt-link>
              <nuxt-link class="navbar-landing__link navbar-landing__link--fade-up" to="/faq">Câu hỏi thường gặp</nuxt-link>
            </nav>
          </div>
          <div class="header-landing__join-now">
            <base-button :disabled="isResourceLoading" variants="contained" color="primary" @click="$emit('on-open-wallet')">{{ $t('header.btn_wallet') }}</base-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import headerMixin from '@/mixins/header.js';
import { mapState } from 'vuex';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [headerMixin],
  computed: {
    ...mapState('resources', ['isResourceLoading'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header-landing/index.scss" />
