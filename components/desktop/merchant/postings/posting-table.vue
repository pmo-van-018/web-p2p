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
              :id="'posts-item-ref-id-' + item.id"
              class="posting-table__ref-item"
            >
              #{{ item.id }}
            </div>
            <b-tooltip :target="'posts-item-ref-id-' + item.id" triggers="hover" placement="top">
              {{ item.id }}
            </b-tooltip>
          </div>
        </div>
      </template>
      <template #cell(availableAmount)="{ item }">
        <div class="posting-item">
          <div class="available-amount"> {{ (item.availableAmount || 0 ) | formatCrypto }} {{ item.cryptoName }}</div>
          <div class="sub-text"><span>{{ item.fiatSymbol }}</span> {{ (item.lowerFiatLimit || 0) | formatMoney }} - <span>{{ item.fiatSymbol }}</span> {{ (item.upperFiatLimit || 0) | formatMoney }}</div>
        </div>
      </template>
      <template #cell(amount)="{ item }">
        <div class="posting-item pr-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="finished-amount"> {{ item.finishedAmount | formatCrypto }} {{ item.cryptoName }}</div>
            <div class="font-t12r grey-400">{{ formatCryptoCompleted(item.percentCryptoCompleted) }}%</div>
          </div>
          <div>
            <progress-line :show-info="false" :percent="formatCryptoCompleted(item.percentCryptoCompleted)" />
          </div>
        </div>
      </template>
      <template #cell(price)="{ item }">
        <div class="posting-item">
          <div class="price"><span>{{ item.fiatSymbol }}</span> {{ item.realPrice | formatCrypto(getPrecisionAsset(item), 'ceil') }}</div>
        </div>
      </template>
      <template #cell(transactionFee)="{ item }">
        <div class="posting-item">
          <div class="sub-text">{{ getFee(item) }} %</div>
        </div>
      </template>
      <template #cell(updateAt)="{ item }">
        <div class="posting-item d-inline-block">
          <div
            :id="'update-at' + item.id"
            class="posting-item__updated-time"
          >
            {{ item.updatedAt | diffForHumans }}
          </div>
          <b-tooltip :target="'update-at' + item.id" triggers="hover" placement="top">
            {{ formatDateTime(item.updatedAt) }}
          </b-tooltip>
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
    <div v-if="items.length" class="posting-table__pagination">
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
import posting from '@/mixins/posting';
import BigNumber from 'bignumber.js';
import { FULL_DATE_FORMAT } from '@/config/constant';
import postingListing from '@/mixins/merchant/posting-listing';
import dayjs from 'dayjs'

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
    getFee (post) {
      return new BigNumber(post.fee).multipliedBy(100).toNumber().toFixed(2)
    },
    formatCryptoCompleted (percent) {
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    },
    formatDateTime (time) {
      return dayjs(time).format(FULL_DATE_FORMAT)
    },
    onChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    onChangeLimit (limit) {
      this.$emit('change-pagination', {
        page: 1,
        limit,
        isSetAllPost: true
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/postings/posting-table.scss" />
