<template>
  <van-dropdown-item
    ref="filter"
    v-bind="$attrs"
    :title="titleModified"
    :disabled="disabled"
    :title-class="titleClass"
    :class="{ operatorFilterFlag: operatorFilterFlag }"
    v-on="$listeners"
    @toggle="$emit('toggle', $event)"
    @close="onModifiedTitle"
    @open="handleToggle(true)"
    @opened="handleToggle(true)"
    @closed="handleToggle(false)"
  >
    <slot />
  </van-dropdown-item>
</template>
<script>
import VanDropdownItem from 'vant/lib/dropdown-item'
import 'vant/lib/dropdown-item/style'

export default {
  components: {
    VanDropdownItem
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    valueActive: {
      type: [Number, String],
      default: ''
    },
    titleClass: {
      type: String,
      default: ''
    },
    operatorFilterFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      titleModified: ''
    }
  },
  watch: {
    valueActive: {
      handler () {
        this.onModifiedTitle()
      }
    }
  },
  mounted () {
    this.titleModified = this.$attrs.title
  },
  methods: {
    toggle (action = false) {
      this.$refs?.filter?.toggle(action)
    },
    onModifiedTitle () {
      const { $parent } = this.$parent
      $parent.activeDropdownItem = !$parent.activeDropdownItem
      if (this.active) {
        this.titleModified = this.valueActive || this.$attrs.title
      } else {
        this.titleModified = this.$attrs.title
      }
    },
    handleToggle (isOpen) {
      this.$emit('on-toggle', isOpen, this.$attrs);
    }
  }
}
</script>
<style lang="scss">
.operatorFilterFlag {
  .van-dropdown-item--down {
    top: 94px !important;
  }
}
</style>
<style lang="scss" scoped src="static/assets/scss/components/mobile/commons/libs/filter-menu-item/index.scss">
</style>
