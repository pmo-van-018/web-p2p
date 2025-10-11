<template>
  <div class="payment-confirmation">
    <LayoutTitle :title="$t('transfer_seller.waiting.label.transaction_info')">
      <CommandInfo :order-info="order" style-card="grey" />
    </LayoutTitle>
    <LayoutTitle :title="$t('transfer_seller.waiting.label.payment_methods')">
      <BoxInfo :title="$t('transfer_seller.completed.label.confirmed_payment')" />
    </LayoutTitle>
    <AppealSecret v-if="secret" :secret="secret" />
    <LayoutTitle v-if="isAppealOpen" :title="$t('transfer_seller.label.waiting')" class="hide-border custom-link">
      <div class="payment-confirmation__sub-title-action">
        {{ appealingText }}
      </div>
    </LayoutTitle>
    <LayoutTitle v-else-if="isShowSupportLink" :title="$t('transfer_seller.label.waiting')" class="hide-border custom-link">
      <div class="payment-confirmation__sub-title-action">
        {{ $t('transfer_seller.end_time.label.time_out_contact_support') }}
      </div>
      <base-button
        variants="contained"
        color="primary"
        @click="getAppealGroup"
      >
        {{ $t('action.contact_merchant') }}
      </base-button>
      <base-button
        v-if="isShowSupportLink"
        variants="text"
        color="primary"
        @click="contactAdmin"
      >
        {{ $t('action.contact_support') }}
      </base-button>
    </LayoutTitle>
    <CountdownAction
      v-else
      :time-left="timeLeft"
      :title="titleCountDown"
      :sub-title="subTitleCountDown"
      :is-visible-time-out="isVisibleTimeOut"
      @time-out="onTimeOut"
    >
      <div class="payment-confirmation__action">
        <base-button
          v-if="!isUserRequestSupport"
          :disabled="isBuyEnableWhileConfirming"
          variants="contained"
          color="primary"
          @click="getAppealGroup"
        >
          {{ $t("action.contact_merchant") }}
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
import BoxInfo from '@/components/common/transfer-to-seller/box-info.vue';
import CommandInfo from '@/components/common/command-info.vue';
import CountdownAction from '@/components/common/countdown-action.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import confirmPaidMixin from '@/mixins/user-order-detail/confirm-paid'
import AppealSecret from '@/components/common/appeal-telegram/appeal-secret.vue';

export default {
  components: {
    AppealSecret,
    BoxInfo,
    CommandInfo,
    CountdownAction,
    LayoutTitle,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [confirmPaidMixin],
  computed: {
    titleCountDown () {
      return this.isBuyEnableWhileConfirming
        ? this.$t('transfer_seller.note.transfer_merchant_confirm_paid.countdown_text')
        : this.$t('transfer_seller.dealing.title')
    },
    subTitleCountDown () {
      return this.isBuyEnableWhileConfirming
        ? this.$t('transfer_seller.note.transfer_waiting_end_time.sub_title')
        : this.$t('transfer_seller.note.transfer_dealing_confirm_paid.sub_title')
    },
    secret () {
      return this.order?.appeal?.secret
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/payment-confirmation.scss" />
