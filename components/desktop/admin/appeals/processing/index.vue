<template>
  <div class="processing">
    <div class="processing__content">
      <div class="processing__title">{{ title }}</div>
      <div class="processing__sub-title">
        <p v-if="winnerSubTitle">{{ winnerSubTitle }}</p>
        <p v-html="subTitle" />
      </div>
    </div>
  </div>
</template>
<script>
import appealProgressMixin from '@/mixins/admin/appeal-progress'

export default {
  mixins: [appealProgressMixin],
  props: {
    appeal: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    order () {
      return this.appeal?.order
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeals/processing/index.scss">
</style>
