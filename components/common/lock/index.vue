<template>
  <div class="page-lock flex-grow-1 d-flex align-items-center justify-content-center flex-column">
    <div class="page-lock__img">
      <img class="logo" src="/assets/images/common/lock.svg" alt="lock page">
    </div>
    <p class="page-lock__text mb-0">
      <span>{{ $t('lock.title.first_wrapper') }}</span>
      <span class="page-lock__nickname">{{ lockedUserData?.user?.nickName }}</span>
      <span>{{ $t('lock.title.last_wrapper') }}</span>
    </p>
    <base-button class="page-lock__btn-back" variants="contained" color="info" @click="$router.push('/')">
      <span class="icon-arrow-left" />
      <span class="text">{{ $t('lock.button_back') }}</span>
    </base-button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  computed: {
    ...mapState('user', ['lockedUserData'])
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/page-lock.scss" />
