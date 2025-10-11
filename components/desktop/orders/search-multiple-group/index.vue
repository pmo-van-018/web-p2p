<template>
  <div class="search-multiple-group">
    <div class="search-multiple-group__container">
      <div class="search-multiple-group__dropdown">
        <b-dropdown class="dropdown-action" variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <div v-if="selectedSearchOption">
              <div class="icon-selected">
                <span :class="selectedSearchOption.icon" />
              </div>
            </div>
            <div v-else>
              Tùy chỉnh
            </div>
            <span class="icon-caret-down" />
          </template>
          <b-dropdown-item
            v-for="(option, index) in filteredSearchOptions"
            :key="`search-option-${index}`"
            :active="option.field === selectedSearchOption.field"
            href="#"
            @click="onSelectSearchOption(option)"
          >
            <div class="dropdown-content" :class="{ 'active': option.field === selectedSearchOption.field }">
              <span :class="['dropdown-content__icon', option.icon]" />
              <span class="dropdown-content__title">{{ option.title }}</span>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <div class="search-multiple-group__input">
        <base-input-label
          v-if="isFieldTotalPrice"
          ref="money-input"
          :key="selectedSearchOption?.field"
          v-model="searchValue"
          :placeholder="selectedSearchOption?.placeholder || $t('placeholder.search')"
          type="tel"
          thousands-separator-symbol=","
          :allow-leading-zeroes="false"
          @input="onSearch"
          @blur="onBlurInput"
        />
        <base-input-label
          v-else
          ref="search-input"
          :key="selectedSearchOption?.field"
          v-model="searchValue"
          type="text"
          :placeholder="selectedSearchOption?.placeholder || $t('placeholder.search')"
          @input="onSearch"
          @blur="onBlurInput"
        />
      </div>
      <div class="search-multiple-group__icon">
        <span v-if="isShowClearSearch" class="icon-close-circle-outline" @click="onClearSearch" />
        <span v-else class="icon-search-outline" />
      </div>
    </div>
  </div>
</template>
<script>
import { trimMultipleSpaceStartEndString } from '@/helper'
import { ORDER_FIELD_SEARCH_GROUP } from '@/constants/orders'

export default {
  components: {
    BaseInputLabel: () => import('@/components/common/base-input-label.vue')
  },
  props: {
    isResetSearch: {
      type: Boolean,
      default: false
    },
    visibleFields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchValue: '',
      selectedSearchOption: {},
      searchOptions: [
        {
          icon: 'icon-encryption',
          title: this.$t('order_filter.money'),
          placeholder: this.$t('placeholder.money'),
          field: ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE
        },
        {
          icon: 'icon-hashtag-square',
          title: this.$t('order_filter.trading_code'),
          placeholder: this.$t('placeholder.trading_code'),
          field: ORDER_FIELD_SEARCH_GROUP.REF_ID
        },
        {
          icon: 'icon-hashtag-square',
          title: this.$t('order_filter.trading_code'),
          placeholder: this.$t('placeholder.trading_code'),
          field: ORDER_FIELD_SEARCH_GROUP.ID
        },
        {
          icon: 'icon-bill-list',
          title: this.$t('order_filter.trans_code'),
          placeholder: this.$t('placeholder.trans_code'),
          field: ORDER_FIELD_SEARCH_GROUP.TRANS_CODE
        },
        {
          icon: 'icon-wallet-address',
          title: this.$t('order_filter.wallet_address'),
          placeholder: this.$t('placeholder.wallet_address'),
          field: ORDER_FIELD_SEARCH_GROUP.WALLET_ADDRESS
        },
        {
          icon: 'icon-nickname',
          title: this.$t('order_filter.nickname'),
          placeholder: this.$t('placeholder.nickname'),
          field: ORDER_FIELD_SEARCH_GROUP.NICK_NAME
        }
      ]
    }
  },
  computed: {
    normalizeSearch () {
      if (this.isFieldTotalPrice) {
        return this.$options.filters.formatMarkToNumber(this.searchValue)
      }
      return trimMultipleSpaceStartEndString(this.searchValue)
    },
    isShowClearSearch () {
      if (this.isFieldTotalPrice) {
        return this.normalizeSearch !== 0
      }
      return this.normalizeSearch !== ''
    },
    filteredSearchOptions () {
      return this.searchOptions.filter((option) => {
        if (this.visibleFields.length) {
          return this.visibleFields.includes(option.field)
        }
        return true
      })
    },
    isFieldTotalPrice () {
      return this.selectedSearchOption?.field === ORDER_FIELD_SEARCH_GROUP.TOTAL_PRICE
    }
  },
  watch: {
    isResetSearch: {
      handler (value) {
        if (value) {
          this.searchValue = ''
        }
      }
    }
  },
  created () {
    this.selectedSearchOption = this.filteredSearchOptions[0]
  },
  methods: {
    onSelectSearchOption (option) {
      this.selectedSearchOption = option
      if (this.isFieldTotalPrice) {
        this.searchValue = ''
      }
      this.onSearch()
    },
    onClearSearch () {
      this.searchValue = ''
      this.onSearch()
    },
    onBlurInput () {
      this.$emit('on-blur', {
        searchValue: this.normalizeSearch
      })
    },
    onSearch () {
      this.$emit('on-search', {
        searchField: this.selectedSearchOption.field,
        searchValue: this.normalizeSearch
      })
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/search-multiple-group/index.scss">
</style>
