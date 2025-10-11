<template>
  <section class="transaction">
    <div class="container transaction__container">
      <div class="transaction__wrapper">
        <div class="transaction__thumbnail">
          <img class="transaction__thumbnail-img transaction__thumbnail-pc" src="/assets/images/components/desktop/home/banner-left.png" alt="banner-left" loading="lazy">
        </div>
        <div class="transaction__content">
          <div class="transaction__title">
            <h2 class="home-page__title">
              {{ $t("home.landing.transaction.title") }}
              <span class="highlight">
                {{ $t("home.landing.transaction.highlight") }}
              </span>
            </h2>
          </div>
          <ul class="transaction__list">
            <li class="transaction__item">{{ $t("home.landing.transaction.content") }}</li>
            <li class="transaction__item">{{ $t("home.landing.transaction.sub-content") }}</li>
          </ul>
          <nuxt-img
            class="transaction__thumbnail-img transaction__thumbnail-mobile"
            src="/assets/images/components/mobile/home/transactions.png"
            alt="banner-left"
            format="webp"
            loading="lazy"
          />
          <base-button class="transaction__action" variants="contained" color="primary" @click="$router.push('/marketplace')">
            <div class="d-flex align-items-center">
              <span class="mr-2">{{ $t("home.landing.transaction.button-name") }}</span>
            </div>
          </base-button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/transactions/index.scss">
</style>
