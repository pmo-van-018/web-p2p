<template>
  <header class="header">
    <div class="header__container">
      <div
        class="header__inner"
      >
        <div class="wrapper-logo">
          <nuxt-link to="/dashboard" event="" class="logo" aria-label="ANOTRADE">
            <img class="logo" src="/assets/images/common/header/logo-ano-dark.svg" alt="ANOTRADE">
          </nuxt-link>
          <span class="role-name">BO</span>
        </div>
        <div class="header__right">
          <div class="header__wrapper-info">
            <div class="header__information">
              Xin chào, {{ user?.nickName || 'Reporter' }}
            </div>
            <base-button variants="text" @click="onConfirmLogout">{{ $t('header.logout') }}</base-button>
            <base-button variants="contained" color="info" @click="onOpenModalChangePassword">{{ $t('common.change_password') }}</base-button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { MODAL } from '@/resources/modal';
import { mapActions, mapState } from 'vuex';
import { getSessionKey } from '@/helper/session';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  computed: {
    ...mapState('reporter', ['user'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('reporter', ['setUser']),
    onOpenModalChangePassword () {
      this.$bvModal.show(MODAL.CHANGE_PASSWORD)
    },
    async onConfirmLogout () {
      await this.logout();
      this.$cookies.remove('connect.sid');
      this.$cookies.remove('user');
      this.setUser(null);
      this.$cookies.remove(getSessionKey(window.location.host, this.$config));
      this.$router.push('/')
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/header-username.scss" />
