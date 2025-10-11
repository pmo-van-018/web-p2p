import { POST_TYPE } from '@/config/constant';

export default {
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('postings.table.post_id'),
          subLabel: this.$t('postings.table.post_asset'),
          sortField: 'id',
          isSort: true,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'totalAmount',
          label: this.$t('postings_history.total_amount'),
          subLabel: '',
          sortField: 'amount',
          isSort: false,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'amount',
          label: this.$t('postings_history.total_amount_trans'),
          subLabel: this.$t('postings.table.success_percent'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'price',
          label: this.$t('postings_history.total_fee'),
          subLabel: this.$t('postings_history.total_penalty_fee'),
          sortField: 'totalFee',
          isSort: true,
          thStyle: {
            width: '9%'
          }
        },
        {
          key: 'updateAt',
          label: this.$t('postings.table.time_update'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10.8%'
          }
        },
        {
          key: 'status',
          label: this.$t('postings.table.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '6%',
            minWidth: '120px'
          }
        },
        {
          key: 'action',
          label: this.$t('postings.table.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '8%'
          }
        }
      ]
    };
  },
  methods: {
    getColor (postType) {
      return postType === POST_TYPE.SELL ? 'sell-color' : 'buy-color';
    }
  }
};
