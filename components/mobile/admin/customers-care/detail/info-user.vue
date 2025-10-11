<template>
  <div class="info-user">
    <div class="info-user__inner">
      <div class="info-user__name">{{ userName }}</div>
      <div class="info-user__content">
        <div class="info-user__statistic">
          <div class="info-user__statistic-inner">
            <div class="info-user__statistic-text">{{ $t('customer_care.transfer') }}</div>
            <div class="info-user__statistic-text yellow">{{ totalOrder }}</div>
          </div>
          <div class="info-user__statistic-inner">
            <div class="info-user__statistic-text">{{ $t('customer_care.completed') }}</div>
            <div class="info-user__statistic-text green">{{ rate }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="info-user__inner">
      <div class="info-user__left">{{ $t('customer_care.code_request') }}</div>
      <div class="info-user__copy-info">
        <span class="info-user__ref-content">#{{ refId }}</span>
        <copy-button
          :id="`support-${refId}`"
          :show-text-copied="false"
          :value="refId"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    refId: {
      type: String,
      default: ''
    },
    totalOrder: {
      type: Number,
      default: 0
    },
    rate: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/customer-care/detail/info-user.scss">
</style>
