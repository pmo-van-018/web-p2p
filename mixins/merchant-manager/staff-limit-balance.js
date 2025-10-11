import MERCHANT_MANAGER_API from '@/api/merchant-manager';
import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { ICON_COIN_DEFAULT } from '@/config/constant';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import orderBy from 'lodash/orderBy';

export default {
  data () {
    return {
      balanceConfigurations: [],
      isLoadingListBalance: false,
      isLoadingUpdateBalance: false
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    balanceConfigurationsMapped () {
      return this.balanceConfigurations
        .map(asset => ({
          assetId: asset.assetId,
          balance: this.$options.filters.formatMarkToNumber(asset.balance)
        }))
    }
  },
  methods: {
    ...mapActions('resources', ['getResources']),
    async $_staffLimitBalanceMixin_getListBalanceConfigurations () {
      try {
        const { data } = await this.$axios.$get(MERCHANT_MANAGER_API.MERCHANT_MANAGER_LIST_BALANCE_CONFIGURATIONS)
        return data.balanceConfigs || []
      } catch (error) {
        console.error(error)
        return []
      }
    },
    async $_staffLimitBalanceMixin_updateBalanceConfigurations (balanceConfigs) {
      try {
        this.isLoadingUpdateBalance = true
        await this.$axios.$post(MERCHANT_MANAGER_API.MERCHANT_MANAGER_UPDATE_BALANCE_CONFIGURATIONS, {
          balanceConfigs: this.balanceConfigurationsMapped
        })
        await this.$_staffLimitBalanceMixin_getBalanceLimitConfigurations()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoadingUpdateBalance = false
      }
    },
    async $_staffLimitBalanceMixin_getBalanceLimitConfigurations () {
      this.isLoadingListBalance = true
      await this.getResources()
      const items = await this.$_staffLimitBalanceMixin_getListBalanceConfigurations()
      this.isLoadingListBalance = false
      this.balanceConfigurations = this._formatResultByAssets(items)
    },
    $_staffLimitBalanceMixin_onConfirmSubmitBalance () {
      this.$bvModal.show(MODAL.SETTING_RESULT_LIMIT_BALANCE)
    },
    _formatResultByAssets (configurations) {
      const assets = orderBy(this.assets, 'orderNumber', 'desc')
      if (!assets?.length) {
        return []
      }
      if (!configurations?.length) {
        return assets.map(asset => ({
          balance: null,
          assetId: asset.id,
          name: asset.name,
          network: asset.network,
          allowDecimal: asset.precision <= 0,
          icon: ASSET_COIN_IMAGES[`${`${asset.name}_${asset.network}`.toUpperCase()}`] ?? ICON_COIN_DEFAULT
        }))
      }
      return assets.map((asset) => {
        const assetNameUpperCase = `${asset.name}_${asset.network}`.toUpperCase();
        const item = configurations.find(item => item.assetId === asset.id)
        const icon = ASSET_COIN_IMAGES[assetNameUpperCase] ?? ICON_COIN_DEFAULT
        if (item) {
          return {
            assetId: asset.id,
            name: asset.name,
            network: asset.network,
            icon,
            allowDecimal: asset.precision <= 0,
            balance: item.balance === 0 ? null : this.$options.filters.formatCrypto(item.balance, asset.precision <= 0 ? 2 : 0)
          }
        }
        return {
          assetId: asset.id,
          name: asset.name,
          network: asset.network,
          allowDecimal: asset.precision <= 0,
          icon,
          balance: null
        }
      })
    }
  }
}
