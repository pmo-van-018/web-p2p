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
          <div class="d-flex grey-900">
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
      <template #cell(operator)="{ item }">
        <div class="posting-item">
          <div class="d-flex align-items-center flex-column">
            <div class="sub-text">{{ item.merchantNickName }}</div>
            <div :id="`wallet-${item.merchantWalletAddress}-${item.id}`" class="sub-text">{{ item.merchantWalletAddress | formatHash(8) }}</div>
          </div>
        </div>
        <b-tooltip :target="`wallet-${item.merchantWalletAddress}-${item.id}`" triggers="hover" placement="top">
          {{ item.merchantWalletAddress }}
        </b-tooltip>
      </template>
      <template #cell(updatedAt)="{ item }">
        <div class="posting-item">
          <div class="d-flex justify-content-center">
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
        </div>
      </template>
      <template #cell(status)="{ item }">
        <div class="posting-item__switch-box">
          <switch-checkbox :value="isActive(item.status)" @click="onChangeStatus(item)" />
          <div class="posting-item__switch-box-inner" :class="{ 'active': isActive(item.status) }">{{ statusText(item.status) }}</div>
        </div>
      </template>
      <template #cell(action)="{ item }">
        <div class="d-flex justify-content-center">
          <base-button :id="'action-' + item.id" class="posting-item__edit" variants="text" color="info" @click="onEditPost(item)">
            <span class="icon-edit" />
          </base-button>
        </div>
        <b-tooltip :target="'action-' + item.id" triggers="hover" placement="top">
          {{ $t('postings.edit_posting') }}
        </b-tooltip>
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
import BigNumber from 'bignumber.js';
import { FULL_DATE_FORMAT, POST_TYPE } from '@/config/constant';
import dayjs from 'dayjs'
import { mapState } from 'vuex';
import { POST_STATUS_TYPE } from '@/constants/posts';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    ProgressLine: () => import('~/components/common/progress-line/index.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
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
  computed: {
    ...mapState('resources', ['assets'])
  },
  methods: {
    getPrecisionAsset (asset) {
      return this.assets.find(item => item.name === asset?.cryptoName && item.network === asset?.cryptoNetwork)?.precision
    },
    getColor (postType) {
      return postType === POST_TYPE.SELL ? 'sell-color' : 'buy-color'
    },
    formatCryptoCompleted (percent) {
      return percent !== 0 ? new BigNumber(percent).multipliedBy(100).toNumber().toFixed(2) : 0
    },
    formatDateTime (time) {
      return dayjs(time).format(FULL_DATE_FORMAT)
    },
    isActive (status) {
      return status === POST_STATUS_TYPE.ONLINE
    },
    onChangeStatus (item) {
      this.$emit('on-change-status', item)
    },
    onEditPost (item) {
      this.$router.push(`/merchant-manager/postings/${item.id}`)
    },
    statusText (status) {
      return status === POST_STATUS_TYPE.ONLINE
        ? this.$t('postings.post_item.online')
        : this.$t('postings.post_item.offline')
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
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant-manager/posts/postings-table.scss" />
