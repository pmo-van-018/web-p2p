<template>
  <section class="order-management">
    <div class="order-management__container">
      <div class="order-management__head">
        <client-only>
          <filter-head-table
            is-visible-search
            :is-visible-date-picker="false"
            :loading="isLoading"
            :visible-fields="[ORDER_FIELD_SEARCH_GROUP.ID, ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE]"
            @on-filters="handleFilterAppeal"
            @on-refresh="$_appealSupporterMixin_onRefresh"
            @on-search="$_appealSupporterMixin_onSearchAppealOrder"
          />
          <div class="order-management__processing-supporter">
            Số khiếu nại có thể nhận: <strong>{{ totalPicked }}/{{ limitAppealReceived }}</strong>
          </div>
        </client-only>
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
                @click="$_appealSupporterMixin_onOpenAppealDetail(item.id)"
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
                {{ formatLimitNickName(item.manager?.nickName) }}
              </div>
              <div
                class="description-text__title"
              >
                {{ formatLimitNickName(item.user?.nickName) }}
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
          <template #cell(actions)="{ item }">
            <base-button
              variants="contained"
              color="primary"
              full-width
              :loading="item._loadingButton"
              :disabled="item._loadingButton"
              @click="$_appealSupporterMixin_onPickAppealOrder(item)"
            >
              {{ $t('action.pick') }}
            </base-button>
          </template>
        </order-table>
      </div>
    </div>
  </section>
</template>
<script>
import walletMixin from '@/mixins/open-wallet.js'
import appealSupporterMixin from '@/mixins/admin/appeal-supporter'
import { STATUS_APPEAL_OPEN, STATUS_PENDING_ORDER } from '@/resources/order-filters'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'
import { mapActions } from 'vuex';

export default {
  components: {
    OrderTable: () => import('@/components/desktop/orders/table'),
    OrderType: () => import('@/components/desktop/orders/table/items/order-type.vue'),
    OrderStatus: () => import('@/components/desktop/orders/status'),
    FilterHeadTable: () => import('@/components/desktop/orders/filter-head-table'),
    OrderAmount: () => import('@/components/desktop/orders/table/items/order-amount.vue'),
    AppealProcessing: () => import('@/components/desktop/admin/appeals/processing/index.vue'),
    BaseButton: () => import('~/components/common/base-button')
  },
  mixins: [walletMixin, appealSupporterMixin],
  data () {
    return {
      ORDER_FIELD_SEARCH_GROUP
    }
  },
  computed: {
    queryParams () {
      return {
        page: this.page,
        limit: this.limit,
        appealStatus: STATUS_APPEAL_OPEN,
        ...((this.searchField && this.searchValue) && { searchField: this.searchField }),
        ...(this.searchValue && { searchValue: this.searchValue }),
        orderStatus: this.orderStatus ? this.orderStatus : STATUS_PENDING_ORDER,
        ...(this.orderField && { sortField: this.orderField }),
        ...(this.orderDirection && { sortDirection: this.orderDirection }),
        ...(this.type && { orderType: this.type }),
        ...(this.assetId && { assetId: this.assetId })
      }
    }
  },
  async created () {
    this.tabActiveCallApi = 'pending'
    await Promise.all([
      this.countOpeningAppeal(),
      this.$_appealSupporterMixin_getAppealList()
    ])
  },
  methods: {
    ...mapActions('admin-appeal', ['countOpeningAppeal'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeals/index.scss">
</style>
