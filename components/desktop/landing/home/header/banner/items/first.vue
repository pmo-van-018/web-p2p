<template>
  <div class="banner-header">
    <div class="banner-header__container">
      <div class="banner-header__outer">
        <div class="banner-header__inner">
          <content-page class="event">
            <div class="content-page__title">
              <p class="mb-sm-2 mb-md-4">Tỷ giá cạnh tranh</p><br/>
              <p>nhất thị trường</p>
            </div>
          </content-page>
        </div>
        <div class="banner-header__inner">
          <div class="banner-header__security">
            <img class="banner-header__security-inner banner-header__security-inner--mb" :src="imageAnimation.mobile" alt="First thumbnail">
            <img class="banner-header__security-inner banner-header__security-inner--pc" :src="imageAnimation.desktop" alt="First thumbnail">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    ContentPage: () => import('@/components/desktop/landing/home/header/content-page.vue')
  },
  props: {
    imageAnimation: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/header/banner/items/index.scss">
</style>
