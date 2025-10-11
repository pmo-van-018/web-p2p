<template>
  <div class="overview-item">
    <div class="overview-item__ttl">
      <p class="overview-item__text grey-500 mb-0">{{ title }} <br v-if="times" class="d-none d-md-block"> {{ times }} </p>
      <span :id="`overview-${id}`" v-b-tooltip.focus class="overview-item__icon icon-info-circle ml-1" tabindex="0" />
      <b-tooltip :target="`overview-${id}`" :triggers="$device.isMobileOrTablet ? 'focus' : 'hover'">
        <span v-html="note"></span>
      </b-tooltip>
    </div>
    <div class="overview-item__content">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ' '
    },
    title: {
      type: String,
      default: ''
    },
    times: {
      type: String,
      default: ''
    }
  }
}
</script>
  <style lang="scss" scoped src="static/assets/scss/components/common/dashboard/item.scss" />
