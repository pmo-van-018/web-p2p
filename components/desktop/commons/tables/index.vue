<template>
  <div class="base-table">
    <b-table
      :fields="fields"
      :items="dataList"
      show-empty
      fixed
      hover
      primary-key="a"
      :busy="isLoading"
      table-class="common-table"
      thead-class="common-table__head"
      thead-tr-class="common-table__head-tr"
      tbody-class="common-table__body"
      :tbody-tr-class="tbodyTrClass"
      @row-clicked="$emit('row-clicked', $event)"
    >
      <!-- When user data empty -->
      <template #empty>
        <div class="base-table__empty">
          <empty-data />
        </div>
      </template>
      <!-- Loading when calling API -->
      <template #table-busy>
        <div class="base-table__loading">
          <loader />
        </div>
      </template>

      <template #head()="{ field }">
        <head-title
          :label="field.label"
          :sub-label="field.subLabel"
          :sort-field="field.sortField"
          :is-sort="field.isSort"
          :align="field.align"
          :is-loading="isLoading"
          :disabled="disabled"
          :reset-sort-field="field.resetSortField"
          @change-sort="handleChangeSort"
        />
      </template>

      <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
        <slot :name="slotName" v-bind="slotScope" />
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  components: {
    EmptyData: () => import('@/components/desktop/commons/tables/empty-data.vue'),
    HeadTitle: () => import('@/components/desktop/commons/tables/head-title.vue'),
    Loader: () => import('~/components/common/loader.vue')
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
    disabled: {
      type: Boolean,
      default: false
    },
    tbodyTrClass: {
      type: [String, Object, Function],
      default: ''
    }
  },
  computed: {
    dataList () {
      return this.items.map((item) => {
        return {
          ...item,
          resetSortField: true
        }
      })
    }
  },
  methods: {
    handleChangeSort ({ sortField, sortDirection }) {
      this.fields.forEach((field) => {
        field.resetSortField = sortField !== field.sortField
      })
      this.$emit('change-sort', {
        sortField,
        sortDirection
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/table/index.scss">
</style>
