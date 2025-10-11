<template>
  <section class="statistics event">
    <div class="statistics__container">
      <div v-if="!isBotChromeLighthouse" class="statistics__list d-block d-lg-none">
        <client-only>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(statistic, index) in statistics" :key="index" class="statistics__item">
              <div class="statistics__inner">
                <div class="statistics__value">{{ statistic.value }}</div>
                <div class="statistics__text">{{ statistic.text }}</div>
              </div>
            </swiper-slide>
          </swiper>
        </client-only>
      </div>
      <div
        :class="[
          'statistics__list',
          isBotChromeLighthouse ? 'statistics__lighthouse' : 'd-none d-lg-grid'
        ]"
      >
        <div v-for="(statistic, index) in statistics" :key="index" class="statistics__item">
          <div class="statistics__inner">
            <div class="statistics__value">{{ statistic.value }}</div>
            <div class="statistics__text">{{ statistic.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 2,
        mousewheel: true,
        pagination: false,
        breakpoints: {
          375: {
            slidesPerView: 2.3
          },

          700: {
            slidesPerView: 4
          }
        }
      },
      statistics: [
        {
          value: '9,800+',
          text: this.$t('home.landing.header.member')
        },
        {
          value: '1,000+',
          text: this.$t('home.landing.header.transaction-number')
        },
        {
          value: '500+',
          text: this.$t('home.landing.header.partners')
        },
        {
          value: '98%',
          text: this.$t('home.landing.header.success-transaction-number')
        }
      ]
    }
  },
  computed: {
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/header/statistics.scss">
</style>
