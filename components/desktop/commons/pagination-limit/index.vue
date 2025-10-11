<template>
  <div class="base-pagination">
    <div class="perpage-selector">
      <div class="perpage-selector__text">{{ getTitle }}</div>
      <b-dropdown class="perpage-selector__dropdown">
        <template #button-content>{{ limit }}</template>
        <div class="dropdown__cnt">
          <b-dropdown-item v-for="item in listPerPage" :key="item" @click="$emit('set-limit', item)">
            {{ item }}
          </b-dropdown-item>
        </div>
      </b-dropdown>
    </div>
    <pagination
      v-if="total > limit"
      :total="total"
      :current-page="page"
      :per-page="limit"
      :note="$t('postings.pagination')"
      @handle-page="$emit('set-page', $event)"
    />
  </div>
</template>

<script>
import Pagination from '~/components/common/pagination.vue';
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
    },
    note: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      listPerPage: [10, 30, 50]
    };
  },
  computed: {
    getTitle () {
      return this.note || this.$t('merchant.list_order.order_pagination.limit_desc')
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/pagination-limit/index.scss" />
