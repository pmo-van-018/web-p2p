<template>
  <div class="item-transaction" :class="{'item-transaction--active' : itemActive}">
    <div v-if="!itemActive" class="content-item-transaction" @click="clickDetail()">
      <div class="content-seller" @click="onClickManagerInfo">
        <div class="content-avatar content-avatar--bg" :style="{ backgroundColor: backgroundAvatar }">
          <div class="status" :class="isOnline ? 'online' : 'offline'" />
          <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
          <p v-else class="text-avatar">{{ avatarChar }}</p>
        </div>
        <div class="content-person">
          <p class="text-seller">{{ manager.nickName }}</p>
          <div class="content-status">
            <p class="text-status">{{ manager.monthOrderCount }} {{ $t('home.command') }}</p>
            <div class="line" />
            <p class="text-status">{{ finishRate }}% {{ $t('home.finish') }}</p>
          </div>
        </div>
      </div>
      <div class="content-price">
        <p class="price"><span>{{ item.fiatSymbol }}</span> {{ price | formatCrypto(decimalLimit, 'ceil') }}</p>
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
      <div class="content-btn">
        <base-button
          v-if="type === POST_TYPE.SELL"
          variants="contained"
          color="success"
        >
          {{ $t('home.btn-buy') }}
        </base-button>
        <base-button
          v-else
          variants="contained"
          color="danger"
        >
          {{ $t('home.btn-sell') }}
        </base-button>
      </div>
    </div>
    <div v-if="itemActive" :class="{active: itemActive, sell: type === POST_TYPE.BUY}" class="content-detail-transaction">
      <div v-if="item" class="d-flex h-100">
        <PostItemInfo :item="item" :is-online="isOnline" />
        <PostItemDetailBuy
          v-if="type === POST_TYPE.SELL"
          :item="item"
          @cancel-transaction="$emit('cancel-transaction')"
        />
        <PostItemDetailSell
          v-else
          :item="item"
          @cancel-transaction="$emit('cancel-transaction')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import PostItemInfo from '@/components/desktop/list-post/post-item-info.vue';
import { POST_TYPE } from '@/config/constant';
import { getMerchantAvatar } from '@/helper/avatar-util';
import PostItemDetailBuy from './post-item-detail-buy.vue';
import PostItemDetailSell from './post-item-detail-sell.vue';
import { getUniqColor } from '~/helper';

export default {
  components: {
    PostItemInfo,
    PostItemDetailBuy,
    PostItemDetailSell,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: POST_TYPE.BUY
    },
    itemActive: {
      type: Boolean,
      default: false
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
    ...mapState('user', ['user']),
    backgroundAvatar () {
      if (this.avatar) {
        return 'none';
      }
      return getUniqColor(this.item.manager?.managerId || 0)
    },
    manager () {
      return this.item?.merchant;
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
    avatarChar () {
      return this.manager.nickName ? this.manager.nickName.charAt(0) : ''
    },
    avatar () {
      return getMerchantAvatar(this.manager.avatar)
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.item?.assetName && item.network === this.item?.assetNetwork)
    }
  },
  methods: {
    clickDetail () {
      if (this.user) {
        this.$emit('click-detail')
        return
      }
      this.$emit('on-authenticate')
    },
    onClickManagerInfo (e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      this.$router.push(`/merchant?ref=${this.manager.id}`)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/list-posts/post-item.scss" />
