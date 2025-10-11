<template>
  <article class="order-card" @click="onOpenOrderDetail">
    <div class="order-card__container">
      <div class="order-card__head">
        <div class="order-card__inner">
          <div class="order-card__left">
            <order-type
              :post-type="postType"
              :name="order.assetName"
              :network="order.assetNetwork"
              is-horizontal
            />
          </div>
          <div class="order-card__right" @click="onOpenOrderDetail">
            <div class="view-detail">
              <div class="view-detail__content">
                <div class="view-detail__text">
                  <order-status :order="order" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order-card__body">
        <div class="order-card__body-content">
          <div class="card-content">
            <div class="card-content__container">
              <div v-if="isCancelledOrder" class="card-content___content d-flex flex-column align-content-start">
                <div class="card-content__text">{{ $t('user_orders.amount_fiat') }}</div>
                <div class="font-t20m grey-600 card-content__amount">
                  <span>{{ order.fiatSymbol }}</span> {{ order.totalPrice | formatMoney }}
                </div>
              </div>
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.amount_mobile') }}</div>
                <div class="card-content__value">{{ order.amount | formatCrypto }} {{ order.assetName }}</div>
              </div>
              <div v-if="isCancelledOrder && totalPenaltyFee > 0" class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.transfer_fee') }}</div>
                <div class="card-content__value">
                  {{ penaltyFee }}% ({{ totalPenaltyFee > 0 ? '~' : '' }}
                  {{ fiatSymbol }} {{ totalPenaltyFee | formatMoney }})
                </div>
              </div>
              <div v-if="!isHiddenBankNumber" class="card-content___content">
                <div class="card-content__text">{{ $t('merchant.transaction_detail.account_no') }}</div>
                <div class="card-content__value">
                  <img v-if="bankIcon?.icon" class="bank-icon" :src="bankIcon?.icon" :alt="bankIcon?.bankName">
                  {{ bankNumberInfo }}
                  <span v-if="isVisibleQrBankCode" class="order-bank-info__icon icon-qrcode" @click.stop="showBankQrcodeModal()" />
                </div>
                <!-- TODO: Add the QR code of bank account info -->
              </div>
              <div v-if="!isCancelledOrder" class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.transaction_info') }}</div>
                <div class="card-content__value">
                  <copy-to-clipboard :id="order.transCode" :value-copy="order.transCode">
                    {{ order.transCode }}
                  </copy-to-clipboard>
                </div>
              </div>
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.code_command') }}</div>
                <div class="card-content__value">{{ '#' + order.orderRefId }}</div>
              </div>
              <div v-if="isVisibleSupporterProcess" class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.supporter_process') }}</div>
                <div class="card-content__value">
                  <div v-if="order.supporter" class="card-content__value--suppoter_process">
                    <span class="card-content__value icon-supporter-order" />
                    <div class="card-content__value--supporter_name">
                      {{ nickNameSupporter(order.supporter) }}
                    </div>
                  </div>
                  <div v-else class="card-content__value--suppoter_process_empty">
                    {{ '-/-' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isCancelledOrder" class="order-card__inner order-card__inner--space">
          <div class="order-card__left">
            <div class="date-time">{{ dateTime | formatDateTime }}</div>
          </div>
          <div class="order-card__right">
            <copy-to-clipboard :id="order.orderId" :value-copy="order.totalPrice">
              <div class="order-amount">
                <span class="order-amount__text">{{ order.fiatSymbol }}</span> {{ order.totalPrice | formatMoney }}
              </div>
            </copy-to-clipboard>
          </div>
        </div>

        <template v-if="isMerchantRole">
          <div class="order-card__inner mt-2">
            <div class="order-card__left">
              <div class="d-flex align-items-end">
                <div class="font-t10m grey-400">{{ $t('merchant.list_order.order_filter.user') }}</div>
                <div class="order-card__nickname ml-2 font-t12m grey-600">{{ order.user?.nickName || '' }}</div>
              </div>
            </div>
          </div>

          <div class="order-card__inner mb-2">
            <div class="order-card__left">
              <div class="d-flex align-items-end">
                <div class="font-t10m grey-400">{{ $t('merchant.list_order.order_filter.merchant') }}</div>
                <div
                  v-if="order.merchant"
                  class="info order-card__nickname font-t14m grey-900 ml-2"
                >
                  {{ order?.merchant?.nickName || '' }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!!$slots.actions" class="order-card__footer">
        <slot name="actions">
          <div class="order-card__footer-text">
            {{ finishStatusText }}
          </div>
        </slot>
      </div>
    </div>
  </article>
</template>
<script>
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import roleManagementMixin from '@/mixins/role-management'
import { BANK } from '@/resources/bank';
import { ORDER_STATUS, POST_TYPE, USER_ROLE } from '~/config/constant';

export default {
  components: {
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    CopyToClipboard: () => import('~/components/common/copy-to-clipboard/index.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    reversePostType: {
      type: Boolean,
      default: false
    },
    finishStatusText: {
      type: String,
      default: ''
    },
    isViewDetail: {
      type: Boolean,
      default: true
    },
    isHiddenBankNumber: {
      type: Boolean,
      default: false
    },
    isVisibleQrBankCode: {
      type: Boolean,
      default: true
    },
    isVisibleSupporterProcess: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isMerchantRole () {
      return [USER_ROLE.MERCHANT_MANAGER, USER_ROLE.MERCHANT_SUPPORTER].includes(this.user?.type)
    },
    postType () {
      if (this.reversePostType) {
        return this.order?.postType === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY
      }
      return this.order?.postType
    },
    isPendingOrder () {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.order?.status)
    },
    isCompletedOrder () {
      return ORDER_STATUS.COMPLETED === this.order?.status
    },
    isCancelledOrder () {
      return ORDER_STATUS.CANCELLED === this.order?.status
    },
    dateTime () {
      if (this.isPendingOrder) {
        return this.order?.endedTime || this.order?.completedTime
      }
      return this.order?.createdTime
    },
    statusText () {
      return {
        [ORDER_STATUS.TO_BE_PAID]: this.postType === POST_TYPE.BUY ? this.$t('common.status.unpaid') : this.$t('common.status.undelivered'),
        [ORDER_STATUS.PAID]: this.postType === POST_TYPE.BUY ? this.$t('common.status.completed') : this.$t('common.status.delivered'),
        [ORDER_STATUS.CONFIRM_PAID]: this.$t('common.status.confirm'),
        [ORDER_STATUS.COMPLETED]: this.$t('common.status.completed'),
        [ORDER_STATUS.CANCELLED]: this.$t('common.status.cancelled')
      }[this.order.status]
    },
    bankNumberInfo () {
      let bankNumberInfo = '';
      if (this.order?.bankName) {
        bankNumberInfo += this.order.bankName.charAt(0).toUpperCase() + this.order.bankName.slice(1);
      }
      if (this.order?.bankNumber) {
        bankNumberInfo += ` - ${this.order.bankNumber}`;
      }
      return bankNumberInfo;
    },
    fiatSymbol () {
      return this.order?.fiatSymbol || ''
    },
    penaltyFee () {
      return new BigNumber(Number(this.order?.penaltyFeePercent || 0)).multipliedBy(100).toString()
    },
    totalPenaltyFee () {
      return this.order?.totalPenaltyFee || 0
    },
    bankIcon () {
      const bankIcon = BANK.find(e => e.bankName === this.order?.bankName)
      return bankIcon;
    }
  },
  methods: {
    onOpenOrderDetail () {
      if (this.isViewDetail) {
        this.$emit('on-open-detail', this.order)
      }
    },
    showBankQrcodeModal () {
      this.$emit('on-open-bank-qrcode', this.order)
    },
    nickNameSupporter (supporter) {
      return supporter?.nickName || this.$_formatWalletHash(supporter?.walletAddress)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/card/index.scss">
</style>
