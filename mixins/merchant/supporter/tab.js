import { POST_TYPE } from '@/config/constant';
import { ORDER_GROUPS, STATUS_PENDING_ORDER } from '@/resources/order-filters';
import MERCHANT_ORDER_API from '@/api/merchant-order';
import debounce from 'lodash/debounce';
import { MODAL } from '@/resources/modal';

export default {
  data () {
    return {
      isLoading: false,
      orders: [],
      total: 0,
      limit: 10,
      page: 1,
      POST_TYPE,
      filter: {
        searchField: '',
        searchValue: '',
        orderStatus: '',
        assetType: '',
        type: '',
        // filter on mobile
        totalPrice: ''
      },
      sortField: '',
      sortDirection: '',
      DEFAULT_LOADER: 6,
      bankQrCode: '',
      key: 0,
      tabs: [
        {
          title: this.$t('tabs.supporter.pending'),
          status: 'pending',
          isCount: true,
          count: 0,
          component: 'PendingOrders'
        },
        {
          title: this.$t('tabs.supporter.processing'),
          status: 'processing',
          isCount: true,
          count: 0,
          component: 'ProcessingOrders'
        }
      ],
      activatedComponent: 'PendingOrders',
      defaultTab: 'pending'
    }
  },
  computed: {
    activeTab () {
      const routeStatus = this.$route?.query?.status || this.defaultTab;
      const activeTab = this.tabs.find(tab => tab.status === routeStatus);
      return activeTab;
    },
    queryParams () {
      const sort = this.sort || 'createdAt:asc'
      return {
        page: this.page,
        limit: this.limit,
        sort,
        orderStatus: this.filter.orderStatus || STATUS_PENDING_ORDER,
        ...(this.sortField && this.sortDirection) && { sort: `${this.sortField}:${this.sortDirection},${sort}` },
        orderGroup: ORDER_GROUPS.APPEAL,
        ...((this.filter.searchField && this.filter.searchValue) && { searchField: this.filter.searchField }),
        ...(this.filter.searchValue && { searchValue: this.filter.searchValue }),
        ...(this.filter.assetType && { assetType: this.filter.assetType }),
        ...(this.filter.type && { type: this.filter.type }),
        ...(this.filter.totalPrice && { totalPrice: this.filter.totalPrice })
      }
    }
  },
  watch: {
    '$route.query.status': {
      async handler () {
        if (this.activeTab) {
          this.orders = []
          this.activatedComponent = this.activeTab.component
          await this.$_supporterMixin_onResetFilter()
        }
      }
    }
  },
  async created () {
    const routeStatus = this.$route?.query?.status || this.defaultTab;
    this.activatedComponent = this.tabs.find(tab => tab.status === routeStatus)?.component || this.activatedComponent;
    if (this.$device.isMobileOrTablet) {
      this.orders = []
    }
    await this.getListOrderAllTab()
  },
  methods: {
    async getListOrderAllTab () {
      const getOrderAllTab = this.tabs.filter(tab => tab.component !== this.activatedComponent).map((tab) => {
        return this.$_supporterMixin_getListAppeal(tab.component)
      })
      await Promise.all(getOrderAllTab)
      await this.$_supporterMixin_getListAppeal()
    },
    onChangeTab (tab) {
      this.orders = []
      this.key = new Date().getTime()
      if (tab) {
        this.$router.push({ path: this.$route.fullPath, query: { status: tab.status } });
        this.activatedComponent = tab.component
        if (this.detailsRow) {
          this.detailsRow._showDetails = false
        }
      }
    },
    handleTotalOrder (total, component) {
      const tabInfo = this.tabs.find(e => e.component === component)
      tabInfo.count = total
    },
    async updateTotalCount () {
      await this.$_supporterMixin_getListAppeal()
      this.tabs = this.tabs.map((tab) => {
        if (tab.component === 'ProcessingOrders') {
          tab.count++
        }
        return tab
      })
    },
    async $_supporterMixin_onResetFilter () {
      this.$_supporterMixin_onResetStateFilter()
      await this.$_supporterMixin_getListAppeal()
    },
    $_supporterMixin_onResetStateFilter () {
      this.filter.searchField = ''
      this.filter.searchValue = ''
      this.page = 1
      this.limit = 10
    },
    async $_supporterMixin_getListAppeal (component, isMerge) {
      try {
        this.isLoading = true
        const activatedComponent = component || this.activatedComponent
        const readonly = activatedComponent === 'PendingOrders'
        const res = await this.$axios.$get(MERCHANT_ORDER_API.GET_LIST_ORDER, { params: { ...this.queryParams, readonly } });
        if (res?.data) {
          if (activatedComponent === this.activatedComponent) {
            const orders = res.data?.orders || []
            this.orders = isMerge ? [...this.orders, ...orders] : orders
          }
          this.total = res.data.total;
          this.handleTotalOrder(this.total, activatedComponent)
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    onSearchOrder: debounce(function ({ searchField, searchValue }) {
      this.filter.searchField = searchField
      this.filter.searchValue = searchValue
      this.$_supporterMixin_getListAppeal()
    }, 500),
    $_supporterMixin_onFilter (options) {
      if (options) {
        const { asset, orderStatus, type, searchField, searchValue, amount, orderField, orderDirection, transCode } = options
        this.filter.type = type
        this.filter.orderStatus = orderStatus || STATUS_PENDING_ORDER
        this.filter.assetType = asset
        this.filter.searchField = searchField
        this.filter.searchValue = searchValue
        this.filter.totalPrice = amount
        this.sortField = orderField
        this.sortDirection = orderDirection
        if (transCode) {
          this.filter.search = transCode
        }
      }
      this.$_supporterMixin_getListAppeal()
    },
    async $_supporterMixin_onInfiniteLoadingOrder () {
      if (!this.isLoading && this.orders.length < this.total) {
        await this.$_supporterMixin_getListAppeal(null, true)
      }
    },
    $_supporterMixin_handleChangeSort ({ sortField, sortDirection }) {
      this.sortField = sortField
      this.sortDirection = sortDirection
      this.$_supporterMixin_getListAppeal()
    },
    async $_supporterMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$_supporterMixin_getListAppeal()
    },
    $_supporterMixin_onOpenBankQrcode (order) {
      this.bankQrCode = order?.bankQrCode
      this.$bvModal.show(MODAL.BANK_QRCODE)
    }
  }
}
