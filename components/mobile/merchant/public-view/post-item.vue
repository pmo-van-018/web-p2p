<template>
  <div class="item-transaction">
    <div class="content-item-transaction">
      <div class="content-seller">
        <div class="content-person">
          <b-avatar
            rounded
            variant="white"
            :src="iconImageAsset"
            class="item-transaction__avatar"
          />
          <p class="text-seller">{{ item?.assetName }}</p>
        </div>
        <p class="text-status"> {{ $t('merchant.public_view.network') }}: {{ item?.assetNetwork }}</p>
      </div>
      <p class="text-price">{{ $t('home.price') }}</p>
      <div class="content-price">
        <p class="price">
          <span class="mr-1">{{ item.fiatSymbol }}</span>
          {{ item.price | formatCrypto(decimalLimit, 'ceil') }}
        </p>
      </div>
      <div class="content-buy">
        <div class="content-amount">
          <div class="content-limit">
            <p class="text-limit">{{ $t('merchant.public_view.available') }}</p>
            <p class="text-money">{{ item.availableAmount | formatCrypto }} {{ item.assetName }}</p>
          </div>
          <div class="content-limit">
            <p class="text-limit">{{ $t('merchant.public_view.limit') }}</p>
            <p class="text-money d-block"><span>{{ item.fiatSymbol }}</span>{{ item.minOrderAmount | formatMoney }} - <span>{{ item.fiatSymbol }}</span>{{ item.maxOrderAmount | formatMoney }}</p>
          </div>
        </div>
        <base-button
          v-if="type==='buy'"
          variants="contained"
          color="success"
          size="small"
          class="content-action"
          :disabled="item.disable"
          @click="transactionCrypto()"
        >
          {{ $t('merchant.public_view.btn_buy') }}
        </base-button>
        <base-button
          v-else
          variants="contained"
          color="danger"
          size="small"
          class="content-action"
          :disabled="item.disable"
          @click="transactionCrypto()"
        >
          {{ $t('merchant.public_view.btn_sell') }}
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { ICON_COIN_DEFAULT } from '@/config/constant';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: () => 'buy'
    },
    itemActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.item?.assetName && item.network === this.item?.assetNetwork)
    },
    iconImageAsset () {
      const assetFullName = `${this.item?.assetName}_${this.item?.assetNetwork}` || '';
      return ASSET_COIN_IMAGES[assetFullName.toUpperCase()] ?? ICON_COIN_DEFAULT
    }
  },
  methods: {
    transactionCrypto () {
      this.$emit('click-detail')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/list-post/post-item.scss" />
