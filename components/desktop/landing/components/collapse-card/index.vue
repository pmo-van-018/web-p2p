<template>
  <div class="collapse-card" :class="visible ? 'visible-collapse' : null">
    <div class="collapse-card__container">
      <div
        :class="visible ? 'visible-collapse' : null"
        aria-controls="collapse"
        class="collapse-header"
        @click="visible = !visible"
      >
        <div class="collapse-header__title">{{ title }}</div>
        <div class="collapse-header__right">
          <span class="collapse-header__icon icon-chevron-right-bordered" />
        </div>
      </div>
    </div>
    <div class="collapse-card__body" :class="visible ? 'visible-collapse' : null">
      <div class="collapse-content">
        <b-collapse v-model="visible" accordion="collapse" role="tabpanel">
          <slot></slot>
        </b-collapse>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/components/collapse-card/index.scss">
</style>
