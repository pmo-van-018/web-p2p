<template>
  <div class="card-result">
    <h3 aria-controls="collapse" class="card-result__title" @click="visible = !visible">{{ item.title }}</h3>
    <p v-show="!visible && description" class="card-result__desc" v-html="description"></p>
    <b-collapse v-model="visible" accordion="result" role="tabpanel" class="mt-2">
      <help-content-detail :answers="item.answers" />
    </b-collapse>
  </div>
</template>
<script>
import get from 'lodash/get';

export default {
  components: {
    HelpContentDetail: () => import('~/components/desktop/landing/help/content-detail/index.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => ({
        title: '',
        answers: []
      })
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    description () {
      return get(this.item.answers, '[0].text')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/help/search-result/card.scss">
</style>
