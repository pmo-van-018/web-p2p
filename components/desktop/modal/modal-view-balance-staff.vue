<template>
  <b-modal
    id="modalShowBalanceStaff"
    modal-class="modal-custom bottom modal-balance"
    centered
    hide-header
    hide-footer
    @shown="getBalanceByAssets"
  >
    <div class="modal-balance-staff">
      <div class="modal-balance-staff__container">
        <div class="modal-balance-staff__header">
          <div class="modal-balance-staff__title">{{ $t('role_management.info_balance') }}</div>
          <div class="modal-balance-staff__close" @click="$bvModal.hide('modalShowBalanceStaff')">
            <span class="icon-cancel" />
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-center modal-balance-staff__thumb">
          <svg>
            <use xlink:href="#balance" />
          </svg>
        </div>
        <div class="modal-balance-staff__body">
          <div class="modal-balance-staff__info">
            <div class="staff-info">
              <div class="staff-info__container">
                <div class="staff-info__inner">
                  <div class="staff-info__title">{{ $t('role_management.label.nickname') }}</div>
                  <div class="staff-info__value">{{ staff?.nickName || '' }}</div>
                </div>
                <div class="staff-info__inner">
                  <div class="staff-info__title">{{ $t('role_management.label.wallet_address') }}</div>
                  <div class="staff-info__value">
                    <div class="staff-info__wallet">
                      <span class="staff-info__wallet-value">
                        {{ staff?.walletAddress }}
                      </span>

                      <copy-button
                        :id="`wallet-address-${staff?.id}`"
                        :value="staff?.walletAddress"
                        :text-guide="$t('role_management.label.copy_wallet_address')"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-balance-staff__list">
            <div class="assets">
              <div class="assets__wrapper">
                <div class="assets__head">
                  <div class="asset__head-left">Loại tài sản</div>
                  <div class="asset__head-right">Số dư hiện tại</div>
                </div>
                <div class="assets__body">
                  <div
                    v-for="(item, index) in balanceWalletAddress"
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
                    <div v-else class="assets__value">
                      {{ item.balance | formatCrypto }} <span class="grey-400">{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import { mapState } from 'vuex'
import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { ICON_COIN_DEFAULT } from '@/config/constant';
import staffMixin from '@/mixins/merchant-manager/staff';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [staffMixin],
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      balanceWalletAddress: []
    }
  },
  computed: {
    ...mapState('resources', ['allAssets']),
    walletAddress () {
      return this.staff?.walletAddress || ''
    },
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
      this.balanceWalletAddress = this.assetsMapped.map((asset) => {
        return { ...asset, loading: true }
      })
      this.balanceWalletAddress = await Promise.all(this.balanceWalletAddress.map((asset) => {
        return this.$_staffMixin_getBalanceByAsset(asset, this.walletAddress);
      }));
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
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/modal/modal-view-balance-staff.scss">
</style>
