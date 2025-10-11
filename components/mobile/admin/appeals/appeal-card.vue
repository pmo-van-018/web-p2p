<template>
  <article class="appeal-card" @click="onOpenOrderDetail">
    <div class="appeal-card__container">
      <div class="appeal-card__head">
        <div class="appeal-card__inner">
          <div class="appeal-card__left">
            <order-type
              :post-type="postType"
              :name="order.assetName"
              :network="order.assetNetwork"
              is-horizontal
            />
            <div class="view-detail__text">
              #{{ order.id }}
            </div>
            <div class="view-detail__text">
              <order-status :order="order" />
            </div>
          </div>
          <div v-if="visibleOpenDetail" class="appeal-card__right" @click="onOpenOrderDetail">
            <div class="view-detail" @click="$_appealListingMixin_onOpenAppealDetail(appeal.id)">
              <div class="view-detail__content">
                <div class="view-detail__text">
                  {{ isPendingOrder ? $t('action.process_appeal') : $t('action.view_more') }}
                </div>
                <span class="view-detail__icon icon-chevron-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="appeal-card__body">
        <div class="appeal-card__body-content">
          <div class="card-content">
            <div class="card-content__container">
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.amount') }}</div>
                <div class="card-content__value">
                  <span>{{ order.fiatSymbol }}</span> {{ order.totalPrice | formatMoney }}
                </div>
              </div>
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('user_orders.amount_mobile') }}</div>
                <div class="card-content__value">
                  {{ order.amount | formatMoney }} <span>{{ order.assetName }}</span>
                </div>
              </div>
            </div>
            <div class="card-content__container">
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('admin.table.merchant') }}</div>
                <div class="card-content__value card-content__value--underline" @click="gotoDashboard(appeal.manager?.id)">
                  {{ appeal.manager?.nickName }}
                </div>
              </div>
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('admin.table.user') }}</div>
                <div class="card-content__value">
                  {{ appeal.user?.nickName }}
                </div>
              </div>
            </div>
            <div class="card-content__container">
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('admin.table.time_appeal') }}</div>
                <div class="card-content__value">
                  {{ appeal.createdAt | formatDateTime }}
                </div>
              </div>
              <div class="card-content___content">
                <div class="card-content__text">{{ $t('admin.table.ended_time') }}</div>
                <div
                  :class="[
                    'card-content__value',
                    isTimeOutAppeal ? 'highlight-timeout' : 'highlight-time'
                  ]"
                >
                  {{ formatCompleteTime }}
                </div>
              </div>
            </div>
            <div class="card-content__container">
              <appeal-processing :appeal="appeal" />
            </div>
          </div>
        </div>
      </div>
      <div class="appeal-card__footer">
        <slot name="action" :appeal="appeal"></slot>
      </div>
    </div>
  </article>
</template>
<script>
import appealListingMixin from '@/mixins/admin/appeals';
import dayjs from 'dayjs';
import { ORDER_STATUS, POST_TYPE } from '~/config/constant'

export default {
  components: {
    OrderType: () => import('~/components/desktop/orders/table/items/order-type.vue'),
    OrderStatus: () => import('~/components/desktop/orders/status/index.vue'),
    AppealProcessing: () => import('@/components/desktop/admin/appeals/processing/index.vue')
  },
  mixins: [appealListingMixin],
  props: {
    appeal: {
      type: Object,
      default: () => {}
    },
    visibleOpenDetail: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    order () {
      return this.appeal?.order || {}
    },
    postType () {
      return this.order?.postType === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY
    },
    isPendingOrder () {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.order?.status)
    },
    dateTime () {
      if (this.isPendingOrder) {
        return this.order?.endedTime || this.order?.completedTime
      }
      return this.order?.createdTime
    },
    fiatSymbol () {
      return this.order?.fiatSymbol || ''
    },
    isTimeOutAppeal () {
      return !dayjs().isBetween(this.appeal?.openAt, this.appeal?.completedAt, 'seconds', '[]') && !this.appeal.actualCloseAt
    },
    formatCompleteTime () {
      const completedAt = this.appeal.completedAt || ''

      if (this.isTimeOutAppeal) {
        return this.$t('admin.table.closed_time')
      }

      return this.$options.filters.formatDateTime(completedAt)
    }
  },
  methods: {
    onOpenOrderDetail () {
      if (this.isViewDetail) {
        this.$emit('on-open-detail', this.order)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/admin/appeals/appeal-card.scss">
</style>
