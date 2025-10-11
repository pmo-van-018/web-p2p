<template>
  <div class="asset-amount">
    <div class="d-flex align-items-center mb-2">
      <div v-for="(item, index) in mappedAssetAmounts" :key="`${id}_${index}`" class="d-flex align-items-center">
        <div class="asset-amount__item">
          {{ item.balance | formatCrypto }} <span>{{ item.assetName }}</span>
        </div>
        <b v-if="index < (mappedAssetAmounts.length - 1)" class="mx-1">-</b>
      </div>
    </div>
    <div :id="id" tabindex="0" class="view-balance" @click="$emit('on-show-balance')">
      <svg>
        <use xlink:href="#balance" />
      </svg>
      <span class="view-balance__text">{{ $t('shift_management.view_balance') }}</span>
    </div>
    <b-tooltip :target="id" triggers="hover">
      {{ $t('shift_management.total_amount') }}
    </b-tooltip>
  </div>
</template>
<script>
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import BigNumber from 'bignumber.js';

export default {
  props: {
    assetAmounts: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    mappedAssetAmounts () {
      return map(groupBy(this.assetAmounts, 'assetName'), (items, assetName) => {
        return {
          assetName,
          balance: BigNumber.sum.apply(null, map(items, 'balance')).toNumber()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/shift/asset-amount.scss">
</style>
