<template>
  <div class="filter-search">
    <div class="filter-search__container">
      <div class="filter-search__head">
        <div class="filter-search__input">
          <search-input
            v-model="searchValue"
            :placeholder="$t('staff.placeholder.wallet_and_nickname_manager')"
            @input="$emit('on-search', $event)"
          />
        </div>
      </div>
      <div class="filter-search__body">
        <form-check-all-check-box
          :title="$t('staff.filters.merchant')"
          :options="options"
          :selected="selected"
          :is-reset="isResetFilter || isReset"
          @input="onSelectedMerchant"
          @intersect="$emit('intersect')"
        />
      </div>
      <div class="filter-search__footer">
        <base-button
          variants="outlined"
          full-width
          :loading="false"
          @click="onResetSearch"
        >
          {{ $t('common.reset') }}
        </base-button>
        <base-button
          variants="contained"
          color="primary"
          full-width
          :loading="false"
          :disabled="false"
          @click="onAppliedFilter"
        >
          {{ $t('common.apply') }}
        </base-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    FormCheckAllCheckBox: () => import('~/components/common/forms/form-checkall-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue')
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    isReset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchValue: '',
      isResetFilter: false,
      merchantManagersSelected: []
    }
  },
  computed: {
    mapByMerchantsIds () {
      if (this.merchantManagersSelected.length) {
        return this.merchantManagersSelected.map((merchant) => {
          return merchant.value
        }).join(',')
      }
      return ''
    }
  },
  methods: {
    onSelectedMerchant (items) {
      this.isResetFilter = false
      this.merchantManagersSelected = items
    },
    onResetSearch () {
      this.isResetFilter = true
      this.searchValue = ''
    },
    onAppliedFilter () {
      this.$emit('on-applied', {
        ids: this.mapByMerchantsIds,
        merchantManagers: this.merchantManagersSelected
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/commons/filter-search-list/index.scss">
</style>
