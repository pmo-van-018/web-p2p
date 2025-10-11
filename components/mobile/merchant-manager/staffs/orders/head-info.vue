<template>
  <section class="head-info">
    <div class="head-info__container">
      <nuxt-link class="head-info__link" to="/merchant-manager/staffs">
        <span class="head-info__icon icon-chevron-right1" />
        <h2 class="head-info__header">{{ $t('role_management.list_waiting_orders') }}</h2>
      </nuxt-link>
      <div class="head-info__content">
        <div class="font-t16b grey-900 mb-2">{{ nickName }}</div>
        <swiper class="swiper" :options="swiperOption">
          <swiper-slide>
            <div class="d-flex flex-column">
              <div class="user-address">
                <div class="user-address__title">{{ $t('role_management.label.wallet_address') }}</div>
                <div class="user-address__value">#{{ walletAddress | formatHash }}</div>
                <div class="user-address__action">
                  <copy-button
                    :id="`wallet-address-copy`"
                    :value="walletAddress"
                    :text-guide="$t('role_management.label.copy_wallet_address')"
                  />
                </div>
              </div>
              <div class="mt-1 d-flex align-items-center">
                <div class="font-t12m grey-400">{{ $t('role_management.label.status') }}</div>
                <div :class="['font-t12m grey-400 ml-2', statusClass]">{{ statusText }}</div>
              </div>
            </div>
          </swiper-slide>
          <!-- <swiper-slide>
            <div class="d-flex flex-column">
              <div class="mt-2 d-flex align-items-center">
                <div class="font-t12m grey-400">{{ $t('role_management.label.order_waiting_count') }}</div>
                <div class="font-t12m yellow-900 ml-1">{{ totalOrderWaitingCount }}</div>
              </div>
              <div class="d-flex align-items-center">
                <div class="font-t12m grey-400">{{ $t('role_management.label.post_show_count') }}</div>
                <div class="font-t12m grey-900 ml-1">{{ postShownCount }}</div>
              </div>
            </div>
          </swiper-slide> -->
          <swiper-slide>
            <div class="d-flex flex-column">
              <div class="d-flex align-items-center">
                <div class="font-t12m grey-400">{{ $t('role_management.label.time_create') }}</div>
                <div class="font-t12m grey-900 ml-1">{{ createdAt | formatDateTime }}</div>
              </div>
              <div class="mt-2 d-flex align-items-center">
                <div class="font-t12m grey-400">{{ $t('role_management.label.time_update') }}</div>
                <div class="font-t12m grey-900 ml-1">{{ updatedAt | formatDateTime }}</div>
              </div>
            </div>
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination" />
        </swiper>
      </div>
    </div>
  </section>
</template>
<script>
import { USER_STATUS } from '@/config/constant';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      swiperOption: {
        direction: 'vertical',
        spaceBetween: 30,
        slidesPerView: 1,
        mousewheel: true,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
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
    orderWaitingCount () {
      return this.info?.statistic?.orderWaitingCount || 0
    },
    orderAppealCount () {
      return this.info?.statistic?.orderAppealCount || 0
    },
    orderWaitingUserCount () {
      return this.info?.statistic?.orderWaitingUserCount || 0
    },
    totalOrderWaitingCount () {
      return this.orderWaitingCount + this.orderAppealCount + this.orderWaitingUserCount
    },
    postShownCount () {
      return this.info?.statistic?.postShownCount || 0
    },
    statusText () {
      if (this.info?.deletedAt) {
        return this.$t('role_management.item.deleted');
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
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/orders/head-info.scss">
</style>
