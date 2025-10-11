<template>
  <div>
    <div v-if="$device.isMobileOrTablet" class="dropdown-notify mr-3 position-relative" @click="$router.push('/notification')">
      <svg-icon icon="notification" @click="initialNotification" />
      <span v-if="notification?.totalBell" class="number position-absolute">{{ notification?.totalBell || 0 }}</span>
    </div>
    <b-dropdown v-else ref="dropdown" right class="dropdown-notify">
      <template #button-content>
        <div class="position-relative">
          <span class="icon-notification-bing icon" @click="initialNotification" />
          <span v-if="notification?.totalBell" class="number position-absolute">{{ notification?.totalBell || 0 }}</span>
        </div>
      </template>
      <div class="dropdown-notify__wrapper">
        <div class="dropdown-notify__top d-flex align-items-center justify-content-between">
          <div>
            <span class="dropdown-notify__total-bell grey-600 font-t20m mr-2">{{ notification?.totalBell || 0 }}</span>
            <span class="dropdown-notify__total-text grey-400 font-t14m mr-2">{{ $t('notification.news') }}</span>
            <span v-if="listNotification?.length" class="dropdown-notify__delete-text grey-400 font-t14m primary" role="button" @click="showModalDeleteNoti()"> {{ $t('notification.delete') }}</span>
          </div>
          <div class="dropdown-notify__button font-t14m" @click="onClose">{{ $t('notification.view') }}<span class="dropdown-notify__button-icon icon-chevron-right ml-1" /></div>
        </div>
        <div v-if="listNotification?.length" class="p-1">
          <div class="dropdown-notify__content">
            <div v-for="(item) in listNotification" :key="item.id" @click="notificationRead(item)">
              <NotificationItemMobile v-if="$device.isMobileOrTablet" :notification="item" :class="{'read': isCheckAddClass(item)}" />
              <NotificationItemDesktop v-else :notification="item" :class="{'read': isCheckAddClass(item)}" />
            </div>
          </div>
        </div>
        <div v-else class="dropdown-notify__content">
          <section class="no-data">
            <svg>
              <use xlink:href="#no-data" />
            </svg>
            <span>{{ $t('notification.nodata') }}</span>
          </section>
        </div>
      </div>
      <ModalDeleteNoti @delete-notification="onDeleteAllNotification" />
    </b-dropdown>
  </div>
</template>
<script>
import notificationListMixin from '@/mixins/notification/notification-list'
import NotificationItemMobile from '@/components/mobile/notification/notification-item'
import ModalDeleteNoti from '@/components/common/modal/modal-delete-notification.vue'
import NotificationItemDesktop from '@/components/desktop/notification/notification-item.vue'
export default {
  components: {
    ModalDeleteNoti,
    NotificationItemMobile,
    NotificationItemDesktop,
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [notificationListMixin],
  data () {
    return {
      items: [],
      totalBell: 0
    }
  },
  computed: {
    listNotification () {
      return this.notification.items
    }
  },
  methods: {
    async onDeleteAllNotification () {
      await this.getNotification()
      this.items = []
    },
    async initialNotification () {
      await this.getNotification()
    },
    onClose () {
      this.$router.push('/notification?tab=all')
      this.$refs.dropdown.hide(true)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/header/dropdown-notify.scss" />
