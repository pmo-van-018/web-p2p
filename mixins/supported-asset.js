import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { ICON_COIN_DEFAULT } from '@/config/constant';
import orderBy from 'lodash/orderBy';
import { mapState } from 'vuex';
import { getNetworkFromWalletAddress } from '@/helper/wallet-address';
import { BLOCKCHAIN, CHAIN } from '@/constants/assets';

export default {
  computed: {
    ...mapState('user', ['user']),
    assetsSupportedMapped () {
      const assets = this.assets.map((asset) => {
        const assetName = `${asset.name}_${asset.network}`;
        const { tooltip, disabled } = this.disabledAssetNotSupportedWallet(getNetworkFromWalletAddress(this.user?.walletAddress), asset.network)
        return {
          ...asset,
          key: (`${asset.symbol}-${asset.network}`).toLowerCase(),
          title: asset.name,
          subTitle: asset.network,
          orderNumber: asset.orderNumber,
          icon: ASSET_COIN_IMAGES[assetName.toUpperCase()] ?? ICON_COIN_DEFAULT,
          weight: asset.name === 'VIC' ? 0 : 1,
          tooltip,
          disabled
        }
      }).sort((thisAsset, thatAsset) => thisAsset.weight - thatAsset.weight);
      return orderBy(assets, ['orderNumber', 'desc'])
    }
  },
  methods: {
    disabledAssetNotSupportedWallet (currentNameNetwork, assetNetwork) {
      const mappingTooltipAsset = {
        Ethereum: this.$t('common.tooltip.unsupported_hover_ethereum'),
        Tron: this.$t('common.tooltip.unsupported_hover_tron')
      }
      const currentAssetNetwork = assetNetwork === CHAIN.TRON ? BLOCKCHAIN.TRON : BLOCKCHAIN.ETHEREUM
      if (currentNameNetwork === currentAssetNetwork) {
        return { tooltip: '', disabled: false }
      }

      const tooltip = mappingTooltipAsset[currentNameNetwork] || '';
      const disabled = !!tooltip;

      return { tooltip, disabled };
    }
  }
}
