<template>
  <div class="report-merchant">
    <div v-click-outside="onFocusout" class="report-merchant__container">
      <div class="report-merchant__dropdown">
        <div class="input-search">
          <span class="input-search__icon icon-person-star" />
          <input
            ref="searchMerchant"
            v-model="searchValue"
            type="text"
            autocomplete="off"
            :placeholder="placeholder"
            @input="$emit('on-search', searchValue)"
            @focusin="onFocusInInput"
          >
          <span class="input-search__arrow icon-arrow" @click="onFocusInInput" />
        </div>
        <div class="report-merchant__wrapper" :class="{ visible }">
          <div class="merchants">
            <template v-if="selectedMerchants.length">
              <div class="merchants__head">
                <div class="font-t16m grey-400">{{ textSelected }}</div>
                <div class="deleted-all-merchant">
                  <div class="deleted-all-merchant__content" @click.stop="selectedMerchants = []">
                    <span class="font-t12m grey-400">{{ $t('action.delete_all') }}</span>
                    <span class="icon-trash" />
                  </div>
                </div>
              </div>
              <div class="merchants__selected-box">
                <report-merchants-selected
                  :merchants="selectedMerchants"
                  @on-remove="selectedMerchants = $event"
                />
              </div>
            </template>
            <div class="merchants__list">
              <template v-if="filteredMerchantManagers.length">
                <b-form-group
                  v-slot="{ ariaDescribedby }"
                  class="m-0"
                >
                  <b-form-checkbox
                    v-for="merchant in filteredMerchantManagers"
                    :key="merchant.id"
                    v-model="selectedMerchants"
                    :value="merchant"
                    :aria-describedby="ariaDescribedby"
                    :checked="selectedMerchants"
                    name="merchantManager"
                    class="merchants__checkbox"
                  >
                    <div
                      class="merchants__item active d-flex flex-column"
                    >
                      <span class="font-t14m grey-900">{{ merchant.nickName }}</span>
                      <span class="font-t12r grey-500">{{ merchant.walletAddress }}</span>
                      <span class="icon-check" />
                    </div>
                  </b-form-checkbox>
                </b-form-group>
                <observer @intersect="$emit('intersect')" />
              </template>
              <no-data v-else class="merchant-empty" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedMerchants.length" class="report-merchant__inner">
        <report-merchants-selected
          :merchants="selectedMerchants"
          @on-remove="selectedMerchants = $event"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { USER_ROLE } from '@/config/constant';

export default {
  components: {
    ReportMerchantsSelected: () => import('~/components/desktop/reports/report-merchants-selected.vue'),
    NoData: () => import('~/components/common/no-data.vue'),
    Observer: () => import('~/components/common/observer/index.vue')
  },
  props: {
    merchants: {
      type: Array,
      default: () => []
    },
    isReset: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: USER_ROLE.MERCHANT_MANAGER
    }
  },
  data () {
    return {
      searchValue: '',
      visible: false,
      allSelected: false,
      selectedMerchants: []
    }
  },
  computed: {
    filteredMerchantManagers () {
      return this.merchants;
    },
    placeholder () {
      if (this.role === USER_ROLE.MERCHANT_MANAGER) {
        return this.selectedMerchants.length ? this.$t('report.merchant') : this.$t('report.all_merchant')
      }
      return this.selectedMerchants.length ? this.$t('report.operator') : this.$t('report.all_merchant_operator')
    },
    textSelected () {
      if (this.role === USER_ROLE.MERCHANT_MANAGER) {
        return this.$t('report.selected_merchant')
      }
      return this.$t('report.selected_operator')
    }
  },
  watch: {
    selectedMerchants (newValue, oldValue) {
      this.visible = true
      this.allSelected = newValue.length !== 0 && newValue.length === this.filteredMerchantManagers.length
      this.$emit('on-selected', newValue)
    },
    isReset: {
      handler (value) {
        if (value) {
          this.selectedMerchants = []
          this.onFocusout()
        }
      }
    }
  },
  methods: {
    onFocusInInput () {
      this.$nextTick(() => {
        this.$refs.searchMerchant.focus()
        this.visible = true
      })
    },
    onFocusout () {
      this.$nextTick(() => {
        this.visible = false
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/reports/report-merchants.scss">
</style>
