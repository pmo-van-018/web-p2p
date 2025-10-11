<template>
  <div class="payment">
    <LayoutTitle :title="$t('transfer_seller.completed.label.transaction_info')">
      <CommandInfo :order-info="order" />
    </LayoutTitle>
    <LayoutTitle :title="$t('transfer_seller.completed.label.payment_methods')" class="hide-border">
      <BoxInfo :title="$t('transfer_seller.completed.label.confirmed_payment')" />
    </LayoutTitle>
    <LayoutTitle
      v-if="lastTransaction.hash"
      :title="$t('transfer_seller.completed.label.deposit_order')"
      class="no-margin-top"
      :class="{'hide-border': !isSendingCryptoFailed}"
    >
      <TransferStatus
        :transaction="lastTransaction"
        :status="status"
      />
    </LayoutTitle>
    <AppealSecret v-if="secret" :secret="secret" />
    <LayoutTitle v-if="isSendingCryptoFailed" :title="$t('transfer_seller.label.waiting')" class="hide-border">
      <div class="payment__sub-title-action">
        {{ $t('transfer_seller.complain.waiting_complain') }}
      </div>
      <base-button variants="contained" color="primary" @click="getAppealGroup">
        {{ $t('action.contact_merchant') }}
      </base-button>
      <base-button variants="text" class="payment__action-contact" color="primary" @click="contactAdmin">
        {{ $t('action.contact_support') }}
      </base-button>
    </LayoutTitle>
    <LayoutTitle
      v-if="isUserRequestSupport"
      :title="appealLimitText"
      :desc="appealEndTime"
      class="hide-border"
    >
      <div class="payment__sub-title-action">
        {{ $t('appeal.desc') }}
      </div>
    </LayoutTitle>
    <LayoutTitle
      v-if="isReopenSteps"
      :title="$t('transfer_seller.note.transfer_reopen.title')"
      class="hide-border"
    >
      <div class="payment__sub-title-action">
        {{ $t('transfer_seller.note.transfer_reopen.sub_title') }}
      </div>
    </LayoutTitle>
    <ModalAppeal
      ref="modalAppeal"
      :order="order"
      :is-contact-admin="isContactAdmin"
      @contact-admin="data => $emit('action', data)"
    />
    <loading v-if="isLoading" />
  </div>
</template>

<script>
import BoxInfo from '@/components/common/transfer-to-seller/box-info.vue';
import CommandInfo from '@/components/common/command-info.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import TransferStatus from '@/components/common/transfer-to-seller/transfer-status.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import paymentMixin from '@/mixins/user-order-detail/payment'
import { mapState } from 'vuex'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'

export default {
  components: {
    BoxInfo,
    CommandInfo,
    LayoutTitle,
    TransferStatus,
    ModalAppeal,
    AppealSecret,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [paymentMixin],
  computed: {
    ...mapState('end-user', ['secretKey']),
    secret () {
      return this.order?.appeal?.secret || this.secretKey
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/payment.scss" />
