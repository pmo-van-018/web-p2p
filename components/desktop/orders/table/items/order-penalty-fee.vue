<template>
  <div class="penalty-fee font-t14m grey-600">
    <template v-if="totalPenaltyFee">
      {{ penaltyFee }}% ({{ totalPenaltyFee > 0 ? '~' : '' }}
      {{ fiatSymbol }} {{ totalPenaltyFee | formatMoney }})
    </template>
    <template v-else>
      <span>&#8722;</span>
    </template>
  </div>
</template>
<script>
import BigNumber from 'bignumber.js';

export default {
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    fiatSymbol () {
      return this.order?.fiatSymbol || ''
    },
    penaltyFee () {
      return new BigNumber(Number(this.order?.penaltyFeePercent || 0)).multipliedBy(100).toString()
    },
    totalPenaltyFee () {
      return this.order?.totalPenaltyFee || 0
    }
  }
}
</script>
