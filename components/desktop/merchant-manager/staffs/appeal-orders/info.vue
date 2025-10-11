<template>
  <section>
    <div class="head-navigation">
      <nuxt-link class="head-navigation__link" to="/merchant-manager/staffs">
        <span class="head-navigation__icon icon-chevron-right1" />
        <h2 class="head-navigation__header">{{ title || $t('role_management.list_waiting_orders') }}</h2>
      </nuxt-link>
    </div>
    <div class="user-info">
      <div class="user-info__content limit-width">
        <div class="user-info__inner">
          <div class="user-info__item">
            <div class="user-info__name">{{ nickName }}</div>
            <div class="user-address">
              <div class="user-address__title">{{ $t('role_management.label.wallet_address') }}:</div>
              <div class="user-address__value">{{ walletAddress }}</div>
            </div>
          </div>

          <div class="user-info__item">
            <div>
              <div>
                <span class="font-t12r grey-400">{{ $t('role_management.label.time_create') }}:</span>
                <span class="font-t12m grey-900 ml-1">{{ createdAt | formatDateTime }}</span>
              </div>
              <div>
                <span class="font-t12r grey-400">{{ $t('role_management.label.time_update') }}:</span>
                <span class="font-t12m grey-900 ml-1">{{ updatedAt | formatDateTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { USER_STATUS } from '@/config/constant';

export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    nickName () {
      return this.info?.nickName || ''
    },
    walletAddress () {
      return this.info?.walletAddress || ''
    },
    createdAt () {
      return this.info?.createdAt || ''
    },
    updatedAt () {
      return this.info?.updatedAt || ''
    },
    statusText () {
      if (this.info?.deletedAt) {
        return this.$t('role_management.item.deleted')
      }
      return this.info?.status === USER_STATUS.INACTIVE
        ? this.$t('role_management.item.inactive')
        : this.$t('role_management.item.active')
    },
    statusClass () {
      if (this.info?.deletedAt) {
        return 'deleted'
      }
      return this.info?.status?.toLowerCase()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/appeal-orders/info.scss">
</style>
