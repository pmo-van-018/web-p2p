<template>
  <div class="sell-payment-info">
    <div class="sell-payment-info__header">
      <CountdownAction
        :time-left="timeLeft"
        :title="titleMobile"
        :sub-title="subTitleMobile"
        class="mobile"
        class-countdown="countdown-action-mobile big-title"
        :pause-countdown="isSellSendingCryptoByUser"
        :is-visible-time-out="isVisibleTimeOut"
        @get-current-time="$_toBePaidSellMixin_getCurrentTime"
      />
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="sell-payment-info__content">
      <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')" class="mobile">
        <CommandInfo :order-info="order" class="mobile" />
      </LayoutTitle>
      <LayoutTitle :title="$t('end_user_sell.info.label.my_info')" class="mobile hide-border flex-grow-1">
        <InfoBlock tooltip-class="payment-info__tooltip" :list-info="listInfo" is-mobile highlight />
      </LayoutTitle>
      <BankNote
        v-if="order.note"
        class="sell-payment-info__payment-methods-item"
        display-expand
        :note="order.note"
      />
      <LayoutTitle
        v-if="lastTransaction.hash"
        :title="$t('transfer_seller.completed.label.deposit_order')"
        class="hide-border no-margin-top"
      >
        <TransferStatus :transaction="lastTransaction" :status="transactionStatus" />
      </LayoutTitle>
      <div v-if="isSellSendingCryptoUnknown" class="sell-payment-info__action">
        <base-button
          variants="contained"
          color="primary"
          full-width
          :loading="isRequestConfirmLoading"
          @click="$_toBePaidSellMixin_contactAdmin"
        >
          {{ $t('end_user_sell.waiting.label.contact_admin') }}
        </base-button>
      </div>
      <template v-else>
        <div class="sell-payment-info__tx-hash">
          <span>{{ $t('tx_confirm.text_pc_eu') }}</span>
          <div class="tx-submit" @click="$_toBePaidSellMixin_txConfirm">
            <span>{{ $t('action.reconfirm') }}</span>
            <span class="sell-payment-info__external-icon icon-arrow-right-up" />
          </div>
        </div>
        <div class="sell-payment-info__action">
          <base-button
            variants="text"
            color="primary"
            class="sell-payment-info__action-contact"
            @click="$_toBePaidSellMixin_cancelPayment"
          >
            {{ $t('action.cancel_transaction') }}
          </base-button>
          <base-button variants="contained" full-width color="primary" @click="$_toBePaidSellMixin_sendCrypto">
            {{ $t('action.transfer_crypto', { assetName: order.assetName }) }}
          </base-button>
        </div>
      </template>
    </div>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      is-contact-admin
      is-mobile
      is-request-confirmation
      @contact-admin="data => $emit('action', data)"
    />
  </div>
</template>

<script>
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import BankNote from '@/components/common/transfer-to-seller/transfer-info/bank-note.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import toBePaidSellMixin from '@/mixins/user-order-detail/to-be-paid-sell'
import { FULL_DATE_FORMAT } from '@/config/constant'
import dayjs from 'dayjs'
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';

export default {
  components: {
    ModalAppeal,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    OrderInfo,
    BankNote,
    TransferStatus,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [toBePaidSellMixin],
  computed: {
    createdTime () {
      if (!this.order || !this.order.createdTime) {
        return ''
      }
      return dayjs(this.order.createdTime).format(FULL_DATE_FORMAT)
    },
    orderId () {
      return this.order?.id || ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/payment-info.scss" />
