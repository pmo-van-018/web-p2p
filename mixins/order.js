import { ORDER_TYPE } from '@/resources/order-type.js';

export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ORDER_TYPE
    };
  },
  computed: {
    getAmount () {
      return (
        (this.post?.amount || 0) |
        this.$options.filters.formatCrypto(2, 'round')
      );
    },
    getPostType () {
      return this.post.postType?.toLowerCase();
    },
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
    }
  }
};
