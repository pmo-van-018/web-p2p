<template>
  <div class="post-item-info">
    <div class="content-seller">
      <div class="content-avatar content-avatar--bg" :style="{backgroundColor: backgroundAvatar }">
        <div class="status" :class="isOnline ? 'online' : 'offline'" />
        <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
        <p v-else class="text-avatar">{{ avatarChar }}</p>
      </div>
      <div class="content-status">
        <p class="text-seller">{{ manager.nickName }}</p>
        <p class="text-status">{{ manager.monthOrderCount }} {{ $t('home.command') }}</p>
        <div class="line" />
        <p class="text-status">{{ finishRate }}% {{ $t('home.finish') }}</p>
      </div>
    </div>
    <div class="content-info-amount">
      <div class="content-money">
        <div class="content-price">
          <p class="title-price">{{ $t('home.price') }}</p>
          <p class="price" :class="{'price--red': type === POST_TYPE.BUY }"><span>{{ item.fiatSymbol }}</span> {{ price | formatCrypto(decimalLimit, 'ceil') }}</p>
        </div>
        <div class="content-time">
          <p class="title-time">{{ $t('home.pay-time') }}</p>
          <p class="time">{{ item.paymentTimeLimit }} {{ $t('home.minute') }}</p>
        </div>
      </div>
      <div class="content-amount">
        <div class="content-limit">
          <p class="text-limit">{{ $t('home.available') }}</p>
          <p class="text-money">{{ availableAmount | formatCrypto }} {{ item.assetName }}</p>
        </div>
        <div class="content-limit">
          <p class="text-limit">{{ $t('home.limit') }}</p>
          <p class="text-money d-block"><span>{{ item.fiatSymbol }}</span>{{ minOrderAmount | formatMoney }} - <span>{{ item.fiatSymbol }}</span>{{ maxOrderAmount | formatMoney }}</p>
        </div>
      </div>
    </div>
    <p class="text-title-note">{{ $t('home.title-note') }}</p>
    <div class="font-t14r post-item-info__note">
      <p v-for="(notify, index) in notifies" :key="index" class="mb-1">{{ notify }}</p>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { POST_TYPE } from '@/config/constant';
import { getMerchantAvatar } from '@/helper/avatar-util';
import { getUniqColor } from '~/helper';
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: POST_TYPE.BUY
    },
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      POST_TYPE
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    backgroundAvatar () {
      return getUniqColor(this.item.merchant?.id || 0)
    },
    notifies () {
      if (!this.item.note) {
        return [this.$t('home.note-null')]
      }
      return this.item.note.split('\n');
    },
    manager () {
      return this.item.merchant;
    },
    maxOrderAmount () {
      return Math.ceil(this.item.maxOrderAmount);
    },
    minOrderAmount () {
      return Math.ceil(this.item.minOrderAmount);
    },
    availableAmount () {
      return this.item.availableAmount;
    },
    price () {
      return this.item.price;
    },
    finishRate () {
      return (this.manager.monthFinishRate * 100).toFixed(2)
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.item?.assetName && item.network === this.item?.assetNetwork)
    },
    avatarChar () {
      return this.manager.nickName ? this.manager.nickName.charAt(0) : ''
    },
    avatar () {
      return getMerchantAvatar(this.manager.avatar)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/list-posts/post-item-info.scss" />
