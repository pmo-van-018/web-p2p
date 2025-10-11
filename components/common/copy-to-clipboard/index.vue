<template>
  <div class="copy-content">
    <div class="copy-content__container">
      <div :class="['copy-content__text', typeClass]">
        <slot />
      </div>
      <copy-button :id="`${id}_${valueCopy}`" :value="valueCopy" class="copy-content__button" />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    valueCopy: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: '',
      validator (value) {
        if (value === '') { return true }
        return ['success', 'danger'].includes(value)
      }
    }
  },
  computed: {
    typeClass () {
      return this.type ? `copy-content__text--${this.type}` : null
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/copy-to-clipboard/index.scss">
</style>
