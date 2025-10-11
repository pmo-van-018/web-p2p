<template>
  <div
    :class="[
      'banner-swiper-mobile__item',
      isLightHouse ? 'banner-swiper-mobile__item--lighthouse' : `banner-swiper-mobile__item--${bannerSwiperClass}`
    ]"
  >
    <div class="header-home__top">
      <div class="header-home__text">
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
      <div :class="['header-home__character', `header-home__character--${characterClass}`]">
        <nuxt-img
          v-if="bannerCharacterMasco"
          :src="bannerCharacterMasco"
          sizes="xs:70vw sm:70vw lg:100vw"
          format="webp"
          :class="['header-home__character-masco', `header-home__character-masco--${characterMascoClass}`]"
          alt="features-banner"
        />
        <nuxt-img
          v-if="bannerCharacterCoin"
          :src="bannerCharacterCoin"
          :class="['header-home__character-coin', `header-home__character-coin--${characterCoinClass}`]"
          sizes="xs:70vw sm:70vw lg:100vw"
          format="webp"
          class="header-home__character-coin"
          alt="features-banner"
        />
      </div>
    </div>
    <nuxt-img
      v-if="bannerBackground"
      :src="bannerBackground"
      sizes="sm:100vw lg:100vw"
      format="webp"
      class="banner-swiper-mobile__background-image"
      alt="features-banner"
    />
  </div>
</template>
<script>
export default {
  props: {
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
    bannerBackground: {
      type: String,
      default: ''
    },
    characterClass: {
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
    },
    isLightHouse: {
      type: Boolean,
      default: false
    }
  }
}
</script>
