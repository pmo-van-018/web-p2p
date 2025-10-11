<template>
  <header class="header-holiday" :style="backgroundHeader">
    <div class="header-holiday__container">
      <swiper
        ref="bannerSwiperHoliday"
        :options="swiperOption"
        :auto-update="true"
        :auto-destroy="true"
        :delete-instance-on-destroy="true"
        :cleanup-styles-on-destroy="true"
        class="banner-swiper w-100 h-100"
      >
        <swiper-slide>
          <header-first-item :image-animation="backgroundAnimationFirst" />
        </swiper-slide>
        <swiper-slide>
          <header-second-item :image-animation="backgroundAnimationSecond" />
        </swiper-slide>
        <swiper-slide>
          <header-three-item :image-animation="backgroundAnimationThree" />
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
      </swiper>
    </div>
    <div class="header-holiday__statistic">
      <statistics-section />
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex';

export default {
  components: {
    HeaderFirstItem: () => import('~/components/desktop/landing/home/header/banner/items/first.vue'),
    HeaderSecondItem: () => import('~/components/desktop/landing/home/header/banner/items/second.vue'),
    HeaderThreeItem: () => import('~/components/desktop/landing/home/header/banner/items/three.vue'),
    StatisticsSection: () => import('~/components/desktop/landing/home/header/statistics.vue')
  },
  data () {
    return {
      swiperOption: {
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
          el: '.swiper-pagination',
          clickable: true
        },
        on: {
          slideChangeTransitionStart () {
            const $wrapperEl = this.$wrapperEl;
            const params = this.params;
            $wrapperEl.children(('.' + (params.slideClass) + '.' + (params.slideDuplicateClass)))
              .each(function () {
                const idx = this.getAttribute('data-swiper-slide-index');
                this.innerHTML = $wrapperEl.children('.' + params.slideClass + '[data-swiper-slide-index="' + idx + '"]:not(.' + params.slideDuplicateClass + ')').html();
              });
          },
          slideChangeTransitionEnd () {
            this.slideToLoop(this.realIndex, 0, false);
          }
        }
      }
    }
  },
  computed: {
    ...mapState('resources', ['metadata']),
    metadataLandingPage () {
      return this.metadata?.landing || null;
    },
    backgroundHeader () {
      const defaultBackground = this.$device.isMobile
        ? '/assets/images/components/mobile/landing/banner/background-header.png'
        : '/assets/images/components/desktop/landing/banner/background-header.png'
      return this.getBackgroundStyle(defaultBackground, 'background')
    },
    backgroundAnimationFirst () {
      return this.getAnimationBackgroundImageStyle(0, 'first')
    },
    backgroundAnimationSecond () {
      return this.getAnimationBackgroundImageStyle(1, 'second')
    },
    backgroundAnimationThree () {
      return this.getAnimationBackgroundImageStyle(2, 'three')
    }
  },
  methods: {
    getBackgroundStyle (defaultValue, key) {
      if (!this.metadataLandingPage) {
        return {
          background: `url(${defaultValue}) no-repeat`,
          'background-size': 'cover'
        };
      }
      const backgroundUrl = this.$device.isMobile ? this.metadataLandingPage?.mobile?.[key] : this.metadataLandingPage?.desktop?.[key];
      return {
        background: `url(${backgroundUrl}) no-repeat`,
        'background-size': 'cover'
      }
    },
    getAnimationBackgroundImageStyle (index, defaultName) {
      if (!this.metadataLandingPage) {
        return {
          desktop: `/assets/images/components/desktop/landing/banner/${defaultName}.png`,
          mobile: `/assets/images/components/mobile/landing/banner/${defaultName}.png`
        }
      }
      return {
        desktop: this.metadataLandingPage?.desktop?.animations?.[index] || `/assets/images/components/desktop/landing/banner/${defaultName}.png`,
        mobile: this.metadataLandingPage?.mobile?.animations?.[index] || `/assets/images/components/mobile/landing/banner/${defaultName}.png`
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/header/banner/index.scss">
</style>
