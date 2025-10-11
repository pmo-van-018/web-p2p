<template>
  <b-modal
    id="detailHelpModal"
    modal-class="modal-custom"
    centered
    hide-header
    hide-footer
  >
    <section v-if="question" class="help-detail">
      <div class="help-detail__container">
        <div class="help-detail__header">
          <div class="help-detail__inner">
            <div class="help-detail__icon-arrow" @click="$bvModal.hide('detailHelpModal')">
              <span class="icon-arrow-left"></span>
            </div>
            <h2 class="help-detail__text">{{ question.title }}</h2>
          </div>
        </div>
        <div class="help-detail__body">
          <h2 class="help-detail__title-text">{{ question.title }}</h2>
          <help-content-detail :answers="question.answers" />
        </div>
      </div>
    </section>
  </b-modal>
</template>
<script>
export default {
  components: {
    HelpContentDetail: () => import('~/components/desktop/landing/help/content-detail/index.vue')
  },
  props: {
    question: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/detail-modal/index.scss">
</style>
