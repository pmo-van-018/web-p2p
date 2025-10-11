<template>
  <section class="pending-order">
    <div class="pending-order__container">
      <div class="pending-order__head">
        <template v-if="isSkeletonLoading">
          <filter-loader-skeleton class="delay-animation" />
        </template>
        <template v-else>
          <filter-head-table
            :loading="orderLoading"
            is-visible-search
            :visible-fields="ORDER_FIELD_SEARCH_DEFAULT"
            :is-visible-refresh="viewOnly"
            :is-visible-supporter-process="!viewOnly"
            @on-search="$commonOrderMixin_onSearch"
            @on-filters="$appealOrdersMixin_onFilterOrder"
            @on-refresh="$appealOrdersMixin_onRefresh"
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

            <template #cell(content)="{ item }">
              <order-bank-info :order="item" @on-open-bank-qrcode="$emit('on-open-bank-qrcode', $event)" />
            </template>

            <template #cell(userInfo)="{ item }">
              <div>
                <nuxt-link
                  v-if="!viewOnly && item.merchant"
                  class="info-link font-t14r grey-600"
                  :to="`/merchant-manager/staffs/dashboard/${item.merchant.id}`"
                >
                  {{ item?.merchant?.nickName || '' }}
                </nuxt-link>
                <div class="font-t14r grey-600">{{ item?.user?.nickName || '' }}</div>
              </div>
            </template>
            <template #cell(supporterProcessing)="{ item }">
              <div v-if="viewOnly" class="font-t14r grey-600">{{ item?.supporter?.nickName || '-/-' }}</div>
              <order-supporter v-else :order="item" />
            </template>
            <template #cell(progressing)="{ item }">
              <order-progressing is-visible-status-appeal :order="item" @on-timeout="$commonOrderMixin_onTimeOutOrder" />
            </template>

            <template #cell(actions)="{ item }">
              <div class="pending-order__actions">
                <order-actions
                  :order="item"
                  visible-copy-all
                  @on-open-appeal="$commonOrdersMixin_onOpenModalOpenAppeal(item)"
                  @on-transfer="$commonOrdersMixin_onOpenModalConfirmTransfer"
                  @on-pay="$commonOrdersMixin_onOpenModalSendCrypto"
                  @on-open-chat="$emit('on-open-chat', item)"
                />
              </div>
            </template>

            <template #row-details="{ item }">
              <detail-row-order
                :order="orderDetail"
                :manager-view="viewOnly"
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
import walletMixin from '@/mixins/open-wallet.js'
import { POST_TYPE } from '@/config/constant'
import { mapState, mapActions } from 'vuex'
import roleManagementMixin from '@/mixins/role-management'
import modalMixin from '~/mixins/modal'
import appealOrdersMixin from '~/mixins/merchant/orders/appeal.js'
import socketListenerListMixin from '~/mixins/chat/socket-listener-list'

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
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue'),
    OrderSupporter: () => import('~/components/desktop/merchant/orders-management/order-supporter.vue')
  },
  mixins: [walletMixin, modalMixin, appealOrdersMixin, roleManagementMixin, socketListenerListMixin],
  data () {
    return {
      searchValue: '',
      bankQrCode: '',
      POST_TYPE
    }
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail']),
    timeLeft () {
      return this.orderDetail.timeout
        ? this.$options.filters.convertToMilliseconds(this.orderDetail.timeout) : 0
    }
  },
  async created () {
    await this.$appealOrdersMixin_onResetFilter().then(() => {
      setTimeout(() => {
        this.isSkeletonLoading = false
      }, 1000)
    })
    if (!this.viewOnly) {
      await this.getSupporterProcess()
    }
    if (this.roomIds.length && !this.viewOnly) {
      await this.getLastMessages(this.roomIds)
      this.initSocketList(this.roomIds)
    }
  },
  beforeDestroy () {
    if (this.roomIds.length) {
      this.leaveRoomSocketList(this.roomIds)
    }
    this.resetStateChat()
  },
  methods: {
    ...mapActions('merchant-orders', ['getSupporterProcess']),
    ...mapActions('chat', ['getLastMessages', 'resetStateChat'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/pending-orders/index.scss">
</style>
