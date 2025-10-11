<template>
  <button
    :class="classes"
    type="button"
    :style="[width ? { width: width } : null]"
    :disabled="disabled || loading"
    @click="handleClick($event)"
  >
    <span><slot /></span>
    <svg
      id="button-loader"
      class="base-button__load-infinite"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="20px"
      height="20px"
      viewBox="0 0 50 50"
      style="enable-background:new 0 0 50 50;"
      xml:space="preserve"
    >
      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
    <span v-if="visibleDot" class="base-button__dot">
      <span class="base-button__dot-inner"></span>
    </span>
  </button>
</template>
<script>
export default {
  props: {
    variants: {
      type: String,
      default: 'text',
      validator (value) {
        return ['text', 'contained', 'outlined'].includes(value)
      }
    },
    color: {
      type: String,
      default: '',
      validator (value) {
        return ['', 'danger', 'info', 'primary', 'success', 'warning', 'grey', 'blue'].includes(value)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    fullWidth: { // fit button width to its parent width
      type: Boolean,
      default: false
    },
    visibleDot: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'middle',
      validator (value) {
        return ['small', 'middle', 'large'].includes(value)
      }
    },
    width: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      innerLoading: false
    }
  },
  computed: {
    sizeClassName () {
      const sizeMap = { large: 'lg', small: 'sm', middle: undefined }
      return this.size ? sizeMap[this.size] || '' : ''
    },
    classes () {
      const pre = 'base-button'
      return {
        [`${pre}`]: true,
        [`${pre}__${this.variants}`]: this.variants,
        [`${pre}__${this.color}`]: this.color,
        [`${pre}__${this.sizeClassName}`]: this.sizeClassName,
        [`${pre}__loading`]: this.loading,
        [`${pre}__full-width`]: this.fullWidth
      };
    }
  },
  methods: {
    handleClick (event) {
      if (this.loading || this.disabled) {
        event.preventDefault()
        return
      }
      this.$emit('click', event)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/base-button/index.scss">
</style>
