<template>
  <div class="order-chat">
    <div class="order-chat__container">
      <div v-if="!isVisibleChat" class="order-chat__header">
        <template v-if="transactions.length">
          <transaction
            v-for="(transaction, index) in transactions"
            :key="index"
            :transaction="transaction"
          />
        </template>
        <template v-else>
          <transaction>
            <template #title>
              <div class="d-flex flex-column">
                <div class="font-t12b grey-900">{{ $t('admin.transaction_title') }}</div>
                <div class="font-t12r grey-400">{{ $t('admin.no_transaction') }}</div>
              </div>
            </template>
          </transaction>
        </template>
      </div>
      <div v-if="isVisibleChatButton" class="order-chat__body">
        <div class="chat-box" :class="[{ 'h-100 collapsed': isVisibleChat }]">
          <chat-frame />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import { APPEAL_STATUS } from '@/constants/appeals';

export default {
  components: {
    Transaction: () => import('~/components/desktop/merchant/order-detail/transaction/index.vue'),
    ChatFrame: () => import('~/components/desktop/merchant/order-detail/order-chat/chat-frame.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    joinedRoom: {
      type: Boolean,
      default: true
    },
    managerView: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleChat', 'isVisibleCaution', 'chatNoti', 'isListenerEventSocket']),
    transactions () {
      return this.order?.transactions || []
    },
    hasAppeal () {
      return this.order?.appeal && !(this.order?.appeal?.status === APPEAL_STATUS.OPEN)
    },
    step () {
      return this.order?.step
    },
    isVisibleChatButton () {
      if (!this.joinedRoom) {
        return false
      }
      const visibleConditionStep = [
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
      ];
      return this.order?.roomId || visibleConditionStep.includes(this.step) || (this.order?.appeal && !this.managerView);
    }
  },
  methods: {
    ...mapActions('chat', ['setVisibleChat', 'setOrder', 'setVisibleCaution'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-chat/index.scss">
</style>
