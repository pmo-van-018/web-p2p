<template>
  <section class="feature">
    <div class="container">
      <h2 class="home-page__title d-flex align-items-center justify-content-center">
        {{ $t("home.landing.join.title") }}
        <img
          src="/assets/images/components/desktop/home/ano-trade-logo.svg"
          alt="Logo"
          sizes="xs:120px md:120px lg:208px"
          loading="lazy"
          width="208"
          height="30"
          class="mx-2 object-fit-contain ano-trade-logo"
        >
        <span class="highlight">
          {{ $t("home.landing.join.highlight") }}
        </span>
      </h2>
      <div class="feature__inner">
        <div class="feature__stepper-swiper">
          <client-only>
            <stepper-swiper-section />
          </client-only>
        </div>
        <div class="feature__wrapper">
          <div class="feature__thumbnail">
            <nuxt-img
              src="/assets/images/components/desktop/home/laptop-coins.png"
              sizes="sm:100vw lg:100vw"
              format="webp"
              alt="laptop-coin"
              loading="lazy"
            />
          </div>
        </div>
        <div class="feature__steps">
          <stepper-section />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  components: {
    StepperSection: () => import('~/components/desktop/landing/home/steps/index.vue'),
    StepperSwiperSection: () => import('~/components/desktop/landing/home/steps/swiper.vue')
  },
  async fetch () {
    await Promise.all([
      this.getResources(),
      this.getMaintenance()
    ])
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenance']),
    ...mapActions('resources', ['getResources'])
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/features/index.scss">
</style>
