import { ICON_COIN_DEFAULT } from '@/config/constant';
import { MODAL } from '@/resources/modal';
import { ASSET_COIN_IMAGES } from '@/resources/wallet';
import { mapState } from 'vuex';
import { getDiffTime } from '@/helper/datetime';
export default {
  components: {
    ModalShiftManagementBalance: () => import('~/components/desktop/merchant/shift-management/modal-shift-balance.vue'),
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue'),
    AssetAmount: () => import('~/components/desktop/shift/asset-amount.vue')
  },
  data () {
    return {
      selectedShift: null,
      type: 'checkin'
    };
  },
  computed: {
    ...mapState('resources', ['allAssets']),
    checkInAt () {
      return this.selectedShift?.checkInAt || ''
    },
    checkOutAt () {
      return this.selectedShift?.checkOutAt || ''
    },
    balanceWalletAddress () {
      return this.selectedShift?.balanceWalletAddress || []
    }
  },
  methods: {
    getDiffWorkingDate (item) {
      const { hours, minutes } = getDiffTime(item?.checkInAt, item?.checkOutAt)
      const totalHoursText = hours > 0 ? `${hours} ${this.$t('datetime_unit.hour')}` : ''
      const totalMinsText = `${minutes || 0} ${this.$t('datetime_unit.minute')}`
      return `${totalHoursText} ${totalMinsText}`
    },
    handleCloseModalBalance () {
      this.selectedShift = null
      this.type = 'checkin'
    },
    handleShowBalance (item, type) {
      const balanceWalletAddress = type === 'checkin' ? item.openingBalance : item.closingBalance
      this.type = type
      this.selectedShift = {
        ...item,
        balanceWalletAddress: balanceWalletAddress.map((asset) => {
          const assetNameUpperCase = `${asset.assetName}_${asset.assetNetwork}`.toUpperCase();
          const symbol = this.allAssets.find(item => item.id === asset.assetId)?.symbol || '';
          return {
            ...asset,
            symbol,
            icon: ASSET_COIN_IMAGES[assetNameUpperCase] ?? ICON_COIN_DEFAULT
          }
        })
      }
      this.$bvModal.show(MODAL.SHIFT_MANAGEMENT_BALANCE);
    }
  }
}
