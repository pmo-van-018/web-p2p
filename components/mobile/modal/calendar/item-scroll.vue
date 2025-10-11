<template>
  <div class="item-scroll">
    <Swiper
      ref="itemScroll"
      :options="swiperOption"
      class="item-scroll__container"
      @slide-change="slideChange"
    >
      <SwiperSlide v-for="(item, index) in listDislay" :key="index" class="item-scroll__item" @click.native="active(index)"> {{ item.title }} </SwiperSlide>
    </Swiper>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
export default {
  components: { SwiperSlide, Swiper },
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 1,
        direction: 'vertical'
      },
      listDislay: []
    };
  },
  computed: {
    swiper () {
      return this.$refs.itemScroll.$swiper;
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value) {
          const index = this.list.findIndex(item => item.value === value.value)
          this.swiper.slideTo(index, 200, false)
        }
      },
      deep: true
    },
    list: {
      handler (value) {
        this.listDislay = value
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.listDislay = this.list
      const index = this.list.findIndex(item => item.value === this.value.value)
      this.swiper.slideTo(index, 200, false)
    }, 100)
  },
  methods: {
    slideChange () {
      this.$emit('input', this.list[this.swiper.activeIndex])
    },
    active (index) {
      this.swiper.slideTo(index, 200, false)
      this.$emit('input', this.list[index])
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/modal/calendar/item-scroll.scss"></style>
