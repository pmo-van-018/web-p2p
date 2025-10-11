<template>
  <main :class="['main d-flex flex-column min-vh-100']">
    <Header />
    <div class="d-flex flex-grow-1">
      <transition name="fade-transform" mode="out-in">
        <nuxt class="d-flex flex-grow-1" />
      </transition>
    </div>
    <client-only>
      <sprite-svg />
      <modal-response />
      <modal-change-password />
    </client-only>
  </main>
</template>
<script>
import SpriteSvg from 'static/assets/images/common/icon-sprite.svg?inline'
import Header from '~/components/common/header/header-username.vue'

export default {
  name: 'LayoutManagement',
  components: {
    Header,
    SpriteSvg,
    ModalResponse: () => import('~/components/common/modal/modal-response.vue'),
    ModalChangePassword: () => import('~/components/desktop/reporter/change-password/index.vue')
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/layout/management.scss">
</style>
