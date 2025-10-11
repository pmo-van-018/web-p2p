import { POST_TYPE } from '@/config/constant';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('postings.table.post_id'),
          subLabel: this.$t('postings.table.post_asset'),
          sortField: 'id',
          isSort: false,
          thStyle: {
            width: '20%'
          }
        },
        {
          key: 'availableAmount',
          label: this.$t('postings.table.available'),
          subLabel: this.$t('postings.table.limit'),
          sortField: 'amount',
          isSort: true,
          thStyle: {
            width: '20%'
          }
        },
        {
          key: 'amount',
          label: this.$t('postings.table.total_trans'),
          subLabel: this.$t('postings.table.success_percent'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '14%'
          }
        },
        {
          key: 'price',
          label: this.$t('postings.table.price_title'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10.5%'
          }
        },
        {
          key: 'transactionFee',
          label: this.$t('postings.table.transaction_fee'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10.5%'
          }
        },
        {
          key: 'updateAt',
          label: this.$t('postings.table.time_update'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '9.8%'
          }
        },
        {
          key: 'status',
          label: this.$t('postings.table.status'),
          subLabel: '',
          sortField: 'status',
          isSort: true,
          thStyle: {
            width: '8%',
            minWidth: '100px'
          }
        },
        {
          key: 'action',
          label: this.$t('postings.table.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '17%'
          }
        }
      ]
    };
  },
  computed: {
    ...mapState('resources', ['assets'])
  },
  methods: {
    getColor (postType) {
      return postType === POST_TYPE.SELL ? 'sell-color' : 'buy-color';
    },
    getPrecisionAsset (asset) {
      return this.assets.find(item => item.name === asset?.cryptoName && item.network === asset?.cryptoNetwork)?.precision
    }
  }
};
