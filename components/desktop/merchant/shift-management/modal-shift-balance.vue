<template>
  <modal-common
    :id="modalName"
    :ref="modalName"
    :title="$t(`shift_management.balance_${type}_title`)"
    @hide-modal="closed"
  >
    <div :class="`shift-management`">
      <div class="shift-management__header">
        <img src="/assets/images/common/merchant-manager/shift-manager/balance.png" alt="balance">
      </div>
      <div class="shift-management__info">
        <div class="shift-management__info-item">
          <div class="info-item__label">
            {{ $t('role_management.label.nickname') }}
          </div>
          {{ nickName }}
        </div>
        <div class="shift-management__info-item">
          <div class="info-item__label">
            {{ $t('role_management.label.wallet_address') }}
          </div>
          <copy-to-clipboard :id="walletAddress" :value-copy="walletAddress">
            {{ walletAddress }}
          </copy-to-clipboard>
        </div>
        <div class="shift-management__info-item">
          <div class="info-item__label">
            {{ $t(`shift_management.${type === 'checkin' ? 'checkin.time_checkin' : 'checkout.time_checkout'}`) }}
          </div>
          {{ type === 'checkin' ? checkInAt : checkOutAt | formatDateTime }}
        </div>
      </div>
      <div class="shift-management__transaction">
        <div class="shift-management__transaction-label">
          <div>
            {{ $t('shift_management.assets') }}
          </div>
          <div>
            {{ $t('shift_management.balance') }}
          </div>
        </div>
        <div class="shift-management__transaction-list">
          <div v-for="(asset, index) in balanceWalletAddress" :key="`asset_${index}`" class="transaction-list__item">
            <div class="transaction-item__asset-name">
              <img :src="asset.icon" :alt="asset.name">
              {{ asset.assetName }} <span> ({{ asset.assetNetwork }})</span>
            </div>
            <div class="transaction-item__balance">
              <span v-if="asset.loading" class="font-t12m grey-400">{{ $t('shift_management.getting_balance') }}</span>
              <template v-else>
                {{ asset.balance | formatCrypto }} <span> {{ asset.symbol }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal';
export default {
  components: {
    ModalCommon,
    CopyToClipboard: () => import('~/components/common/copy-to-clipboard/index.vue')
  },
  props: {
    type: {
      type: String,
      default: 'checkin'
    },
    nickName: {
      type: String,
      default: ''
    },
    walletAddress: {
      type: String,
      default: ''
    },
    checkInAt: {
      type: String,
      default: ''
    },
    checkOutAt: {
      type: String,
      default: ''
    },
    balanceWalletAddress: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      MODAL,
      modalName: MODAL.SHIFT_MANAGEMENT_BALANCE
    }
  },
  methods: {
    closed () {
      this.$bvModal.hide(MODAL.SHIFT_MANAGEMENT_BALANCE);
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/shift-management/modal-shift-management.scss">
</style>
