<template>
  <div class="posting-table">
    <base-table
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      @change-sort="$emit('change-sort', $event)"
    >
      <template #cell(type)="{ item }">
        <div class="posting-item flex-column">
          <div class="d-flex align-items-center">
            <div :class="getColor(item.type)" class="mr-1">
              {{ $t('home.' + item.type?.toLowerCase()) }}
            </div>
            <div>{{ item.cryptoName }}<span class="sub-text">({{ item.cryptoNetwork }})</span></div>
          </div>
          <div class="d-flex grey-900 ml-1">
            <div
              :id="'posts-history-item-ref-id-' + item.id"
              class="posting-table__ref-item"
              @click="showModalToggleDisplay(item.id)"
            >
              #{{ item.id }}
            </div>
            <b-tooltip :target="'posts-history-item-ref-id-' + item.id" triggers="hover" placement="top">
              {{ item.id }}
            </b-tooltip>
          </div>
        </div>
      </template>
      <template #cell(totalAmount)="{ item }">
        <div class="posting-item">
          <div class="total-amount"> {{ (item.totalAmount || 0 ) | formatCrypto }} {{ item.cryptoName }}</div>
        </div>
      </template>
      <template #cell(amount)="{ item }">
        <div class="posting-item">
          <div class="posting-item pr-4">
            <div class="d-flex justify-content-between align-items-center">
              <div class="finished-amount"> {{ item.finishedAmount | formatCrypto }} {{ item.cryptoName }}</div>
              <div class="font-t12r grey-400">{{ formatCryptoCompleted(item.percentCryptoCompleted) }}%</div>
            </div>
            <div>
              <progress-line :show-info="false" :percent="formatCryptoCompleted(item.percentCryptoCompleted)" />
            </div>
          </div>
        </div>
      </template>
      <template #cell(price)="{ item }">
        <div class="posting-item">
          <div><span>{{ item.fiatSymbol }}</span> {{ (item.totalFee || 0) | formatMoney }}</div>
          <div><span>{{ item.fiatSymbol }}</span> {{ (item.totalPenaltyFee || 0) | formatMoney }}</div>
        </div>
      </template>
      <template #cell(updateAt)="{ item }">
        <div class="posting-item">
          <div class="font-t14r">{{ item.updatedAt | diffForHumans }}</div>
        </div>
      </template>
      <template #cell(status)="{ item }">
        <div class="posting-item">
          <div class="sub-text" :class="`${item.status?.toLowerCase()}-status`">
            {{ $t(`postings.post_item.${item.status?.toLowerCase()}`) }}
          </div>
        </div>
      </template>
      <template #cell(action)="{ item }">
        <slot name="action" :item="item" />
      </template>
    </base-table>
    <div class="posting-table__pagination">
      <pagination-limit
        :page="page"
        :limit="limit"
        :total="total"
        :note="$t('postings.pagination')"
        @set-limit="onChangeLimit"
        @set-page="onChangePagination"
      />
    </div>
  </div>
</template>

<script>
import posting from '@/mixins/posting-history';
import BigNumber from 'bignumber.js';
import postingListing from '@/mixins/merchant/posting-listing';
export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    ProgressLine: () => import('~/components/common/progress-line/index.vue')
  },
  mixins: [posting, postingListing],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  methods: {
    getFee (fee) {
      return (fee || 0) * 100
    },
    formatCryptoCompleted (percent) {
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    },
    onChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    onChangeLimit (limit) {
      this.$emit('change-pagination', {
        page: this.page,
        limit,
        isSetAllPost: true
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/posting-table.scss" />
