import { MODAL } from '@/resources/modal.js';
import isEmpty from 'lodash/isEmpty';
import { SYSTEM_ADMIN_API } from '@/api/system-admin';

export default {
  data () {
    return {
      MODAL,
      limit: 10,
      page: 1,
      total: 0,
      admins: [],
      filter: {
        searchField: null,
        searchValue: null
      },
      isLoading: false
    };
  },
  methods: {
    async $_adminMixin_onParamsChange ({ page, limit }) {
      this.page = page;
      if (this.limit !== limit) {
        this.page = 1;
      }
      this.limit = limit;
      await this.$_adminMixin_getAdmins();
    },
    async $_adminMixin_onResetFilter () {
      this.limit = 10;
      this.page = 1;
      this.total = 0;
      this.admins = [];
      this.filter = {
        searchField: null,
        searchValue: null
      };
      await this.$_adminMixin_getAdmins();
    },
    $_adminMixin_onChangeFilter (filter = {}) {
      this.filter = { ...filter };
      this.$_adminMixin_getAdmins();
    },
    async $_adminMixin_getAdmins () {
      try {
        this.isLoading = true;
        const params = {
          searchField: this.filter?.searchField || null,
          searchValue: this.filter?.searchValue || null,
          page: this.page,
          limit: this.limit
        };

        const res = await this.$axios.$get(SYSTEM_ADMIN_API.LIST, { params });
        if (!isEmpty(res?.data)) {
          this.admins = res.data?.items || []
          this.total = res.data.totalItems;
        }
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    $_adminMixin_onEdit () {
      this.$bvModal.show(MODAL.EDIT_SUPPER_ADMIN);
    },
    $_adminMixin_onCreate () {
      this.$bvModal.show(MODAL.ADD_SUPPER_ADMIN);
    }
  }
};
