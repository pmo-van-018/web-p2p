<template>
  <section class="detail-faq">
    <faq-collapse
      v-for="(ques, idxQuestion) in questions"
      :key="`question_${idxQuestion}`"
      :title="ques.title"
    >
      <div class="detail-faq__content">
        <help-content-detail :answers="ques.answers" />
      </div>
    </faq-collapse>
  </section>
</template>
<script>
export default {
  components: {
    FaqCollapse: () => import('~/components/common/customer-care/detail-faq/collapse.vue'),
    HelpContentDetail: () => import('~/components/desktop/landing/help/content-detail/index.vue')
  },
  props: {
    questions: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/detail-faq/index.scss">
</style>
