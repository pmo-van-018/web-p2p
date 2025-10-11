<template>
  <div class="stepper">
    <div class="stepper__item second">
      <div class="stepper__title">{{ title }}</div>
      <div class="stepper__desc">
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/steps/step.scss">
</style>
