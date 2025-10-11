<template>
  <div class="flex-grow-1 notification">
    <p class="notification__title font-t20b grey-900">{{ $t('notification.title') }}</p>
    <div class="notification__content">
      <div class="notification__toolbar d-flex justify-content-between">
        <div class="notification__read-acticon-group">
          <b-form-checkbox
            v-model="isCheckbox"
            class="primary notification__check-box font-t14b grey-900"
            @change="notificationHideRead()"
          >
            {{ $t('notification.hide_notify') }}
          </b-form-checkbox>
          <div class="mail-box" :class="{'disabled': !notification.totalBell}" @click="notificationReadAll()">
            <img :src="`/assets/icons/${icon}.svg`" alt="icon" class="notification__icon-item">
            {{ $t('notification.check_read') }}
          </div>
        </div>
        <div class="notification__icon-group">
          <svg-icon
            id="icon-setting"
            v-b-tooltip.hover
            :title="$t('notification.check_receive')"
            icon="setting"
            class="notification__icon-item"
            @click="openSettingNotification"
          />
          <svg-icon
            id="icon-trash"
            v-b-tooltip.hover
            icon="delete"
            :title="$t('notification.delete')"
            class="notification__icon-item"
            :class="{'disabled': !totalItem}"
            @click="showModalDeleteNoti"
          />
        </div>
      </div>
      <client-only>
        <div v-if="listNotification.length" class="notification__list">
          <div v-for="(item) in listNotification" :key="item.id" @click="notificationRead(item)">
            <NotificationItem :notification="item" :is-show-notification="item.id == notificationIdQuery" :class="{'read': isCheckAddClass(item) }" />
          </div>
        </div>
        <div v-else class="notification__list">
          <Nodata
            :title="$t('notification.nodata')"
          />
        </div>
        <PaginationLimit
          v-if="listNotification.length"
          class="content-pagination mt-3 d-flex justify-content-end"
          :total="totalItem"
          :current-page="queryParams.page"
          :per-page="queryParams.limit"
          :limit="queryParams.limit"
          :note="$t('notification.pagination_title')"
          @set-limit="onChangeLimit"
          @set-page="handlePage"
        />
        <SettingNotification />
      </client-only>
    </div>
  </div>
</template>

<script>
import darkMModeMixin from '@/mixins/dark-mode.js';
import notificationListMixin from '@/mixins/notification/notification-list'
import Nodata from '@/components/common/no-data.vue'
import PaginationLimit from '@/components/desktop/commons/pagination-limit'
import NotificationItem from './notification-item.vue'

export default {
  components: {
    Nodata,
    NotificationItem,
    PaginationLimit,
    SvgIcon: () => import('~/components/common/svg-icon/index.vue')
  },
  mixins: [notificationListMixin, darkMModeMixin],
  computed: {
    listNotification () {
      return this.notification?.items || []
    },
    totalItem () {
      return this.notification?.totalItem || 0
    },
    icon () {
      return this.isDarkMode ? 'opened-dark' : 'opened'
    }
  },
  watch: {
    '$route.query.tab': {
      handler (value) {
        if (value) {
          this.queryParams.page = 1
          this.getNotification()
        }
      },
      immediate: true
    }
  },
  methods: {
    onChangeLimit (limit) {
      this.queryParams.page = 1
      this.queryParams.limit = limit
      this.getNotification()
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/notification/index.scss" />
