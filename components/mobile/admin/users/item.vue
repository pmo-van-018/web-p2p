<template>
  <section class="card-item">
    <div :class="['card-item__container', { 'card-item__container--last': isLastItem }]">
      <div class="card-item__head">
        <span class="card-item__nickname">
          {{ item.nickName }}
        </span>
      </div>
      <div class="card-item__content">
        <div class="card-item__text">{{ $t('order_filter.wallet_address') }}</div>
        <div class="card-item__value">
          {{ item?.walletAddress | formatHash }}
          <copy-button
            :id="`wallet-address-copy-${item?.id}`"
            class="card-item__icon"
            :value="item?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
          <qr-code-button :id="item.id" :value="item?.walletAddress" class="card-item__icon" />
        </div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.buy_order') }}</div>
        <div class="card-item__value count-order sell-order">{{ item?.totalBuyOrderCount || 0 }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.sell_order') }}</div>
        <div class="card-item__value count-order buy-order">{{ item?.totalSellOrderCount || 0 }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.last_trade') }}</div>
        <div class="card-item__value">{{ formatDateTime(lastTradeDate) }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.last_login') }}</div>
        <div class="card-item__value">{{ formatDateTime(item.lastLoginAt) }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.created_at') }}</div>
        <div class="card-item__value">{{ formatDateTime(item.createdAt) }}</div>
      </div>
    </div>
  </section>
</template>
<script>
import dayjs from 'dayjs'

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue'),
    QrCodeButton: () => import('~/components/common/wallet-address-qrcode-button.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isLastItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    lastTradeDate () {
      if (this.item?.lastBuyOrder && this.item?.lastSellOrder) {
        return dayjs(this.item?.lastBuyOrder).isAfter(dayjs(this.item?.lastSellOrder)) ? this.item?.lastBuyOrder : this.item?.lastSellOrder
      }
      return this.item?.lastBuyOrder || this.item?.lastSellOrder
    }
  },
  methods: {
    formatDateTime (dateTime) {
      return dateTime ? `${dayjs(dateTime).format('YYYY-MM-DD')} • ${dayjs(dateTime).format('HH:mm:ss')}` : ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/users/item.scss">
</style>
