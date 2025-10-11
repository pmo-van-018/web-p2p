<template>
  <div
    class="notification-item"
    :class="{ active: isActive }"
    @click="NotificationClick()"
  >
    <div class="pt-2 notification-item__left">
      <span class="icon-sms" />
      <p class="mb-1 notification-item__title font-t14m status-read">
        {{ notification.title ?? '' }}
      </p>
      <p class="grey-400 font-t14r mb-1 notification-item__text">
        {{ notification.description ?? '' }}
      </p>
      <p class="font-t12r grey-400 mb-0">{{ formatDate(notification.createdAt) ?? '' }}</p>
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
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    NotificationClick () {
      if (this.notification?.link) {
        if (this.$device.isAndroid) {
          this.$router.push(this.notification.link)
        } else {
          window.open(this.notification.link, '_blank')
        }
      } else {
        this.$router.push(`/notification?id=${this.notification.id}`)
      }
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
  src="static/assets/scss/components/mobile/merchant/notification/item.scss"
/>
