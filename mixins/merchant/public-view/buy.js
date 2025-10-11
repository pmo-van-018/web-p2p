import merchantPublicViewCommonMixin from '@/mixins/merchant/public-view/common.js'
import { POST_TYPE } from '@/config/constant'
import PostStatusMixin from '@/mixins/home/post-status';

export default {
  mixins: [merchantPublicViewCommonMixin, PostStatusMixin],
  data () {
    return {
      fields: [
        {
          key: 'asset',
          label: this.$t('merchant.public_view.command_type'),
          thStyle: {
            width: '20%'
          }
        },
        {
          key: 'price',
          label: this.$t('merchant.public_view.price_low_to_high')
        },
        {
          key: 'availableLimit',
          label: this.$t('merchant.public_view.available_limit')
        },
        {
          key: 'action',
          label: this.$t('merchant.public_view.action'),
          align: 'right',
          thStyle: {
            width: '15%'
          }
        }
      ]
    }
  },
  computed: {
    params () {
      return {
        page: this.page,
        limit: this.limit,
        fiat: 'VND',
        type: POST_TYPE.SELL
      }
    }
  },
  methods: {
    async $merchantPublicViewMixin_onReset () {
      this.$merchantPublicViewMixin_onResetStateFilter()
      await this.$merchantPublicViewMixin_getList()
    },
    async $commonOrderMixin_onChangePage (page, limit) {
      this.page = page
      this.limit = limit
      await this.$merchantPublicViewMixin_getList()
    }
  }
}
