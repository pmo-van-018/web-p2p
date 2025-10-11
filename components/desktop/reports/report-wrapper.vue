<template>
  <div class="report-wrapper">
    <div class="report-wrapper__container">
      <div v-if="title" class="report-wrapper__title font-t12m grey-500 mb-2">{{ title }}</div>
      <div class="report-wrapper__body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.report-wrapper {
  &__title {
    color: var(--mode-light-dark-700);
  }
}
</style>
