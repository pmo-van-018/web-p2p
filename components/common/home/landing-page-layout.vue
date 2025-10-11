<template>
  <section class="home">
    <div class="content-banner" :style="backgroundImage">
      <div class="container-xl">
        <div class="banner-intro">
          <p class="text-title">{{ $t('home.title') }}</p>
          <div class="d-flex">
            <div class="banner-intro__text">
              <div class="banner-intro__text-main">{{ $t('home.fast') }} - {{ $t('home.safe') }} - {{ $t('home.security') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tool-bar-loader v-if="isResourceLoading" class="home__loader" />
    <tool-bar v-else :tabs="tabs" :active-tab="activeTab" @play="$emit('play')" />
    <b-container fluid="xl">
      <slot />
    </b-container>
  </section>
</template>
<script>
import ToolBar from '@/components/common/home/tool-bar.vue';
import { mapState } from 'vuex';
export default {
  components: {
    ToolBar,
    ToolBarLoader: () => import('~/components/desktop/commons/loader/tool-bar.vue')
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapState('post', ['assetName']),
    ...mapState('resources', ['isResourceLoading', 'metadata']),
    backgroundImage () {
      const url = this.metadata?.marketplace?.desktop?.background || '/assets/images/components/desktop/home/hero-banner-event.png'
      return {
        backgroundImage: `url(${url})`
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/home/landing-page-layout.scss" />
