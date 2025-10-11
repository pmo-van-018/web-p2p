<template>
  <div class="report-action" :class="{active}" @click="$emit('click', item)">
    <div class="report-action__wrapper">
      <slot>
        <div class="report-action__content">{{ item.title }}</div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({
        title: '',
        key: ''
      })
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-action.scss">
</style>
