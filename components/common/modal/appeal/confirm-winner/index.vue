<template>
  <modal-common
    :id="MODAL.CONFIRM_WINNER_APPEAL"
    :ref="MODAL.CONFIRM_WINNER_APPEAL"
    :title="title"
    @show-modal="onResetModalShown"
  >
    <section class="modal-confirm">
      <div class="modal-confirm__container">
        <div class="modal-confirm__head">
          <div class="modal-confirm__content" v-html="content" />
          <div class="modal-confirm__type">
            <template v-if="isForceCloseAppeal">
              <div>
                <span class="grey-400 font-weight-light" v-html="$t('admin.modal.content.user_win')" />
              </div>
              <div>
                <span :class="orderTypeClass">{{ textOrderType }}</span> #{{ orderId }}
                <span class="grey-400 font-weight-light">
                  , {{ $t('admin.modal.content.open_transaction') }}
                </span>
              </div>
            </template>
            <template v-else>
              <img
                class="modal-confirm__icon"
                :src="`/assets/images/common/${isReOpenTransaction ? 'appeal-reopen' : 'appeal-confirm'}.svg`"
                alt="appeal"
              >
              <span :class="orderTypeClass">{{ textOrderType }}</span> #{{ orderId }}
            </template>
          </div>
        </div>

        <div class="content-note">
          <div class="content-note__wrapper">
            <ul class="content-note__list">
              <li
                v-for="(note, index) in listNoteConfirm"
                :key="index"
                :class="['content-note__item', {'content-note__item--order-none': listNoteConfirm.length === 1 }]"
              >
                <span v-html="note" />
              </li>
            </ul>
          </div>
        </div>

        <div v-if="isBuyUserWin" class="choice-status">
          <div class="choice-status__container">
            <div class="choice-status__title">{{ $t('admin.modal.select.title') }}</div>
            <div class="choice-status__dropdown">
              <dropdown-filter
                :list-filter="buyUserWinList"
                :selected="buyUserWinSelected"
                @on-select="onSelectedBuyUserWin"
              />
            </div>
          </div>
        </div>

        <change-amount v-if="isReOpenTransaction" @on-change-amount="amount = $event" @on-confirm-change-amount="isConfirmChangeAmount = $event" />

        <div v-else-if="isBuyCloseAppeal" class="close-appeal">
          <div class="close-appeal__container">
            <b-form-radio-group v-model="buyCloseAppeal" name="buyCloseAppeal">
              <radio-button :value="BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_EVIDENT_NOT_APPROVED">
                {{ $t('admin.close_appeal.options.evident') }}
              </radio-button>
              <radio-button :value="BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_MC_HAS_RETURNED">
                {{ $t('admin.close_appeal.options.returned_fiat') }}
              </radio-button>
            </b-form-radio-group>
          </div>
        </div>

        <div v-else class="modal-confirm__checkbox">
          <b-form-checkbox
            v-model="isConfirm"
            class="primary"
          >
            <span v-html="confirmCheckBoxText" />
          </b-form-checkbox>
        </div>
        <base-button
          variants="contained"
          color="primary"
          full-width
          :disabled="
            (!isReOpenTransaction && !isConfirm) ||
              (isReOpenTransaction && isConfirmChangeAmount && !amount)
          "
          @click="onConfirmAppeal"
        >
          {{ $t("action.confirm") }}
        </base-button>
      </div>
    </section>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'
import { mapActions, mapState } from 'vuex'
import {
  BUY_APPEAL_RESULTS,
  BUY_APPEAL_RESULTS_KEY,
  MODAL_TYPE_CONFIRM,
  SELL_APPEAL_RESULTS,
  SELL_APPEAL_RESULTS_KEY
} from '@/constants/appeals'
import { TRADE_TYPE, USER_ROLE } from '@/config/constant'
import BigNumber from 'bignumber.js'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    ModalCommon,
    DropdownFilter: () => import('~/components/desktop/commons/dropdown-filter/index.vue'),
    ChangeAmount: () => import('~/components/common/modal/appeal/confirm-winner/change-amount/index.vue'),
    RadioButton: () => import('~/components/common/forms/radio-button/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL,
      isConfirm: false,
      isOpenConfirmReOpenTransaction: false,
      isConfirmBuyUserWinViolate: false,
      buyCloseAppeal: '',
      isConfirmChangeAmount: false,
      amount: '',
      BUY_APPEAL_RESULTS,
      buyUserWinSelected: {
        name: this.$t('admin.modal.select.reopen_waiting_merchant'),
        value: BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
      },
      buyUserWinList: [
        {
          name: this.$t('admin.modal.select.reopen_waiting_merchant'),
          value: BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
        },
        {
          name: this.$t('admin.modal.select.cancelled_refund_money'),
          value: BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE
        }
      ],
      minFiat: ''
    }
  },
  watch: {
    buyCloseAppeal (value) {
      this.isConfirm = !!value
    }
  },
  computed: {
    ...mapState('admin-appeal', ['confirmModal', 'detailAppeal']),
    ...mapState('user', ['user']),
    isSupperAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    title () {
      return this.confirmModal.title || ''
    },
    orderId () {
      return this.confirmModal?.orderId
    },
    order () {
      return this.detailAppeal?.order
    },
    appealId () {
      return this.confirmModal.appealId
    },
    keyAppeal () {
      return this.confirmModal.key
    },
    modalType () {
      return this.confirmModal.modalType
    },
    orderType () {
      return this.confirmModal?.orderType || ''
    },
    isBuyUserWin () {
      return this.orderType === TRADE_TYPE.BUY && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN && !this.isConfirmBuyUserWinViolate
    },
    isReOpenTransaction () {
      return this.keyAppeal === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN && this.isOpenConfirmReOpenTransaction
    },
    isBuyCloseAppeal () {
      return this.keyAppeal === BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_EVIDENT_NOT_APPROVED
    },
    isForceCloseAppeal () {
      return this.keyAppeal === BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE
    },
    decisionResultKey () {
      return this.orderType === TRADE_TYPE.BUY ? BUY_APPEAL_RESULTS_KEY[this.keyAppeal] : SELL_APPEAL_RESULTS_KEY[this.keyAppeal]
    },
    orderTypeClass () {
      return this.orderType === TRADE_TYPE.BUY ? 'buy' : 'sell'
    },
    textOrderType () {
      return this.orderType === TRADE_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    userWinSelectedType () {
      return this.buyUserWinSelected.value
    },
    penaltyFee () {
      return new BigNumber(Number(this.order?.penaltyFeePercent || 0)).multipliedBy(100).toString()
    },
    totalPenaltyFee () {
      return this.order?.totalPenaltyFee || new BigNumber(Number(this.order?.penaltyFeePercent || 0)).multipliedBy(Number(this.order?.totalPrice || 0)).toNumber()
    },
    feeFormatLang () {
      return {
        penaltyFee: this.penaltyFee,
        totalPenaltyFee: this.$options.filters.formatUpMoney(this.totalPenaltyFee),
        fiatSymbol: this.order?.fiatSymbol || '',
        duringSymbol: this.totalPenaltyFee > 0 ? '~' : ''
      }
    },
    listNoteConfirm () {
      if (!this.orderType) {
        return []
      }
      if (this.isReOpenTransaction) {
        return [this.$t('admin.modal.confirm.re_open_transaction')]
      }
      let keyLang = ''
      if (this.modalType === MODAL_TYPE_CONFIRM.FORCE_CLOSE_APPEAL) {
        keyLang = MODAL_TYPE_CONFIRM.FORCE_CLOSE_APPEAL
      }
      if ((this.orderType === TRADE_TYPE.SELL && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN) ||
          (this.orderType === TRADE_TYPE.BUY && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN && this.isConfirmBuyUserWinViolate)
      ) {
        keyLang = MODAL_TYPE_CONFIRM.USER_WIN
      }
      if (keyLang) {
        return [
          this.$t(`admin.modal.confirm.${keyLang}.note_1`),
          this.$t(`admin.modal.confirm.${keyLang}.note_2`),
          this.$t(`admin.modal.confirm.${keyLang}.note_3`),
          this.$t(`admin.modal.confirm.${keyLang}.note_4`, this.feeFormatLang)
        ]
      }
      const modalTypeKeyLang = `${this.orderType.toLowerCase()}_${this.modalType}`
      const keyMappedNotes = {
        sell_user_win: ['note_1', 'note_2', 'note_3'],
        sell_merchant_win: ['note_1', 'note_2', 'note_3'],
        sell_close_appeal: ['note_1', 'note_2'],
        buy_user_win: ['note_1', 'note_2', 'note_3'],
        buy_merchant_win: ['note_1', 'note_2', 'note_3'],
        buy_close_appeal: ['note_1', 'note_2']
      }[modalTypeKeyLang]

      return keyMappedNotes ? keyMappedNotes.map((note) => {
        return this.$t(`admin.modal.confirm.${modalTypeKeyLang}.${note}`)
      }) : []
    },
    confirmCheckBoxText () {
      if (
        (this.orderType === TRADE_TYPE.SELL && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN)) {
        return this.$t('admin.modal.confirm.transferred_crypto', this.feeFormatLang)
      }
      if ((this.orderType === TRADE_TYPE.BUY && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN && this.isConfirmBuyUserWinViolate) ||
          this.modalType === MODAL_TYPE_CONFIRM.FORCE_CLOSE_APPEAL) {
        return this.$t('admin.modal.confirm.transferred_fiat', this.feeFormatLang)
      }
      if (SELL_APPEAL_RESULTS.SELL_NOWIN_CANCEL_MC_HAS_RETURNED === this.keyAppeal) {
        return this.$t('admin.modal.confirm.transferred_returned')
      }
      return this.$t('modal.contact_admin.confirm')
    },
    content () {
      if (this.modalType === MODAL_TYPE_CONFIRM.USER_WIN || this.modalType === MODAL_TYPE_CONFIRM.OPEN_TRANSACTION) {
        return this.$t('admin.modal.content.user_win')
      }
      if (this.modalType === MODAL_TYPE_CONFIRM.MERCHANT_WIN) {
        return this.$t('admin.modal.content.merchant_win')
      }
      if (this.modalType === MODAL_TYPE_CONFIRM.CLOSE_APPEAL) {
        return this.$t('admin.modal.confirm.no_win')
      }
      return ''
    }
  },
  methods: {
    ...mapActions('admin-appeal', ['onDecideSellResult', 'setConfirmModal', 'onShowDetailAppeal', 'onDecideBuyResult']),
    ...mapActions('modal-response', ['showResponseModal']),
    onResetModalShown () {
      this.isConfirm = false
      this.isOpenConfirmReOpenTransaction = false
      this.isConfirmBuyUserWinViolate = false
      this.buyCloseAppeal = ''
      this.buyUserWinSelected = {
        name: this.$t('admin.modal.select.reopen_waiting_merchant'),
        value: BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
      }
    },
    onSelectedBuyUserWin (selected) {
      this.buyUserWinSelected = selected
    },
    async onConfirmAppeal () {
      try {
        if (!this.isConfirm && !this.isConfirmBuyUserWinViolate) {
          return
        }
        if (this.orderType === TRADE_TYPE.BUY && this.modalType === MODAL_TYPE_CONFIRM.USER_WIN) {
          if (this.userWinSelectedType === BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE && !this.isConfirmBuyUserWinViolate) {
            this.isConfirmBuyUserWinViolate = true
            this.isConfirm = false
            this.setConfirmModal({
              ...this.confirmModal,
              key: BUY_APPEAL_RESULTS.BUY_EUWIN_CANCEL_MC_VIOLATE
            })
            return
          }
          if (this.userWinSelectedType === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN) {
            this.isOpenConfirmReOpenTransaction = true
            this.setConfirmModal({
              title: this.$t('admin.modal.title.confirm_reopen_appeal'),
              key: BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN,
              appealId: this.appealId,
              orderType: this.orderType,
              orderId: this.orderId,
              modalType: MODAL_TYPE_CONFIRM.OPEN_TRANSACTION,
              requestAmount: this.order?.requestAmount || 0,
              amount: this.order?.amount || 0,
              totalPrice: this.order?.totalPrice || 0,
              fiatSymbol: this.order?.fiatSymbol || '',
              assetName: this.order?.assetName || ''
            })
            return
          }
        }
        if (this.orderType === TRADE_TYPE.BUY && this.modalType === MODAL_TYPE_CONFIRM.CLOSE_APPEAL) {
          this.setConfirmModal({
            ...this.confirmModal,
            key: this.buyCloseAppeal
          })
        }
        let result;
        if (this.orderType === TRADE_TYPE.SELL) {
          result = await this.onDecideSellResult({
            appealId: this.appealId,
            decisionResult: this.decisionResultKey
          })
        } else {
          result = await this.onDecideBuyResult({
            appealId: this.appealId,
            decisionResult: this.decisionResultKey,
            amount: this.$options.filters.formatMarkToNumber(this.amount)
          })
        }
        if (result.errors?.length) {
          let errorMessagePath = result.errors?.[0]?.key || 'error_system';
          let preventClose = false
          let forceReload = false
          let visibleClose = true
          let responseIcon = RESPONSE_ICON.RESPONSE_FAILED
          if (errorMessagePath === 'APPEAL_STATUS_IS_INVALID') {
            responseIcon = RESPONSE_ICON.SWITCH_STATUS_FAILED
            errorMessagePath = 'ORDER_STATUS_IS_INVALID_FORCE_RELOAD'
            forceReload = true
          }
          if (errorMessagePath === 'PERMISSION_DENIED_TO_UPDATE_APPEAL') {
            responseIcon = RESPONSE_ICON.CANCELLED_APPEAL_FAILED
            preventClose = true
            visibleClose = false
          }
          this.showResponseModal({
            title: '',
            content: this.$t('modal.message.system_failed'),
            description: this.$t(`modal.message.${errorMessagePath}`),
            icon: responseIcon,
            show: true,
            forceReload,
            preventClose,
            visibleClose,
            confirmAction: this.$t('action.confirm'),
            confirmActionType: this.isSupperAdmin ? CONFIRM_TYPE.REDIRECT_APPEAL_LIST : CONFIRM_TYPE.REDIRECT_APPEAL_LIST_SUPPORTER
          })
        }
        this.$bvModal.hide(MODAL.CONFIRM_WINNER_APPEAL)
      } catch (error) {
        this.showResponseModal({
          title: '',
          content: this.$t('modal.message.system_failed'),
          description: this.$t('modal.message.error_system'),
          icon: RESPONSE_ICON.RESPONSE_FAILED,
          show: true,
          forceReload: false,
          confirmAction: this.$t('action.confirm'),
          confirmActionType: this.isSupperAdmin ? CONFIRM_TYPE.REDIRECT_APPEAL_LIST : CONFIRM_TYPE.REDIRECT_APPEAL_LIST_SUPPORTER
        })
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/appeal/confirm-winner/index.scss">
</style>
