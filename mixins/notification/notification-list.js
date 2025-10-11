import { mapActions, mapState } from 'vuex'
import { MODAL } from '@/resources/modal';
import NOTIFICATION_API from '@/api/notification'
import Pagination from '@/components/common/pagination.vue'
import SettingNotification from '@/components/common/modal/modal-setting-notification.vue'
import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from '@/constants/notification.js'
import { mergeByProp } from '~/helper';

export default {
  components: {
    Pagination,
    SettingNotification
  },
  data () {
    return {
      isCheckbox: false,
      isShowClick: false,
      isEnableReadAll: false,
      status: null,
      notificationIdQuery: null,
      total: 0,
      isLoadingListNotification: false,
      queryParams: {
        limit: 10,
        page: 1,
        status: null,
        type: null
      }
    }
  },
  mounted () {
    this.notificationIdQuery = this.$route?.query?.id
  },
  computed: {
    ...mapState(['notification'])
  },
  methods: {
    ...mapActions('notification', ['setNotification', 'setTotalBell', 'setTotalSystem', 'setTotalTransaction', 'setTotalNotification', 'setTotalPages']),
    showModalDeleteNoti () {
      this.isShowSubToolbar = !this.isShowSubToolbar
      this.$bvModal.show(MODAL.Delete_Noti)
    },
    openSettingNotification () {
      this.$bvModal.show(MODAL.SETTING_NOTIFICATION);
    },
    async getNotification (type = null, isMergeNotification = false) {
      const { tab } = this.$route?.query
      this.isLoadingListNotification = true
      this.queryParams.type = NOTIFICATION_TYPE[tab?.toUpperCase()] || type
      try {
        const { data } = await this.$axios.$get(NOTIFICATION_API.NOTIFICATION, { params: this.queryParams })
        if (data) {
          this.total = data?.totalItems || 0
          this.setTotalNotification(data?.totalItems || 0)
          this.setTotalBell(data?.totalUnread || 0)
          this.setTotalSystem(data?.systemUnread || 0)
          this.setTotalTransaction(data?.transactionUnread || 0)
          this.setTotalPages(data?.totalPages || [])
          this.isLoadingListNotification = false
          const unreadNotifications = (data?.items ?? []).map(item => ({
            ...item,
            unread: item?.notificationUsers?.some(notificationUser => notificationUser?.status === NOTIFICATION_STATUS.UNREAD)
          }));
          if (isMergeNotification) {
            this.setNotification(mergeByProp(this.notification.items, unreadNotifications, 'id'))
          } else {
            this.setNotification(unreadNotifications)
          }
        }
      } catch (error) {
        this.isLoadingListNotification = false
      }
    },
    async notificationRead (dataItem) {
      if (!dataItem?.unread) {
        return
      }
      const { id } = dataItem
      try {
        const { errors } = await this.$axios.$put(`${NOTIFICATION_API.NOTIFICATION_READ_ONE}/${id}`, { status: 1 })
        if (!errors?.length) {
          const notifications = this.notification?.items?.map(item =>
            item.id === id
              ? { ...item, unread: false }
              : item
          );
          const updatedData = this.notification?.items?.find(e => e.id === id)
          this.setNotification(notifications || [])
          this.setTotalBell(this.notification?.totalBell - 1)
          if (updatedData.type === 1) {
            this.setTotalTransaction(this.notification?.totalTransaction - 1)
          } else {
            this.setTotalSystem(this.notification?.totalSystem - 1)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async notificationReadAll () {
      try {
        await this.$axios.$put(`${NOTIFICATION_API.NOTIFICATION_READ_ALL}`)
        const updatedData = this.notification?.items?.map((item) => {
          return {
            ...item, unread: false
          }
        });
        this.setNotification(updatedData || [])
        this.setTotalBell(0)
        this.setTotalBell(0)
        this.setTotalSystem(0)
        this.setTotalTransaction(0)
        this.isEnableReadAll = false
      } catch (error) {
        console.log(error)
      }
    },
    async notificationHideRead () {
      let status = null
      if (this.isCheckbox) {
        status = 0
      }
      this.queryParams.page = 1
      this.queryParams.status = status
      await this.getNotification()
    },
    async notificationHideReadMobile () {
      this.isShowSubToolbar = !this.isShowSubToolbar
      let status = null
      if (this.isShowClick) {
        status = 0
      }
      this.queryParams.status = status
      await this.getNotification()
    },
    async handlePage (page, type = null) {
      this.queryParams.page = page
      await this.getNotification(type)
    },
    isCheckAddClass (data) {
      return !data?.unread
    },
    handleScroll (type) {
      const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
      if (endOfPage && this.notification?.totalItem > this.queryParams?.limit) {
        this.queryParams.limit += 10
        this.handlePage(1, type)
      }
    }
  }
}
