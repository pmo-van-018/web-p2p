<template>
  <div class="order-pending">
    <div class="order-pending__toolbar">
      <div class="order-pending__filter">
        <Dropdown
          v-model="typeSelected"
          :list="listType"
          :placeholder="$t('user_orders.list_type')"
        />
        <Dropdown
          v-model="statusSelected"
          :list="listStatusDisplay"
          class="order-pending-custom"
          :placeholder="$t('user_orders.list_status')"
        />
        <div class="order-pending__search-container">
          <input v-model="keywordSearch" class="order-pending__search" :placeholder="$t('user_orders.placeholder')">
          <span class="icon-search-outline" />
        </div>
        <div class="order-pending__reset" @click="reset">{{ $t('user_orders.setting_filter') }}</div>
      </div>
      <div class="order-pending__refresh" @click="refresh">
        <span class="icon-loading" :class="{'spin': inRefresh}"><span class="path1" /><span class="path2" /></span>
        {{ $t('user_orders.btn-refresh') }}
      </div>
    </div>
    <div class="order-pending__list">
      <div class="order-pending__list-header">
        <div class="history__list-header-item">
          <div class="c-btn-sort__wrapper">
            {{ $t('user_orders.code_command') }}
            <span class="c-btn-sort" @click="sort(FIELD_SORT.ID)">
              <span role="button" class="icon-sort-decrease" :class="{'c-btn-sort__item--hide': fieldSort === FIELD_SORT.ID && typeSort !== TYPE_SORT.DESC}" />
              <span role="button" class="icon-sort-increase" :class="{'c-btn-sort__item--hide': fieldSort === FIELD_SORT.ID && typeSort !== TYPE_SORT.ASC}" />
            </span>
          </div>
        </div>
        <!-- item -->
        <div class="history__list-header-item">
          <div class="c-btn-sort__wrapper">
            {{ $t('user_orders.amount') }}
            <span class="c-btn-sort" @click="sort(FIELD_SORT.AMOUNT)">
              <span role="button" class="icon-sort-decrease" :class="{'c-btn-sort__item--hide': fieldSort === FIELD_SORT.AMOUNT && typeSort !== TYPE_SORT.DESC}" />
              <span role="button" class="icon-sort-increase" :class="{'c-btn-sort__item--hide': fieldSort === FIELD_SORT.AMOUNT && typeSort !== TYPE_SORT.ASC}" />
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
          {{ $t('user_orders.process-label') }}
        </div>
      </div>
      <OrderItem
        v-for="order in listOrders"
        :key="order.orderId"
        :order="order"
        @go-detail="goDetail"
      />
    </div>
    <div class="order-pending__footer">
      <div class="order-pending__page">
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
  </div>
</template>

<script>
import Dropdown from '@/components/common/dropdown.vue';
import Pagination from '@/components/common/pagination.vue';
import OrderItem from '@/components/desktop/user-orders/order-item.vue';
import userBuyOrderMixin from '@/mixins/user-buy-order'
import { mapActions } from 'vuex';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { convertToStringQuery } from '@/helper/index';
import { FIELD_SORT, TYPE_SORT } from '@/config/constant.js';
export default {
  components: {
    Dropdown,
    Pagination,
    OrderItem
  },
  mixins: [userBuyOrderMixin],
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
          value: 1,
          title: this.$t('common.status.unpaid'),
          status: STATUS_ORDER_BUY.TO_BE_PAID.value,
          type: [ORDER_TYPE.BUY]
        },
        {
          value: 2,
          title: this.$t('common.status.confirm'),
          status: STATUS_ORDER_BUY.CONFIRM_PAID.value,
          type: [ORDER_TYPE.BUY, ORDER_TYPE.SELL]
        },
        {
          value: 3,
          title: this.$t('common.status.paid'),
          status: STATUS_ORDER_BUY.PAID.value,
          type: [ORDER_TYPE.BUY]
        },
        {
          value: 4,
          title: this.$t('common.status.undelivered'),
          status: STATUS_ORDER_BUY.TO_BE_PAID.value,
          type: [ORDER_TYPE.SELL]
        },
        {
          value: 5,
          title: this.$t('common.status.delivered'),
          status: STATUS_ORDER_BUY.PAID.value,
          type: [ORDER_TYPE.SELL]
        }
      ],
      listLimitRow: [
        {
          value: 2,
          title: '2'
        },
        {
          value: 30,
          title: '30'
        },
        {
          value: 50,
          title: '50'
        },
        {
          value: 100,
          title: '100'
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
      inRefresh: false,
      keywordSearch: '',
      lastFetch: 0,
      timeoutFetch: null,
      firstFetch: true,
      fieldSort: '',
      typeSort: '',
      FIELD_SORT,
      TYPE_SORT
    };
  },
  computed: {
    listStatusDisplay () {
      return !this.typeSelected ? this.listStatus : this.listStatus.filter(item => item.type.includes(this.typeSelected.value))
    }
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
        if (this.statusSelected && !this.statusSelected.type.includes(this.typeSelected.value)) {
          this.statusSelected = null
        }
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
    currentPage () {
      this.fetchData();
    },
    keywordSearch () {
      this.fetchData();
    }
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    ...mapActions('end-user', ['setBuyInfo', 'getListOrder']),
    async fetchData () {
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
            STATUS_ORDER_BUY.TO_BE_PAID.value,
            STATUS_ORDER_BUY.CONFIRM_PAID.value,
            STATUS_ORDER_BUY.PAID.value
          ],
          limit: this.limitRowSelected.value,
          page: this.currentPage
        };
        if (this.typeSelected) {
          query.type = this.typeSelected.value
        }
        if (this.statusSelected) {
          if (!this.typeSelected && this.statusSelected.status !== STATUS_ORDER_BUY.CONFIRM_PAID.value) {
            query.type = this.statusSelected.type[0]
          }
          query.orderStatus = this.statusSelected.status
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
          this.totalOrders = result.data.total;
          this.listOrders = result.data.orders;
          if (this.firstFetch) {
            this.firstFetch = false
            this.$emit('fetch-number-order', result.data.total)
          }
        }
      }
    },
    handlePage (page) {
      this.currentPage = page;
    },
    goDetail (order) {
      this.setBuyInfo(order)
      this.$_userBuyOrderMixin_fetchDataBuyInfo(true)
    },
    reset () {
      this.typeSelected = null
      this.statusSelected = null
      this.keywordSearch = ''
      this.limitRowSelected = {
        value: 30,
        title: '30'
      }
    },
    async refresh () {
      this.inRefresh = true
      await this.fetchData();
      this.inRefresh = false
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
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-orders/history.scss" />
