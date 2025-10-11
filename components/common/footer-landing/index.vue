<template>
  <footer class="footer-landing">
    <div class="footer-landing__container container">
      <div class="footer-landing__wrapper">
        <div class="footer-landing__inner footer-landing__logo">
          <img class="logo" src="/assets/images/common/header/logo-ano.svg" alt="Logo Ano Footer">
        </div>
        <div class="footer-navlink">
          <div class="footer-navlink__container">
            <div class="footer-navlink__inner mb-2">
              <nuxt-link class="footer-navlink__content" to="/privacy-principles">{{ $t('footer.policy') }}</nuxt-link>
              <nuxt-link class="footer-navlink__content" to="/faq">{{ $t('footer.menu.faqs') }}</nuxt-link>
            </div>
            <div class="footer-navlink__inner">
              <nuxt-link class="footer-navlink__content" to="/about">{{ $t('footer.menu.about') }}</nuxt-link>
              <nuxt-link class="footer-navlink__content" to="/terms">{{ $t('footer.menu.terms') }}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="footer-landing__inner footer-landing__inner--pc">
          <h3 class="footer-landing__title text-uppercase">{{ $t('footer.menu.about') }}</h3>
          <div class="footer-landing__list">
            <nuxt-link class="footer-landing__item" to="/about">{{ $t('footer.menu.about') }}</nuxt-link>
            <nuxt-link class="footer-landing__item" to="/terms">{{ $t('footer.menu.terms') }}</nuxt-link>
            <nuxt-link class="footer-landing__item" to="/privacy-principles">{{ $t('footer.menu.policy') }}</nuxt-link>
          </div>
        </div>
        <div class="footer-landing__inner footer-landing__inner--pc">
          <h3 class="footer-landing__title text-uppercase">{{ $t('footer.menu.support') }}</h3>
          <div class="footer-landing__list">
            <nuxt-link class="footer-landing__item" to="/faq">{{ $t('footer.menu.faqs') }}</nuxt-link>
          </div>
        </div>
        <div class="footer-landing__inner socials">
          <h3 class="footer-landing__title text-uppercase">{{ $t('footer.menu.contact') }}</h3>
          <div class="footer-landing__list">
            <a
              v-for="social in socials"
              :key="social.name"
              rel="noreferrer noopenner"
              class="footer-landing__item"
              target="_blank"
              :href="social.link"
            >
              <span :class="`icon-social icon-${social.name}`" />
            </a>
          </div>
        </div>
      </div>
      <div class="footer-landing__identifier">
        <div class="footer-landing__bottom">
          {{ platform }} &#169; {{ year }} <span class="footer-landing-bottom__dot" />  v{{ appVersion }}
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import dayjs from 'dayjs';
export default {
  data () {
    return {
      appVersion: this.$config.APP_VERSION,
      platform: this.$config.BRAND_PLATFORM,
      socials: [
        {
          name: 'facebook',
          link: this.$config.FACEBOOK_URL
        },
        {
          name: 'telegram',
          link: this.$config.TELEGRAM_URL
        },
        {
          name: 'twitter',
          link: this.$config.TWITTER_URL
        }
      ]

    }
  },
  computed: {
    isDesktop () {
      return this.$device.isDesktopOrTablet
    },
    year () {
      return dayjs().year()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/footer-landing/index.scss" />
