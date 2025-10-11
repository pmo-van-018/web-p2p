<template>
  <div class="payment">
    <div class="payment__header">
      <TitleHeader
        :title="titleText.title"
        :sub-title="titleText.subTitle"
        :desc="appealEndTime"
      />
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="payment__content">
      <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')" class="mobile">
        <CommandInfo :order-info="order" class="mobile" />
      </LayoutTitle>
      <LayoutTitle :title="$t('transfer_seller.cancel.label.payment_methods')" class="mobile hide-border">
        <BoxInfo :title="$t('transfer_seller.completed.label.confirmed_payment')" />
      </LayoutTitle>
      <AppealSecret v-if="secret" :secret="secret" />
      <LayoutTitle
        v-if="lastTransaction.hash"
        :title="$t('transfer_seller.completed.label.deposit_order')"
        class="mobile"
      >
        <TransferStatus :transaction="lastTransaction" :status="status" />
      </LayoutTitle>
      <div v-if="isSendingCryptoFailed" class="payment__action">
        <base-button full-width variants="text" class="payment__action-contact" color="primary" @click="contactAdmin">
          {{ $t('action.contact_support') }}
        </base-button>
        <base-button full-width variants="contained" color="primary" @click="getAppealGroup">
          {{ $t('action.contact_merchant') }}
        </base-button>
      </div>
      <div v-if="isUserRequestSupport || isReopenSteps" class="payment__action">
        <base-button full-width variants="contained" color="blue" @click="openChatFrame">
          {{ $t('action.join_appeal') }}
        </base-button>
      </div>
    </div>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      :is-contact-admin="isContactAdmin"
      is-mobile
      @contact-admin="data => $emit('action', data)"
    />
    <loading v-if="isLoading" />
  </div>
</template>

<script>
import BoxInfo from '@/components/common/transfer-to-seller/box-info.vue';
import CommandInfo from '@/components/common/command-info.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import TitleHeader from '@/components/common/transfer-to-seller/title-header.vue';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import paymentMixin from '@/mixins/user-order-detail/payment'
import { mapState } from 'vuex'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'

export default {
  components: {
    AppealSecret,
    BoxInfo,
    CommandInfo,
    LayoutTitle,
    OrderInfo,
    TitleHeader,
    TransferStatus,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [paymentMixin],
  computed: {
    ...mapState('chat', ['chatNoti']),
    ...mapState('end-user', ['secretKey']),
    orderId () {
      return this.order?.id || ''
    },
    secret () {
      return this.order?.appeal?.secret || this.secretKey
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-order-detail/payment-info.scss" />
