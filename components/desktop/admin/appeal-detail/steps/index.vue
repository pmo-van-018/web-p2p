<template>
  <div class="steps steps--vertical">
    <div v-for="step in steps" :key="step.id" class="step is-vertical">
      <div :class="['step__head', { 'is-finish': step.id === activeKey && !decisionResult }]">
        <div class="step__line">
          <i class="step__line-inner" />
        </div>
        <div class="step__icon" />
      </div>
      <div :class="['step__main', { 'is-finish': step.id === activeKey }]">
        <div class="step__title">
          <div class="content-step">
            <div class="content-step__container">
              <div class="content-step__head">
                <h3 :class="['content-step__title', { 'is-finish': step.id === activeKey }]">{{ step.title }}</h3>
                <div :class="['content-step__date', { 'is-finish': step.id === activeKey }]">{{ step.openAt | formatDateTime }}</div>
              </div>
              <div class="content-step__body">
                <div :class="['content-step__detail', { 'is-finish': step.id === activeKey }]">
                  <template v-if="step.id === keyStep.contact">
                    {{ subTitleContactAt }}
                  </template>
                  <template v-if="step.id === keyStep.appealMerchant">
                    {{ subTitleOpenAt }}
                  </template>
                  <template v-else-if="step.id === keyStep.extraTime">
                    <div v-html="subTitleExtraTime" />
                  </template>
                  <template v-else-if="step.id === keyStep.resultAppeal">
                    <p>{{ winnerSubTitle }}</p>
                    <p v-html="subTitleFormatAppeal" />
                    <p v-if="isForceCloseAppeal">{{ $t('admin.processing.sub_title.force_close_appeal') }}</p>
                  </template>
                  <template v-else-if="step.id === keyStep.completedAppeal">
                    <div v-html="subTitleCompletedAppeal" />
                  </template>
                </div>
              </div>
              <div class="content-step__footer">
                <div class="content-step__footer-date">{{ step.openAt | formatDateTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderBy from 'lodash/orderBy';
import { ORDER_STATUS } from '@/config/constant'
import appealProgressMixin from '@/mixins/admin/appeal-progress'
export default {
  mixins: [appealProgressMixin],
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    appeal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      keyStep: {
        contact: 1,
        appealMerchant: 2,
        extraTime: 3,
        resultAppeal: 4,
        completedAppeal: 5
      }
    }
  },
  computed: {
    activeKey () {
      let active = this.keyStep.contact;
      if (this.appeal.openAt && this.order?.roomId) {
        active = this.keyStep.appealMerchant
      }
      if (this.appeal?.addExtraAt) {
        active = this.keyStep.extraTime
      }
      if (this.appeal?.decisionAt && this.appeal.decisionResult) {
        active = this.keyStep.resultAppeal
      }
      if ([ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(this.order.status)) {
        active = this.keyStep.completedAppeal
      }
      return active
    },
    steps () {
      const stepList = [
        {
          id: this.keyStep.contact,
          title: this.$t('admin.steps.contacted'),
          openAt: this.appeal.createdAt,
          index: new Date(this.appeal.createdAt).getTime()
        }
      ]
      if (this.appeal.openAt) {
        stepList.push({
          id: this.keyStep.appealMerchant,
          title: this.$t('admin.steps.user_complained_merchant'),
          openAt: this.appeal.openAt,
          index: new Date(this.appeal.openAt).getTime()
        })
      }
      if (this.appeal.addExtraAt) {
        stepList.push({
          id: this.keyStep.extraTime,
          title: this.$t('admin.steps.extra_time'),
          openAt: this.appeal.addExtraAt,
          index: new Date(this.appeal.addExtraAt).getTime()
        })
      }
      if (this.appeal.decisionAt && this.appeal.decisionResult) {
        stepList.push({
          id: this.keyStep.resultAppeal,
          title: this.$t('admin.steps.result_appeal'),
          openAt: this.appeal.decisionAt,
          index: new Date(this.appeal.decisionAt).getTime()
        })
      }
      if ([ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(this.order.status)) {
        stepList.push({
          id: this.keyStep.completedAppeal,
          title: this.$t('admin.steps.complained_ended'),
          openAt: this.appeal.actualCloseAt,
          index: new Date(this.appeal.actualCloseAt).getTime()
        })
      }
      return orderBy(stepList, ['index'], ['ASC'])
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/admin/appeal-detail/steps/index.scss">
</style>
