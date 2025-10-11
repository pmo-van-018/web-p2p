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
              {{ $t('common.custom') }}
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
import { USER_ROLE } from '@/config/constant'
import { mapState } from 'vuex';

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
          icon: 'icon-hashtag-square',
          title: this.$t('order_filter.key_request'),
          placeholder: this.$t('placeholder.key_request'),
          field: 'REF_ID'
        },
        {
          icon: 'icon-nickname',
          title: this.$t('order_filter.user_name_sent'),
          placeholder: this.$t('placeholder.user_name_sent'),
          field: 'NICK_NAME'
        },
        {
          icon: 'icon-supporter-order',
          title: this.$t('order_filter.admin_support_name'),
          placeholder: this.$t('order_filter.admin_support_name'),
          field: 'ADMIN_NICK_NAME',
          role: USER_ROLE.SUPER_ADMIN
        }
      ]
    }
  },
  computed: {
    ...mapState('user', ['user']),
    normalizeSearch () {
      return trimMultipleSpaceStartEndString(this.searchValue)
    },
    isShowClearSearch () {
      return this.normalizeSearch !== ''
    },
    filteredSearchOptions () {
      return this.searchOptions.filter((option) => {
        if (this.visibleFields.length) {
          return this.visibleFields.includes(option.field)
        }
        return !option.role || option.role === this.user?.type
      })
    }
  },
  watch: {
    isResetSearch: {
      handler (value) {
        if (value) {
          this.searchValue = ''
          this.selectedSearchOption = this.filteredSearchOptions[0]
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
      if (this.searchValue) {
        this.onSearch()
      }
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
