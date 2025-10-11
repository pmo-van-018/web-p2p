<template>
  <button class="refresh-button" :disabled="disabled" @click="$emit('click')">
    <span class="icon-reload"><span class="path1" /><span class="path2" /></span>
    <slot>{{ $t('common.button.refresh') }}</slot>
  </button>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/buttons/refresh.scss">
</style>
