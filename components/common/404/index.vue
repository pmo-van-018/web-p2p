<template>
  <div class="page-404 flex-grow-1 d-flex align-items-center justify-content-center flex-column">
    <div class="page-404__img">
      <img class="logo" src="/assets/images/common/404.png" alt="404 page">
    </div>
    <p class="page-404__txt mb-0">
      {{ $t('not_found.title') }}
    </p>
    <div class="page-404__btn-group d-flex align-items-center w-100 justify-content-center">
      <span role="button" class="page-404__btn d-block back font-t14m" @click="$router.go(-1)">{{ $t('not_found.button_back') }}</span>
      <base-button v-if="isVisibleHome" variants="contained" color="primary" @click="onGoToHome">
        {{ $t('not_found.button_home') }}
      </base-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { USER_ROLE } from '@/config/constant';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isVisibleHome: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    getTargetPathRedirect (userType) {
      switch (userType) {
        case USER_ROLE.SUPER_ADMIN:
          return '/dashboard';
        case USER_ROLE.MERCHANT_MANAGER:
          return '/merchant-manager/dashboard';
        case USER_ROLE.MERCHANT_SUPPORTER:
          return '/supporter/orders?status=pending';
        case USER_ROLE.MERCHANT_OPERATOR:
          return '/merchant/dashboard';
        case USER_ROLE.ADMIN_SUPPORTER:
          return '/admin-supporter/list-appeals';
        default:
          return '/';
      }
    },
    onGoToHome () {
      const targetPath = this.user?.type ? this.getTargetPathRedirect(this.user.type) : '/';
      this.$router.push(targetPath)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/page-404.scss" />
