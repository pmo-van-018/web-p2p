import merchantPublicViewCommonMixin from '@/mixins/merchant/public-view/common.js'
import { POST_TYPE } from '@/config/constant'
import { mapState } from 'vuex';
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
          label: this.$t('merchant.public_view.price_high_to_low'),
          tdClass: 'nameOfTheClass'
        },
        {
          key: 'availableLimit',
          label: this.$t('merchant.public_view.available_limit')
        },
        {
          key: 'action',
          align: 'right',
          label: this.$t('merchant.public_view.action'),
          thStyle: {
            width: '15%'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('payments', ['payments']),
    params () {
      return {
        page: this.page,
        limit: this.limit,
        fiat: 'VND',
        type: POST_TYPE.BUY
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
