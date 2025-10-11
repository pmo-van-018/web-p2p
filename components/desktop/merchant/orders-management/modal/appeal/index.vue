<template>
  <b-modal
    :id="id"
    :ref="id"
    centered
    hide-header
    hide-footer
    @hide="onCloseModal"
  >
    <section v-if="order" class="appeal">
      <div class="appeal__container">
        <div class="appeal__head">
          <h2 class="appeal__title" v-html="title" />
          <div class="appeal__close" @click="onCloseModal"><span class="icon-cancel" /></div>
        </div>
        <div class="appeal__body">
          <div class="appeal__thumb">
            <img
              :src="isVisibleAppealButton ? '/assets/images/common/orders/appeal-chat.svg'
                : '/assets/images/common/orders/chat.svg'"
              alt="icon chat appeal"
            >
          </div>
          <p class="appeal__content">{{ subTitle }}</p>
          <div v-if="notes.length" class="appeal-note">
            <div class="appeal-note__content">
              <ol class="appeal-note__list">
                <li v-for="(note, index) in notes" :key="index" class="appeal-note__item">
                  <span v-html="$t(note)" />
                </li>
              </ol>
            </div>
          </div>
          <div v-if="isVisibleAppealButton || order?.isSupporter" class="appeal__show-option">
            <b-form-checkbox v-model="showOption" class="primary payment-confirmation__checkbox">{{ $t('modal.appeal.not_show') }}</b-form-checkbox>
          </div>
          <div class="appeal-action">
            <div class="appeal-action__container">
              <base-button
                v-if="textJoinAppeal"
                variants="contained"
                color="blue"
                @click="onOpenChat"
              >
                {{ textJoinAppeal }}
              </base-button>
              <base-button
                v-if="enableTransfer"
                variants="contained"
                color="primary"
                @click="onTransfer"
              >
                {{ textTransferAppeal }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </b-modal>
</template>
<script>
import { mapActions } from 'vuex'
import { POST_TYPE } from '~/config/constant'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '~/constants/orders'
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'
import { MODAL } from '~/resources/modal'
import modalMixin from '~/mixins/modal'
import { setPopupOptionsLocalStorage } from '~/helper';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [orderActionTransferMixin, modalMixin],
  props: {
    order: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      default: MODAL.MERCHANT_APPEAL
    },
    isOpenChat: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL,
      showOption: false
    }
  },
  computed: {
    textJoinAppeal () {
      if (this.isVisibleAppealButton) {
        return this.$t('action.join_appeal')
      }
      if (this.isVisibleChatButton) {
        return this.$t('action.join_group')
      }
      return ''
    },
    enableTransfer () {
      return this.isVisibleChatButton && this.isHiddenActionTransfer && !this.order?.isSupporter
    },
    textTransferAppeal () {
      if ([BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME].includes(this.step)) {
        return this.$t('action.agree_with_buyer')
      }
      if (this.isPostTypeBuy) {
        return this.$t('action.pay_for_seller')
      }
      return this.$t('action.send_vndt', {
        assetName: this.order?.assetName || 'VIC'
      })
    },
    textTransferAssetName () {
      if ([BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT].includes(this.step)) {
        return this.$t('merchant.modal_appeal.notes.dont_not_transfer', {
          assetName: this.order?.assetName || 'VIC'
        })
      }
      return this.$t('merchant.modal_appeal.notes.send_vndt', {
        assetName: this.order?.assetName || 'VIC'
      })
    },
    notes () {
      if (this.order?.isSupporter) {
        return this.isBuyPostType ? [
          this.isOpenAppeal ? 'merchant.modal_appeal.notes.provider_proof' : 'merchant.modal_appeal.notes.provider_proof',
          'merchant.modal_appeal.notes.if_you_lose_sell',
          'merchant.modal_appeal.notes.reduce_rate'
        ] : (this.isOpenAppeal ? [
          this.$t('merchant.modal_appeal.notes.dont_not_transfer', {
            assetName: this.order?.assetName || 'VIC'
          }),
          'merchant.modal_appeal.notes.confirm_info_transaction',
          'merchant.modal_appeal.notes.if_you_lose',
          'merchant.modal_appeal.notes.reduce_rate'
        ] : [
          'merchant.modal_appeal.notes.continue_order',
          'merchant.modal_appeal.notes.contact_admin',
          'merchant.modal_appeal.notes.dont_sent_crypto'
        ])
      }
      const stepNoteDescriptions = [
        {
          steps: [
            BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
            BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME
          ],
          notes: [
            'merchant.modal_appeal.notes.agreement',
            'merchant.modal_appeal.notes.contact_admin',
            'merchant.modal_appeal.notes.dont_sent_crypto'
          ]
        },
        {
          steps: [BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT],
          notes: [
            this.textTransferAssetName,
            'merchant.modal_appeal.notes.confirm_info_transaction',
            'merchant.modal_appeal.notes.if_you_lose',
            'merchant.modal_appeal.notes.reduce_rate'
          ]
        },
        {
          steps: [
            BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
            BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED,
            BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT
          ],
          notes: [
            this.textTransferAssetName,
            'merchant.modal_appeal.notes.contact_admin',
            'merchant.modal_appeal.notes.dont_sent_crypto'
          ]
        },
        {
          steps: [BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED],
          notes: [
            'merchant.modal_appeal.notes.dont_sent_crypto',
            'merchant.modal_appeal.notes.confirm_info_transaction',
            'merchant.modal_appeal.notes.if_you_lose',
            'merchant.modal_appeal.notes.reduce_rate'
          ]
        },
        {
          steps: [
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME,
            SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
          ],
          notes: [
            'merchant.modal_appeal.notes.provider_proof_sell',
            'merchant.modal_appeal.notes.if_you_lose_sell',
            'merchant.modal_appeal.notes.reduce_rate'
          ]
        },
        {
          steps: [
            SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME
          ],
          notes: [
            'merchant.modal_appeal.notes.provider_proof',
            'merchant.modal_appeal.notes.if_you_lose_sell',
            'merchant.modal_appeal.notes.reduce_rate'
          ]
        }
      ]
      return stepNoteDescriptions.find(content => content.steps.includes(this.step))?.notes || []
    },
    isOpenAppeal () {
      return this.order?.appeal.status === 1
    },
    isBuyPostType () {
      return this.order ? this.order.postType === POST_TYPE.BUY : ''
    },
    step () {
      return this.order.step
    },
    title () {
      if (this.order?.isSupporter) {
        return this.order.appeal.status === 1
          ? this.$t('merchant.supporter.title.appeal', {
            type: this.isBuyPostType
              ? this.$t('merchant.supporter.sell').toLowerCase()
              : this.$t('merchant.supporter.buy').toLowerCase()
          })
          : this.$t('merchant.supporter.title.contact', {
            type: this.isBuyPostType
              ? this.$t('merchant.supporter.sell').toLowerCase()
              : this.$t('merchant.supporter.buy').toLowerCase(),
            typeClass: this.order.postType.toLowerCase()
          })
      }
      if (this.isVisibleAppealButton) {
        return this.isBuyPostType ? this.$t('merchant.modal_appeal.buyer_sent_appeal') : this.$t('merchant.modal_appeal.seller_sent_appeal')
      }
      return this.isBuyPostType ? this.$t('merchant.modal_appeal.agreement_with_seller') : this.$t('merchant.modal_appeal.agreement_with_buyer')
    },
    subTitle () {
      return this.isBuyPostType
        ? this.$t('merchant.modal_appeal.join_chat_agree_with_seller')
        : this.$t('merchant.modal_appeal.join_chat_agree_with_buyer')
    }
  },
  watch: {
    isOpenChat () {
      this.onOpenChat()
    }
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'toggleVisibleChat', 'setVisibleChat']),
    onCloseModal () {
      this.$bvModal.hide(this.id)
      setPopupOptionsLocalStorage(this.id, this.order?.type, this.showOption)
    },
    onOpenChat () {
      if (this.$device.isMobile) {
        this.$_modalMixin_closeExceptModal(MODAL.ORDER_DETAIL)
        this.$emit('on-open-chat', this.order)
      } else {
        this.$_modalMixin_closeAllModal()
        this.$emit('on-open-detail-order', this.order)
      }
    },
    onTransfer () {
      this.$bvModal.hide(this.id)
      this.onTransferAction()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/modal/appeal/index.scss">
</style>
