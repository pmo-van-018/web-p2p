<template>
  <div class="overview-title">
    <div class="overview__container d-flex justify-content-between align-items-center w-100">
      <div class="title-group">
        <template v-if="!isLoading">
          <span v-if="backButton && staffName" class="icon-chevron-right1" @click="handleClickGoBack()" />
          <p class="title-group__title font-t20b grey-900 mb-0">{{ staffName || $t("merchant.overview.title") }}</p>
        </template>
      </div>
      <span v-if="isShowButton" role="button" class="overview__button font-t14m grey-900" @click="handleExportFile('Order_History')">
        <span class="icon-download" /> {{ $t("merchant.overview.button_export") }}
      </span>
    </div>
  </div>
</template>
<script>
import dashboardMixin from '@/mixins/dashboard/index.js'
export default {
  mixins: [dashboardMixin],
  props: {
    isShowButton: {
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
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/dashboard/title.scss" />
