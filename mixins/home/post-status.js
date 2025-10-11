import { mapActions, mapState } from 'vuex';
import { CHECK_ONLINE_POST_INTERVAL } from '@/config/constant';

export default {
  data () {
    return {
      onlineStatusInterval: null
    };
  },
  computed: {
    ...mapState('post', ['postStatus'])
  },
  mounted () {
    this.getStatusByPostInterval();
  },
  beforeDestroy () {
    clearInterval(this.onlineStatusInterval)
  },
  methods: {
    ...mapActions('post', ['getPostStatus']),
    getStatusByPostInterval () {
      this.onlineStatusInterval = setInterval(() => {
        this.getPostStatus()
      }, CHECK_ONLINE_POST_INTERVAL);
    },
    checkPostOnline (postId) {
      return this.postStatus?.includes(postId)
    }
  }
};
