import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('post', [
      'setPostClone'
    ]),
    handleClonePost (postId) {
      this.setPostClone(postId);
      this.$router.push('/merchant/create-ad')
    }
  }
}
