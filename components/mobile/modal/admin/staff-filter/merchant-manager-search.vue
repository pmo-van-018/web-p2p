<template>
  <div>
    <search-input
      v-model="searchValue"
      :placeholder="$t('staff.placeholder.wallet_and_nickname_manager')"
      @input="$emit('on-search', $event)"
    />
    <div class="collapse-merchant">
      <div class="collapse-merchant__head" @click="visibleSelectedMerchant = !visibleSelectedMerchant">
        <div class="collapse-merchant__title">{{ $t('staff.selected_merchant') }}</div>
        <div class="collapse-merchant__arrow">
          <span
            :class="[
              'collapse-merchant__icon',
              visibleSelectedMerchant ? 'icon-sort-increase' : 'icon-sort-decrease'
            ]"
          />
        </div>
      </div>
      <b-collapse id="collapse-merchant" v-model="visibleSelectedMerchant">
        <form-check-all-check-box
          :is-visible-head="false"
          :is-reset="isResetSelectedMerchantManager"
          :options="merchantManagerList"
          :selected="merchantManagerListSelected"
          :title="$t('staff.filters.merchant')"
          @input="onSelectedMerchant"
        />
      </b-collapse>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    FormCheckAllCheckBox: () => import('~/components/common/forms/form-checkall-checkbox/index.vue'),
    SearchInput: () => import('~/components/common/forms/search-input/index.vue')
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    merchantManagerList: {
      type: Array,
      default: () => []
    },
    isReset: {
      type: Boolean
    }
  },
  data () {
    return {
      visibleSelectedMerchant: false,
      isResetSelectedMerchantManager: false,
      merchantManagerListSelected: [],
      merchantIds: [],
      searchValue: ''
    }
  },
  watch: {
    isReset: {
      handler (value) {
        if (value) {
          this.searchValue = ''
          this.merchantManagerListSelected = []
        } else {
          this.merchantManagerListSelected = this.selected
        }
      },
      immediate: true
    }
  },
  methods: {
    onSelectedMerchant (ids) {
      this.$emit('on-selected', ids)
    }
  }
}
</script>
<style lang="scss" scoped src="../../../../../static/assets/scss/components/mobile/modal/modal-staff-filter/merchant-manager-search.scss">
</style>
