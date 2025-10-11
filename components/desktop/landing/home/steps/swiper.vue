<template>
  <div class="stepper">
    <swiper
      class="choose-us__list choose-us__list--mb"
      :options="swiperOption"
    >
      <swiper-slide
        class="choose-us__swiper"
      >
        <step-section :title="`Bước 1: Truy cập vào web ${brandName}`">
          <p>Tham gia nhanh chóng bằng cách bấm vào đường link phía bên dưới <a :href="linkUrlRedirect" target="_blank">{{ linkUrlRedirect }}</a></p>
        </step-section>
      </swiper-slide>
      <swiper-slide
        class="choose-us__swiper"
      >
        <step-section title="Bước 2: Liên kết ví">
          <p>Bấm vào nút "Liên kết ví", sau đó tiến hành chọn các non-custodial wallet để liên kết các ví với hệ thống {{ brandName }}</p>
          <p>Lưu ý: Mỗi ví sẽ có các hình thức liên kết khác nhau (bằng Password, QRCode...) tùy mỗi dịch vụ mà ví đó hỗ trợ.</p>
        </step-section>
      </swiper-slide>
      <swiper-slide
        class="choose-us__swiper"
      >
        <step-section title="Bước 3:  Hoàn tất đăng ký">
          <p>Sau khi liên kết ví, tài khoản của bạn sẽ được tự động khởi tạo và định danh thông qua địa chỉ ví mà bạn đã liên kết.</p>
          <p>Vui lòng đọc kỹ <a href="/terms" target="_blank">Điều khoản sử dụng</a> và <a href="/privacy-principles" target="_blank">Chính sách bảo mật</a> trước khi xác nhận liên kết ví với hệ thống {{ brandName }}</p>
          <p>Sau khi khởi tạo tài khoản thành công, hệ thống sẽ tự động đăng nhập và hoàn thành tất quá trình đăng ký.</p>
        </step-section>
      </swiper-slide>
    </swiper>
    <div slot="pagination" class="swiper-pagination" />
  </div>
</template>
<script>
export default {
  components: {
    StepSection: () => import('~/components/desktop/landing/home/steps/step/index.vue')
  },
  data () {
    return {
      brandName: this.$config.BRAND_NAME,
      swiperOption: {
        slidesPerView: 1,
        centeredSlides: true,
        slidesOffsetAfter: 16,
        observeParents: true,
        spaceBetween: 20,
        autoHeight: true,
        loop: true,
        autoplay: {
          delay: 5000
        },
        speed: 800,
        breakpoints: {
          1024: {
            slidesPerView: 'auto'
          }
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    linkUrlRedirect () {
      return `${this.$config.STATIC_DOMAIN}/marketplace` || ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/steps/swiper.scss">
</style>
