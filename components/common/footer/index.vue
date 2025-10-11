<template>
  <footer class="footer" :class="[className, { 'dark-footer': isDark }]">
    <div class="container-xl footer__container">
      <div class="footer__inner">
        <nav class="footer-nav">
          <ul class="footer-nav__list">
            <li v-for="(footer, index) in navLinkFooter" :key="index" class="footer-nav__item">
              <a class="footer-nav__link" :href="footer.link" target="_blank">{{ footer.title }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="footer__inner">
        <div class="footer__text">{{ $t('footer.sign', { year }) }} <span class="footer__dot" /> v{{ appVersion }}</div>
      </div>
    </div>
  </footer>
</template>
<script>
import dayjs from 'dayjs';

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      appVersion: this.$config.APP_VERSION,
      year: dayjs().year(),
      navLinkFooter: [
        {
          title: this.$t('footer.home'),
          link: '/'
        },
        {
          title: this.$t('footer.about_us'),
          link: '/about'
        },
        {
          title: this.$t('footer.policy'),
          link: '/privacy-principles'
        },
        {
          title: this.$t('footer.terms'),
          link: '/terms'
        },
        {
          title: this.$t('footer.faq'),
          link: '/faq'
        }
      ]
    }
  },
  mounted () {
    const domain = this.$config.STATIC_DOMAIN || '';
    this.navLinkFooter.forEach((nav) => { nav.link = domain + nav.link; });
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/footer/index.scss"></style>
