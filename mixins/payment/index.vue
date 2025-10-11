
<script>
import { BANK } from '@/resources/bank.js';
import { MODAL } from '@/resources/modal.js';
import { mapActions, mapState } from 'vuex';
import { USER_ROLE } from '@/config/constant';
import PAYMENTS_API from '@/api/payments';
import { mergeUniqueByProp } from '@/helper';
export default {
  components: {
    NoData: () => import('@/components/common/no-data.vue')
  },
  data () {
    return {
      BANK,
      MODAL,
      loading: false,
      page: 1,
      limit: 10,
      total: 0,
      totalPage: 0
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('payments', ['reloadTrigger', 'publicPayments']),
    isUser () {
      return this.user?.type === USER_ROLE.USER
    },
    isMobile () {
      return this.$device.isMobileOrTablet
    },
    isEmptyPayment () {
      return !this.publicPayments?.length
    },
    paymentView () {
      return this.publicPayments
    },
    isShowPagination () {
      return this.publicPayments?.length
    }
  },
  watch: {
    reloadTrigger (value) {
      this.getPayments()
    }
  },
  mounted () {
    this.getPayments()
  },
  methods: {
    ...mapActions('payments', ['setPaymentDetail', 'setPublicPayments', 'getPaymentMethodAvailability', 'setPaymentId']),
    getBankFromBankName (bankName) {
      return BANK.find(e => e.bankName === bankName);
    },
    async onEdit (item) {
      await this.setPaymentDetail(item)
      this.$bvModal.show(MODAL.ADD_BANK)
    },
    onDeleteSuccess () {
      this.page = 1
      this.getPayments()
    },
    onChangePagination (page) {
      this.page = page
      this.getPayments()
    },
    onChangeLimit (limit) {
      this.limit = limit
      this.page = 1
      this.getPayments()
    },
    async getMorePayment () {
      if (!this.loading && this.page < this.totalPage) {
        this.page = this.page + 1
        await this.getPayments()
      }
    },
    async getPayments () {
      this.loading = true
      try {
        const api = this.isUser ? PAYMENTS_API.USER_PUBLIC_LIST : PAYMENTS_API.LIST
        const { data } = await this.$axios.$get(api, {
          params: {
            page: this.page,
            limit: this.limit
          }
        })
        const items = this.isMobile ? mergeUniqueByProp(this.publicPayments, data.items, 'id') : data.items
        this.setPublicPayments(items)
        this.total = data?.totalItems || 0
        this.totalPage = data?.totalPages || 0
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
