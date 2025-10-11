<template>
  <div class="home-page">
    <header-section />
    <section class="home-about">
      <div class="container home-page__container">
        <choose-us-section />
      </div>
    </section>
    <template v-if="!isBotChromeLighthouse">
      <check-list-feature-section />
      <feature-section />
      <transaction-section />
      <footer-banner-section />
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  components: {
    HeaderSection: () => import('~/components/desktop/landing/home/header/banner/index.vue'),
    ChooseUsSection: () => import('~/components/desktop/landing/home/choose-us/index.vue'),
    CheckListFeatureSection: () => import('~/components/desktop/landing/home/checklist-feature/index.vue'),
    FeatureSection: () => import('~/components/desktop/landing/home/features/index.vue'),
    TransactionSection: () => import('~/components/desktop/landing/home/transactions/index.vue'),
    FooterBannerSection: () => import('~/components/desktop/landing/home/footer-banner/index.vue')
  },
  async fetch () {
    await Promise.all([
      this.getResources(),
      this.getMaintenance()
    ])
  },
  computed: {
    linkUrlRedirect () {
      return this.$config.STATIC_DOMAIN || ''
    },
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  },
  methods: {
    ...mapActions('maintenance', ['getMaintenance']),
    ...mapActions('resources', ['getResources'])
  }
}
</script>

<style lang="scss" src="static/assets/scss/components/desktop/landing/home/index.scss"/>
