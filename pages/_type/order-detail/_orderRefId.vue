<template>
  <section>
    <component :is="component" />
    <completed-transaction-modal />
  </section>
</template>

<script>
import Base from '@/components/common/base.vue';
import hiddenMenuBottom from '@/mixins/hidden-menu-bottom.js';
import orderSocket from '@/mixins/order-socket';
import { mapState } from 'vuex';
import { ORDER_STATUS } from '@/config/constant';
import isEmpty from 'lodash/isEmpty';
import { ORDER_TYPE } from '@/resources/order-type';
export default {
  middleware: 'authenticated-user',
  components: {
    Desktop: () => import('@/components/desktop/user-order-detail'),
    Mobile: () => import('@/components/mobile/user-order-detail'),
    CompletedTransactionModal: () => import('@/components/common/modal/modal-completed-transaction.vue')
  },
  extends: Base,
  mixins: [hiddenMenuBottom, orderSocket],
  validate ({ params, redirect }) {
    const type = (params.type || '').toUpperCase()
    if ([ORDER_TYPE.BUY, ORDER_TYPE.SELL].includes(type)) {
      return true
    }
    return redirect('/')
  },
  computed: {
    ...mapState('end-user', ['buyOrderInfo']),
    isOrderCompleted () {
      return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.buyOrderInfo?.status)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== from.name) {
      if (isEmpty(this.buyOrderInfo) || this.isOrderCompleted) {
        next()
        return
      }
      this.$bvModal.show('modalCompletedTransaction')
      next(false)
    }
  }
};
</script>
