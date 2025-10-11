<template>
  <section class="pending-order">
    <div class="pending-order__container">
      <div class="pending-order__head">
        <filter-search-head-table
          :loading="isLoading"
          @on-search="$emit('on-search', $event)"
          @on-refresh="$emit('on-refresh', $event)"
          @on-filters="$emit('on-filters', $event)"
        />
      </div>
      <div class="pending-order__body">
        <order-table
          :items="ordersMapped"
          :fields="fields"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          @change-sort="$emit('change-sort', $event)"
          @change-pagination="$emit('change-pagination', $event)"
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
                class="description-text__title description-text__title--underline description-text__title--inline"
                @click="$_supporterMixin_toggleDetails(item)"
              >
                #{{ item.orderRefId }}
              </div>
              <b-tooltip :target="`order_id_${item.orderId}`" triggers="hover">
                {{ $t('merchant.list_order.order_item.see_detail') }}
              </b-tooltip>
            </div>
          </template>

          <template #cell(statusOrder)="{ item }">
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
          <template #cell(payment)="{ item }">
            <order-bank-info :order="item" @on-open-bank-qrcode="$commonOrdersMixin_onOpenBankQrcode" />
          </template>
          <template #cell(trader)="{ item }">
            <div class="description-text description-text--default-cursor">
              <div
                class="description-text__title description-text__ellipsis"
              >
                {{ formatNickName(item.merchant?.nickName || '') }}
              </div>
              <div
                class="description-text__title description-text__ellipsis"
              >
                {{ formatNickName(item.user?.nickName || '') }}
              </div>
            </div>
          </template>
          <template #cell(processStatus)="{ item }">
            <order-process-status :order="item" />
          </template>
          <template #cell(progressing)="{ item }">
            <order-progressing is-visible-status-appeal :order="item" />
          </template>
          <template #cell(action)="{ item }">
            <div class="pending-order__action-status">
              <base-button variants="text" class="pending-order__action-message" @click="$_supporterMixin_openAppealPopup(item)">
                <svg-icon
                  v-b-tooltip="{
                    trigger: $device.isMobile ? 'focus' : 'hover',
                    disabled: $device.isMobile
                  }"
                  :icon="item?.isSeenMessage ? 'read-message' : 'unread-message'"
                  :title="$t('common.tooltip.view_message')"
                  class="pending-order__message-icon"
                />
              </base-button>
            </div>
          </template>
          <template #row-details="{ item }">
            <detail-row-order
              :order="{ ...item, supporterView: true, readOnly: false, confirmResolved: true }"
              :is-loading="isLoadingConfirmResolved"
              @close="$_supporterMixin_toggleDetails(item)"
              @on-open-appeal="$_supporterMixin_openAppealPopup(item)"
              @on-confirmed-processed="resolveAppeal(item.id)"
            />
          </template>
        </order-table>
      </div>
    </div>
    <client-only>
      <modal-appeal
        :id="modalAppeal"
        :order="selectedOrder"
        :is-open-chat="isOpenChat"
        @on-open-detail-order="isOpenDetail = true"
        @on-open-chat="openChatFrameInAppealModal"
      />
      <modal-bank-qrcode :qr-code-url="bankQrCode" />
    </client-only>
  </section>
</template>
<script>
import supporterMixin from '@/mixins/merchant/supporter/orders';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { mapActions, mapState } from 'vuex'
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button'),
    OrderTable: () => import('@/components/desktop/orders/table'),
    OrderType: () => import('@/components/desktop/orders/table/items/order-type.vue'),
    OrderStatus: () => import('@/components/desktop/orders/status'),
    FilterSearchHeadTable: () => import('@/components/desktop/orders/filter-head-table/search.vue'),
    OrderAmount: () => import('@/components/desktop/orders/table/items/order-amount.vue'),
    OrderBankInfo: () => import('~/components/desktop/orders/table/items/order-bank-info.vue'),
    OrderProgressing: () => import('~/components/desktop/merchant/orders-management/pending-orders/order-progressing.vue'),
    DetailRowOrder: () => import('~/components/desktop/merchant/orders-management/pending-orders/row-detail-order.vue'),
    ModalAppeal: () => import('~/components/desktop/merchant/orders-management/modal/appeal/index.vue'),
    ModalBankQrcode: () => import('@/components/common/modal/modal-bank-qrcode.vue'),
    OrderProcessStatus: () => import('~/components/desktop/orders/table/items/order-process-status.vue'),
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [supporterMixin, commonOrdersMixin, socketListenerListMixin],
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    page: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isOpenChat: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('merchant.list_order.order_filter.type'),
          subLabel: this.$t('merchant.list_order.order_filter.asset_type'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '14%'
          }
        },
        {
          key: 'statusOrder',
          label: this.$t('merchant.list_order.order_filter.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'amount',
          label: this.$t('merchant.list_order.order_filter.money'),
          subLabel: this.$t('merchant.list_order.order_filter.crypto_money'),
          sortField: 'amount',
          isSort: true,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'payment',
          label: this.$t('merchant.list_order.order_filter.bank_number'),
          subLabel: this.$t('merchant.list_order.order_filter.transfer_code'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'trader',
          label: this.$t('merchant.list_order.order_filter.merchant'),
          subLabel: this.$t('merchant.list_order.order_filter.user'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'processStatus',
          label: this.$t('merchant.list_order.order_table.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'progressing',
          label: this.$t('merchant.list_order.order_table.progressing'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '19%'
          }
        },
        {
          key: 'action',
          label: this.$t('merchant.list_order.order_table.deal'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('chat', ['isVisibleChat']),
    roomIds () {
      return this.ordersMapped?.map(order => order?.roomId).filter(id => id) || []
    }
  },
  watch: {
    isOpenDetail: {
      handler (isOpen) {
        if (isOpen) {
          if (this.rowOrderSelected?._showDetails) {
            if (!this.isVisibleChat) {
              this.setOrder(this.selectedOrder)
              this.setVisibleChat(true)
            }
            this.isOpenDetail = false
          } else {
            this.$nextTick(() => {
              this.$commonOrderMixin_openDetails(this.rowOrderSelected)
            })
          }
        }
      }
    },
    isLoading: {
      async handler (value) {
        if (!value && this.orders?.length) {
          if (this.roomIds.length) {
            await this.getLastMessages(this.roomIds)
            this.initSocketList(this.roomIds)
          }
        }
      },
      immediate: true
    }
  },
  beforeDestroy () {
    if (this.roomIds.length) {
      this.leaveRoomSocketList(this.roomIds)
    }
    this.resetStateChat()
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat', 'getLastMessages', 'resetStateChat'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/pending-orders/index.scss">
</style>
