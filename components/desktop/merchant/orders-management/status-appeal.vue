<template>
  <div v-if="isVisible" class="appeal-status" :class="{ 'appeal': isVisibleAppealButton }">
    <div class="appeal-status__container">
      <svg-icon class="appeal-status__icon" :icon="isVisibleAppealButton ? 'appeal' : 'hand'" />
      <div class="appeal-status__text" :class="{ 'appeal': isVisibleAppealButton }">
        {{ isVisibleAppealButton ? $t('appeal.complain') : $t('appeal.deal') }}
      </div>
    </div>
  </div>
</template>
<script>
import actionAppealMixin from '~/mixins/merchant/orders/action-appeal'

export default {
  components: {
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [actionAppealMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/status-appeal.scss">
</style>
