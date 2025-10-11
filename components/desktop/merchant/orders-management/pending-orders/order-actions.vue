<template>
  <order-actions
    :order="order"
    :disabled="disabledButton"
    :visible-appeal="isVisibleAppealButton"
    :visible-chat="isVisibleChatButton"
    :visible-copy-all="visibleCopyAll"
    :hidden-transfer="isHiddenActionTransfer"
    :is-visible-term-transfer="isPostTypeBuy "
    @click="onTransferAction"
    @on-open-appeal="onOpenAppeal"
    @on-term-transfer="onTermTransfer"
    @on-open-chat="onOpenChat"
  >
    {{ actionTransferText }}
  </order-actions>
</template>
<script>
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'
export default {
  components: {
    OrderActions: () => import('~/components/desktop/orders/table/items/order-actions.vue')
  },
  mixins: [orderActionTransferMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    visibleCopyAll: {
      type: Boolean,
      default: false
    }
  }
}
</script>
