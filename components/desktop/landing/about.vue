<template>
  <section class="about-us">
    <header>
      <div class="header-section">
        <div class="container">
          <div class="header-section__top row">
            <div class="col-3 col-md-6">
              <div class="figure-section" />
            </div>
            <div class="col-9 col-md-6">
              <div class="header-content">
                <h1 class="header-content__title">
                  <img class="header-content__title-logo" src="/assets/images/common/header/logo-ano.svg" alt="Logo Ano About" width="305" height="47">
                  <span>chào mừng bạn!</span>
                </h1>
                <div class="header-content__desc">
                  <div class="mb-sm-2 mb-3">Tại {{ brandName }}, giao dịch tiền mã hóa của bạn sẽ trở nên dễ dàng và nhanh chóng. <span>Chúng tôi cam kết mang đến trải nghiệm tuyệt vời để làm hài lòng bạn.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="about-us__wrapper">
      <div class="pc-only card-wrapper">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div class="row">
              <div class="col-md-6 d-flex align-items-center">
                <div class="card-content">
                  <div class="card-content__title">
                    <span>{{ valueSection.title }}</span>
                  </div>
                  <h2 class="card-content__desc">{{ valueSection.desc }}</h2>
                  <ul class="card-content__list">
                    <li v-for="(content, index) in valueSection.content" :key="`value_pc_${index}`" class="card-content__item">{{ content }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card-content">
                  <div class="card-content__img">
                    <nuxt-img
                      src="/assets/images/components/desktop/about/guard-bg.png"
                      alt="Security Image"
                      format="webp"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-only card-wrapper">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div class="card-content">
              <div class="card-content__title">
                <span>{{ valueSection.title }}</span>
              </div>
              <h2 class="card-content__desc">{{ valueSection.desc }}</h2>
            </div>
            <div class="card-content">
              <div class="card-content__img">
                <nuxt-img
                  src="/assets/images/components/desktop/about/guard-bg.png"
                  alt="Security Image"
                  sizes="sm:100vw lg:100vw"
                  format="webp"
                  loading="lazy"
                />
              </div>
            </div>
            <div class="card-content">
              <ul class="card-content__list">
                <li v-for="(content, index) in valueSection.content" :key="`value_mb_${index}`" class="card-content__item">{{ content }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="pc-only card-wrapper card-wrapper--grey">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div class="row flex-md-row-reverse">
              <div class="col-md-6 d-flex align-items-center">
                <div ref="scrollRef" class="card-content">
                  <div class="card-content__title">
                    <span>{{ visionSection.title }}</span>
                  </div>
                  <h2 class="card-content__desc">{{ visionSection.desc }}</h2>
                  <ul class="card-content__list">
                    <li v-for="(content, index) in visionSection.content" :key="`vision_pc_${index}`" class="card-content__item">{{ content }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div ref="scrollRef" class="card-content">
                  <div class="card-content__img">
                    <nuxt-img
                      src="/assets/images/components/desktop/about/vision-bg.png"
                      alt="Vision"
                      sizes="sm:100vw lg:100vw"
                      format="webp"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-only card-wrapper card-wrapper--grey">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div ref="scrollRef" class="card-content">
              <div class="card-content__title">
                <span>{{ visionSection.title }}</span>
              </div>
              <h2 class="card-content__desc">{{ visionSection.desc }}</h2>
            </div>
            <div ref="scrollRef" class="card-content">
              <div class="card-content__img">
                <nuxt-img
                  src="/assets/images/components/desktop/about/vision-bg.png"
                  alt="Vision"
                  format="webp"
                  loading="lazy"
                />
              </div>
            </div>
            <div class="card-content">
              <ul class="card-content__list">
                <li v-for="(content, index) in visionSection.content" :key="`vision_mb_${index}`" class="card-content__item">{{ content }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="pc-only card-wrapper">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div class="row">
              <div class="col-md-6 d-flex align-items-center">
                <div ref="scrollRef" class="card-content">
                  <div class="card-content__title">
                    <span>{{ missionSection.title }}</span>
                  </div>
                  <h2 class="card-content__desc">{{ missionSection.desc }}</h2>
                  <ul class="card-content__list">
                    <li v-for="(content, index) in missionSection.content" :key="`mission_pc_${index}`" class="card-content__item">{{ content }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card-content">
                  <div class="card-content__img">
                    <nuxt-img
                      src="/assets/images/components/desktop/about/mission-bg.png"
                      alt="Mission"
                      format="webp"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-only card-wrapper">
        <div class="card-wrapper__inner">
          <div class="container card-wrapper__container">
            <div ref="scrollRef" class="card-content">
              <div class="card-content__title">
                <span>{{ missionSection.title }}</span>
              </div>
              <h2 class="card-content__desc">{{ missionSection.desc }}</h2>
            </div>
            <div class="card-content">
              <div class="card-content__img">
                <nuxt-img
                  src="/assets/images/components/desktop/about/mission-bg.png"
                  alt="Mission"
                  format="webp"
                  loading="lazy"
                />
              </div>
            </div>
            <div class="card-content">
              <ul class="card-content__list">
                <li v-for="(content, index) in missionSection.content" :key="`mission_mb_${index}`" class="card-content__item">{{ content }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
export default {
  data () {
    return {
      brandName: this.$config.BRAND_NAME,
      valueSection: {
        title: 'GIÁ TRỊ',
        desc: 'An toàn và Bảo mật',
        content: [
          'Chúng tôi cam kết xây dựng và duy trì một nền tảng giao dịch an toàn và đáng tin cậy, đảm bảo tính bảo mật và bảo vệ dữ liệu của người dùng. Sự tin cậy của người dùng là ưu tiên hàng đầu của chúng tôi.',
          'Người dùng có hoàn toàn quyền kiểm soát tài sản của mình mà không cần dựa vào bất kỳ tổ chức trung gian nào. Điều này đảm bảo tính minh bạch và tăng cường sự linh hoạt trong việc quản lý và giao dịch tiền mã hóa.'
        ]
      },
      visionSection: {
        title: 'TẦM NHÌN',
        desc: 'Tiếp cận toàn cầu',
        content: [
          'Tiếp cận toàn cầu đến thị trường tiền mã hóa. Có thể giao dịch với người dùng từ nhiều quốc gia khác nhau, giúp tăng tính thanh khoản và mang lại nhiều cơ hội đầu tư hấp dẫn.',
          'Các giao dịch trên sàn được lưu trữ công khai trên blockchain, đảm bảo tính minh bạch cao. Người dùng có thể dễ dàng kiểm tra và xác minh giao dịch một cách công khai.',
          'Chúng tôi cung cấp nhiều loại tiền mã hóa để người dùng lựa chọn. Điều này cho phép đa dạng hóa danh mục đầu tư và tận dụng các cơ hội trên thị trường.'
        ]
      },
      missionSection: {
        title: 'SỨ MỆNH',
        desc: 'Luôn luôn đổi mới để phát triển',
        content: [
          'Chúng tôi tập trung vào việc cung cấp trải nghiệm giao dịch dễ dàng, nhanh chóng và hiệu quả cho người dùng. Điều này giúp họ tiếp cận thị trường tiền mã hóa một cách thuận tiện và linh hoạt.',
          'Chúng tôi xây dựng một cộng đồng đồng lòng và nhiệt huyết, nơi người dùng có thể giao tiếp và hỗ trợ lẫn nhau. Cộng đồng là trụ cột của sự phát triển và thành công của chúng tôi.',
          'Sứ mệnh lớn nhất của chúng tôi là định hình một tương lai tài chính phi tập trung. Chúng tôi tận tụy làm việc để xây dựng hệ sinh thái đáng tin cậy và đổi mới, đem lại lợi ích thực sự cho cộng đồng toàn cầu.'
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/about.scss" />
