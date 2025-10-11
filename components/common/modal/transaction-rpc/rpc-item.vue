<template>
  <div class="rpc-item">
    <div class="rpc-item__container">
      <div class="rpc-item__inner">
        <div class="rpc-item__text">RPC {{ orderNumber }}</div>
        <div class="rpc-item__content">
          <div class="rpc-item__link" :title="txtStatus?.rpc">
            {{ txtStatus?.rpc }}
          </div>
          <copy-button
            :id="`rpc-${txtStatus?.rpc}`"
            :show-text-copied="false"
            :value="txtStatus?.rpc"
          />
        </div>
      </div>
      <div class="rpc-item__status">
        <status-wrapper :status="txtStatus?.status" :is-loading="txtStatus?.loading" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    StatusWrapper: () => import('~/components/common/modal/transaction-rpc/status.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    txtStatus: {
      type: Object,
      default: () => {}
    },
    orderNumber: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/transaction-rpc/rpc-item.scss">
</style>
