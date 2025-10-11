<template>
  <div :class="['overview-title', {'px-0': isEndUser}]">
    <div class="d-flex justify-content-between align-items-center w-100">
      <div class="title-group">
        <template v-if="!isLoading">
          <span v-if="backButton && staffName" class="icon-chevron-right1" @click="handleClickGoBack()" />
          <div class="title-group__staff-info">
            <p class="title-group__title font-t20b grey-900 mb-0">{{ staffName || $t("merchant.overview.title") }}</p>
            <p v-if="staffWallet" class="title-group__staff-wallet">{{ staffWallet }}</p>
          </div>
        </template>
      </div>
      <div class="button-group">
        <div v-if="isRefreshButton" role="button" class="overview__button font-t14m grey-900" @click="$emit('on-refresh')">
          <span class="icon-reload"><span class="path1" /><span class="path2" /></span>
          <slot>{{ $t("merchant.overview.refresh_statistic") }}</slot>
        </div>
        <div v-if="isShowButton" role="button" class="overview__button font-t14m grey-900" @click="$emit('click')">
          <span class="icon-download" /> {{ $t("merchant.overview.button_export") }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
export default {
  mixins: [dashboardMixin],
  props: {
    isEndUser: {
      type: Boolean,
      default: false
    },
    isShowButton: {
      type: Boolean,
      default: false
    },
    isRefreshButton: {
      type: Boolean,
      default: false
    },
    isShowTitle: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    backButton: {
      type: Boolean,
      default: false
    },
    staffName: {
      type: String,
      default: ''
    },
    staffWallet: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dashboard/title.scss" />
