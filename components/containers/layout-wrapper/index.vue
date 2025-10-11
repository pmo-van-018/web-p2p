<template>
  <section class="layout-wrapper">
    <div class="layout-wrapper__inner">
      <div class="layout-wrapper__head" :class="{'layout-wrapper__head--center': hasActionSlot }">
        <div :class="{ 'container' :center }">
          <h2 v-if="title" class="layout-wrapper__title">{{ title }}</h2>
          <slot v-if="hasHeadSlot" name="head" />
        </div>
        <slot name="action" />
      </div>
      <div class="layout-wrapper__body">
        <div :class="{ 'container' :center }">
          <slot v-if="hasBodySlot" name="body" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasHeadSlot () {
      return !!this.$slots.head;
    },
    hasActionSlot () {
      return !!this.$slots.action;
    },
    hasBodySlot () {
      return !!this.$slots.body;
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/containers/layout-wrapper/index.scss">
</style>
