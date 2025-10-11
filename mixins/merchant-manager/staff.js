import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { LIST_STAFFS } from '@/api/staff';
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant.js';
import { LIST_STAFF, LIST_STATUS } from '@/resources/role-management';
import { MODAL } from '@/resources/modal.js';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import balanceAssetMixin from '~/mixins/balance-asset'
export default {
  mixins: [balanceAssetMixin],
  computed: {
    ...mapGetters('resources', ['networkConfigs'])
  },
  data () {
    const defaultDateRange = { startDate: null, endDate: null };
    const statusOptions = Object.values(LIST_STATUS).map(item => ({
      ...item,
      label: this.$t(item?.label)
    })).filter(item => item.name !== USER_STATUS.BLOCKED);

    const staffRoleOptions = Object.values(LIST_STAFF).map(item => ({
      ...item,
      label: this.$t(item?.label)
    }))

    return {
      MODAL,
      limit: 10,
      page: 1,
      total: 0,
      staffs: [],
      filter: {
        startDate: defaultDateRange.startDate,
        endDate: defaultDateRange.endDate,
        status: null,
        search: null
      },
      defaultDateRange,
      statusOptions,
      staffRoleOptions,
      isLoading: false
    };
  },
  methods: {
    convertDateRequest (date) {
      if (!date) {
        return null;
      }
      if (isString(date)) {
        return date;
      }
      return dayjs(date).format(DATE_TIME_FORMAT.DATE_ONLY);
    },
    async $_staffMixin_onParamsChange ({ page, limit }) {
      this.page = page;
      if (this.limit !== limit) {
        this.page = 1;
      }
      this.limit = limit;
      await this.$_staffMixin_getStaffs();
    },
    async $_staffMixin_onResetFilter () {
      this.limit = 10;
      this.page = 1;
      this.total = 0;
      this.staffs = [];
      this.filter = {
        startDate: this.defaultDateRange.startDate,
        endDate: this.defaultDateRange.endDate,
        status: null,
        search: null
      };
      await this.$_staffMixin_getStaffs();
    },
    $_staffMixin_onChangeFilter (filter = {}) {
      this.filter = { ...filter };
      this.$_staffMixin_getStaffs();
    },
    async $_staffMixin_getStaffs (isMergeOldData = false) {
      try {
        this.isLoading = true;
        const params = {
          ...this.filter,
          startDate: this.convertDateRequest(this.filter?.startDate),
          endDate: this.convertDateRequest(this.filter?.endDate),
          status: this.filter?.status || null,
          type: this.filter?.type || null,
          page: this.page,
          limit: this.limit
        };

        const res = await this.$axios.$get(LIST_STAFFS, { params });
        if (!isEmpty(res?.data)) {
          const oldStaffs = isMergeOldData ? [...this.staffs] : [];
          this.staffs = [
            ...oldStaffs,
            ...(res.data.items || [])
          ];
          this.total = res.data.totalItems;
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async $_staffMixin_onInfiniteLoading () {
      if (this.staffs?.length >= this.total) {
        return;
      }
      this.page = this.page + 1;
      await this.$_staffMixin_getStaffs(true);
    },
    $_staffMixin_onEdit () {
      this.$bvModal.show(MODAL.EDIT_STAFF);
    },
    $_staffMixin_onCreate () {
      this.$bvModal.show(MODAL.SELECT_STAFF_TYPE);
    },
    async $_staffMixin_getBalanceByAsset (asset, walletAddress) {
      let balance = 0
      let loading = true
      try {
        const isNative = this.networkConfigs?.[asset?.network]?.nativeCurrency?.symbol === asset?.symbol
        balance = await this.$_balanceAssetMixin_getBalanceAsset({
          contractAddress: asset?.contract,
          walletAddress,
          assetNetwork: asset?.network,
          isNative
        })
      } catch (error) {
        console.error(error)
      } finally {
        loading = false
      }
      return { ...asset, balance, loading }
    }
  }
};
