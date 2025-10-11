<template>
  <section class="collapse-appeal">
    <div class="collapse-appeal__container">
      <div
        :class="[
          'collapse-appeal__head',
          visible ? null : 'collapsed',
          classHeader ? classHeader : null
        ]"
        @click="visible = !visible"
      >
        <div class="collapse-appeal__inner">
          <h3 class="collapse-appeal__title">
            <span v-if="icon" :class="['collapse-appeal__title-icon', icon]" />{{ title }}
          </h3>
          <div :class="['collapse-appeal__icon', visible ? 'icon-arrow-up' : 'icon-arrow']" />
        </div>
      </div>
      <div class="collapse-appeal__body">
        <b-collapse v-model="visible">
          <slot />
        </b-collapse>
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
    icon: {
      type: String,
      default: ''
    },
    classHeader: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/appeal-detail/collapse-appeal/index.scss">
</style>
