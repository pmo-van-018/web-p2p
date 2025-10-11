<template>
  <section class="pending-order">
    <div class="pending-order__container">
      <div class="pending-order__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-table
            is-visible-search
            :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
            :loading="orderLoading"
            :is-visible-refresh="false"
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$waitingConfirmationOrdersMixin_onFilterOrder"
            @on-refresh="$waitingConfirmationOrdersMixin_onRefresh"
          />
        </template>
      </div>
      <div class="pending-order__body">
        <template v-if="isSkeletonLoading">
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <template v-else>
          <order-table
            :items="orders"
            :fields="fieldsCustomRolesUser"
            :page="page"
            :limit="limit"
            :total="total"
            :is-loading="orderLoading"
            :has-pagination="false"
            @change-sort="$commonOrderMixin_handleChangeSort"
          >
            <template #cell(type)="{ item }">
              <order-type
                is-horizontal
                :post-type="item.postType"
                :name="item.assetName"
                :network="item.assetNetwork"
              />
              <div class="description-text">
                <div
                  :id="`order_id_${item.orderId}`"
                  class="description-text__title description-text__title--underline"
                  @click="$commonOrderMixin_openDetails(item)"
                >
                  #{{ item.orderRefId }}
                </div>
                <b-tooltip :target="`order_id_${item.orderId}`" triggers="hover">
                  {{ $t('merchant.list_order.order_item.see_detail') }}
                </b-tooltip>
              </div>
            </template>

            <template #cell(status)="{ item }">
              <div class="description-text">
                <div class="description-text__title">
                  <order-status :order="item" />
                </div>
              </div>
            </template>

            <template #cell(amount)="{ item }">
              <order-amount
                :order-id="item.orderId"
                :post-type="item.postType"
                :fiat-symbol="item.fiatSymbol"
                :asset-name="item.assetName"
                :amount-crypto="item.amount"
                :total-price="item.totalPrice"
              />
            </template>

            <template #cell(bank)="{ item }">
              <order-bank-info :order="item" @on-open-bank-qrcode="$emit('on-open-bank-qrcode', $event)" />
            </template>

            <template #cell(userInfo)="{ item }">
              <div>
                <nuxt-link
                  v-if="item.merchant"
                  class="info-link font-t16r grey-600"
                  :to="`/merchant-manager/staffs/dashboard/${item.merchant.id}`"
                >
                  {{ item?.merchant?.nickName || '' }}
                </nuxt-link>
                <div class="font-t16r grey-600">{{ item?.user?.nickName || '' }}</div>
              </div>
            </template>

            <template #cell(progressing)="{ item }">
              <order-progressing :order="item" @on-timeout="$commonOrderMixin_onTimeOutOrder" />
            </template>

            <template #cell(actions)="{ item }">
              <div class="pending-order__actions">
                <order-actions
                  :order="item"
                  visible-copy-all
                  @on-open-chat="$emit('on-open-chat', item)"
                  @on-open-appeal="$commonOrdersMixin_onOpenModalOpenAppeal"
                  @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
                  @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
                />
              </div>
            </template>

            <template #row-details="{ item }">
              <detail-row-order
                :key="`${orderDetail.orderId}_${orderDetail.timeout}`"
                :order="orderDetail"
                @close="$commonOrderMixin_closeDetail(item)"
                @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
                @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
                @on-open-appeal="$commonOrdersMixin_onOpenModalOpenAppeal(item)"
              />
            </template>
          </order-table>
        </template>
      </div>
    </div>
  </section>
</template>
<script>
import { MODAL } from '@/resources/modal'
import { ORDER_GROUPS } from '@/resources/order-filters';
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import { mapState } from 'vuex';
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import modalMixin from '~/mixins/modal'
import waitingConfirmationOrdersMixin from '~/mixins/merchant/orders/waiting-confirmation'

export default {
  components: {
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderAmount: () => import('~/components/desktop/orders/table/items/order-amount.vue'),
    OrderBankInfo: () => import('~/components/desktop/orders/table/items/order-bank-info.vue'),
    OrderActions: () => import('~/components/desktop/merchant/orders-management/pending-orders/order-actions.vue'),
    DetailRowOrder: () => import('~/components/desktop/merchant/orders-management/pending-orders/row-detail-order.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    OrderProgressing: () => import('~/components/desktop/merchant/orders-management/pending-orders/order-progressing.vue'),
    FilterHeadTable: () => import('~/components/desktop/orders/filter-head-table/index.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [modalMixin, waitingConfirmationOrdersMixin],
  data () {
    return {
      searchValue: '',
      bankQrCode: '',
      isWaitingConfirmation: true,
      orderGroup: ORDER_GROUPS.WAITING_USER,
      POST_TYPE
    }
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail']),
    ...mapState({
      currentOrder: state => state.orders.order
    }),
    ...mapState('chat', ['lastMessages']),
    orders () {
      const filterAllOrders = this.orderMapped?.filter(item => ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]
        .includes(item.status))
        .map((item) => {
          return {
            ...item,
            _showDetails: item.orderId === this.rowOrderSelected?.orderId ? this.rowOrderSelected?._showDetails : false
          }
        })
      const orderSpecialCases = this.filterSpecialAppealCases(filterAllOrders)
      return orderSpecialCases.map((order, index) => {
        const lastMessage = this.lastMessages.find(message => order?.roomId === message.roomId)
        return {
          ...order,
          isSeenMessage: lastMessage?.seen || false,
          _rowVariant: index === 0 ? 'warning' : undefined
        }
      })
    }
  },
  created () {
    this.$waitingConfirmationOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 600)
    })
  },
  methods: {
    onOpenBankQrcode (order) {
      this.bankQrCode = order.bankQrCode
      this.$bvModal.show(MODAL.BANK_QRCODE)
    },
    // Function to filter cases same steps but can in 2 groups
    filterSpecialAppealCases (orders) {
      const specialSteps = [BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME, SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME]
      return orders.filter(item => !(item?.appeal?.appealId && specialSteps.includes(item?.step)))
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/pending-orders/index.scss">
</style>
