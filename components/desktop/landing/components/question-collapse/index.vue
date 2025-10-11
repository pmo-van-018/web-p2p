<template>
  <section class="question-collapse" :class="visible ? 'visible-collapse' : null">
    <div class="question-collapse__container">
      <div
        :class="visible ? 'visible-collapse' : null"
        :aria-expanded="visible ? 'true' : 'false'"
        aria-controls="question-collapse"
        class="question-collapse-header"
        @click="visible = !visible"
      >
        <h3 class="question-collapse__title" :class="visible ? 'active' : null">{{ title }}</h3>
      </div>
      <div class="question-collapse__wrapper-title" @click="$emit('on-open-detail')">
        <h3 class="question-collapse__title">{{ title }}</h3>
      </div>
    </div>
    <div class="question-collapse__body" :class="visible ? 'visible-collapse' : null">
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/components/question-collapse/index.scss">
</style>
