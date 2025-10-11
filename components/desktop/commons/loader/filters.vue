<template>
  <div class="filter-loader">
    <div class="filter-loader__wrapper">
      <div class="filter-loader__inner">
        <b-skeleton class="filter-loader__skeleton" animation="fade"></b-skeleton>
        <b-skeleton class="filter-loader__skeleton" animation="fade"></b-skeleton>
        <b-skeleton class="filter-loader__skeleton" animation="fade"></b-skeleton>
      </div>
      <div v-if="isShowAction" class="filter-loader__action">
        <b-skeleton animation="fade" height="40" type="button"></b-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowAction: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/loader/filters.scss">
</style>
