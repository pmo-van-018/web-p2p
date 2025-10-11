import POST_API from '@/api/post.js';
import { ORDER_STATUS } from '@/config/constant'
import { LIST_STATUS_HISTORY } from '@/resources/merchant/orders-filter'
import { ORDER_TYPE } from '@/resources/order-type.js';

export default {
  data () {
    return {
      LIST_STATUS_HISTORY,
      ORDER_TYPE,
      page: 1,
      limit: 10,
      total: 0,
      post: null,
      isLoading: false,
      orders: []
    };
  },
  async mounted () {
    await Promise.all([this.getPostDetail(), this.getOrderByPost()])
  },
  computed: {
    getColor () {
      return this.post.postType === ORDER_TYPE.SELL
        ? 'sell-color'
        : 'buy-color';
    },
    getLowerFiat () {
      return (
        (this.post?.lowerFiatLimit || 0) |
        this.$options.filters.formatMoney(this.post.lowerFiatLimit)
      );
    },
    getUpperFiat () {
      return (
        (this.post?.upperFiatLimit || 0) |
        this.$options.filters.formatMoney(this.post.upperFiatLimit)
      );
    },
    getTotalAmount () {
      return this.$options.filters.formatCrypto((this.post?.totalAmount || 0), 2, 'round')
    },
    getAmountTransfer () {
      return this.$options.filters.formatCrypto((this.post?.finishedAmount || 0))
    }
  },
  methods: {
    getStatusText (status) {
      return status === ORDER_STATUS.CANCELLED ? this.$t('user_orders.status_cancel') : this.$t('user_orders.status_done')
    },
    onParamsChange (key, value) {
      this[key] = value
      this.getPostings()
    },
    async $_merchantManagerMixin_onParamsChange ({ page, limit }) {
      this.page = page;
      if (this.limit !== limit) {
        this.page = 1;
        this.limit = limit;
      }
      await this.getOrderByPost();
    },
    async getPostDetail () {
      this.isLoading = true
      try {
        const res = await this.$axios.$get(POST_API.GET_HISTORY_DETAIL(this.$route.params.id));
        this.post = res?.data
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    async getOrderByPost (isMobile) {
      this.isLoading = true
      try {
        const res = await this.$axios.$get(POST_API.GET_POST_ORDERS, {
          params: {
            limit: this.limit,
            page: this.page,
            id: this.$route.params.id
          }
        });
        const additionalOrders = res?.data?.items?.length ? res.data.items : []
        if (isMobile) {
          this.orders.push(...additionalOrders)
        } else {
          this.orders = additionalOrders
        }
        this.total = res?.data?.totalItems
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    }
  }
}
