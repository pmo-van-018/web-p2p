<template>
  <div class="bank-selector">
    <b-dropdown class="bank-selector__dropdown">
      <template #button-content>
        <div v-if="hasPaymentDetail" class="bank-item">
          <img :src="bankIcon" :alt="bankName" class="bank-img">
          <div v-if="showBankNumber" class="bank-name">{{ bankName }} - {{ bankNumber }}</div>
        </div>
        <div v-else class="bank-empty">{{ $t('common.select_bank') }}</div>
        <span class="icon-triangle-down" />
      </template>
      <div class="dropdown-cnt">
        <b-dropdown-item
          v-for="(item, index) in payments"
          :key="index"
          class="bank-item"
          :class="{ active: selectedPayment && selectedPayment.id === item.id }"
          @click="setSelectedPayment(item)"
        >
          <img :src="getBank(item.bankName)?.icon" alt="" class="bank-img">
          <div class="bank-name">{{ getBank(item.bankName)?.name }} - {{ item.bankNumber }}</div>
        </b-dropdown-item>
        <b-dropdown-item v-show="enableAdd" class="bank-item bank-item--add" @click="openModal()">
          <span class="icon-add-circle bank-img" />
          <span class="bank-name">{{ $t("form_post.button.add_bank") }}</span>
        </b-dropdown-item>
      </div>
    </b-dropdown>
  </div>
</template>

<script>
import { BANK } from '@/resources/bank.js';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import isEmpty from 'lodash/isEmpty';
export default {
  props: {
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
      BANK
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('payments', ['payments', 'selectedPayment']),
    hasPaymentDetail () {
      return !isEmpty(this.selectedPayment)
    },
    bankNameDetail () {
      if (this.hasPaymentDetail) {
        return this.selectedPayment?.bankName?.toLowerCase()
      }
      return '';
    },
    bankNumberDetail () {
      if (this.hasPaymentDetail) {
        return this.selectedPayment?.bankNumber
      }
      return '';
    },
    bankName () {
      return this.getBank(this.bankNameDetail)?.name || '';
    },
    bankIcon () {
      return this.getBank(this.bankNameDetail)?.icon || '';
    },
    bankNumber () {
      return this.payments.find(item => item.bankName === this.bankNameDetail && item.bankNumber === this.bankNumberDetail)?.bankNumber || '';
    }
  },
  methods: {
    ...mapActions('payments', ['setSelectedPayment']),
    getBank (bank) {
      return BANK.find(e => e.bankName === bank);
    },
    openModal () {
      this.$bvModal.show(MODAL.ADD_BANK)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/bank-selector.scss" />
