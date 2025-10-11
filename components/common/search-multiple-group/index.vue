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
            v-for="(option, index) in searchOptions"
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
          @focus="$emit('on-focus', $event)"
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
          @focus="$emit('on-focus', $event)"
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
    searchOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchValue: '',
      selectedSearchOption: {}
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
    this.selectedSearchOption = this.searchOptions[0]
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
<style lang="scss" scoped src="static/assets/scss/components/common/search-multiple-group/index.scss">
</style>
