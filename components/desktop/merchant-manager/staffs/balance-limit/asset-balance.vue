<template>
  <div class="assets">
    <div class="assets__wrapper">
      <div class="assets__body">
        <div
          v-for="(item, index) in balanceConfigurations"
          :key="index"
          class="assets__item"
        >
          <div class="assets__inner">
            <div class="assets__icon">
              <img :src="item.icon" :alt="item.name">
            </div>
            <div class="assets__content"><strong>{{ item.name }}</strong> <span>({{ item.network }})</span></div>
          </div>
          <div v-if="item.loading" class="assets__value">
            <span class="font-t12m grey-400">{{ $t('shift_management.getting_balance') }}</span>
          </div>
          <div v-else class="assets__value" :class="{'input-balance': isShowInput }">
            <template v-if="isShowInput">
              <crypto-input
                v-model="balanceConfigurations[index].balance"
                :name="`asset_${item.assetId}`"
                class="input-crypto"
                class-option="error--outline"
                type="tel"
                :unit="item.name"
                :min-value="null"
                :max-value="maxValue"
                placeholder="0"
                :limit-input="15"
                :is-show-label="false"
                :required="false"
                :allow-decimal="item.allowDecimal"
                :allow-leading-zeroes="false"
              />
            </template>
            <template v-else>
              <div>
                {{ (item.balance || 0) | formatCrypto(item.precision) }} <span class="grey-400">{{ item.name }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CRYPTO_INPUT_MAX_VALUE } from '@/config/constant';

export default {
  components: {
    CryptoInput: () => import('@/components/common/home/crypto-input.vue')
  },
  props: {
    balanceConfigs: {
      type: Array,
      default: () => []
    },
    isShowInput: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      balanceConfigurations: [],
      maxValue: CRYPTO_INPUT_MAX_VALUE
    }
  },
  watch: {
    balanceConfigs: {
      handler (values) {
        this.balanceConfigurations = values
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/asset-balance.scss">
</style>
