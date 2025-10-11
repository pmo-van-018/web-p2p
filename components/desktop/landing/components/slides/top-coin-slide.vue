<template>
  <div class="coin-top coin-top__active-mobile">
    <swiper
      :options="swiperOption"
      class="swiper slides__scroll-tabs"
    >
      <swiper-slide
        v-for="(item, index) in slides"
        :key="`coin_${index}`"
        class="tab-action__scroll-item"
      >
        <div class="coin-top__item">
          <div class="row">
            <div class="col-4 coin-top__item-icon">
              <img :src="item.image" alt="usdt" class="coin-top__item--asset-icon">
            </div>
            <div class="col-8 coin-top__item-info">
              <div>
                <span class="coin-top__font14b">{{ item.name }}</span>
                <span class="coin-top__network-type">{{ item.network }}</span>
              </div>
              <span><strong>{{ item.marketCap }}</strong></span>
            </div>
          </div>
          <div class="row pt-3">
            <div class="col-7 coin-top__price-change">
              <span :class="item.upFlag ? 'coin-top__item--coin-up' : 'coin-top__item--coin-down'">{{ item.priceChange }}</span><img :src="getUnion(item.upFlag)" alt="union" class="coin-top__price-change--union ml-2">
            </div>
            <div class="col-5 coin-top__item--coin-price">
              {{ item.price }}
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        observer: true,
        observeParents: true,
        spaceBetween: 20,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        breakpoints: {
          1024: {
            slidesPerView: 'auto'
          }
        }
      }
    };
  },
  methods: {
    getUnion (flag) {
      return flag ? '/assets/images/components/desktop/home/union.svg' : '/assets/images/components/desktop/home/down-union.svg';
    }
  }
}
</script>
<style lang="scss" src="static/assets/scss/components/desktop/landing/components/slides/top-coin-slide.scss" />
