<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :class="{ 'mobile': isMobile }"
    centered
    hide-header
    hide-footer
    @hidden="onHideModal"
  >
    <div :class="['appeal', { 'mobile': isMobile }]">
      <div class="appeal__header">
        <div class="title">{{ isContactAdmin ? $t('modal.contact_admin.title') : $t('modal.appeal.title') }}</div>
        <div class="close" @click="close()"><span class="icon-cancel" /></div>
      </div>
      <div v-if="isContactAdmin" class="appeal___desc">
        <p class="des">{{ $t('modal.contact_admin.desc') }}</p>
      </div>
      <div :class="['appeal__content', { 'reverse': isContactAdmin }]">
        <div v-if="!isContactAdmin" class="appeal__icon-top">
          <img :src="require('~imageRoot/common/orders/chat.svg')" alt="icon chat">
        </div>
        <div class="appeal__warning">
          <div class="warning-icon">
            <span class="icon-question" />
            <span v-show="isMobile" class="note">{{ $t('home.note') }}</span>
          </div>
          <div class="warning-info">
            <div v-for="(warning, index) in warnings" :key="`appeal-${index}`" class="info-block">
              <p class="step">{{ index + 1 }}.</p>
              <p class="text" v-html="$t(warning)" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="isContactAdmin" class="appeal__confirm">
        <form-checkbox class="primary payment-confirmation__checkbox" @input="isConfirm = $event">{{ $t('modal.contact_admin.confirm') }}</form-checkbox>
      </div>
      <div v-if="!isContactAdmin" class="appeal__show-option">
        <form-checkbox
          class="appeal__show-option"
          aria-describedby="selected"
          aria-controls="selected"
          @input="showOption = $event"
        >
          {{ $t('modal.appeal.not_show') }}
        </form-checkbox>
      </div>
      <div class="appeal__action">
        <base-button
          v-if="isContactAdmin"
          full-width
          :disabled="!isConfirm"
          variants="contained"
          color="primary"
          @click="onHandleContactAdmin"
        >
          {{ $t('user_orders.confirm') }}
        </base-button>
        <base-button v-else full-width variants="contained" color="blue" @click="goToChat">
          <div class="d-flex align-items-center justify-content-center">
            <span class="appeal__icon-action icon-complaint" />
            <span>{{ $t('modal.appeal.join_chat') }}</span>
          </div>
        </base-button>
      </div>
    </div>
    <loading v-if="isLoading" />
  </b-modal>
</template>
<script>
import { ORDER_ACTIONS, ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import ORDER_API from '@/api/user-order'
import { ORDER_TYPE } from '@/resources/order-type';
import { mapActions } from 'vuex'
import { MODAL } from '@/resources/modal'
import modalMixin from '~/mixins/modal'
import { setPopupOptionsLocalStorage } from '~/helper';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  mixins: [modalMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    isContactAdmin: {
      type: Boolean,
      default: false
    },
    isRequestConfirmation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isConfirm: false,
      showOption: false,
      isLoading: false,
      modalId: MODAL.APPEAL
    }
  },
  computed: {
    isLayoutMobileAppealInfo () {
      return this.isMobile && !this.isContactAdmin
    },
    isBuyOrder () {
      return this.order.postType === ORDER_TYPE.SELL
    },
    isStep2BuyOrder () {
      return this.isBuyOrder && this.order.step === ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name
    },
    warningText () {
      if (this.isBuyOrder) {
        return [
          this.isStep2BuyOrder ? 'modal.appeal.buy_step_2_warning_1' : 'modal.appeal.buy_step_4_warning_1',
          this.isStep2BuyOrder ? 'modal.appeal.buy_step_2_warning_2' : 'modal.appeal.buy_step_4_warning_2',
          this.isStep2BuyOrder ? 'modal.appeal.buy_step_2_warning_3' : 'modal.appeal.buy_step_4_warning_3'
        ]
      }
      return [
        'modal.appeal.sell_warning_1',
        'modal.appeal.sell_warning_2',
        'modal.appeal.sell_warning_3'
      ]
    },
    contactWarningText () {
      return [
        this.isBuyOrder ? 'modal.appeal.buy_contact_warning_1' : 'modal.appeal.sell_contact_warning_1',
        this.isBuyOrder ? 'modal.appeal.buy_contact_warning_2' : 'modal.appeal.sell_contact_warning_2',
        this.isBuyOrder ? 'modal.appeal.buy_contact_warning_3' : 'modal.appeal.sell_contact_warning_3',
        this.isBuyOrder ? 'modal.appeal.buy_contact_warning_4' : 'modal.appeal.sell_contact_warning_4'
      ]
    },
    requestConfirmationWarningText () {
      return [
        'modal.appeal.confirmation_warning_1',
        'modal.appeal.confirmation_warning_2',
        'modal.appeal.confirmation_warning_4',
        'modal.appeal.confirmation_warning_5'
      ]
    },
    warnings () {
      if (this.isRequestConfirmation) {
        return this.requestConfirmationWarningText
      }
      return this.isContactAdmin ? this.contactWarningText : this.warningText
    }
  },
  methods: {
    ...mapActions('chat', ['setVisibleChat', 'setOrder']),
    ...mapActions('end-user', ['setSecret']),
    close () {
      this.$bvModal.hide(this.modalId)
      setPopupOptionsLocalStorage(this.modalId, this.order?.type, this.showOption)
    },
    onHideModal () {
      this.isConfirm = false
      this.showOption = false
    },
    goToChat () {
      setPopupOptionsLocalStorage(this.modalId, this.order?.type, this.showOption)
      this.$_modalMixin_closeAllModal()
      if (this.$device.isMobile) {
        this.close()
        this.$bvModal.show(MODAL.CHAT_FRAME)
      }
      this.setVisibleChat(true)
    },
    async onHandleContactAdmin () {
      if (this.isRequestConfirmation) {
        if (this.order?.roomId) {
          this.goToChat()
          return;
        }
        await this.requestConfirmationTransaction()
      } else {
        await this.contactAdmin()
      }
    },
    async contactAdmin () {
      try {
        this.isLoading = true
        const appealApi = this.isBuyOrder ? ORDER_API.OPEN_APPEAL_BUY_ORDER : ORDER_API.OPEN_APPEAL_SELL_ORDER
        const respone = await this.$axios.$post(appealApi, {
          // TODO: improve when integrate order module
          orderId: this.order?.id
        });
        if (respone?.data?.secret) {
          this.setSecret(respone?.data?.secret)
        }
        this.$emit('contact-admin', { type: ORDER_ACTIONS.CONTACT_ADMIN })
        this.isLoading = false
        this.goToChat()
      } catch (e) {
        this.isLoading = false
        console.error(e)
      }
    },
    async requestConfirmationTransaction () {
      this.isLoading = true
      try {
        const result = await this.$axios.$post(ORDER_API.REQUEST_CONFIRMATION_TRANSACTION, {
          id: this.order?.id
        });
        if (result?.data) {
          this.$emit('contact-admin', { type: ORDER_ACTIONS.CONTACT_ADMIN })
          this.setOrder({
            ...this.order,
            roomId: result?.data?.roomId || null
          })
        }
        this.goToChat()
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
  <style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-appeal.scss"></style>
