<template>
  <modal-common
    :id="modalName"
    :ref="modalName"
    :title="$t(`shift_management.${type}.title`)"
    @show-modal="handleShowModal"
    @hide-modal="closed"
  >
    <div :class="`shift-management ${type}`">
      <div class="shift-management__header">
        <template v-if="message">
          <img :src="`/assets/images/common/merchant-manager/shift-manager/${icon}`" :alt="type">
          <div :class="`shift-management__description ${isSuccess ? 'success': 'error'}`">{{ message }}</div>
        </template>
        <template v-else>
          <img :src="`/assets/images/common/merchant-manager/shift-manager/${type}.png`" :alt="type">
          <div class="shift-management__description">{{ $t(`shift_management.${type}.description`) }}</div>
        </template>
      </div>
      <template v-if="submitResponse">
        <div v-if="isCheckin" class="shift-management__response">
          <span>
            {{ $t('shift_management.checkin.time_checkin') }}
          </span>
          {{ submitResponse.checkInAt | formatDateTime }}
        </div>
        <template v-else>
          <div class="shift-management__response">
            <span>
              {{ $t('shift_management.checkout.time_checkout') }}
            </span>
            {{ submitResponse.checkOutAt | formatDateTime }}
          </div>
          <div class="shift-management__response">
            <span>
              {{ $t('shift_management.checkout.time_working') }}
            </span>
            {{ getDiffWorkingDate(submitResponse?.checkInAt, submitResponse?.checkOutAt) }}
          </div>
          <div class="shift-management__response">
            <span>
              {{ $t('shift_management.checkout.order_amount') }}
            </span>
            <div>
              {{ submitResponse.orderAmount || 0 | formatMoney }} <span class="normal">{{ $t('home.unit-vnd') }}</span>
            </div>
          </div>
        </template>
        <div class="shift-management__action">
          <base-button
            variants="contained"
            full-width
            color="primary"
            @click="closed"
          >
            {{ $t('action.confirm') }}
          </base-button>
        </div>
      </template>
      <div v-else-if="!message" class="shift-management__content">
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
            <div v-for="asset in balanceWalletAddress" :key="asset.name + asset.network" class="transaction-list__item">
              <div class="transaction-item__asset-name">
                <img :src="asset.icon" :alt="asset.name">
                {{ asset.name }} <span> ({{ asset.network }})</span>
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
        <div class="shift-management__action">
          <base-button
            variants="contained"
            full-width
            color="primary"
            :disabled="loading || loadingAssets"
            @click="handleSubmit"
          >
            {{ $t(`shift_management.${type}.button`) }}
          </base-button>
        </div>
      </div>
    </div>
  </modal-common>
</template>
<script>
import { SHIFT_MANAGEMENT } from '@/api/shift-management';
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { getDiffTime } from '@/helper/datetime';
import staffBalanceMixin from '@/mixins/merchant-manager/staff-balance';
import { MODAL } from '@/resources/modal';
import { mapActions, mapState } from 'vuex';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    CopyToClipboard: () => import('~/components/common/copy-to-clipboard/index.vue')
  },
  mixins: [staffBalanceMixin],
  data () {
    return {
      MODAL,
      modalName: MODAL.SHIFT_MANAGEMENT,
      submitResponse: null,
      message: '',
      isSuccess: false,
      loading: false,
      type: 'checkin'
    }
  },
  computed: {
    ...mapState('user', ['user', 'isShiftProcessing']),
    nickName () {
      return this.user?.nickName || this.user?.walletAddress
    },
    isCheckin () {
      return this.type === 'checkin'
    },
    walletAddress () {
      return this.user?.walletAddress || ''
    },
    icon () {
      return `${this.type}-${this.isSuccess ? 'success' : 'error'}.png`
    }
  },
  methods: {
    ...mapActions('user', ['setIsShiftProcessing']),
    getDiffWorkingDate (checkInAt, checkOutAt) {
      if (!checkInAt || !checkOutAt) {
        return ''
      }
      const { hours, minutes } = getDiffTime(checkInAt, checkOutAt)
      const totalHoursText = hours > 0 ? `${hours} ${this.$t('datetime_unit.hour')}` : ''
      const totalMinsText = `${minutes || 0} ${this.$t('datetime_unit.minute')}`
      return `${totalHoursText} ${totalMinsText}`
    },
    handleShowModal () {
      this.getBalanceByAssets()
      this.type = this.isShiftProcessing ? 'checkout' : 'checkin'
    },
    async handleSubmit () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.isSuccess = false
      const assetBalances = this.balanceWalletAddress.map((asset) => {
        return {
          assetId: asset.id,
          balance: asset.balance
        }
      });
      try {
        const res = await this.$axios.$post(this.isCheckin ? SHIFT_MANAGEMENT.CHECK_IN : SHIFT_MANAGEMENT.CHECK_OUT, {
          assetBalances
        });
        if (res?.errors && res?.errors[0]) {
          const error = res.errors[0]
          if (error?.key === 'BALANCE_DOES_NOT_MATCH') {
            this.message = this.$t('shift_management.balance_error');
            return
          }
          if (error?.key === 'ORDER_AMOUNT_DOES_NOT_MATCH') {
            this.message = this.$t('shift_management.order_error');
            return
          }
          throw new Error(res.errors[0].key)
        } else {
          this.message = this.$t(`shift_management.${this.type}.success`);
          this.isSuccess = true
          this.submitResponse = res.data
          this.setIsShiftProcessing(!this.isShiftProcessing)
        }
      } catch (error) {
        this.message = this.$t(`shift_management.${this.type}.error`);
      } finally {
        this.loading = false
      }
    },
    resetState () {
      this.message = '';
      this.submitResponse = null;
      this.isSuccess = false;
      this.loading = false
    },
    closed () {
      this.$bvModal.hide(MODAL.SHIFT_MANAGEMENT);
      this.resetState();
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/shift-management/modal-shift-management.scss">
</style>
