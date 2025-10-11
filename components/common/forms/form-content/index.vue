<template>
  <div class="form-content">
    <div class="form-content__wrapper">
      <div class="form-content__body">
        <slot />
      </div>
      <div class="form-content__footer">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/form-content/index.scss">
</style>
