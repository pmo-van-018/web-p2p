<template>
  <section class="order-management">
    <div class="order-management__container">
      <div class="order-management__head">
        <filter-head-table
          is-visible-search
          :is-visible-date-picker="false"
          :loading="isLoading"
          :visible-fields="[ORDER_FIELD_SEARCH_GROUP.ID, ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE]"
          @on-filters="handleFilterAppeal"
          @on-refresh="$_appealListingMixin_onRefresh"
          @on-search="$_appealListingMixin_onSearchAppealOrder"
        />
      </div>
      <div class="order-management__body">
        <order-table
          :items="listAppeal"
          :fields="fields"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          @change-sort="handleChangeSort"
          @change-pagination="onChangePage"
        >
          <template #cell(type)="{ item }">
            <order-type
              is-horizontal
              :post-type="item.order?.type"
              :name="item.order?.assetName"
              :network="item.order?.assetNetwork"
            />
            <div class="description-text">
              <div
                :id="`order_id_${item.order.id}`"
                class="description-text__title description-text__title--underline description-text__title--inline"
                @click="$_appealListingMixin_onOpenAppealDetail(item.id)"
              >
                #{{ item.order?.id }}
              </div>
              <b-tooltip :target="`order_id_${item.order?.id}`" triggers="hover">
                {{ $t('merchant.list_order.order_item.see_detail') }}
              </b-tooltip>
            </div>
          </template>

          <template #cell(status)="{ item }">
            <div class="description-text">
              <div class="description-text__title">
                <order-status :order="item.order" />
              </div>
            </div>
          </template>

          <template #cell(amount)="{ item: { order } }">
            <order-amount
              :order-id="order.id"
              :fiat-symbol="order.fiatSymbol"
              :asset-name="order.assetName"
              :amount-crypto="order.amount"
              :total-price="order.totalPrice"
            />
          </template>
          <template #cell(user)="{ item }">
            <div class="description-text">
              <div
                class="description-text__title description-text__title--underline"
                @click="gotoDashboard(item.manager?.id)"
              >
                {{ formatLimitNickName(item.manager?.nickName || '') }}
              </div>
              <div
                class="description-text__title"
              >
                {{ formatLimitNickName(item.user?.nickName || '') }}
              </div>
            </div>
          </template>
          <template #cell(timeAppeal)="{ item }">
            <div class="description-text">
              <div
                class="description-text__title"
              >
                {{ formatStartTimeAppeal(item) }}
              </div>
            </div>
            <div class="description-text">
              <div
                :class="[
                  'description-text__title description-text__title--yellow',
                  { 'description-text__timeout': isTimeOut(item) }
                ]"
              >
                {{ formatCloseTimeAppeal(item) }}
              </div>
            </div>
          </template>
          <template #cell(numberOfExtension)="{ item }">
            <div class="font-t12b text-center grey-800">{{ item.numberOfExtension || 0 }}</div>
          </template>
          <template #cell(progressing)="{ item }">
            <appeal-processing :appeal="item" />
          </template>
          <template #cell(nameAdminSupporter)="{ item }">
            <span class="font-t12r grey-700">{{ item?.nickNameAdminSupporter || '' }}</span>
          </template>
          <template #cell(actions)="{ item }">
            <div class="appeal-action">
              <div class="appeal-action__container">
                <span :id="`popover-appeal-${item.id}`" class="appeal-action__icon icon-edit-2" tabindex="0" />
              </div>
            </div>
            <b-popover
              :ref="`popover-appeal-${item.id}`"
              triggers="hover"
              custom-class="popover-appeal"
              :target="`popover-appeal-${item.id}`"
              placement="leftbottom"
            >
              <div class="popover-appeal__list">
                <div
                  class="popover-appeal__item"
                  @click="onOpenAppealDetail(item)"
                >
                  {{ $t('action.process_appeal') }}
                </div>
                <div
                  v-if="item.nickNameAdminSupporter"
                  class="popover-appeal__item popover-appeal__item--border-top"
                  @click="onHiddenActionAppeal(item)"
                >
                  {{ $t('action.cancel_support') }}
                </div>
              </div>
            </b-popover>
          </template>
        </order-table>
      </div>
    </div>
    <client-only>
      <cancel-supporter-modal :appeal="selectedAppeal" @on-confirm-success="$_appealListingMixin_getAppealList" />
    </client-only>
  </section>
</template>
<script>
import walletMixin from '@/mixins/open-wallet.js'
import appealListingMixin from '@/mixins/admin/appeals'
import { STATUS_APPEAL_OPEN, STATUS_PENDING_ORDER } from '@/resources/order-filters'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'
import { MODAL } from '@/resources/modal'

export default {
  components: {
    OrderTable: () => import('@/components/desktop/orders/table'),
    OrderType: () => import('@/components/desktop/orders/table/items/order-type.vue'),
    OrderStatus: () => import('@/components/desktop/orders/status'),
    FilterHeadTable: () => import('@/components/desktop/orders/filter-head-table'),
    OrderAmount: () => import('@/components/desktop/orders/table/items/order-amount.vue'),
    AppealProcessing: () => import('@/components/desktop/admin/appeals/processing/index.vue'),
    CancelSupporterModal: () => import('~/components/desktop/admin/modal/appeal/cancel-supporter.vue')
  },
  mixins: [walletMixin, appealListingMixin],
  data () {
    return {
      ORDER_FIELD_SEARCH_GROUP,
      selectedAppeal: null
    }
  },
  computed: {
    queryParams () {
      return {
        page: this.page,
        limit: this.limit,
        ...((this.searchField && this.searchValue) && { searchField: this.searchField }),
        ...(this.searchValue && { searchValue: this.searchValue }),
        orderStatus: this.orderStatus ? this.orderStatus : STATUS_PENDING_ORDER,
        appealStatus: STATUS_APPEAL_OPEN,
        ...(this.orderField && { sortField: this.orderField }),
        ...(this.orderDirection && { sortDirection: this.orderDirection }),
        ...(this.type && { orderType: this.type }),
        ...(this.assetId && { assetId: this.assetId })
      }
    }
  },
  async created () {
    await this.$_appealListingMixin_getAppealList()
    this.$emit('update-total-pending', this.total)
  },
  methods: {
    onHiddenActionAppeal (appeal) {
      this.$root.$emit('bv::hide::popover', `popover-appeal-${appeal.id}`)
      this.selectedAppeal = appeal
      this.$bvModal.show(MODAL.CANCEL_SUPPORTER)
    },
    onOpenAppealDetail (appeal) {
      this.$_appealListingMixin_onOpenAppealDetail(appeal.id)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeals/index.scss">
</style>
<style lang="scss" src="static/assets/scss/components/desktop/admin/appeals/popover.scss">
</style>
