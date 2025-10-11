<template>
  <div class="payment-confirmation">
    <div class="payment-confirmation__header">
      <TitleHeader
        v-if="isShowSupportLink"
        :title="$t('transfer_seller.waiting.label.title')"
        :sub-title="appealingText"
      />
      <CountdownAction
        v-else
        :time-left="timeLeft"
        :title="countdownText.title"
        :sub-title="countdownText.subTitle"
        :is-visible-time-out="isVisibleTimeOut"
        :is-visible-mercy-loading="sellStepMercy || buyStepMercy"
        class="mobile"
        @time-out="onTimeOut"
      />
      <OrderInfo :order-id="orderId" :time="createdTime" />
    </div>
    <div class="payment-confirmation__content">
      <LayoutTitle :title="$t('transfer_seller.waiting.label.transaction_info')" class="mobile">
        <CommandInfo :order-info="order" class="mobile" />
      </LayoutTitle>
      <LayoutTitle :title="$t('transfer_seller.waiting.label.payment_methods')" class="mobile hide-border no-padding-bot">
        <BoxInfo :title="$t('transfer_seller.completed.label.confirmed_payment')" />
      </LayoutTitle>
      <div v-if="!isAppealOpen" class="payment-confirmation__action">
        <base-button
          :full-width="!isShowSupportLink"
          variants="contained"
          color="primary"
          :disabled="isBuyEnableWhileConfirming"
          class="primary payment-confirmation__submit"
          @click="getAppealGroup"
        >
          {{ $t('action.contact_merchant') }}
        </base-button>
        <base-button
          v-if="isShowSupportLink"
          variants="text"
          color="primary"
          :disabled="isBuyEnableWhileConfirming"
          @click="contactAdmin"
        >
          {{ $t('action.contact_support') }}
        </base-button>
      </div>
      <div v-else class="payment-confirmation__action">
        <base-button
          full-width
          variants="contained"
          color="blue"
          @click="openChatFrame"
        >
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
import CountdownAction from '@/components/common/countdown-action.vue';
import LayoutTitle from '@/components/common/layout-title.vue';
import OrderInfo from '@/components/common/transfer-to-seller/order-info.vue';
import TitleHeader from '@/components/common/transfer-to-seller/title-header.vue';
import ModalAppeal from '@/components/common/modal/modal-appeal.vue';
import confirmPaidMixin from '@/mixins/user-order-detail/confirm-paid'
import { FULL_DATE_FORMAT } from '@/config/constant'
import { mapState } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {
    BoxInfo,
    CommandInfo,
    CountdownAction,
    LayoutTitle,
    OrderInfo,
    TitleHeader,
    ModalAppeal,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [confirmPaidMixin],
  data () {
    return {
      countdownText: {
        title: this.$t('transfer_seller.waiting.label.title'),
        subTitle: this.$t('transfer_seller.note.transfer_waiting_end_time.sub_title')
      }
    }
  },
  computed: {
    ...mapState('chat', ['chatNoti']),
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
