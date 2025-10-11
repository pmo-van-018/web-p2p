<template>
  <swiper
    ref="assetSwiper"
    :options="swiperOption"
    :auto-update="true"
    :auto-destroy="true"
    :delete-instance-on-destroy="true"
    :cleanup-styles-on-destroy="true"
    class="swiper-asset"
  >
    <swiper-slide
      v-for="(tab, index) in tabs"
      :key="index"
      class="swiper-asset__item"
    >
      <b-nav-item
        v-b-tooltip.focus.bottom="{
          delay: { show: 500, hide: 50 }
        }"
        href="javascript:void(0)"
        role="presentation"
        tabindex="0"
        :title="tab.tooltip"
        :active="currentTab === index"
        @click="handleActiveTab(tab, index)"
      >
        <div :id="tab.key" class="asset-content" tabindex="0">
          <div class="asset-content__header" :class="{ disabled: tab.disabled }">
            <div v-if="tab.icon" class="asset-content__logo">
              <img :src="tab.icon" :alt="tab.title">
            </div>
            <div class="d-flex align-items-center">
              <span class="asset-content__title">{{ tab.title }}</span>
              <span v-if="tab.subTitle" class="asset-content__sub-title">
                ({{ tab.subTitle }})
              </span>
            </div>
          </div>
        </div>
      </b-nav-item>
    </swiper-slide>
  </swiper>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentTab: 0,
      swiperOption: {
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: this.tabs.length > 3,
        centeredSlidesBounds: true,
        centerInsufficientSlides: this.tabs.length > 1,
        breakpoints: {
          767: {
            centeredSlides: false,
            slideToClickedSlide: false,
            centeredSlidesBounds: false,
            centerInsufficientSlides: false,
            allowTouchMove: false
          }
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs?.assetSwiper?.$swiper;
    }
  },
  watch: {
    active: {
      handler () {
        if (this.active) {
          this.currentTab = this.active
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.swiper.destroy(false, false)
    this.swiper.init()
    if (this.active) {
      const index = this.tabs.findIndex((item, idx) => idx === this.active);
      this.swiper?.slideTo(index, 0, false);
    }
  },
  methods: {
    handleActiveTab (tab, indexTab) {
      if (tab.disabled && tab.tooltip) {
        return;
      }
      this.currentTab = indexTab
      this.$emit('change-tab', tab)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/tabs-panel/swiper.scss">
</style>
