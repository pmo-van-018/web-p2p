<template>
  <div class="order-table">
    <base-table
      :class="customClass"
      :fields="fields"
      :items="items"
      :is-loading="isLoading"
      :disabled="disabled"
      @change-sort="$emit('change-sort', $event)"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
        <slot :name="slotName" v-bind="slotScope" />
      </template>
    </base-table>
    <div v-if="isShowPagination" class="order-table__pagination">
      <pagination-limit
        :page="page"
        :limit="limit"
        :total="total"
        :note="paginationTitle"
        @set-limit="onChangeLimit"
        @set-page="onChangePagination"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    BaseTable: () => import('~/components/desktop/commons/tables/index.vue'),
    PaginationLimit: () => import('~/components/desktop/commons/pagination-limit/index.vue')
  },
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
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
      default: 10
    },
    customClass: {
      type: String,
      default: ''
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    paginationTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    disabled () {
      return !this.items.length
    },
    isShowPagination () {
      return this.hasPagination && this.items?.length;
    }
  },
  methods: {
    onChangePagination (page) {
      this.$emit('change-pagination', {
        page,
        limit: this.limit
      })
    },
    onChangeLimit (limit) {
      this.$emit('change-pagination', {
        page: 1,
        limit
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/index.scss">
</style>
