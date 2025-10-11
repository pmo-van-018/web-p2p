import POST_API from '@/api/post.js';
import dayjs from 'dayjs'
import ModalSetPostingStatus from '@/components/common/modal/modal-set-posting-status.vue';
import { DATE_TIME_FORMAT } from '@/config/constant.js'

export default {
  components: { ModalSetPostingStatus },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      posts: [],
      sortBy: {
        orderField: '',
        orderDirection: ''
      },
      filter: {}
    };
  },
  async created () {
    await this.getPostings();
  },
  methods: {
    async onParamsChange ({ page, limit }) {
      this.page = page
      if (this.limit !== limit) {
        this.page = 1
      }
      this.limit = limit
      await this.getPostings()
    },
    onChangeFilter (filter) {
      this.filter = filter
      this.getPostings()
    },
    async getPostings () {
      try {
        this.isLoading = true
        const params = {
          postType: this.filter.type?.value,
          status: this.filter.status ? this.filter.status?.value : this.postStatus,
          assetName: this.filter.asset?.assetName,
          assetNetwork: this.filter.asset?.assetNetwork,
          startDate: this.filter.dateRange?.startDate ? dayjs(this.filter.dateRange.startDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
          endDate: this.filter.dateRange?.endDate ? dayjs(this.filter.dateRange.endDate).format(DATE_TIME_FORMAT.DATE_ONLY) : null,
          orderField: this.sortBy.orderField,
          orderDirection: this.sortBy.orderDirection,
          page: this.page,
          limit: this.limit
        }
        const res = await this.$axios.$get(POST_API.GET_LIST, {
          params
        });
        if (res?.data) {
          this.posts = res.data.posts;
          this.total = res.data.total;
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    }
  }
};
