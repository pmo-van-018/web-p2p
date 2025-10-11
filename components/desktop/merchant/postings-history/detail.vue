<template>
  <div class="postings-detail">
    <p class="postings-detail__title font-t20b grey-900 d-flex align-items-center mb-0">
      <span class="icon-chevron-right1" @click="$router.push('/merchant/postings-history')" /> {{ $t('postings_history.detail.title') }}
    </p>
    <div class="postings-detail__content font-t14m grey-400">
      <div v-if="post && !isLoading" class="postings-detail__wrapper justify-content-between">
        <div class="postings-detail__item">
          <div>
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.post_id') }}</span>
            <span class="postings-detail__data d-block grey-900">#{{ post.id }}</span>
          </div>
          <div class="d-flex bottom justify-content-between">
            <div class="mr-3">
              <span class="postings-detail__label d-block">{{ $t('postings_history.detail.type') }}</span>
              <span class="postings-detail__data d-block grey-900" :class="getColor">{{ $t('home.' + post.type.toLowerCase()) }}</span>
            </div>
            <div class="mx-3">
              <span class="postings-detail__label d-block">{{ $t('postings_history.detail.cryptocurrency') }}</span>
              <span class="postings-detail__data d-block grey-900">{{ post.cryptoName }} <span class="grey-600">({{ post.cryptoNetwork }})</span></span>
            </div>
            <div class="ml-3">
              <span class="postings-detail__label d-block">{{ $t('postings_history.detail.fiat_money') }}</span>
              <span class="postings-detail__data d-block grey-900">{{ post.fiatName }}</span>
            </div>
          </div>
        </div>
        <!-- item -->
        <div class="postings-detail__item">
          <div>
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.transfer_number') }}/{{ $t('postings_history.total_amount') }}</span>
            <span class="postings-detail__data d-block grey-900">{{ getAmountTransfer | formatCrypto }} {{ post.cryptoName }} / {{ getTotalAmount | formatCrypto }} {{ post.cryptoName }}</span>
          </div>
          <progress-line :percent="cryptoCompleted" />
          <div class="bottom">
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.limit_order') }}</span>
            <span class="postings-detail__data d-block grey-900"><span>{{ post.fiatSymbol }}</span> {{ getLowerFiat | formatMoney }} - <span>{{ post.fiatSymbol }}</span> {{ getUpperFiat | formatMoney }}</span>
          </div>
        </div>
        <!-- item -->
        <div class="postings-detail__item">
          <div>
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.total_fee') }}</span>
            <span class="postings-detail__data d-block grey-700"><span>{{ post.fiatSymbol }}</span> {{ (post.totalFee || 0) | formatMoney }}</span>
          </div>
          <div class="bottom">
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.total_penalty_fee') }}</span>
            <span class="postings-detail__data d-block grey-700"><span>{{ post.fiatSymbol }}</span> {{ (post.totalPenaltyFee || 0) | formatMoney }} </span>
          </div>
        </div>
        <!-- item -->
        <div class="postings-detail__item">
          <div>
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.time_update') }}</span>
            <span class="postings-detail__data d-block grey-700">{{ post.updatedAt | formatDateTime }}</span>
          </div>
          <div class="bottom">
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.time_create') }}</span>
            <span class="postings-detail__data d-block grey-700">{{ post.createdAt | formatDateTime }}</span>
          </div>
        </div>
        <!-- item -->
        <div class="postings-detail__item">
          <div>
            <span class="postings-detail__label d-block">{{ $t('postings_history.detail.status') }}</span>
            <span class="postings-detail__data d-block grey-700">{{ $t(`postings.post_item.${post.status?.toLowerCase()}`) }}</span>
          </div>
        </div>
        <!-- item -->
      </div>
    </div>
    <div class="postings-detail__table">
      <order-table
        v-if="!isLoading"
        ref="orderTable"
        :items="orders"
        :fields="fields"
        :page="page"
        :limit="limit"
        :total="total"
        :is-loading="isLoading"
        @change-pagination="onChangePagination"
      >
        <template #cell(id)="{ item }">
          <div class="order-item">
            #{{ item.id }}
          </div>
        </template>
        <template #cell(amount)="{ item }">
          <div class="order-item">
            <div><span>{{ item.fiatSymbol }}</span> {{ (item.totalPrice || 0) | formatMoney }}</div>
            <div>{{ item.transCode }}</div>
          </div>
        </template>
        <template #cell(transferAmount)="{ item }">
          <div class="order-item">
            <div>{{ (item.amount || 0) | formatCrypto }} {{ item.assetName }}</div>
            <div><span>{{ item.fiatSymbol }}</span> {{ priceFormatter(item) }} </div>
          </div>
        </template>
        <template #cell(fee)="{ item }">
          <template v-if="isGreaterThanZero(item.totalFee)">
            <div class="order-item">
              <div><span>{{ item.fiatSymbol }}</span> {{ (item.totalFee || 0) | formatMoney }}</div>
              <div class="sub-text">{{ getFee(item.fee) }} %</div>
            </div>
          </template>
          <template v-else>
            <span>&#8722;</span>
          </template>
        </template>
        <template #cell(penaltyFee)="{ item }">
          <div class="order-item">
            <template v-if="isGreaterThanZero(item.totalPenaltyFee)">
              <div><span>{{ item.fiatSymbol }}</span> {{ (item.totalPenaltyFee || 0) | formatMoney }}</div>
              <div class="sub-text"> {{ getFee(item.penaltyFee) }} %</div>
            </template>
            <template v-else>
              <span>&#8722;</span>
            </template>
          </div>
        </template>
        <template #cell(completedTime)="{ item }">
          <div class="order-item">
            {{ (item.completedTime || '') | formatDateTime }}
          </div>
        </template>
        <template #cell(status)="{ item }">
          <div class="order-item">
            <template v-if="item.appeal">
              <order-appeal-status
                :type="USER_TYPE.MERCHANT"
                :title-modified="getStatusText(item.status)"
                :order="item"
                :appeal="item.appeal"
                :is-visible-content="false"
              />
            </template>
            <div v-else class="font-t14r">
              {{ getStatusText(item.status) }}
            </div>
          </div>
        </template>
      </order-table>
    </div>
  </div>
</template>

<script>
import OrderTable from '@/components/desktop/orders/table';
import postingDetailMixin from '@/mixins/merchant/posting-detail.js'
import { ORDER_STATUS, USER_TYPE } from '@/config/constant'
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  components: {
    OrderTable,
    ProgressLine: () => import('~/components/common/progress-line/index.vue'),
    OrderAppealStatus: () => import('~/components/desktop/orders/table/items/order-appeal-status.vue')
  },
  mixins: [postingDetailMixin],
  data () {
    return {
      USER_TYPE,
      fields: [
        {
          key: 'id',
          label: this.$t('user_orders.code_command'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'amount',
          label: this.$t('user_orders.amount'),
          subLabel: this.$t('user_orders.transaction_info'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'transferAmount',
          label: this.$t('postings_history.transfer_number'),
          subLabel: this.$t('postings.table.price_title'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '14%'
          }
        },
        {
          key: 'fee',
          label: this.$t('postings.table.total_fee'),
          subLabel: this.$t('postings.table.transaction_fee'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '11.5%'
          }
        },
        {
          key: 'penaltyFee',
          label: this.$t('postings_history.total_penalty_fee'),
          subLabel: this.$t('postings_history.penalty_fee'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12.8%'
          }
        },
        {
          key: 'completedTime',
          label: this.$t('postings_history.time_tranfer'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'status',
          label: this.$t('postings_history.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '8%',
            minWidth: '120px'
          }
        }
      ]
    };
  },
  computed: {
    ...mapState('resources', ['assets']),
    cryptoCompleted () {
      const percent = this.post?.percentCryptoCompleted || 0
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    }
  },
  methods: {
    getFee (fee) {
      return new BigNumber(fee).multipliedBy(100).toNumber().toFixed(2)
    },
    isGreaterThanZero (value) {
      return new BigNumber(value).toNumber() > 0
    },
    getStatusText (status) {
      return status === ORDER_STATUS.CANCELLED ? this.$t('user_orders.status_cancel') : this.$t('user_orders.status_done')
    },
    priceFormatter (item) {
      const asset = this.assets.find(asset => asset.name === item?.assetName && asset.network === item?.assetNetwork)
      const decimalLimit = this.assets.find(item => item.id === asset?.id)?.precision || 0
      return this.$options.filters.formatCrypto(item.price || 0, decimalLimit, 'ceil')
    },
    async onChangePagination ({ page, limit }) {
      await this.$_merchantManagerMixin_onParamsChange({ page, limit });
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings-history/detail.scss" />
