<template>
  <section class="question-collapse" :class="visible ? 'visible-collapse' : null" @click="visible = !visible">
    <div class="question-collapse__container">
      <div
        :class="visible ? 'visible-collapse' : null"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="question-collapse"
        class="question-collapse-header round-xl"
      >
        <div class="question-collapse__inner-header d-flex align-items-center justify-content-between">
          <h3 class="question-collapse__title">{{ title }}</h3>
          <span class="question-collapse__icon icon-chevron-right-bordered" />
        </div>
      </div>
    </div>
    <div class="question-collapse__body">
      <div class="question-collapse__content">
        <b-collapse v-model="visible" accordion="question-collapse" role="tabpanel">
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
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/detail-faq/collapse.scss">
</style>
