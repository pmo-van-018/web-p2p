<template>
  <modal-common
    :id="modalId"
    :ref="modalId"
    :title="$t('transaction_rpc.content_title')"
    @show-modal="onShowModalTransactionRpc"
    @hide-modal="onCloseModalTransactionRpc"
  >
    <template v-if="isHasTimeOut && showCountDown" #countdown>
      <countdown
        class="ml-1"
        :time-left="timeoutMilliseconds"
        is-visible-mercy-loading
        @on-start-countdown="showCountDown = true"
        @time-out="onTimeOut"
      />
    </template>
    <div class="transaction-rpc">
      <div class="transaction-rpc__container">
        <div class="transaction-rpc__wrapper">
          <div class="transaction-rpc__thumb">
            <img src="/assets/images/common/transaction-rpc.png" alt="rpc icon" width="120" height="120">
          </div>
          <div class="transaction-rpc__head">
            <div class="transaction-rpc__content">
              {{ $t('transaction_rpc.content') }}
            </div>
          </div>

          <div v-if="order?.id" class="transaction-rpc__detail-order">
            <span>{{ $t('order_filter.trading_code') }}</span>
            <b>{{ order?.id || '' }}</b>
          </div>

          <div class="transaction-rpc__body">
            <div class="transaction-rpc__body-title">{{ $t('transaction_rpc.status_transaction') }}</div>
            <rpc-item
              v-for="(txtStatus, index) in transactionTxtStatusList"
              :key="`txt-status-${index}`"
              :order-number="index + 1"
              :txt-status="txtStatus"
            />
          </div>

          <div class="transaction-rpc__txt">
            <div class="transaction-txt">
              <div class="transaction-txt__inner">
                <div class="transaction-txt__text">TxID</div>
                <div
                  class="transaction-txt__id"
                  @click="$_assetNetwork_openExploreTransactionHash(assetNetwork, transactionHash)"
                >
                  {{ transactionHash | formatHash(8) }}
                </div>
              </div>.
              <div class="transaction-txt__copy">
                <copy-button
                  :id="`transaction-txt-${transactionHash}`"
                  :show-text-copied="false"
                  :value="transactionHash"
                />
              </div>
            </div>
          </div>

          <div class="transaction-rpc__checkbox">
            <form-checkbox
              class="form-checkbox-custom"
              aria-describedby="selected"
              aria-controls="selected"
              @input="selectedUpdateTransaction = $event"
            >
              <span class="font-t14r" v-html="$t('transaction_rpc.checkbox_text')" />
            </form-checkbox>
          </div>
          <div class="transaction-rpc__action">
            <base-button
              variants="outlined"
              color="primary"
              full-width
              :disabled="isLoadingConfirmResolved"
              @click="onReUpdateTransactionCryptoStatusRpc"
            >
              {{ $t('action.re_update') }}
            </base-button>
            <base-button
              :disabled="isLoadingConfirmResolved || !selectedUpdateTransaction"
              variants="contained"
              color="primary"
              full-width
              @click="onContinueConfirmPay"
            >
              {{ $t('action.continue') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue'
import { MODAL } from '@/resources/modal'
import MERCHANT_ORDER_API from '@/api/merchant-order'
import last from 'lodash/last'
import { setPopupOptionsLocalStorage } from '@/helper';
import { SELL_ORDER_STEPS } from '@/constants/orders';
import { mapGetters } from 'vuex';
import assetNetworkMixin from '@/mixins/asset-network';

export default {
  components: {
    ModalCommon,
    RpcItem: () => import('~/components/common/modal/transaction-rpc/rpc-item.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    Countdown: () => import('~/components/common/countdown.vue')
  },
  mixins: [assetNetworkMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectedUpdateTransaction: false,
      modalId: MODAL.TRANSACTION_RPC,
      transactionTxtStatusList: [],
      isLoadingConfirmResolved: false,
      showCountDown: true
    }
  },
  computed: {
    ...mapGetters('resources', ['networkConfigs']),
    isHasTimeOut () {
      return !!this.order?.timeout
    },
    timeoutMilliseconds () {
      if (this.order?.timeout === null) {
        return null
      }
      return this.$options.filters.convertToMilliseconds(this.order?.timeout)
    },
    lastTransactions () {
      return last(this.order?.transactions) || []
    },
    transactionHash () {
      return this.lastTransactions?.hash || ''
    },
    assetNetwork () {
      return this.order?.assetNetwork || ''
    },
    transactionTxStatus () {
      const txtStatus = this.lastTransactions?.txnStatus || []
      if (!txtStatus.length) {
        return []
      }
      return txtStatus.map((item) => {
        return {
          ...item,
          loading: false
        }
      })
    }
  },
  methods: {
    onShowModalTransactionRpc () {
      this.showCountDown = true
      this.transactionTxtStatusList = this.transactionTxStatus
    },
    onTimeOut () {
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME) {
        this.showCountDown = false
      }
    },
    onCloseModalTransactionRpc () {
      this.isLoadingConfirmResolved = false
      this.selectedUpdateTransaction = false
      this.$bvModal.hide(MODAL.TRANSACTION_RPC)
    },
    onContinueConfirmPay () {
      setPopupOptionsLocalStorage(this.modalId, this.order?.id, true)
      this.onCloseModalTransactionRpc()
      this.$emit('on-continue', this.order)
    },
    async onReUpdateTransactionCryptoStatusRpc () {
      if (!this.order?.orderRefId) {
        return;
      }
      this.isLoadingConfirmResolved = true;
      this.transactionTxtStatusList = this.transactionTxStatus.map(item => ({
        ...item,
        loading: true
      }));
      try {
        const { data } = await this.$axios.$get(MERCHANT_ORDER_API.TRANSACTION_CRYPTO_STATUS_RPC(this.order.orderRefId));
        const rpcStatus = data.rpcStatus;
        if (rpcStatus) {
          this.transactionTxtStatusList = rpcStatus.map(item => ({
            ...item,
            loading: false
          }));
        }
      } catch (error) {
        this.transactionTxtStatusList = this.transactionTxStatus.map(item => ({
          ...item,
          loading: false
        }));
      } finally {
        this.isLoadingConfirmResolved = false
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/transaction-rpc/index.scss">
</style>
