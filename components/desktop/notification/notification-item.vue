<template>
  <div
    :id="`notificationId${notification.id}`"
    class="notification-item d-flex justify-content-between"
    :class="{ active: isActive }"
    @click="notificationClick()"
  >
    <div class="pt-2 notification-item__left">
      <span class="icon-sms" />
      <p class="mb-1 notification-item__title font-t14b status-read">
        {{ notification.title ?? '' }}
      </p>
      <p class="grey-400 font-t14r mb-1 notification-item__text">
        {{ notification.description ?? '' }}
      </p>
    </div>
    <div
      class="font-t14m grey-600 notification-item__right d-flex align-items-center"
    >
      {{ formatDate(notification.createdAt) }}
    </div>
  </div>
  <!-- /item -->
</template>

<script>
import { FULL_DATE_FORMAT } from '@/config/constant'
import dayjs from 'dayjs'

export default {
  props: {
    notification: {
      type: Object,
      default: () => ({})
    },
    isShowNotification: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  mounted () {
    this.isActive = this.isShowNotification
  },
  methods: {
    notificationClick () {
      const link = this.notification.link || '/notification?tab=all'
      window.open(link, '_blank')
    },
    formatDate (date) {
      const todaysDate = dayjs();
      const timesDate = dayjs(date);
      const seconds = todaysDate.diff(timesDate, 'seconds')
      if (seconds === 0) {
        return 'Vài giây trước'
      }
      if (seconds <= 60 && seconds > 0) {
        return `${todaysDate.diff(timesDate, 'seconds')} Giây trước`
      }
      if (seconds > 60 && seconds <= 3600) {
        return `${todaysDate.diff(timesDate, 'minutes')} Phút trước`
      }
      if (seconds > 3600 && seconds <= 86400) {
        return `${todaysDate.diff(timesDate, 'hours')} Giờ trước`
      } else {
        return dayjs(date).format(FULL_DATE_FORMAT)
      }
    }
  }
}
</script>

<style
  lang="scss"
  scoped
  src="static/assets/scss/components/desktop/merchant/notification/item.scss"
/>
