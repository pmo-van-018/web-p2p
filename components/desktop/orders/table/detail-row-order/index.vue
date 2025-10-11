<template>
  <section class="detail-order">
    <div class="detail-order__close">
      <span class="icon-cancel" @click="$emit('close')" />
    </div>
    <div class="detail-order__container">
      <div class="detail-order__head">
        <div class="detail-order__head-left">
          <div class="detail-order__head-inner">
            <div class="detail-order__order-type">
              <order-type
                :post-type="order.postType"
                :name="order.assetName"
                :network="order.assetNetwork"
                is-horizontal
              />
            </div>
            <div class="detail-order__order-no">#{{ order.orderRefId }}</div>
            <div class="detail-order__status">
              <order-status :order="order" />
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div v-if="order.user?.nickName" class="user-info">
              <span class="font-t12r grey-400">{{ $t('merchant.list_order.order_filter.user') }}</span>
              <span class="font-t12r grey-600">{{ order.user?.nickName || '' }}</span>
            </div>
            <div v-if="order.user?.nickName" class="detail-order__dot" />
            <div class="detail-order__datetime">
              <div class="date-time">
                <div class="date-time__created">{{ $t('transfer_seller.label.time_create') }}</div>
                <div class="date-time__value">{{ order.createdTime | formatDateTime }}</div>
              </div>
            </div>
            <div v-if="order.postRefId" class="detail-order__dot" />
            <div class="order-no">
              <div class="order-no__inner">
                <div class="order-no__title order-no__title--text-grey">{{ $t('order.detail.ad_id') }}</div>
                <div class="order-no__title">#{{ order.postRefId }}</div>
                <div class="order-no__copy">
                  <copy-button :id="`copy-post-id-${order.postRefId}`" :value="order.postRefId" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="order.supporter" class="detail-order__head-right">
          <order-supporter :order="order" horizontal />
        </div>
      </div>
      <div class="detail-order__body">
        <div class="detail-order__grid" :class="[{'vertical': isVisibleChat}, {'show-wallet-address': showWalletAddress && !isVisibleChat}]">
          <div class="detail-order__item">
            <div class="detail-order__item-inner" :class="[{'vertical': isVisibleChat}, {'show-wallet-address': showWalletAddress}]">
              <order-info :order-detail="order" />
              <div class="detail-order__payment">
                <order-method :order-detail="order" />
              </div>
              <div v-if="showWalletAddress" class="detail-order__wallet-address">
                <div class="detail-card">
                  <div class="title">{{ $t('merchant.transaction_detail.wallet_address_info.title') }}</div>
                  <div class="detail-card__wrapper">
                    <div class="info-list">
                      <div class="row-info">
                        <div class="label">{{ $t('merchant.transaction_detail.wallet_address_info.sender') }}</div>
                        <div class="value">
                          <span>{{ order?.user?.walletAddress }}</span>
                          <CopyButton id="sender-wallet-address" :value="order?.user?.walletAddress" />
                        </div>
                      </div>
                      <div class="row-info">
                        <div class="label">{{ $t('merchant.transaction_detail.wallet_address_info.receiver') }}</div>
                        <div class="value">
                          <span>{{ order?.merchant?.walletAddress }}</span>
                          <CopyButton id="receiver-wallet-address" :value="order?.merchant?.walletAddress" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isVisibleChat" class="detail-order__chat">
                <div class="detail-order__chat-title">{{ $t('admin.transaction_title') }}</div>
                <div class="detail-order__chat-inner">
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
                        <div class="font-t12r grey-400">{{ $t('admin.no_transaction') }}</div>
                      </template>
                    </transaction>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-order__item">
            <order-chat :order="order" :joined-room="joinedRoom" :manager-view="managerView" />
          </div>
        </div>
      </div>
      <slot name="footer" :item="order">
        <div v-if="!managerView" class="detail-order__footer">
          <order-footer
            :order="order"
            :is-loading="isLoading"
            :is-transasaction-error="showWalletAddress"
            @on-transfer="$emit('on-transfer', $event)"
            @on-pay="$emit('on-pay', $event)"
            @on-open-appeal="$emit('on-open-appeal', $event)"
            @on-confirmed-processed="$emit('on-confirmed-processed', $event)"
            @on-term-transfer="$emit('on-term-transfer', $event)"
            @on-tx-confirm="$refs.popupTxConfirmation.show()"
          />
        </div>
        <ManagerOrderFooter
          v-else
          :order="order"
        />
      </slot>
    </div>
    <ModalTxConfirmation ref="popupTxConfirmation" @on-tx-guide="$refs.popupTxGuide.show()" />
    <ModalTxGuide ref="popupTxGuide" @on-tx-confirm="$refs.popupTxConfirmation.show()" />
  </section>
</template>
<script>
import { mapState } from 'vuex'

export default {
  components: {
    ModalTxConfirmation: () => import('@/components/common/modal/modal-tx-confirmation.vue'),
    ModalTxGuide: () => import('@/components/common/modal/modal-tx-guide.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderInfo: () => import('~/components/desktop/merchant/order-detail/order-info.vue'),
    OrderMethod: () => import('~/components/desktop/merchant/order-detail/order-method.vue'),
    OrderChat: () => import('~/components/desktop/merchant/order-detail/order-chat/index.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    OrderFooter: () => import('~/components/desktop/orders/table/detail-row-order/order-footer/index.vue'),
    ManagerOrderFooter: () => import('~/components/desktop/orders/table/detail-row-order/order-footer/order-footer-manager.vue'),
    Transaction: () => import('~/components/desktop/merchant/order-detail/transaction/index.vue'),
    OrderSupporter: () => import('~/components/desktop/merchant/orders-management/order-supporter.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    joinedRoom: {
      type: Boolean,
      default: true
    },
    managerView: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    showWalletAddress: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleChat']),
    transactions () {
      return this.order?.transactions || []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/detail-row-order/index.scss">
</style>
