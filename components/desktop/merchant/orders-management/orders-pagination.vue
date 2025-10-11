<template>
  <div class="orders-pagination">
    <div class="perpage-selector">
      <div class="perpage-selector__text">{{ $t('merchant.list_order.order_pagination.limit_desc') }}</div>
      <b-dropdown class="perpage-selector__dropdown">
        <template #button-content>{{ limit }}</template>
        <div class="dropdown__cnt">
          <b-dropdown-item v-for="item in listPerPage" :key="item" @click="$emit('setLimit', item)">
            {{ item }}
          </b-dropdown-item>
        </div>
      </b-dropdown>
    </div>
    <Pagination
      v-if="total > limit"
      :total="total"
      :current-page="page"
      :per-page="limit"
      @handle-page="$emit('setPage', $event)"
    />
  </div>
</template>

<script>
import Pagination from '@/components/common/pagination.vue';
export default {
  components: { Pagination },
  props: {
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      listPerPage: [30, 50, 100]
    };
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/orders-management/orders-pagination.scss" />
