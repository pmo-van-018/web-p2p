<template>
  <section class="checklist-feature">
    <div class="checklist-feature__container container">
      <h2 class="home-page__title">
        {{ $t("home.landing.features.title") }}
        <span class="highlight">
          {{ $t("home.landing.features.sub-title") }}
        </span>
      </h2>
      <div class="checklist-feature__description">
        {{ $t("home.landing.features.description") }}
      </div>
      <div class="checklist-feature__outer">
        <div class="checklist-feature__thumbnail">
          <nuxt-img
            src="/assets/images/components/desktop/home/feature-banner.png"
            sizes="xs:230px sm:70vw lg:100vw"
            format="webp"
            alt="features-banner"
            loading="lazy"
          />
        </div>
        <div class="checklist-feature__wrapper">
          <div class="d-lg-flex justify-content-center my-4 d-none">
            <base-button class="checklist-feature__action" variants="contained" color="primary" @click="$router.push('/about')">
              <div class="d-flex align-items-center">
                <span class="mr-2">{{ $t("home.landing.features.trade-now-button") }}</span>
              </div>
            </base-button>
          </div>
          <div class="checklist">
            <div class="checklist__wrapper">
              <div class="checklist__list">
                <div v-for="(checklist, index) in checklists" :key="`checklist_${index}`" class="checklist__item">
                  <div class="checklist__thumb checklist__thumb--pc">
                    <img :src="checklist.thumbnail" :alt="checklist.title">
                  </div>
                  <div class="checklist__inner">
                    <div class="checklist__content">
                      <h3 class="checklist__title">{{ checklist.title }}</h3>
                    </div>
                    <p class="checklist__text">{{ checklist.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="checklist-feature__grid">
        <div class="checklist-feature__grid-inner">
          <div class="checklist">
            <div class="checklist__wrapper">
              <div class="checklist__list">
                <div v-for="(checklist, index) in firstThreeItemsCheckList" :key="`checklist_${index}`" class="checklist__item">
                  <div class="checklist__thumb checklist__thumb--pc">
                    <img :src="checklist.thumbnail" :alt="checklist.title">
                  </div>
                  <div class="checklist__inner">
                    <div class="checklist__content">
                      <h3 class="checklist__title">{{ checklist.title }}</h3>
                    </div>
                    <p class="checklist__text">{{ checklist.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="checklist-feature__grid-inner d-flex align-items-center flex-column">
          <div class="checklist-feature__thumbnail">
            <nuxt-img
              src="/assets/images/components/desktop/home/feature-banner.png"
              sizes="xs:70vw sm:100vw lg:100vw"
              format="webp"
              class="checklist-feature__banner"
              alt="banner"
            />
          </div>
          <base-button class="checklist-feature__action" variants="contained" color="primary" @click="$router.push('/about')">
            <div class="d-flex align-items-center">
              <span class="mr-2">{{ $t("home.landing.features.trade-now-button") }}</span>
            </div>
          </base-button>
        </div>
        <div class="checklist-feature__grid-inner">
          <div class="checklist">
            <div class="checklist__wrapper">
              <div class="checklist__list">
                <div v-for="(checklist, index) in lastTwoItemsCheckList" :key="`checklist-last_${index}`" class="checklist__item">
                  <div class="checklist__thumb checklist__thumb--pc">
                    <img :src="checklist.thumbnail" :alt="checklist.title">
                  </div>
                  <div class="checklist__inner">
                    <div class="checklist__content">
                      <h3 class="checklist__title">{{ checklist.title }}</h3>
                    </div>
                    <p class="checklist__text">{{ checklist.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import takeRight from 'lodash/takeRight'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      checklists: [
        {
          title: this.$t('home.landing.features.item.decentralized-title'),
          thumbnail: require('~imageRoot/components/desktop/home/feature-decentralized.jpg'),
          content: this.$t('home.landing.features.item.decentralized-content')
        },
        {
          title: this.$t('home.landing.features.item.fee-title'),
          thumbnail: require('~imageRoot/components/desktop/home/feature-fee.jpg'),
          content: this.$t('home.landing.features.item.fee-content')

        },
        {
          title: this.$t('home.landing.features.item.support-title'),
          thumbnail: require('~imageRoot/components/desktop/home/feature-support.jpg'),
          content: this.$t('home.landing.features.item.support-content')

        },
        {
          title: this.$t('home.landing.features.item.performance-title'),
          thumbnail: require('~imageRoot/components/desktop/home/feature-performance.jpg'),
          content: this.$t('home.landing.features.item.performance-content')
        },
        {
          title: this.$t('home.landing.features.item.trusted-title'),
          thumbnail: require('~imageRoot/components/desktop/home/trusted.jpg'),
          content: this.$t('home.landing.features.item.trusted-content')
        }
      ]
    }
  },
  computed: {
    firstThreeItemsCheckList () {
      return this.checklists.slice(0, 3)
    },
    lastTwoItemsCheckList () {
      return takeRight(this.checklists, 2)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/checklist-feature/index.scss">
</style>
