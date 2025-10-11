import dayjs from 'dayjs'
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant.js';
import { LIST_STATUS } from '@/resources/role-management';
import { MODAL } from '@/resources/modal.js';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import { LIST_ADMIN_SUPPORTER } from '@/api/admin-supporter';
import { getTotalPage } from '@/helper'

export default {
  data () {
    const defaultDateRange = { startDate: null, endDate: null };
    const statusOptions = Object.values(LIST_STATUS).map(item => ({
      ...item,
      label: this.$t(item?.label)
    })).filter(status => status.name !== USER_STATUS.DELETED);

    return {
      MODAL,
      limit: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      adminSupporters: [],
      filter: {
        startDate: defaultDateRange.startDate,
        endDate: defaultDateRange.endDate,
        status: null,
        searchField: null,
        searchValue: null
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
    async $_adminSupporterMixin_onParamsChange ({ page, limit }) {
      this.page = page;
      if (this.limit !== limit) {
        this.page = 1;
      }
      this.limit = limit;
      await this.$_adminSupporterMixin_getAdminSupporters();
    },
    async $_adminSupporterMixin_onResetFilter () {
      this.limit = 10;
      this.page = 1;
      this.total = 0;
      this.adminSupporters = [];
      this.filter = {
        startDate: this.defaultDateRange.startDate,
        endDate: this.defaultDateRange.endDate,
        status: null,
        searchField: null,
        searchValue: null
      };
      await this.$_adminSupporterMixin_getAdminSupporters(false);
    },
    $_adminSupporterMixin_onChangeFilter (filter = {}) {
      this.page = 1;
      this.filter = { ...filter };
      this.$_adminSupporterMixin_getAdminSupporters();
    },
    async $_adminSupporterMixin_getAdminSupporters (isMergeOldData = false) {
      try {
        this.isLoading = true;
        const params = {
          ...this.filter,
          startDate: this.convertDateRequest(this.filter?.startDate),
          endDate: this.convertDateRequest(this.filter?.endDate),
          status: this.filter?.status || null,
          searchField: this.filter?.searchField || null,
          searchValue: this.filter?.searchValue || null,
          page: this.page,
          limit: this.limit
        };

        const res = await this.$axios.$get(LIST_ADMIN_SUPPORTER, { params });
        if (!isEmpty(res?.data)) {
          const oldAdminSupporters = isMergeOldData ? [...this.adminSupporters] : [];
          this.adminSupporters = [
            ...oldAdminSupporters,
            ...(res.data.items || [])
          ];
          this.total = res.data.totalItems;
          this.totalPages = getTotalPage(this.total, params.limit)
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async $_adminSupporterMixin_onInfiniteLoading () {
      if (!this.isLoading && this.page < this.totalPages) {
        this.page = this.page + 1;
        await this.$_adminSupporterMixin_getAdminSupporters(true);
      }
    },
    $_adminSupporterMixin_onCreate () {
      this.$bvModal.show(MODAL.ADD_ADMIN_SUPPORTER);
    },
    $_adminSupporterMixin_onEdit () {
      this.$bvModal.show(MODAL.EDIT_ADMIN_SUPPORTER);
    }
  }
};
