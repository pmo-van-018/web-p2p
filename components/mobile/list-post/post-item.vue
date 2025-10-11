<template>
  <div class="item-transaction">
    <div class="content-item-transaction">
      <div class="content-seller" @click="$router.push(`/merchant?ref=${manager.id}`)">
        <div class="content-person">
          <div class="content-avatar content-avatar--bg" :style="{backgroundColor: backgroundAvatar }">
            <div class="status" :class="isOnline ? 'online' : 'offline'" />
            <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
            <p v-else class="text-avatar">{{ avatarChar }}</p>
          </div>
          <p class="text-seller">{{ manager.nickName }}</p>
        </div>
        <p class="text-status">{{ manager.monthOrderCount }} {{ $t('home.command') }} | {{ rate }}%</p>
      </div>
      <p class="text-price">{{ $t('home.price') }}</p>
      <div class="content-price">
        <p class="price"><span class="mr-1">{{ item.fiatSymbol }}</span>{{ item.price | formatCrypto(decimalLimit, 'ceil') }}</p>
      </div>
      <div class="content-buy">
        <div class="content-amount">
          <div class="content-limit">
            <p class="text-limit">{{ $t('home.available') }}</p>
            <p class="text-money">{{ item.availableAmount | formatCrypto }} {{ item.assetName }}</p>
          </div>
          <div class="content-limit">
            <p class="text-limit">{{ $t('home.limit') }}</p>
            <p class="text-money d-block"><span>{{ item.fiatSymbol }}</span>{{ item.minOrderAmount | formatMoney }} - <span>{{ item.fiatSymbol }}</span>{{ item.maxOrderAmount | formatMoney }}</p>
          </div>
        </div>
        <base-button
          v-if="type === POST_TYPE.SELL"
          variants="contained"
          color="success"
          size="small"
          class="content-action"
          @click="transactionCrypto()"
        >
          {{ $t('home.btn-buy') }}
        </base-button>
        <base-button
          v-else
          variants="contained"
          color="danger"
          size="small"
          class="content-action"
          @click="transactionCrypto()"
        >
          {{ $t('home.btn-sell') }}
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { POST_TYPE } from '@/config/constant';
import { mapState } from 'vuex';
import postDetailMixin from '@/mixins/home/post-detail.js';
import { getMerchantAvatar } from '@/helper/avatar-util';
import { getUniqColor } from '~/helper';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [postDetailMixin],
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
      return getUniqColor(this.item.merchant?.managerId || 0)
    },
    rate () {
      return (this.manager.monthFinishRate * 100).toFixed(2)
    },
    manager () {
      return this.item.merchant
    },
    avatar () {
      return getMerchantAvatar(this.manager.avatar)
    },
    avatarChar () {
      return this.manager.nickName ? this.manager.nickName.charAt(0) : ''
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.item?.assetName && item.network === this.item?.assetNetwork)
    }
  },
  methods: {
    transactionCrypto () {
      this.$emit('click-detail', this.index)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/list-post/post-item.scss" />
