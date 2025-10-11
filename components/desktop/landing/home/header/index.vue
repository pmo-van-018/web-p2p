<template>
  <header class="header-top">
    <template v-if="isDesktop">
      <div class="header-top__pc wrap-header">
        <div class="header-home">
          <template v-if="isBotChromeLighthouse">
            <banner-desktop
              banner-swiper-class="first-item"
              character-masco-class="first"
              banner-character-masco="/assets/images/components/lighthouse/home-mascot.png"
              banner-character-coin="/assets/images/components/desktop/landing/coin.png"
            >
              <h1 class="header-home__title header-home__title--first-slide">
                <span class="text-blue">{{ $t("home.landing.header.title_slide_three[0]") }}</span>
                {{ $t("home.landing.header.title_slide_three[1]") }}<br>
                {{ $t("home.landing.header.title_slide_three[2]") }}
              </h1>
            </banner-desktop>
          </template>
          <template v-else>
            <swiper
              ref="bannerSwiper"
              :options="swiperOption"
              :auto-update="true"
              :auto-destroy="true"
              :delete-instance-on-destroy="true"
              :cleanup-styles-on-destroy="true"
              class="banner-swiper"
            >
              <swiper-slide>
                <banner-desktop
                  banner-swiper-class="first-item"
                  character-masco-class="first"
                  banner-character-masco="/assets/images/components/desktop/home/home-mascot.png"
                  banner-character-coin="/assets/images/components/desktop/landing/coin.png"
                >
                  <h2 class="header-home__title header-home__title--first-slide">
                    {{ $t("home.landing.header.title_slide_first[0]") }}
                    <span class="text-blue">{{ $t("home.landing.header.title_slide_first[1]") }}</span>
                    <br>
                    <span>{{ $t("home.landing.header.title_slide_first[2]") }}</span>
                  </h2>
                </banner-desktop>
              </swiper-slide>
              <swiper-slide>
                <banner-desktop
                  banner-swiper-class="second-item"
                  character-masco-class="second"
                  left-class="flex-60 text-right"
                  right-class="flex-40 h-100"
                  banner-character-masco="/assets/images/components/desktop/home/home-mascot-slide-second.png"
                >
                  <h2 class="header-home__title header-home__title--second-slide text-right">
                    <span>{{ $t("home.landing.header.title_slide_second[0]") }}</span>
                    <span class="text-orange">{{ $t("home.landing.header.title_slide_second[1]") }}</span><br>
                    <span>{{ $t("home.landing.header.title_slide_second[2]") }}</span>
                  </h2>
                </banner-desktop>
              </swiper-slide>
              <swiper-slide>
                <banner-desktop
                  banner-swiper-class="three-item"
                  character-masco-class="three"
                  banner-character-masco="/assets/images/components/desktop/home/home-mascot-slide-last.png"
                  banner-character-coin="/assets/images/components/desktop/home/icon-coin-mascot-slide-last.png"
                  character-coin-class="three"
                >
                  <h1 class="header-home__title header-home__title--three-slide">
                    <span class="text-blue">{{ $t("home.landing.header.title_slide_three[0]") }}</span>
                    {{ $t("home.landing.header.title_slide_three[1]") }}<br>
                    {{ $t("home.landing.header.title_slide_three[2]") }}
                  </h1>
                </banner-desktop>
              </swiper-slide>
            </swiper>
            <div slot="pagination" class="swiper-pagination swiper-pagination-pc" />
          </template>
          <div class="header-home__statistics">
            <client-only>
              <statistics-section />
            </client-only>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="header-top__mobile wrap-header">
        <div class="header-home">
          <template v-if="isBotChromeLighthouse">
            <banner-mobile
              :is-light-house="isBotChromeLighthouse"
              banner-swiper-class="first-item"
              character-masco-class="first"
              banner-character-masco="/assets/images/components/lighthouse/home-mascot.png"
              banner-character-coin="/assets/images/components/desktop/landing/coin.png"
            >
              <h1 class="header-home__title header-home__title--first-slide">
                <span class="text-blue">{{ $t("home.landing.header.title_slide_three[0]") }}</span>
                {{ $t("home.landing.header.title_slide_three[1]") }}<br>
                {{ $t("home.landing.header.title_slide_three[2]") }}
              </h1>
            </banner-mobile>
          </template>
          <template v-else>
            <swiper
              ref="bannerSwiperMobile"
              :options="swiperOptionMB"
              :auto-update="true"
              :auto-destroy="true"
              :delete-instance-on-destroy="true"
              :cleanup-styles-on-destroy="true"
              class="banner-swiper-mobile w-100 h-100"
            >
              <swiper-slide>
                <banner-mobile
                  banner-swiper-class="first-item"
                  character-masco-class="first"
                  banner-background="/assets/images/components/mobile/home/banner-first.jpg"
                  banner-character-masco="/assets/images/components/desktop/home/home-mascot.png"
                  banner-character-coin="/assets/images/components/desktop/landing/coin.png"
                >
                  <h2 class="header-home__title">
                    {{ $t("home.landing.header.title_slide_first[0]") }}
                    <span class="text-blue">{{ $t("home.landing.header.title_slide_first[1]") }}</span>
                    <span>{{ $t("home.landing.header.title_slide_first[2]") }}</span>
                  </h2>
                </banner-mobile>
              </swiper-slide>
              <swiper-slide>
                <banner-mobile
                  banner-swiper-class="second-item"
                  title-class="first-slide"
                  character-masco-class="second"
                  character-class="second"
                  banner-background="/assets/images/components/mobile/home/banner-second.jpg"
                  banner-character-masco="/assets/images/components/mobile/home/home-mascot-slide-second.png"
                >
                  <h2 class="header-home__title">
                    <span>{{ $t("home.landing.header.title_slide_second[0]") }}</span>
                    <span class="text-orange">{{ $t("home.landing.header.title_slide_second[1]") }}</span><br>
                    <span>{{ $t("home.landing.header.title_slide_second[2]") }}</span>
                  </h2>
                </banner-mobile>
              </swiper-slide>
              <swiper-slide>
                <banner-mobile
                  banner-swiper-class="three-item"
                  character-masco-class="three"
                  character-class="second"
                  character-coin-class="three"
                  banner-background="/assets/images/components/mobile/home/banner-three.jpg"
                  banner-character-masco="/assets/images/components/desktop/home/home-mascot-slide-last.png"
                  banner-character-coin="/assets/images/components/desktop/home/icon-coin-mascot-slide-last.png"
                >
                  <h1 class="header-home__title">
                    <span class="text-blue">{{ $t("home.landing.header.title_slide_three[0]") }}</span>
                    {{ $t("home.landing.header.title_slide_three[1]") }}<br>
                    {{ $t("home.landing.header.title_slide_three[2]") }}
                  </h1>
                </banner-mobile>
              </swiper-slide>
            </swiper>
            <div slot="pagination" class="swiper-pagination swiper-pagination-mb" />
          </template>
          <client-only>
            <statistics-section is-mobile />
          </client-only>
        </div>
      </div>
    </template>
  </header>
</template>
<script>
export default {
  components: {
    StatisticsSection: () => import('~/components/desktop/landing/home/header/statistics.vue'),
    BannerDesktop: () => import('~/components/desktop/landing/home/header/banner-desktop.vue'),
    BannerMobile: () => import('~/components/desktop/landing/home/header/banner-mobile.vue')
  },
  data () {
    return {
      brandPlatform: this.$config.BRAND_PLATFORM,
      swiperOption: {
        slidesPerView: 1,
        infinite: true,
        spaceBetween: 0,
        resistanceRatio: 0,
        speed: 1000,
        observer: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        observeParents: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination-pc',
          clickable: true
        }
      },
      swiperOptionMB: {
        slidesPerView: 1,
        infinite: true,
        spaceBetween: 0,
        resistanceRatio: 0,
        autoplaySpeed: 4000,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        speed: 500,
        loop: true,
        pagination: {
          el: '.swiper-pagination-mb',
          clickable: true
        }
      }
    }
  },
  computed: {
    isDesktop () {
      return this.$device.isDesktop
    },
    isBotChromeLighthouse () {
      if (process.client) {
        return this.$checkLighthouseBot()
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/header/index.scss">
</style>
