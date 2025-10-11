<template>
  <div class="detail-header">
    <div class="detail-header__container">
      <div class="detail-header__head" @click="onBackAppealListing">
        <span class="detail-header__icon icon-chevron-right1" />
        <h3 class="detail-header__title">
          {{ $t('admin.appeal_title') }} <span :class="orderTypeClass">{{ orderTypeText }}</span> {{ assetText }}
        </h3>
      </div>
      <div class="detail-header__content">
        <div class="detail-header__context">
          <div class="detail-header__command">
            <div class="detail-header__command-text">{{ $t('user_orders.code_command') }}:</div>
            <div class="detail-header__command-number">#{{ refId }}</div>
            <div class="detail-header__command-copy">
              <copy-button id="orderId" :value="refId" />
            </div>
          </div>
        </div>
        <div class="detail-header__context">
          <div class="detail-header__command detail-header__datetime">
            <span>{{ $t('admin.time_create') }}</span>
            {{ createAtOrder }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TRADE_TYPE, USER_ROLE } from '@/config/constant'
import { mapState } from 'vuex'

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('user', ['user']),
    refId () {
      return this.order?.id || 0
    },
    createAtOrder () {
      const createdAt = this.order?.createdTime
      return createdAt ? this.$options.filters.formatDateTime(createdAt) : ''
    },
    orderTypeClass () {
      return this.orderType === TRADE_TYPE.BUY ? 'buy' : 'sell'
    },
    orderType () {
      return this.order?.type
    },
    assetName () {
      return this.order?.assetName || ''
    },
    assetNetwork () {
      return this.order?.assetNetwork || ''
    },
    status () {
      return this.order?.status || ''
    },
    orderTypeText () {
      return this.orderType === TRADE_TYPE.BUY ? this.$t('common.buy') : this.$t('common.sell')
    },
    assetText () {
      return `${this.assetName}-${this.assetNetwork}`
    }
  },
  methods: {
    onBackAppealListing () {
      if (this.user?.type === USER_ROLE.ADMIN_SUPPORTER) {
        this.$router.push({ name: 'admin-supporter-list-appeals' })
        return;
      }
      this.$router.push({ name: 'appeals' })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeal-detail/header/index.scss">
</style>
