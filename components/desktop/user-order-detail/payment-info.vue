<template>
  <div class="payment-info">
    <LayoutTitle :title="$t('transfer_seller.info.label.transaction_info')">
      <CommandInfo :order-info="order" style-card="grey" />
    </LayoutTitle>
    <div class="payment-info__wrapper">
      <LayoutTitle :title="$t('transfer_seller.info.label.payment_methods')">
        <div class="payment-info__payment-methods">
          <div class="payment-info__highlight">
            <InfoBlock :list-info="listInfo" :note="order.note" :show-note="false" />
            <BankQrCode :qr-code-url="order.bankQrCode" />
          </div>
        </div>
      </LayoutTitle>
      <BankNote
        v-if="order.note"
        :note="order.note"
      />
      <Note :notes="$t('transfer_seller.info.notes')" class="payment-info__payment-methods-note" />
      <AppealSecret v-if="secret" :secret="secret" />
    </div>
    <CountdownAction
      :time-left="timeLeft"
      :title="countdownText.title"
      :sub-title="countdownText.subTitle"
      :class-countdown="`${isBuyEnableWhileSending ? 'warning' : ''}`"
      :is-warning="isBuyEnableWhileSending"
      :appeal-end-time="appealEndTime"
      :is-visible-time-out="isVisibleTimeOut"
      :is-visible-mercy-loading="buyStepMercy || sellStepMercy"
      @get-current-time="$_toBePaid_getCurrentTime"
    >
      <div class="payment-info__action">
        <base-button
          v-if="isContactMerchant"
          variants="contained"
          color="primary"
          :disabled="isPaidWaitingConfirm"
          @click="getAppealGroup()"
        >
          {{ isDealingWhileNotPaid ? $t('action.transferred_contact_merchant') : $t('action.contact_merchant') }}
        </base-button>
        <base-button
          v-else-if="isBuyEnableWhileSending"
          variants="contained"
          color="danger"
          :style="{ minWidth: '200px' }"
          @click="contactAdmin"
        >
          {{ $t('action.contact_support') }}
        </base-button>
        <base-button
          v-else-if="!isUserRequestSupport"
          variants="contained"
          color="primary"
          @click="$_toBePaid_submitPayment"
        >
          {{ $t('action.submit_transferred') }}
        </base-button>
        <base-button
          v-if="!isUserRequestSupport"
          variants="text"
          color="primary"
          @click="$_toBePaid_cancelPayment"
        >
          {{ isDealingWhileNotPaid ? $t('action.not_transfer_cancelled') : $t('action.cancel_transaction') }}
        </base-button>
      </div>
    </CountdownAction>
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
import BankNote from '@/components/common/transfer-to-seller/transfer-info/bank-note.vue';
import BankQrCode from '@/components/common/transfer-to-seller/transfer-info/bank-qrcode.vue';
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import InfoBlock from '@/components/common/info-block.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import Note from '@/components/common/transfer-to-seller/transfer-info/note.vue';
import toBePaidMixin from '@/mixins/user-order-detail/to-be-paid'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue'
import { mapState } from 'vuex'

export default {
  components: {
    AppealSecret,
    BankNote,
    BankQrCode,
    CommandInfo,
    CountdownAction,
    InfoBlock,
    LayoutTitle,
    Note,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [toBePaidMixin],
  computed: {
    ...mapState('end-user', ['secretKey']),
    countdownText () {
      if (this.isDealingWhileNotPaid || this.isPaidDealing) {
        return {
          title: this.$t('transfer_seller.dealing.title'),
          subTitle: this.$t('transfer_seller.dealing.desc')
        }
      } else if (this.isBuyEnableWhileSending) {
        return {
          title: this.$t('transfer_seller.end_time.label.auto_cancel'),
          subTitle: this.$t('transfer_seller.end_time.label.time_out_contact_support')
        }
      } else if (this.isPaidWaitingConfirm) {
        return {
          title: this.$t('transfer_seller.waiting.label.problem_transaction'),
          subTitle: this.$t('transfer_seller.info.label.waiting_merchant_confirm')
        }
      } else if (this.isUserRequestSupport) {
        return {
          title: this.$t('appeal.title', { durations: this.durations, unit: this.$t(`datetime_unit.${this.unit}`) }),
          subTitle: this.$t('appeal.desc')
        }
      } else {
        return {
          title: this.$t('transfer_seller.note.transfer_info.countdown_text'),
          subTitle: this.$t('transfer_seller.info.label.confirm_after_transfer')
        }
      }
    },
    secret () {
      return this.order?.appeal?.secret || this.secretKey
    }
  },
  methods: {
    contactMerchant () {
      // TODO: Need implement
    },
    contactCustomerCare () {
      // TODO: Need implement
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/payment-info.scss" />
