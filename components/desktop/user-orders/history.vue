<template>
  <LayoutUserOrder>
    <section class="history">
      <div class="history__toolbar">
        <div class="history__filter">
          <Dropdown v-model="typeSelected" :list="listType" :placeholder="$t('user_orders.list_type')" />
          <Dropdown v-model="statusSelected" :list="listStatus" :placeholder="$t('user_orders.list_status')" />
          <DatePickerCustom v-model="dateRange" />
          <div class="order-pending__search-container">
            <input v-model="keywordSearch" class="order-pending__search" :placeholder="$t('user_orders.placeholder')">
            <span class="icon-search-outline" />
          </div>
          <div class="history__reset" @click="reset">
            {{ $t('user_orders.setting_filter') }}
          </div>
        </div>
        <div class="history__refresh" @click="refresh">
          <span class="icon-loading" :class="{'spin': inRefresh}"><span class="path1" /><span class="path2" /></span>
          {{ $t('user_orders.btn-refresh') }}
        </div>
      </div>
      <div class="history__list">
        <div class="history__list-header">
          <div class="history__list-header-item">
            <div class="c-btn-sort__wrapper">
              {{ $t('user_orders.code_command') }}
              <span class="c-btn-sort" @click="sort(FIELD_SORT.ID)">
                <span role="button" class="icon-sort-decrease" :class="getClassFilter(FIELD_SORT.ID, TYPE_SORT.DESC)" />
                <span role="button" class="icon-sort-increase" :class="getClassFilter(FIELD_SORT.ID, TYPE_SORT.ASC)" />
              </span>
            </div>
          </div>
          <!-- item -->
          <div class="history__list-header-item">
            <div class="c-btn-sort__wrapper">
              {{ $t('user_orders.amount') }}
              <span class="c-btn-sort" @click="sort(FIELD_SORT.AMOUNT)">
                <span role="button" class="icon-sort-decrease" :class="getClassFilter(FIELD_SORT.AMOUNT, TYPE_SORT.DESC)" />
                <span role="button" class="icon-sort-increase" :class="getClassFilter(FIELD_SORT.AMOUNT, TYPE_SORT.ASC)" />
              </span>
            </div>
            <span class="d-block mt-1">{{ $t('user_orders.amount_mobile') }}</span>
          </div>
          <!-- item -->
          <div class="history__list-header-item">
            {{ $t('user_orders.transaction_info') }}
          </div>
          <!-- item -->
          <div class="history__list-header-item">
            {{ $t('user_orders.completed-time') }}
          </div>
          <!-- item -->
          <div class="history__list-header-item">
            {{ $t('user_orders.list_status') }}
          </div>
          <!-- item -->
        </div>
        <OrderItem v-for="order in listOrders" :key="order.orderId" :order="order" />
      </div>
      <div class="history__footer">
        <div class="history__page">
          {{ $t('user_orders.pagination-title') }}
          <Dropdown
            v-model="limitRowSelected"
            :list="listLimitRow"
            placeholder=""
            class="page-limit-custom"
          />
        </div>
        <Pagination
          v-if="totalOrders > limitRowSelected.value"
          class="history-order-custom"
          :total="totalOrders"
          :current-page="currentPage"
          :per-page="limitRowSelected.value"
          @handle-page="handlePage"
        />
      </div>
    </section>
  </LayoutUserOrder>
</template>

<script>
import Dropdown from '@/components/common/dropdown.vue';
import DatePickerCustom from '@/components/common/date-picker-custom.vue'
import Pagination from '@/components/common/pagination.vue'
import OrderItem from '@/components/desktop/user-orders/order-item.vue';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapActions } from 'vuex';
import { convertToStringQuery } from '@/helper/index';
import { FIELD_SORT, TYPE_SORT } from '@/config/constant.js';
import dayjs from 'dayjs'
export default {
  components: {
    LayoutUserOrder: () => import('~/components/common/layout-user-order.vue'),
    Dropdown,
    DatePickerCustom,
    Pagination,
    OrderItem
  },
  data () {
    return {
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
      listLimitRow: [
        {
          value: 10,
          title: '10'
        },
        {
          value: 30,
          title: '30'
        },
        {
          value: 50,
          title: '50'
        }
      ],
      typeSelected: null,
      statusSelected: null,
      limitRowSelected: {
        value: 30,
        title: '30'
      },
      currentPage: 1,
      totalOrders: 0,
      listOrders: [],
      keywordSearch: '',
      inRefresh: false,
      inReset: false,
      lastFetch: 0,
      timeoutFetch: null,
      dateRange: {
        startDate: null,
        endDate: null
      },
      fieldSort: '',
      typeSort: '',
      FIELD_SORT,
      TYPE_SORT
    };
  },
  computed: {
  },
  watch: {
    limitRowSelected: {
      handler () {
        this.fetchData();
      },
      deep: true
    },
    typeSelected: {
      handler () {
        this.fetchData();
      },
      deep: true
    },
    statusSelected: {
      handler () {
        this.fetchData();
      },
      deep: true
    },
    dateRange: {
      handler () {
        if (this.dateRange.startDate && this.dateRange.endDate) {
          this.fetchData();
        }
      },
      deep: true
    },
    currentPage () {
      this.fetchData();
    },
    keywordSearch () {
      this.fetchData();
    }
  },
  mounted () {
    this.initDate()
  },
  methods: {
    ...mapActions('end-user', [
      'getListOrder'
    ]),
    async fetchData () {
      if (this.inReset) {
        return;
      }
      const currentTime = Number(new Date().getTime());
      if (currentTime < this.lastFetch + 1000) {
        if (!this.timeoutFetch) {
          this.timeoutFetch = setTimeout(() => {
            this.fetchData()
          }, 1000)
        }
      } else {
        this.timeoutFetch = null;
        this.lastFetch = currentTime;
        const query = {
          orderStatus: [
            STATUS_ORDER_BUY.COMPLETED.value,
            STATUS_ORDER_BUY.CANCELLED.value
          ],
          limit: this.limitRowSelected.value,
          page: this.currentPage,
          startDate: dayjs(this.dateRange.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(this.dateRange.endDate).format('YYYY-MM-DD')
        }
        if (this.typeSelected) {
          query.type = this.typeSelected.value
        }
        if (this.statusSelected) {
          query.orderStatus = this.statusSelected.value
        }
        if (this.keywordSearch) {
          query.search = this.keywordSearch
        }
        if (this.fieldSort) {
          query.orderField = this.fieldSort
          query.orderDirection = this.typeSort
        }
        const result = await this.getListOrder(convertToStringQuery(query));
        if (result?.data) {
          this.totalOrders = result.data.total
          this.listOrders = result.data.orders
        }
      }
    },
    handlePage (page) {
      this.currentPage = page
    },
    reset () {
      this.inReset = true
      this.typeSelected = null
      this.statusSelected = null
      this.keywordSearch = ''
      this.fieldSort = ''
      this.typeSort = ''
      this.limitRowSelected = {
        value: 30,
        title: '30'
      }
      setTimeout(() => {
        this.inReset = false
        this.initDate();
      }, 100)
    },
    async refresh () {
      this.inRefresh = true
      await this.fetchData();
      this.inRefresh = false
    },
    initDate () {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(today.getDate() - 30);
      this.dateRange.endDate = today;
      this.dateRange.startDate = lastMonth;
    },
    sort (field) {
      if (field === this.fieldSort) {
        if (this.typeSort === TYPE_SORT.ASC) {
          this.typeSort = TYPE_SORT.DESC
        } else {
          this.typeSort = TYPE_SORT.ASC
        }
      } else {
        this.fieldSort = field
        this.typeSort = TYPE_SORT.ASC
      }
      this.fetchData();
    },
    getClassFilter (field, type) {
      return this.fieldSort === field && this.typeSort !== type ? 'c-btn-sort__item--hide' : ''
    }
  }

};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-orders/history.scss" />
