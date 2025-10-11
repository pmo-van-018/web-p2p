import dayjs from 'dayjs'
import { ADMIN_MERCHANT_MANAGER } from '@/api/merchant-manager';
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant.js';
import { LIST_STAFF, LIST_STATUS } from '@/resources/role-management';
import { MODAL } from '@/resources/modal.js';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export default {
  data () {
    const defaultDateRange = { startDate: null, endDate: null };
    const statusOptions = Object.values(LIST_STATUS).map(item => ({
      ...item,
      label: this.$t(item?.label)
    })).filter(status => status.name !== USER_STATUS.DELETED);
    const staffRoleOptions = Object.values(LIST_STAFF).map(item => ({
      ...item,
      label: this.$t(item?.label)
    }))

    return {
      MODAL,
      limit: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      merchantManagers: [],
      selectedStaffRole: null,
      staffRoleOptions,
      filter: {
        startDate: defaultDateRange.startDate,
        endDate: defaultDateRange.endDate,
        status: null,
        search: null
      },
      defaultDateRange,
      statusOptions,
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
    async $_merchantManagerMixin_onParamsChange ({ page, limit }) {
      this.page = page;
      if (this.limit !== limit) {
        this.page = 1;
      }
      this.limit = limit;
      await this.$_merchantManagerMixin_getMerchantManagers();
    },
    async $_merchantManagerMixin_onResetFilter (isGetAll = false) {
      this.limit = 10;
      this.page = 1;
      this.total = 0;
      this.merchantManagers = [];
      this.filter = {
        startDate: this.defaultDateRange.startDate,
        endDate: this.defaultDateRange.endDate,
        status: null,
        search: null
      };
      await this.$_merchantManagerMixin_getMerchantManagers(false, isGetAll);
    },
    $_merchantManagerMixin_onChangeFilter (filter = {}) {
      this.page = 1;
      this.filter = { ...filter };
      this.$_merchantManagerMixin_getMerchantManagers();
    },
    async $_merchantManagerMixin_getMerchantManagers (isMergeOldData = false, isGetAll = false) {
      try {
        this.isLoading = true;
        const params = {
          ...this.filter,
          startDate: this.convertDateRequest(this.filter?.startDate),
          endDate: this.convertDateRequest(this.filter?.endDate),
          status: this.filter?.status || null,
          page: this.page,
          limit: this.limit,
          isGetAll
        };

        const res = await this.$axios.$get(ADMIN_MERCHANT_MANAGER, { params });
        if (!isEmpty(res?.data)) {
          const oldMerchantManagers = isMergeOldData ? [...this.merchantManagers] : [];
          this.merchantManagers = [
            ...oldMerchantManagers,
            ...(res.data.items || [])
          ];
          this.total = res.data.totalItems;
          this.totalPages = parseInt(this.total / this.limit) + (this.total % this.limit > 0 ? 1 : 0);
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async $_merchantManagerMixin_onInfiniteLoading () {
      if (!this.isLoading && this.page < this.totalPages) {
        this.page = this.page + 1;
        await this.$_merchantManagerMixin_getMerchantManagers(true);
      }
    },
    $_merchantManagerMixin_onEdit () {
      this.$bvModal.show(MODAL.EDIT_MERCHANT_MANAGER);
    },
    $_merchantManagerMixin_onCreate () {
      this.$bvModal.show(MODAL.ADD_MERCHANT_MANAGER);
    }
  }
};
