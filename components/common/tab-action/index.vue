<template>
  <div class="tab-action">
    <div class="tab-action__container">
      <div class="tab-action__head">
        <b-tabs>
          <template #tabs-end>
            <div class="tab-action__disable-swiper">
              <b-nav-item
                v-for="tab in tabs"
                :key="tab?.status"
                lazy
                :active="tab?.status === currentTabStatus"
                @click="onActiveTab(tab)"
              >
                <div class="tab-content">
                  <div class="tab-content__text">{{ tab.title }}</div>
                  <div v-if="tab.isCount" class="tab-content__count">{{ tab.count }}</div>
                </div>
              </b-nav-item>
            </div>
            <div class="tab-action__active-mobile">
              <swiper
                ref="tabsScroll"
                :options="swiperOption"
                class="swiper tab-action__scroll-tabs"
              >
                <swiper-slide
                  v-for="tab in tabs"
                  :key="tab?.status"
                  class="tab-action__scroll-item"
                >
                  <b-nav-item
                    lazy
                    :active="tab?.status === currentTabStatus"
                    @click="onActiveTab(tab)"
                  >
                    <div class="tab-content">
                      <div class="tab-content__text">{{ tab.title }}</div>
                      <div v-if="tab.isCount" class="tab-content__count">{{ tab.count }}</div>
                    </div>
                  </b-nav-item>
                </swiper-slide>
              </swiper>
            </div>
          </template>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      currentTabStatus: null,
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
        allowTouchMove: this.tabs.length > 2,
        breakpoints: {
          1024: {
            slidesPerView: 'auto'
          }
        }
      }
    };
  },
  computed: {
    swiper () {
      return this.$refs?.tabsScroll?.$swiper;
    }
  },
  watch: {
    activeTab: {
      handler () {
        if (this.activeTab) {
          this.currentTabStatus = this.activeTab?.status;
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (this.activeTab) {
      const index = this.tabs.findIndex(item => item?.status === this.activeTab?.status);
      this.swiper?.slideTo(index, 200, false);
    }
  },
  methods: {
    onActiveTab (tab) {
      this.currentTabStatus = tab?.status;
      this.$emit('on-change-tab', tab)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/tab-action/index.scss">
</style>
