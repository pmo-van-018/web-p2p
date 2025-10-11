<template>
  <div class="search-group">
    <BaseInputLabel
      v-model="inputValue"
      :class="['search-group__input', {
        'search-group__input--icon': isShowIcon
      }]"
      :placeholder="placeholder"
      :type="type"
      @input="$emit('input', $event)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @focusin="$emit('focusin', $event)"
    />
    <span
      v-if="isShowIconClose"
      id="delete-search"
      v-b-tooltip.hover.bottom="$t('home.delete')"
      class="icon icon-close-circle-outline"
      @click="onClearInput"
    />
    <span v-else class="icon" :class="iconClass" />
  </div>
</template>
<script>
export default {
  components: {
    BaseInputLabel: () => import('~/components/common/base-input-label.vue')
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    isShowIcon: {
      type: Boolean,
      default: true
    },
    iconClass: {
      type: String,
      default: 'icon-search-outline'
    }
  },
  data () {
    return {
      inputValue: this.value
    }
  },
  computed: {
    isShowIconSearch () {
      return this.isShowIcon && !this.inputValue?.trim()?.length;
    },
    isShowIconClose () {
      return this.isShowIcon && this.inputValue?.trim()?.length;
    }
  },
  watch: {
    value (newValue) {
      this.inputValue = newValue
    }
  },
  methods: {
    onClearInput () {
      this.inputValue = ''
      this.$emit('input', this.inputValue)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/search-input/index.scss">
</style>
