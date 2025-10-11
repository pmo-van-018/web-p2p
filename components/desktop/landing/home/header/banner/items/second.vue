<template>
  <div class="banner-header">
    <div class="banner-header__container">
      <div class="banner-header__outer">
        <div class="banner-header__inner">
          <content-page class="event">
            <div class="content-page__title">
              <p class="mb-sm-2 mb-md-4">Cá nhân hoá tuyệt đối</p><br/>
              <p>toàn quyền kiểm soát giao dịch</p>
            </div>
          </content-page>
        </div>
        <div class="banner-header__inner">
          <div class="banner-header__security">
            <img class="banner-header__security-inner banner-header__security-inner--mb" :src="imageAnimation.mobile" alt="First thumbnail" loading="lazy">
            <img class="banner-header__security-inner banner-header__security-inner--pc" :src="imageAnimation.desktop" alt="First thumbnail" loading="lazy">
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
