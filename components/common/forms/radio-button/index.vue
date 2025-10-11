<template>
  <b-form-radio
    class="custom-radio-form"
    v-bind="$attrs"
    plain
    stacked
    v-on="$listeners"
  >
    <slot />
  </b-form-radio>
</template>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/radio-button/index.scss">
</style>
