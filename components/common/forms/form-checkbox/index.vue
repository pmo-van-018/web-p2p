<template>
  <b-form-checkbox
    :class="[
      'form-checkbox-custom',
      { 'form-checkbox-custom--reverse': reverse }
    ]"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </b-form-checkbox>
</template>
<script>
export default {
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/form-checkbox/index.scss">
</style>
