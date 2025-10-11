<template>
  <div :class="['info-block', { 'mobile': isMobile}]">
    <div
      v-if="listInfo.length"
      :class="[
        'bank-info',
        { 'w-100': !showNote},
        { 'bank-info__highlight': highlight}
      ]"
    >
      <div v-for="(info, index) in listInfo" :key="index" class="bank-info__item">
        <div class="bank-info__item-title">
          {{ info.title }} <span v-if="info.labelNote" :id="`transfer-note-${index}-${blockId}`" v-b-tooltip.focus tabindex="0" class="icon-info bank-info__icon" />
          <b-tooltip :target="`transfer-note-${index}-${blockId}`" :triggers="tooltipTrigger" :custom-class="tooltipClass">
            {{ info.labelNote }}
          </b-tooltip>
        </div>
        <div v-if="info.value" class="bank-info__item-value" :class="{ 'info.valueClass': true, 'bank-info__item-value--word-wrap': index !== 0 }">
          <img v-if="info.icon" :src="info.icon" class="bank-info__item-icon">
          {{ getTextValue(info, index) }} <CopyButton v-if="info.canCopy" :value="info.valueCopy ? info.valueCopy : info.value" />
          <span
            v-if="info?.isVisibleEye"
            class="bank-info__icon-eye"
            :class="markAsteriskContent[index] ? 'icon-close-eye' : 'icon-open-eye'"
            @click="toggleEye(index)"
          />
        </div>
      </div>
      <div v-if="isShowSelectBank" class="bank-info__item">
        <div class="bank-info__item-title">
          {{ $t('label.payment_method') }}
        </div>
        <div v-if="payments.length === 0" class="no-payment">{{ $t('add_bank_modal.no_payment') }}</div>
              <bank-list-payment-method-selector
                v-else
                :filter-banks="payments"
                :placeholder="$t('form_post.payment.title')"
              />
      </div>
    </div>
    <div v-else class="bank-note">
      {{ $t('end_user_sell.info.payment.title') }}
    </div>
    <button
      v-if="isMobile && note"
      :class="['collapse-note', { 'expanded': expandedNote }]"
      @click="expandedNote = !expandedNote"
    >
      <span class="icon-arrow" />
    </button>
    <bank-note v-show="isShowNote" :note="note" class="payment-note" />
  </div>
</template>

<script>
import CopyButton from '@/components/common/copy-button.vue';
import { mapActions, mapState } from 'vuex';
import { BANK } from '@/resources/bank.js';

export default {
  components: {
    CopyButton,
    BankNote: () => import('~/components/common/transfer-to-seller/transfer-info/bank-note.vue'),
    BankListPaymentMethodSelector: () => import('~/components/common/bank-selector.vue')
  },
  props: {
    tooltipClass: {
      type: String,
      default: ''
    },
    listInfo: {
      type: Array,
      default: () => []
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    showNote: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    note: {
      type: String,
      default: ''
    },
    isShowSelectBank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expandedNote: false,
      blockId: Math.random(),
      markAsteriskContent: []
    }
  },
  computed: {
    ...mapState('end-user', ['isMarkAsteriskContent']),
    ...mapState('payments', ['payments', 'selectedPayment']),
    notes () {
      return this.note?.split(/\r?\n/)
    },
    isShowNote () {
      return this.expandedNote && this.showNote && this.note
    },
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    },
    getBankName () {
      return BANK.find(e => e.bankName === this.selectedPayment?.bankName)?.name;
    }
  },
  async mounted () {
    this.expandedNote = !this.isMobile;
    this.markAsteriskContent = Array.from({ length: this.listInfo.length }, () => this.isMarkAsteriskContent)
    if (this.isShowSelectBank) {
      await this.getListPayment()
    }
  },
  methods: {
    ...mapActions('end-user', ['setMarkAsteriskContent']),
    ...mapActions('payments', ['getListPayment']),
    getTextValue (info, index) {
      if (info.isVisibleEye) {
        return this.markAsteriskContent[index] ? info.valueMark : info.value
      }
      return info.value
    },
    toggleEye (index) {
      this.$set(this.markAsteriskContent, index, !this.markAsteriskContent[index])
      this.setMarkAsteriskContent(this.markAsteriskContent[index])
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/info-block.scss" />
