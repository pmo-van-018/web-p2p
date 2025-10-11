<template>
  <div class="help-content">
    <div v-for="(answer, idxAnswer) in answers" :key="idxAnswer">
      <p v-if="answer.type === TYPE_CONTENT_FAQ.TEXT" class="help-content__text" v-html="answer.text">
      </p>
      <div v-else-if="answer.type === TYPE_CONTENT_FAQ.IMAGE" class="d-flex align-items-center justify-content-center mb-4">
        <img
          :src="answer.link"
          :alt="answer.text"
          class="help-content__image"
        >
      </div>
      <div v-else-if="answer.type === TYPE_CONTENT_FAQ.TEXT_ITALIC" class="help-content__text">
        <i>{{ answer.text }}</i>
      </div>
      <div v-else-if="answer.type === TYPE_CONTENT_FAQ.TEXT_BOLD" class="help-content__text">
        <strong>{{ answer.text }}</strong>
      </div>
      <div v-else-if="answer.type === TYPE_CONTENT_FAQ.LINK" class="help-content__text">
        <a :href="answer.value" target="_blank">{{ answer.text }}</a>
      </div>
      <div v-if="answer?.children?.length" class="ml-3">
        <content-detail
          :answers="answer.children"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { TYPE_CONTENT_FAQ } from '~/resources/faq';

export default {
  name: 'ContentDetail',
  props: {
    answers: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      TYPE_CONTENT_FAQ
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/content-detail/index.scss">
</style>
