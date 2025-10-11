<template>
  <section class="filter-head-table">
    <div class="filter-head-table__container">
      <div class="filter-head-table__left">
        <div class="filter-head-table__actions">
          <div class="filter-head-table__selected">
            <slot name="actions" />
            <div v-if="isVisibleReset" class="filter-head-table__reset">
              <base-button variants="outlined" color="primary" :disabled="disabledResetFilter" @click="$emit('reset-filter')">
                {{ $t('common.setting_filter') }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isVisibleRefresh" class="filter-head-table__right">
        <slot name="other">
          <div class="filter-head-table__refresh">
            <refresh-button :disabled="disabled" @click="$emit('refresh')" />
          </div>
        </slot>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {
    RefreshButton: () => import('@/components/common/buttons/refresh.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isVisibleRefresh: {
      type: Boolean,
      default: true
    },
    isVisibleReset: {
      type: Boolean,
      default: true
    },
    disabledResetFilter: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/filter-head-table/index.scss">
</style>
