import { mapState } from 'vuex'
import { ASSET_COIN_IMAGES } from '@/resources/wallet'
import { ICON_COIN_DEFAULT } from '@/config/constant'
import staffMixin from '@/mixins/merchant-manager/staff';
import providerFactoryMixin from '~/mixins/web3-onboard/provider-factory'

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [staffMixin, providerFactoryMixin],
  data () {
    return {
      loadingAssets: false,
      balanceWalletAddress: []
    }
  },
  computed: {
    ...mapState('resources', ['allAssets']),
    assetsMapped () {
      if (!this.allAssets.length) {
        return []
      }
      let newAssets = [...this.allAssets];
      const tronAsset = this.allAssets.find(as => as.network.toUpperCase() === 'TRON')
      if (!tronAsset) {
        return this.formatResultByAssets(newAssets)
      }
      const provider = this.$_providerFactory_getProvider(tronAsset.network);
      if (!provider) {
        return this.formatResultByAssets(newAssets)
      }
      const isTronWalletAddress = provider.isAddress(this.walletAddress);
      if (isTronWalletAddress) {
        newAssets = this.allAssets.filter(asset => asset.network.toUpperCase() === 'TRON')
      } else {
        newAssets = this.allAssets.filter(asset => asset.network.toUpperCase() !== 'TRON')
      }
      return this.formatResultByAssets(newAssets)
    }
  },
  methods: {
    async getBalanceByAssets () {
      if (this.loadingAssets) {
        return
      }
      this.loadingAssets = true
      this.balanceWalletAddress = this.assetsMapped.map((asset) => {
        return { ...asset, loading: true }
      })
      this.balanceWalletAddress = await Promise.all(this.balanceWalletAddress.map((asset) => {
        return this.$_staffMixin_getBalanceByAsset(asset, this.walletAddress);
      }))
      this.loadingAssets = false
    },
    formatResultByAssets (assets) {
      return assets.map((asset) => {
        const assetNameUpperCase = `${asset.name}_${asset.network}`.toUpperCase();
        return {
          ...asset,
          balance: 0,
          icon: ASSET_COIN_IMAGES[assetNameUpperCase] ?? ICON_COIN_DEFAULT,
          loading: true
        }
      })
    }
  }
}
