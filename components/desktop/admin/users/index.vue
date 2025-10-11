<template>
  <layout-wrapper class="managements">
    <template #head>
      <div class="managements__head">
        <h2 class="managements__title">{{ $t('staff.list_user') }}</h2>
      </div>
    </template>
    <template #body>
      <client-only>
        <template #placeholder>
          <filter-loader-skeleton class="delay-animation my-2" />
          <b-skeleton-table
            class="delay-animation"
            :rows="7"
            :columns="4"
            :table-props="{ bordered: false, striped: false }"
          />
        </template>
        <div class="managements__filter">
          <filter-head
            @on-filters="$_userMixin_onFilter"
            @on-refresh="$_userMixin_getList"
          />
        </div>
        <order-table
          class="managements__table"
          :items="users"
          :fields="fields"
          :page="page"
          :limit="limit"
          :total="total"
          :is-loading="isLoading"
          :pagination-title="$t('role_management.pagination')"
          @change-sort="$_userMixin_handleChangeSort"
          @change-pagination="$_userMixin_onChangePage"
        >
          <template #cell(walletAddress)="{ item }">
            <div class="managements__item wallet-address">
              <span class="wallet-address__name">
                {{ item?.walletAddress }}
              </span>

              <copy-button
                :id="`wallet-address-copy-${item?.id}`"
                :value="item?.walletAddress"
                :text-guide="$t('role_management.label.copy_wallet_address')"
              />
            </div>
          </template>
          <template #cell(nickName)="{ item }">
            <div class="managements__item">
              {{ item?.nickName }}
            </div>
          </template>
          <template #cell(buyOrder)="{ item }">
            <div class="managements__item order-count buy-order">
              {{ item?.totalBuyOrderCount || 0 }}
            </div>
          </template>

          <template #cell(sellOrder)="{ item }">
            <div class="managements__item order-count sell-order">
              {{ item?.totalSellOrderCount || 0 }}
            </div>
          </template>

          <template #cell(lastTrade)="{ item }">
            <div class="managements__item">
              {{ lastTradeDate(item) | formatDateTime }}
            </div>
          </template>

          <template #cell(lastLogin)="{ item }">
            <div class="managements__item">
              {{ (item?.lastLoginAt || item?.createdAt) | formatDateTime }}
            </div>
          </template>

          <template #cell(createdAt)="{ item }">
            <div class="managements__item">
              {{ item?.createdAt | formatDateTime }}
            </div>
          </template>
        </order-table>
      </client-only>
    </template>
  </layout-wrapper>
</template>
<script>
import usersMixin from '@/mixins/admin/users'
import dayjs from 'dayjs'

export default {
  components: {
    LayoutWrapper: () => import('~/components/containers/layout-wrapper/index.vue'),
    OrderTable: () => import('~/components/desktop/orders/table/index.vue'),
    FilterHead: () => import('~/components/desktop/admin/users/filter-head.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue'),
    FilterLoaderSkeleton: () => import('~/components/desktop/commons/loader/filters.vue')
  },
  mixins: [usersMixin],
  methods: {
    lastTradeDate (item) {
      if (item?.lastBuyOrder && item?.lastSellOrder) {
        return dayjs(item?.lastBuyOrder).isAfter(dayjs(item?.lastSellOrder)) ? item?.lastBuyOrder : item?.lastSellOrder
      }
      return item?.lastBuyOrder || item?.lastSellOrder
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/users/index.scss">
</style>
