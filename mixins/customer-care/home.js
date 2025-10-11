import { mapActions, mapState } from 'vuex'
import { USER_REQUEST_SUPPORT_API } from '@/api/user-request-support'
import { USER_ROLE } from '@/config/constant'
import { accountFaq, appealFaq, definitionsFaq, otherQuestion, transactionsFaq } from 'p2p-common/topics.json'
import authMixin from '~/mixins/auth'

export default {
  mixins: [authMixin],
  data () {
    return {
      isRequestSupportLoading: false,
      activatedComponent: 'ListFaq',
      activeDetailFaq: 'other',
      roomId: '',
      requestId: '',
      requestTypeText: '',
      faqCategories: [
        {
          key: 'definition',
          title: this.$t('customer_care.faq.title.info'),
          content: this.$t('customer_care.faq.content.info'),
          icon: '/assets/images/common/customer-care/faqs/introduction.svg'
        },
        {
          key: 'account',
          title: this.$t('customer_care.faq.title.account'),
          content: this.$t('customer_care.faq.content.account'),
          icon: '/assets/images/common/customer-care/faqs/account.svg'
        },
        {
          key: 'transfer',
          title: this.$t('customer_care.faq.title.transfer'),
          content: this.$t('customer_care.faq.content.transfer', { name: this.$config.BRAND_NAME || '' }),
          icon: '/assets/images/common/customer-care/faqs/transfer.svg'
        },
        {
          key: 'appeal',
          title: this.$t('customer_care.faq.title.appeal'),
          content: this.$t('customer_care.faq.content.appeal'),
          icon: '/assets/images/common/customer-care/faqs/appeal.svg'
        },
        {
          key: 'other',
          title: this.$t('customer_care.faq.title.other'),
          content: this.$t('customer_care.faq.content.other'),
          icon: '/assets/images/common/customer-care/faqs/other.svg'
        }
      ]
    }
  },
  computed: {
    ...mapState('chat-support-request', ['isVisibleChat', 'resolvedSupportRequest']),
    ...mapState('user', ['user']),
    faqs () {
      switch (this.activeDetailFaq) {
        case 'definition':
          return definitionsFaq
        case 'account':
          return accountFaq
        case 'transfer':
          return transactionsFaq
        case 'appeal':
          return appealFaq
        default:
          return otherQuestion
      }
    },
    questions () {
      return this.faqs?.[0]?.questions || []
    },
    title () {
      if (this.activatedComponent === 'DetailFaq') {
        return this.faqs?.[0]?.title || ''
      }
      return this.$t('customer_care.title')
    },
    isVisibleActionSupportRequest () {
      if (['DetailFaq', 'ListFaq'].includes(this.activatedComponent)) {
        return true
      }
      return this.resolvedSupportRequest
    },
    isListFaqComponent () {
      return this.activatedComponent === 'ListFaq'
    }
  },
  mounted () {
    if (this.user?.type === USER_ROLE.USER) {
      this.getRequestSupport()
    }
  },
  watch: {
    roomId: {
      handler (newRoomId) {
        if (newRoomId) {
          this.activatedComponent = 'ChatSupport'
        }
      }
    }
  },
  methods: {
    ...mapActions('chat-support-request', ['setVisibleChat', 'setMessages']),
    onSelectedFaq (item) {
      this.activeDetailFaq = item.key
      this.activatedComponent = 'DetailFaq'
    },
    onClickBack () {
      this.activatedComponent = 'ListFaq'
      this.requestTypeText = ''
    },
    async onSelectedChatSupport () {
      if (!this.user) {
        this.setVisibleChat(false)
        this.$emit('on-support-request')
        return
      }
      this.setMessages([])
      this.setResolveSupportRequest(false)
      await this.getRequestSupport()
      this.activatedComponent = 'ChatSupport'
    },
    onBackToSection () {
      if (this.isListFaqComponent) {
        this.setVisibleChat(false)
      } else {
        this.activatedComponent = 'ListFaq'
        this.requestTypeText = ''
      }
    },
    async getRequestSupport () {
      try {
        this.isRequestSupportLoading = true
        const { data } = await this.$axios.$get(USER_REQUEST_SUPPORT_API.GET_REQUEST)
        if (data) {
          this.roomId = data.roomId
          this.requestId = data.id
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isRequestSupportLoading = false
      }
    },
    async onRequestSupportToChat ({ text, value }) {
      try {
        const { data } = await this.$axios.$post(USER_REQUEST_SUPPORT_API.CREATE_REQUEST, {
          type: value
        })
        this.roomId = data.roomId
        this.requestId = data.id
        this.requestTypeText = this.$t(text)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
