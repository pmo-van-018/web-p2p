import { scrollTo } from '@/helper/scroll-to';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    redirectToMarketplace () {
      this.$router.push('/marketplace')
    },
    onScrollToTopCurrentPage () {
      if (this.$route.path === '/') {
        scrollTo(0, 800, () => {})
        return
      }
      this.$router.push('/')
    }
  }
}
