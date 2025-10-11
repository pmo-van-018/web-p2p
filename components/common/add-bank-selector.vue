<template>
  <div class="bank-selector">
    <b-dropdown class="bank-selector__dropdown">
      <template #button-content>
        <div v-if="!selected" class="bank-empty">{{ placeholder }}</div>
        <div v-else class="bank-item">
          <div class="bank-selector__logo mr-3">
            <img :src="selected.icon" :alt="selected.name" />
          </div>
          <div class="bank-name">{{ selected.name }}</div>
          <div v-if="showBankNumber" class="bank-number">&nbsp;&#8722;&nbsp;{{ getBankNumber }}</div>
        </div>
        <span class="icon-triangle-down" />
      </template>
      <div class="dropdown-search">
        <div class="dropdown-search__wrapper">
          <span class="dropdown-search__icon icon-search-outline" />
          <base-input-label
            ref="searchBank"
            v-model="searchBankValue"
            name="searchBank"
            class="input mb-0"
            class-name="dropdown-search__input"
            type="text"
            :is-show-label="false"
            :placeholder="$t('placeholder.quick_search')"
          />
        </div>
      </div>
      <div v-if="filteredBankList.length" class="dropdown-cnt">
        <b-dropdown-item
          v-for="(value, key) in filteredBankList"
          :key="key"
          class="bank-item"
          :class="{ active: selected && selected.bankName === value.bankName }"
          @click="selectBank(value)"
        >
          <div class="bank-selector__logo">
            <img :src="value.icon" :alt="value.name">
          </div>
          <div class="d-flex flex-column">
            <div class="font-t14m">{{ value.name }}</div>
            <span class="bank-selector__fullname font-t14r">{{ value.fullName }}</span>
          </div>
          <div v-if="showBankNumber" class="bank-number">&nbsp;&#8722;&nbsp;{{ value.bankNumber }}</div>
        </b-dropdown-item>
        <b-dropdown-item v-show="enableAdd" class="bank-item bank-item--add" @click="openMethodTab()">
          <span class="icon-add-circle bank-img" />
          <span class="bank-name">{{ $t("form_post.button.add_bank") }}</span>
        </b-dropdown-item>
      </div>
      <div v-else class="bank-selector__empty">
        {{ $t('add_bank_modal.no_result_bank') }}
      </div>
    </b-dropdown>
  </div>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
import { BANK } from '@/resources/bank.js';
import { mapState } from 'vuex';
import { trimMultipleSpaceStartEndString } from '@/helper'
import toLower from 'lodash/toLower'

export default {
  components: {
    BaseInputLabel: () => import('~/components/common/base-input-label.vue')
  },
  props: {
    bankName: {
      type: String,
      default: ''
    },
    filterBanks: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Chọn ngân hàng'
    },
    enableAdd: {
      type: Boolean,
      default: false
    },
    showBankNumber: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      BANK,
      MODAL,
      searchBankValue: ''
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('payments', ['payments']),
    selected () {
      return BANK.find(e => e.bankName === this.bankName)
    },
    getBankNumber () {
      return this.payments.find(bank => bank.bankName === this.bankName)?.bankNumber || '';
    },
    bankList () {
      if (this.filterBanks) {
        const bankList = this.filterBanks.filter(e => BANK.find(bank => bank.bankName === e.bankName));
        return bankList.map((item) => {
          const bank = BANK.find(bank => bank.bankName === item.bankName)
          return {
            ...item,
            ...bank,
            bankNumber: this.payments.find(bank => bank.bankName === item.bankName)?.bankNumber || ''
          }
        })
      }
      return BANK
    },
    filteredBankList () {
      const search = toLower(trimMultipleSpaceStartEndString(this.searchBankValue))
      if (search === '') {
        return this.bankList
      }
      return this.bankList.filter((bank) => {
        return toLower(bank.name).includes(search) || toLower(bank.fullName).includes(search)
      })
    }
  },
  methods: {
    selectBank (value) {
      this.$emit('on-select', value.bankName)
    },
    openMethodTab () {
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/bank-selector.scss" />
