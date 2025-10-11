<template>
  <div class="payment-info">
    <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')">
      <CommandInfo :order-info="order" />
    </LayoutTitle>
    <LayoutTitle :title="$t('transfer_seller.waiting.label.payment_method_title')">
      <InfoBlock :list-info="listInfo" show-note :note="order?.note" highlight />
    </LayoutTitle>
    <LayoutTitle v-if="isSellSendingCryptoFailed" :title="$t('transfer_seller.completed.label.deposit_order')">
      <TransferStatus :transaction="lastTransaction" :status="transactionStatus" />
    </LayoutTitle>
    <CountdownAction
      :time-left="timeLeft"
      :title="title"
      :sub-title="subTitle"
      :pause-countdown="isSellSendingCryptoByUser"
      :is-visible-time-out="isVisibleTimeOut"
      @get-current-time="$_toBePaidSellMixin_getCurrentTime"
    >
      <template v-if="isSellSendingCryptoUnknown">
        <div class="payment-info__action">
          <base-button
            variants="contained"
            color="primary"
            @click="$_toBePaidSellMixin_contactAdmin"
          >
            {{ $t('end_user_sell.waiting.label.contact_admin') }}
          </base-button>
        </div>
      </template>
      <template v-else>
        <div class="payment-info__tx-hash">
          {{ $t('tx_confirm.text_pc_eu') }} <span @click="$_toBePaidSellMixin_txConfirm">{{ $t('action.reconfirm') }}</span>
        </div>
        <div class="payment-info__action">
          <base-button variants="contained" color="primary" @click="$_toBePaidSellMixin_sendCrypto">
            {{ $t('action.transfer_crypto', { assetName: order?.assetName }) }}
          </base-button>
          <base-button variants="text" color="primary" @click="$_toBePaidSellMixin_cancelPayment">
            {{ $t('action.cancel_transaction') }}
          </base-button>
        </div>
      </template>
    </CountdownAction>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      is-contact-admin
      is-request-confirmation
      @contact-admin="data => $emit('action', data)"
    />
  </div>
</template>

<script>
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import toBePaidSellMixin from '@/mixins/user-order-detail/to-be-paid-sell';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';

export default {
  components: {
    ModalAppeal,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    TransferStatus,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [toBePaidSellMixin]
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/payment-info.scss" />
