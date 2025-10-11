<template>
  <div class="history">
    <div class="history__filter">
      <div class="history__filter-item" :class="{'history__filter-item--active': showTypeFilter || typeSelected}" @click="showFilter('type')">
        {{ $t('user_orders.list_type') }}
        <span class="icon-triangle-down" />
      </div>
      <div class="history__filter-item" :class="{'history__filter-item--active': showStatusFilter || statusSelected}" @click="showFilter('status')">
        {{ $t('user_orders.list_status') }}
        <span class="icon-triangle-down" />
      </div>
      <div class="history__filter-item" @click="showCalendar">
        <img src="/assets/images/common/calendar.svg">
      </div>
    </div>
    <SelectFilter v-if="showTypeFilter" key="type-filter" v-model="typeSelected" :list="listType" />
    <SelectFilter v-if="showStatusFilter" key="status-filter" v-model="statusSelected" :list="listStatus" />
    <div class="history__list">
      <OrderItem v-for="order in listOrders" :key="order.orderId" :order="order" @go-detail="goDetail" />
    </div>
    <Calendar ref="calendar" v-model="dateRange" />
  </div>
</template>

<script>
import SelectFilter from '@/components/mobile/user-orders/select-filter.vue';
import OrderItem from '@/components/mobile/user-orders/order-item.vue';
import Calendar from '@/components/mobile/modal/calendar/index.vue';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { mapActions } from 'vuex';
import { convertToStringQuery } from '@/helper/index';
export default {
  components: {
    OrderItem,
    SelectFilter,
    Calendar
  },
  mixins: [userBuyOrderMixin],
  data () {
    return {
      listOrders: [],
      listType: [
        {
          value: ORDER_TYPE.BUY,
          title: this.$t('common.buy')
        },
        {
          value: ORDER_TYPE.SELL,
          title: this.$t('common.sell')
        }
      ],
      listStatus: [
        {
          value: STATUS_ORDER_BUY.CANCELLED.value,
          title: this.$t('common.status.cancelled')
        },
        {
          value: STATUS_ORDER_BUY.COMPLETED.value,
          title: this.$t('common.status.completed')
        }
      ],
      typeSelected: null,
      statusSelected: null,
      showTypeFilter: false,
      showStatusFilter: false,
      dateRange: null
    };
  },
  computed: {
  },
  watch: {
    typeSelected: {
      handler () {
        this.showTypeFilter = false
        this.fetchData();
      },
      deep: true
    },
    statusSelected: {
      handler () {
        this.showStatusFilter = false
        this.fetchData();
      },
      deep: true
    },
    dateRange: {
      handler () {
        this.fetchData();
      },
      deep: true
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapActions('end-user', [
      'getListOrder'
    ]),
    async fetchData () {
      const query = {
        orderStatus: [
          STATUS_ORDER_BUY.COMPLETED.value,
          STATUS_ORDER_BUY.CANCELLED.value
        ],
        limit: 10,
        page: 1
      }
      if (this.typeSelected) {
        query.type = this.typeSelected.value
      }
      if (this.statusSelected) {
        query.orderStatus = this.statusSelected.value
      }
      if (this.dateRange && this.dateRange.startDate && this.dateRange.endDate) {
        const startDate = `${this.dateRange.startDate.substring(6, 10)}-${this.dateRange.startDate.substring(0, 2)}-${this.dateRange.startDate.substring(3, 5)}`
        const endDate = `${this.dateRange.endDate.substring(6, 10)}-${this.dateRange.endDate.substring(0, 2)}-${this.dateRange.endDate.substring(3, 5)}`
        if (endDate > startDate) {
          query.startDate = startDate
          query.endDate = endDate
        } else {
          query.startDate = endDate
          query.endDate = startDate
        }
      }
      const result = await this.getListOrder(convertToStringQuery(query));
      if (result?.data) {
        this.listOrders = result.data.orders
      }
    },
    goDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    },
    showFilter (filter) {
      if (filter === 'type') {
        this.showStatusFilter = false
        this.showTypeFilter = !this.showTypeFilter
      } else if (filter === 'status') {
        this.showTypeFilter = false
        this.showStatusFilter = !this.showStatusFilter
      }
    },
    showCalendar () {
      this.$refs.calendar.showPopup()
    }
  }

};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/user-orders/history.scss" />
