import { POST_STATUS } from '@/constants/posts';
export default {
  data () {
    return {
      postStatus: POST_STATUS.CLOSED
    };
  },
  methods: {
    async handleChangeSort (value) {
      this.sortBy.orderField = value.sortField
      this.sortBy.orderDirection = value.sortDirection
      await this.getPostings()
    }
  }
}
