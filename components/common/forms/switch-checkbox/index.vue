<template>
  <div class="switch-toggle">
    <div
      class="switch-toggle__overlay"
      :class="{disabled: loading || disabled}"
      @click="onToggleCheckBox"
    />
    <label
      :class="[
        'switch',
        switchClass,
        {
          load: loading,
          disabled: disabled,
        }
      ]"
    >
      <input
        v-model="inputValue"
        type="checkbox"
        :disabled="loading || disabled"
      >
      <div />
    </label>
  </div>
</template>
<script>
export default {
  props: {
    switchClass: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isToggle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputValue: this.value
    }
  },
  watch: {
    value (newValue) {
      this.inputValue = newValue
    }
  },
  methods: {
    onToggleCheckBox () {
      // Toggle the checkbox value before emitting "click"
      if (this.isToggle) {
        this.inputValue = !this.inputValue;
      }
      this.$emit('click', this.inputValue)
    }
  }
}
</script>
<style  lang="scss" scoped src="static/assets/scss/components/common/forms/switch-checkbox/index.scss">
</style>
