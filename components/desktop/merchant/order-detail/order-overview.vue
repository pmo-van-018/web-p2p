<template>
  <div class="detail-intro">
    <div class="detail-intro__left">
      <div class="d-flex align-items-center ">
        <div class="d-flex w-100 align-items-center">
          <div v-if="orderDetail.postType === ORDER_TYPE.BUY" class="detail-name">{{ $t('merchant.transaction_detail.buy') }} {{ asset }}</div>
          <div v-else class="detail-name bearish-red">{{ $t('merchant.transaction_detail.sell') }} {{ asset }}</div>
          <div class="detail-id grey-600">#{{ refId }}</div>
        </div>
        <div class="detail-status font-t12m grey-600" :class="statusClass">{{ $t(status) }}</div>
      </div>
      <div class="d-flex mt-2">
        <div class="label grey-400">{{ $t('merchant.transaction_detail.time_create') }}</div>
        <div class="value grey-600">{{ createdTime }}</div>
      </div>
    </div>
    <div class="detail-intro__right">
      <span :id="`${orderDetail.orderId}-detail`" class="icon-cancel" @click="$emit('click')" />
      <b-tooltip v-show="active" :target="`${orderDetail.orderId}-detail`" triggers="hover" placement="top">
        <span>{{ $t('merchant.list_order.order_item.close_detail') }}</span>
      </b-tooltip>
      <div class="intro-row">
        <div class="label grey-400">{{ $t('merchant.transaction_detail.AD_code') }}</div>
        <div class="value d-flex grey-600">#{{ postRefId }} <CopyButton :id="`${orderDetail.orderId}-copy`" :value="postRefId" /></div>
      </div>
    </div>
  </div>
</template>
<script>
import { STATUS_ORDER_BUY, STATUS_ORDER_SELL } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import CopyButton from '@/components/common/copy-button.vue';
import { FULL_DATE_FORMAT } from '@/config/constant'
import dayjs from 'dayjs'
export default {
  components: { CopyButton },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ORDER_TYPE
    }
  },
  computed: {
    asset () {
      return this.orderDetail.asset || ''
    },
    orderId () {
      return this.orderDetail.orderId || ''
    },
    refId () {
      return this.orderDetail.orderRefId || ''
    },
    postRefId () {
      return this.orderDetail.postRefId || ''
    },
    createdTime () {
      return this.orderDetail.createdTime ? dayjs(this.orderDetail.createdTime).format(FULL_DATE_FORMAT) : ''
    },
    status () {
      return this.orderDetail.postType === ORDER_TYPE.SELL
        ? STATUS_ORDER_BUY[this.orderDetail.status].text
        : STATUS_ORDER_SELL[this.orderDetail.status].text
    },
    statusClass () {
      return STATUS_ORDER_BUY[this.orderDetail.status]?.name
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-overview.scss" />
