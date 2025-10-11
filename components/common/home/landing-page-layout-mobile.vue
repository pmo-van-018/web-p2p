<template>
  <div class="home">
    <div class="content-banner event" :style="backgroundImage">
      <div class="banner-intro">
        <p class="text-title">{{ $t('home.title', { assetName }) }}</p>
        <div class="d-flex">
          <div class="banner-intro__text">
            <div class="banner-intro__text-main">{{ $t('home.fast') }} - {{ $t('home.safe') }} - {{ $t('home.security') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <ToolBar :tabs="tabs" :active-tab="activeTab" />
      <b-container fluid="xl" :class="['home', {'logged-in': !!userType}]">
        <section :class="['home__list', {'home__list--loading': isLoading }]">
          <slot name="list" />
        </section>
      </b-container>
    </div>
  </div>
</template>
<script>
import ToolBar from '@/components/common/home/tool-bar.vue';
import { mapState } from 'vuex';
export default {
  components: {
    ToolBar
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('post', ['assetName']),
    ...mapState('user', ['user']),
    ...mapState('resources', ['metadata']),
    userType () {
      return this.user?.type || null
    },
    backgroundImage () {
      const url = this.metadata?.marketplace?.mobile?.background || '/assets/images/components/mobile/home/hero-banner-event.png'
      return {
        backgroundImage: `url(${url})`
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/home/landing-page-layout-mobile.scss" />
