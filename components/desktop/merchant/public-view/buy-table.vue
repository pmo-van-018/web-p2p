<template>
  <section class="buy-table">
    <template v-if="isSkeletonLoading">
      <b-skeleton-table
        class="delay-animation"
        :rows="7"
        :columns="4"
        :table-props="{ bordered: false, striped: false }"
      />
    </template>
    <template v-else>
      <base-table
        :fields="fields"
        :items="items"
        :is-loading="isLoadingData"
        :tbody-tr-class="handleRowClass"
        @row-clicked="onRowClicked"
      >
        <template #cell(asset)="{ item }">
          <div class="avatar-container">
            <b-avatar
              rounded
              variant="white"
              :src="getAssetIcon(item)"
              class="mr-3 w43-custom"
            />
            <div class="avatar-item__right">
              <div class="text-top">{{ item.assetName }}</div>
              <div class="text-bottom"> {{ $t('merchant.public_view.network') }}: {{ item.assetNetwork }}</div>
            </div>
          </div>
        </template>
        <template #cell(price)="{ item }">
          <p class="price"><span>{{ item.fiatSymbol }}</span> {{ item.price |formatCrypto(decimalLimit(item), 'ceil') }}</p>
        </template>
        <template #cell(availableLimit)="{ item }">
          <div class="content-amount">
            <div class="content-limit">
              <p class="text-limit"> {{ $t('merchant.public_view.available') }} </p>
              <p class="text-money">{{ item?.availableAmount | formatCrypto }} {{ item.assetName }}</p>
            </div>
            <div class="content-limit">
              <p class="text-limit">  {{ $t('merchant.public_view.limit') }}</p>
              <p class="text-money d-block"><span>{{ item?.fiatSymbol }}</span>{{ item.minOrderAmount | formatMoney }} - <span>{{ item?.fiatSymbol }}</span>{{ item.maxOrderAmount | formatMoney }}</p>
            </div>
          </div>
        </template>
        <template #cell(action)="{ item }">
          <base-button
            variants="contained"
            color="success"
            full-width
            :disabled="item.disable"
            @click="onRowClicked(item)"
          >
            {{ $t('merchant.public_view.btn_buy') }}
          </base-button>
        </template>
        <template #row-details="row">
          <div v-if="row.item" class="content-detail">
            <PostItemInfo :item="selectedItem(row.item)" :is-online="checkPostOnline(row.item?.id)" />
            <div class="line" />
            <PostItemDetailBuy
              :item="selectedItem(row.item)"
              :cf-token="cfToken"
              @cancel-transaction="$merchantPublicViewMixin__toggleDetails(row.item)"
              @cf-verify="$emit('cf-verify')"
            />
          </div>
        </template>
      </base-table>
      <div v-if="items.length" class="merchant-table__pagination">
        <pagination-limit
          :page="page"
          :limit="limit"
          :total="total"
          :note="$t('postings.pagination')"
          @set-limit="onChangeLimit"
          @set-page="onChangePagination"
        />
      </div>
    </template>
  </section>
</template>

<script>
import merchantPublicViewBuyMixin from '@/mixins/merchant/public-view/buy.js'
import PostItemInfo from '@/components/desktop/list-post/post-item-info.vue';
import PostItemDetailBuy from '@/components/desktop/list-post/post-item-detail-buy.vue';
import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { ICON_COIN_DEFAULT } from '@/config/constant';

export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    PostItemInfo,
    PostItemDetailBuy
  },
  mixins: [merchantPublicViewBuyMixin],
  async mounted () {
    await this.$merchantPublicViewMixin_onReset()
    setTimeout(() => {
      this.isSkeletonLoading = false
    }, 800)
  },
  methods: {
    onChangePagination (page) {
      this.$commonOrderMixin_onChangePage(page, this.limit)
    },
    onChangeLimit (limit) {
      this.$commonOrderMixin_onChangePage(1, limit)
    },
    getAssetIcon (item) {
      const assetNameConvert = `${item?.assetName}_${item?.assetNetwork}` || '';
      return ASSET_COIN_IMAGES[assetNameConvert.toUpperCase()] ?? ICON_COIN_DEFAULT
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/public-view/index.scss" />
<style lang="scss">
  .w43-custom {
    width: 43px;
    height: 40px;
  }
</style>
