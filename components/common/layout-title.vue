<template>
  <div class="layout-title">
    <div class="layout-title__title">
      {{ title }}
      <span v-if="desc">{{ desc }}</span>
    </div>
    <div class="layout-title__container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/layout-title.scss" />
