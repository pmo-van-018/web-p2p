import { SHIFT_MANAGEMENT } from '@/api/shift-management';
import { SHIFT_STATUS } from '@/constants/shift';

export default {
  data () {
    return {
      isSkeletonLoading: false,
      isLoading: false,
      shiftManagementList: [],
      page: 1,
      total: 0,
      limit: 10,
      orderField: 'checkIn',
      orderDirection: 'DESC',
      startDate: null,
      endDate: null,
      filterDateType: null,
      searchTextType: null,
      search: null
    };
  },
  computed: {
    filterOptions () {
      return {
        page: this.page,
        limit: this.limit,
        status: this.$route.query?.status === 'approved' ? SHIFT_STATUS.APPROVED : SHIFT_STATUS.FINISHED,
        ...(this.startDate) && { startDate: `${this.startDate}` },
        ...(this.endDate) && { endDate: `${this.endDate}` },
        ...(this.filterDateType) && { filterDateType: `${this.filterDateType}` },
        ...(this.search) && { search: `${this.search}` },
        ...(this.searchTextType) && { searchTextType: `${this.searchTextType}` },
        ...(this.orderDirection && this.orderField) && { orderField: `${this.orderField}` },
        ...(this.orderDirection && this.orderField) && { orderDirection: `${this.orderDirection}` }
      }
    }
  },
  methods: {
    async handleChangePagination ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$_commonShiftManagement_onGetOperatorShiftHistories()
    },
    async handleFilter ({ startDate, endDate, filterDateType, searchField, searchValue }) {
      this.page = 1
      this.startDate = startDate
      this.endDate = endDate
      this.filterDateType = filterDateType
      this.searchTextType = searchField
      this.search = searchValue
      await this.$_commonShiftManagement_onGetOperatorShiftHistories()
    },
    async handleChangeSort ({ sortField, sortDirection }) {
      this.page = 1
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.$_commonShiftManagement_onGetOperatorShiftHistories()
    },
    onSetTotalPendingShiftHistories () {
      if (this.$route.query?.status !== 'approved') {
        this.$emit('on-set-total-shift', this.total)
      }
    },
    async $_commonShiftManagement_onGetOperatorShiftHistories () {
      try {
        this.isLoading = true
        const { data } = await this.$axios.$get(SHIFT_MANAGEMENT.MANAGER_GET_LIST_SHIFT, {
          params: this.filterOptions
        })
        this.shiftManagementList = data?.items || []
        this.total = data?.totalItems || 0
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
