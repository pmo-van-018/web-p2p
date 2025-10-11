import POST_API from '@/api/post.js';
import { MODAL } from '@/resources/modal.js';
import { LIST_STATUS } from '@/resources/postings-management';
import ModalSetPostingStatus from '@/components/common/modal/modal-set-posting-status.vue';
import { POST_STATUS, POST_STATUS_TYPE } from '@/constants/posts'
import { mapActions, mapState } from 'vuex'
import { RESPONSE_ICON } from '@/resources/message'

export default {
  components: { ModalSetPostingStatus },
  data () {
    return {
      MODAL,
      postStatus: `${POST_STATUS.OFFLINE},${POST_STATUS.ONLINE}`,
      currentPost: {
        postId: '',
        isClosePost: false
      },
      currentModal: {}
    };
  },
  computed: {
    ...mapState('merchant-posting', ['currentPosting'])
  },
  methods: {
    ...mapActions('merchant-posting', ['onSetCurrentPost', 'toggleStatusPosting', 'closePosting']),
    ...mapActions('modal-response', ['showResponseModal']),
    statusText (status) {
      return status.toUpperCase() === LIST_STATUS.OFFLINE.name ? this.$t('postings.post_item.show') : this.$t('postings.post_item.hide')
    },
    onEdit (postId) {
      this.$router.push(`/merchant/posting-detail?id=${postId || this.currentPosting.id}`)
    },
    async onDelete (postId) {
      try {
        const res = await this.$axios.$put(POST_API.CLOSE(postId))
        if (res?.data) {
          await this.getPostings()
        }
      } catch (error) {
        console.error(error)
      }
    },
    showModalToggleDisplay (post) {
      this.onSetCurrentPost({
        id: post.id,
        isClose: false,
        status: post.status
      })
      this.$bvModal.show(MODAL.SET_POSTING_STATUS)
    },
    showModalClosePost () {
      this.$bvModal.show(MODAL.SET_POSTING_STATUS)
    },
    onClosePost (postId) {
      this.onSetCurrentPost({
        id: postId,
        isClose: true,
        status: POST_STATUS_TYPE.CLOSE
      })
      this.$bvModal.show(MODAL.SET_POSTING_STATUS)
    },
    async onToggleStatusPosting () {
      try {
        this.$bvModal.hide(MODAL.TOOLBAR)
        this.$bvModal.hide(MODAL.SET_POSTING_STATUS)
        const { status, id } = this.currentPosting
        let res = null
        if (status === POST_STATUS_TYPE.CLOSE) {
          res = await this.closePosting(id)
        } else {
          res = await this.toggleStatusPosting({ id, status })
        }
        if (res?.errors?.length) {
          this.handleError(res?.errors[0]?.key)
        }
      } catch (error) {
        console.log(error)
        this.handleError(error?.response?.data?.errors?.[0]?.key)
      }
    },
    handleError (key) {
      this.showResponseModal({
        title: '',
        content: this.$t('modal.message.merchant_postings_update_failed'),
        description: this.$t(`modal.message.${key || 'error_system'}`),
        icon: RESPONSE_ICON.POST_FAILED,
        show: true
      })
    }
  }
};
