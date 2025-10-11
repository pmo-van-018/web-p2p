<template>
  <section class="choose-us">
    <div class="choose-us__container">
      <h2 class="home-page__title d-flex align-items-center justify-content-center">
        <span class="why-content">{{ $t("home.landing.why-choice.title") }}</span>
        <img
          src="/assets/images/components/desktop/home/ano-trade-logo.svg"
          alt="Logo"
          sizes="xs:140px md:140px lg:208px"
          loading="lazy"
          width="208"
          class="ml-1 object-fit-contain ano-trade-logo"
        >
      </h2>
      <p class="choose-us__content">
        {{ $t("home.landing.why-choice.sub-title") }}
      </p>
      <div class="choose-us__wrapper">
        <div class="choose-us__list choose-us__list--pc">
          <div
            v-for="(item, index) in items"
            :key="`choice-us-${index}`"
            class="choose-us__item"
          >
            <div class="choose-card">
              <div class="choose-card__wrapper">
                <div class="choose-card__inner" :class="item.class">
                  <div class="choose-card__thumb">
                    <img :src="item.thumb" :alt="item.title">
                  </div>
                  <h3 class="choose-card__title" :class="item.class">
                    {{ item.title }}
                  </h3>
                  <div class="choose-card__content">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <client-only>
          <swiper
            class="choose-us__list choose-us__list--mb"
            :options="swiperOption"
          >
            <swiper-slide
              v-for="(item, index) in items"
              :key="`choice-us-${index}`"
              class="choose-us__swiper"
            >
              <div class="choose-card">
                <div class="choose-card__wrapper">
                  <div class="choose-card__inner" :class="item.class">
                    <div class="choose-card__thumb">
                      <img :src="item.thumb" :alt="item.title">
                    </div>
                    <h3 class="choose-card__title" :class="item.class">
                      {{ item.title }}
                    </h3>
                    <div class="choose-card__content">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </client-only>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      brandName: this.$config.BRAND_PLATFORM,
      swiperOption: {
        slidesPerView: 1.4,
        spaceBetween: 8,
        slidesOffsetBefore: 12,
        slidesOffsetAfter: 12,
        loop: true,
        watchSlidesProgress: true,
        autoplay: {
          delay: 3000
        },
        breakpoints: {
          530: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 2.4,
            spaceBetween: 16
          },
          820: {
            slidesPerView: 2.5
          },
          992: {
            slidesPerView: 3,
            allowTouchMove: false,
            loop: false,
            autoplay: false
          }
        }
      },
      items: [
        {
          title: this.$t('home.landing.why-choice.incognito-title'),
          content: this.$t('home.landing.why-choice.incognito-content'),
          thumb: require('~imageRoot/components/desktop/home/incognito.jpg'),
          class: 'first'
        },
        {
          title: this.$t('home.landing.why-choice.price-title'),
          content: this.$t('home.landing.why-choice.price-content'),
          thumb: require('~imageRoot/components/desktop/home/price.jpg'),
          class: 'second'
        },
        {
          title: this.$t('home.landing.why-choice.safe-title'),
          content: this.$t('home.landing.why-choice.safe-content'),
          thumb: require('~imageRoot/components/desktop/home/safe.jpg'),
          class: 'three'
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/choose-us/index.scss">
</style>
