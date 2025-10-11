<template>
  <div :class="['banner-swiper__item', `banner-swiper__item--${bannerSwiperClass}`]">
    <div class="header-home__container">
      <div class="header-home__row">
        <div class="header-home__left" :class="leftClass">
          <div class="header-home__left-content">
            <div class="header-home__version">
              {{ $t("home.landing.header.text_version") }}
            </div>
            <slot />
            <p class="header-home__subtitle">{{ $t("home.landing.header.content") }}</p>
            <div class="header-home__scroll">
              <div class="header-home__scroll-icon" />
              <div class="header-home__scroll-inner">
                <div class="header-home__scroll-text">{{ $t("home.landing.header.scroll-text") }}</div>
                <div class="header-home__scroll-subtitle">{{ $t("home.landing.header.scroll-subtitle") }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="header-home__right" :class="rightClass">
          <div class="header-home__content-right">
            <nuxt-img
              v-if="bannerCharacterMasco"
              :src="bannerCharacterMasco"
              sizes="xs:230px sm:70vw lg:100vw"
              format="webp"
              class="header-home__character-masco"
              :class="['header-home__character-masco', `header-home__character-masco--${characterMascoClass}`]"
              alt="features-banner"
            />
            <nuxt-img
              v-if="bannerCharacterCoin"
              :src="bannerCharacterCoin"
              sizes="xs:230px sm:70vw lg:100vw"
              format="webp"
              class="header-home__character-coin"
              :class="['header-home__character-coin', `header-home__character-coin--${characterCoinClass}`]"
              alt="features-banner"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    leftClass: {
      type: String,
      default: ''
    },
    rightClass: {
      type: String,
      default: ''
    },
    bannerSwiperClass: {
      type: String,
      default: ''
    },
    characterMascoClass: {
      type: String,
      default: ''
    },
    bannerCharacterMasco: {
      type: String,
      default: ''
    },
    characterCoinClass: {
      type: String,
      default: ''
    },
    bannerCharacterCoin: {
      type: String,
      default: ''
    }
  }
}
</script>
