<template>
  <div class="maintenance-section">
    <div class="maintenance-section__wrapper">
      <div class="maintenance-section__inner">
        <div class="maintenance-section__content">{{ $t('merchant.settings.maintenance.network') }}:</div>
        <div v-if="mappedNetworkMaintenanceValues.length" class="maintenance-section__list">
          <div
            v-for="(item, index) in mappedNetworkMaintenanceValues"
            :key="`network_selected__${index}`"
            class="maintenance-section__item"
          >
            <div class="maintenance-section__icon">
              <img :src="item.icon" :alt="item.name">
            </div>
            <div class="maintenance-section__text">{{ item.name }}</div>
          </div>
        </div>
        <span v-else>--</span>
      </div>
      <div class="maintenance-section__inner">
        <div class="maintenance-section__content">{{ $t('merchant.settings.maintenance.wallet') }}:</div>
        <div v-if="mappedWalletMaintenanceValues.length" class="maintenance-section__list">
          <div
            v-for="(item, index) in mappedWalletMaintenanceValues"
            :key="`wallet_selected__${index}`"
            class="maintenance-section__item"
          >
            <div class="maintenance-section__icon">
              <img :src="item.icon" :alt="item.name">
            </div>
            <div class="maintenance-section__text">{{ item.name }}</div>
          </div>
        </div>
        <span v-else>--</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { NETWORK_OPTIONS, WALLET_OPTIONS } from '@/resources/maintenance';

export default {
  props: {
    walletMaintenance: {
      type: Array,
      default: () => []
    },
    assetMaintenance: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      networkOptions: NETWORK_OPTIONS,
      walletOptions: WALLET_OPTIONS
    }
  },
  computed: {
    ...mapState('resources', ['allAssets']),
    mappedWalletMaintenanceValues () {
      return this.walletMaintenance.map((wallet) => {
        return this.walletOptions.find(option => option.value === wallet)
      }).filter(item => item)
    },
    mappedNetworkMaintenanceValues () {
      const assetMap = new Map(this.allAssets.map(as => [`${as.name} (${as.network})`, as.network]));
      const uniqNetworks = new Set();

      this.assetMaintenance?.forEach((item) => {
        const network = assetMap.get(item);
        if (network) {
          uniqNetworks.add(network);
        }
      });
      return this.networkOptions.filter(option => uniqNetworks.has(option.value));
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/settings/maintenance/list.scss">
</style>
