<template>
  <div class="flex-grow-1 notification">
    <div class="notification__top d-flex justify-content-between align-items-center">
      <nuxt-link :to="linkRedirect" class="notification__top-left font-t14m d-flex align-items-center">
        <span class="icon-chevron-right1" />
        {{ $t('notification.title') }}
      </nuxt-link>
      <div class="notification__top-right">
        <span id="icon-check" class="icon-mail-box" :class="{'disabled': !notification.totalBell}" @click="handleClick()" />
        <div v-if="isShowChecked" class="pop-checked font-t14r grey-900 d-flex align-items-center"> <span id="icon-check" class="icon-mail-box" /> {{ $t('notification.check_read') }}</div>
        <span :class="['notification__icon-edit icon-edit-2', { active: isShowClick }]" @click="isShowSubToolbar = !isShowSubToolbar" />
        <div v-if="isShowSubToolbar" class="pop-toolbar">
          <span role="button" class="font-t14r grey-900 pop-toolbar__item d-block" @click="showSettingNotification()">{{ $t('notification.modalSetting.title') }}</span>
          <span role="button" class="font-t14r grey-900 pop-toolbar__item d-block" @click="isShowClick=!isShowClick; notificationHideReadMobile()"> {{ isShowClick ? $t('notification.show_notify') : $t('notification.hide_notify') }}</span>
          <span role="button" class="font-t14r grey-900 pop-toolbar__item d-block" @click="showModalDeleteNoti()">{{ $t('notification.delete') }}</span>
        </div>
      </div>
    </div>
    <div class="notification__tab mt-3">
      <span class="item font-t12m grey-900" :class="{'active': !tab}" @click="handleClickTab(null)">{{ $t('notification.tab.all') }} ({{ notification?.totalBell || 0 }})</span>
      <span class="item font-t12m grey-900" :class="{'active': tab===1}" @click="handleClickTab(1)">{{ $t('notification.tab.transaction') }} ({{ notification.totalTransaction || 0 }})</span>
      <span class="item font-t12m grey-900" :class="{'active': tab===2}" @click="handleClickTab(2)">{{ $t('notification.tab.system') }} ({{ notification.totalSystem || 0 }})</span>
    </div>
    <div class="notification__content">
      <client-only>
        <div v-if="listNotification.length" class="notification__list">
          <div v-for="item in listNotification" :key="item.id" @click="notificationRead(item)">
            <NotificationItem :notification="item" :is-show-notification="item.id == notificationIdQuery" :class="{'read': isCheckAddClass(item) }" />
          </div>
          <observer @intersect="onInfiniteLoadingNotification" />
        </div>
        <div v-else class="notification__list">
          <Nodata
            :title="$t('notification.nodata')"
          />
        </div>
      </client-only>
    </div>
    <ModalDeleteNoti @delete-notification="getNotification" />
    <SettingNotification />
  </div>
</template>

<script>
import Nodata from '@/components/common/no-data.vue'
import notificationListMixin from '@/mixins/notification/notification-list'
import ModalDeleteNoti from '@/components/common/modal/modal-delete-notification.vue'
import { USER_ROLE } from '@/config/constant';
import { mapState } from 'vuex';
import NotificationItem from './notification-item.vue';
export default {
  components: {
    Nodata,
    ModalDeleteNoti,
    NotificationItem,
    Observer: () => import('~/components/common/observer/index.vue')
  },
  mixins: [notificationListMixin],
  data () {
    return {
      isShowChecked: false,
      isShowSubToolbar: false,
      tab: null
    }
  },
  computed: {
    ...mapState('user', ['user']),
    listNotification () {
      return this.notification?.items || []
    },
    linkRedirect () {
      switch (this.user?.type) {
        case USER_ROLE.SUPER_ADMIN: {
          return '/dashboard'
        }
        case USER_ROLE.USER: {
          return '/marketplace'
        }
        case USER_ROLE.MERCHANT_MANAGER: {
          return '/merchant-manager/dashboard'
        }
        case USER_ROLE.MERCHANT_SUPPORTER: {
          return '/supporter/orders?status=pending'
        }
        case USER_ROLE.MERCHANT_OPERATOR: {
          return '/merchant/dashboard'
        }
        default: {
          return '/'
        }
      }
    }
  },
  methods: {
    showSettingNotification () {
      this.isShowSubToolbar = false
      this.openSettingNotification()
    },
    async handleClick () {
      if (this.notification?.totalBell) {
        this.isShowChecked = !this.isShowChecked
        if (this.notification.totalItem) {
          await this.notificationReadAll()
          setTimeout(() => {
            this.isShowChecked = false
          }, 3000);
        }
      }
    },
    async onInfiniteLoadingNotification () {
      if (!this.isLoadingListNotification && this.queryParams.page < this.notification.totalPages) {
        this.queryParams.page = this.queryParams.page + 1
        await this.getNotification(this.tab, true)
      }
    },
    handleClickTab (type) {
      this.tab = type
      this.queryParams.page = 1
      this.queryParams.type = type
      this.queryParams.limit = 10
      this.getNotification(type)
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/mobile/merchant/notification/index.scss" />
