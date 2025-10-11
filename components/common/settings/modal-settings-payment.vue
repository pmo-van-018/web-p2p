<template>
  <ModalCommon
    :id="MODAL.SETTING_PAYMENT"
    :ref="MODAL.SETTING_PAYMENT"
    :title="$t('merchant.settings.bank.modal.title')"
    modal-class="modal-small modal-mobile-bottom"
    @hide-modal="hideModal"
  >
    <div class="modal-content md-1 pb-0">
      <p class="mt-3 mb-3 grey-400 font-t14r">{{ $t('merchant.settings.bank.modal.description') }}</p>
      <search-input
        v-model="searchPaymentValue"
        class="mb-2"
        :placeholder="`${$t('merchant.settings.bank.placeholder')}`"
      />
      <div class="bank-list">
        <!-- The "all" checkbox -->
        <template v-if="filteredBankList.length">
          <b-form-checkbox
            :checked="allSelected"
            class="font-t14r grey-900 bank-item c-primary-checkbox"
            name="bank-checkbox-all"
            @change="selectAllBanks"
          >
            {{ $t('merchant.settings.bank.modal.select_all') }}
          </b-form-checkbox>
          <hr class="divide">
          <!-- List of the bank checkboxes -->
          <div class="bank-list__wrapper">
            <b-form-checkbox
              v-for="(bank) in filteredBankList"
              :key="bank.bankName"
              v-model="selectedBanks"
              :value="bank.bankName"
              class="bank-item c-primary-checkbox"
              name="supported-banks"
            >
              <img :src="bank.icon" :alt="bank.name" class="bank-img">
              <div class="d-flex flex-column">
                <div class="font-t14m grey-900">{{ bank.name }}</div>
                <div class="font-t14r grey-500">{{ bank.fullName }}</div>
              </div>
            </b-form-checkbox>
          </div>
        </template>
        <div v-else class="d-flex align-items-center justify-content-center h-100 font-t14m grey-400">
          {{ $t('add_bank_modal.no_result_bank') }}
        </div>
      </div>
      <base-button
        variants="contained"
        color="primary"
        :disabled="disabledUpdateBank"
        @click="submit"
      >
        {{ $t('merchant.settings.bank.modal.button') }}
      </base-button>
    </div>
    <loading v-if="isLoading" />
  </ModalCommon>
</template>

<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { BANK } from '@/resources/bank.js';
import MASTER_DATA_API from '@/api/master-data.js';
import { trimMultipleSpaceStartEndString } from '@/helper'
import toLower from 'lodash/toLower'

export default {
  components: {
    ModalCommon,
    SearchInput: () => import('~/components/common/forms/search-input/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    supportedBanks: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      MODAL,
      bankOptions: BANK,
      allSelected: this.supportedBanks?.length === BANK.length,
      isLoading: false,
      selectedBanks: this.supportedBanks || [],
      searchPaymentValue: ''
    }
  },
  computed: {
    filteredBankList () {
      const search = toLower(trimMultipleSpaceStartEndString(this.searchPaymentValue))
      if (search === '') {
        return this.bankOptions
      }
      return this.bankOptions.filter((bank) => {
        return toLower(bank.name).includes(search) || toLower(bank.fullName).includes(search)
      })
    },
    disabledUpdateBank () {
      return !this.filteredBankList.length || !this.selectedBanks.length
    }
  },
  watch: {
    supportedBanks (newSupportedBanks) {
      this.selectedBanks = newSupportedBanks;
      this.allSelected = newSupportedBanks?.length === this.filteredBankList.length;
    },
    selectedBanks (newSelectedBanks) {
      this.allSelected = newSelectedBanks?.length === this.filteredBankList.length;
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.SETTING_PAYMENT);
    },
    hideModal () {
      this.allSelected = this.supportedBanks?.length === BANK.length;
      this.selectedBanks = this.supportedBanks;
      this.searchPaymentValue = ''
    },
    selectAllBanks (allSelected) {
      this.selectedBanks = [];
      this.allSelected = allSelected;

      if (allSelected) {
        this.selectedBanks = this.filteredBankList.map(item => item?.bankName);
      }
    },
    async submit () {
      try {
        this.isLoading = true;
        // Request to update
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, {
          supportedBanks: this.selectedBanks
        });
        // The case the result is successful
        if (!result.errors?.length) {
          this.$emit('on-success', this.selectedBanks);
        }
        // Close the popup
        this.close();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-payment.scss"></style>
