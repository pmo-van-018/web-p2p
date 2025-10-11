<template>
  <section class="orders">
    <div class="orders__container">
      <div class="orders__body">
        <template v-if="isSkeletonLoading">
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <template v-else>
          <order-table
            custom-class="order-table__variant"
            :items="orders"
            :fields="fields"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="orderLoading"
            @change-pagination="$confirmationTransactionMixin_onChangePage"
          >
            <template #cell(type)="{ item }">
              <order-type
                is-horizontal
                :post-type="item.postType"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
              <div class="description-text">
                <div
                  :id="`order_id_${item.orderRefId}`"
                  class="description-text__title description-text__title--underline"
                  @click="$confirmationTransactionMixin_openDetails(item)"
                >
                  #{{ item.orderRefId }}
                </div>
                <b-tooltip :target="`order_id_${item.orderRefId}`" triggers="hover">
                  {{ $t('merchant.list_order.order_item.see_detail') }}
                </b-tooltip>
              </div>
            </template>
            <template #cell(status)="{ item }">
              <div class="description-text">
                <div class="description-text__title mt-1">
                  <order-status :order="item" />
                </div>
              </div>
            </template>
            <template #cell(amount)="{ item }">
              <order-amount
                :order-id="item.orderRefId"
                :post-type="item.type"
                :fiat-symbol="item.fiatSymbol"
                :asset-name="item.assetName"
                :amount-crypto="item.amount"
                :total-price="item.totalPrice"
              />
            </template>

            <template #cell(bank)="{ item }">
              <order-bank-info :order="item" />
            </template>
            <template #cell(progressing)>
              <div class="description-text">
                <div class="description-text__text">
                  {{ $t('transaction.unknown_transfer') }}
                </div>
              </div>
            </template>
            <template #cell(actions)="{ item }">
              <div class="order-actions">
                <div class="order-actions__wrapper" @click="$confirmationTransactionMixin_onOpenDetailOrderAndChat(item)">
                  <svg-icon
                    icon="read-message"
                    class="order-actions__message-icon"
                  />
                  <div class="order-actions__text">{{ $t('common.view_message') }}</div>
                </div>
              </div>
            </template>

            <template #row-details="{ item }">
              <detail-row-order
                :order="orderDetail"
                show-wallet-address
                @close="$confirmationTransactionMixin_closeDetail(item)"
              >
                <template #footer>
                  <div class="order-actions__confirm-action">
                    <div class="transaction-error">
                      {{ $t('merchant.transaction_detail.transaction_error') }}
                    </div>
                    <div class="btn-actions">
                      <base-button
                        variants="text"
                        color="grey"
                        @click="$confirmationTransactionMixin_openCancelledModal"
                      >
                        {{ $t('action.cancel_transaction') }}
                      </base-button>
                      <base-button
                        variants="contained"
                        color="primary"
                        @click="$confirmationTransactionMixin_openConfirmedModal"
                      >
                        {{ $t('action.confirm_received_crypto') }}
                      </base-button>
                    </div>
                  </div>
                </template>
              </detail-row-order>
            </template>
          </order-table>
        </template>
      </div>
    </div>
    <confirmation-transaction-failed-modal
      :thumbnail="thumbnailConfirmation"
      :title="titleConfirmation"
      :desc="descConfirmation"
      :notes="notesConfirmation"
      :order="orderDetail"
      :is-loading="isConfirmedTransaction"
      @on-confirm="$confirmationTransactionMixin_onConfirm"
    />
  </section>
</template>
<script>
import transactionConfirmationMixin from '~/mixins/transaction-confirmation/index.js'
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderBankInfo: () => import('~/components/desktop/orders/table/items/order-bank-info.vue'),
    DetailRowOrder: () => import('~/components/desktop/orders/table/detail-row-order/index.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ConfirmationTransactionFailedModal: () => import('~/components/desktop/admin/orders/confirmation-modal.vue')
  },
  mixins: [transactionConfirmationMixin, socketListenerListMixin],
  async created () {
    this.countFailedTransaction()
    await this.$confirmationTransactionMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/orders/list.scss">
</style>
