<template>
  <div class="post-item-detail-sell">
    <CryptoInput
      ref="get-input"
      :key="`crypto_${key}`"
      v-model="cryptoValue"
      class="input-crypto"
      class-option="error--outline"
      placeholder="0.00"
      type="tel"
      :label="$t('home.label-sell')"
      :unit="item.assetName"
      :min-value="null"
      :max-value="CRYPTO_INPUT_MAX_VALUE"
      :limit-input="cryptoInputMaxLength"
      :label-require="$t('input.crypto-label-required')"
      :allow-decimal="true"
      :allow-leading-zeroes="false"
      sell-all
      @sell-all-crypto="$_postDetailMixin_buyAll"
      @input="$_postDetailMixin_inputCrypto"
      @blur="$_postDetailMixin_blurCrypto"
    />
    <div v-if="user" class="balance">{{ $t('home.balance') }}: {{ balance | formatCrypto }} {{ item.assetName?.toUpperCase() }}</div>
    <CryptoInput
      ref="sell-input"
      :key="`fiat_${key}`"
      v-model="vndValue"
      class="input-crypto"
      class-option="error--outline"
      :placeholder="placeholder"
      :min-value="minOrderAmount"
      :max-value="maxOrderAmount"
      :error-max-value="errorMaxValueText"
      :error-min-value="errorMinValueText"
      :limit-input="CRYPTO_INPUT_MAX_LENGTH"
      type="tel"
      :label="$t('home.label-get')"
      :unit="item.fiatName"
      :allow-decimal="false"
      :allow-leading-zeroes="false"
      :label-require="$t('input.crypto-label-required')"
      @input="$_postDetailMixin_inputVnd"
    />
    <div v-if="user" class="bank-select">
      <div class="bank-select__label payment-label">
        {{ $t('home.account_name') }}
      </div>
      <div v-if="payments.length === 0" class="btn-add-bank" @click="$_postDetailMixin_openModalAddBank()">{{ $t('add_bank_modal.title') }}</div>
      <BankSelector v-else :enable-add="isEndUser" />
    </div>
    <div class="content-btn mt-3">
      <base-button
        variants="contained"
        color="info"
        :full-width="true"
        @click="$_postDetailMixin_cancelTransaction"
      >
        {{ $t('home.btn-cancel') }}
      </base-button>
      <base-button
        variants="contained"
        color="danger"
        :full-width="true"
        :loading="isSubmitLoading"
        :disabled="!isFormValid || isSubmitLoading"
        :class="{disabled : !isFormValid}"
        @click="$_postDetailMixin_onOpenConfirmPolicyConditionSellOrder"
      >
        {{ $t('home.sell') }} {{ item.assetName?.toUpperCase() }}
      </base-button>
    </div>
    <client-only>
      <modal-policy-condition-order @on-confirm="$_postDetailMixin_approvedTransactionSell" />
      <modal-add-bank />
    </client-only>
  </div>
</template>
<script>
import CryptoInput from '@/components/common/home/crypto-input.vue'
import postDetailMixin from '@/mixins/home/post-detail';
import { MODAL } from '@/resources/modal.js';
import { mapState } from 'vuex';
import BankSelector from '@/components/common/bank-selector.vue';
import ModalAddBank from '@/components/common/modal/modal-add-bank.vue';

export default {
  components: {
    CryptoInput,
    BankSelector,
    ModalAddBank,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalPolicyConditionOrder: () => import('~/components/common/modal/modal-policy-condition-order.vue')
  },
  mixins: [postDetailMixin],
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    require: {
      type: Boolean,
      default: true
    },
    cfToken: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL
    }
  },
  watch: {
    vndValue () {
      this.$refs['sell-input'].checkValid()
    }
  },
  computed: {
    ...mapState('user', ['user', 'balance']),
    ...mapState('payments', ['payments'])
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/list-posts/post-item-detail-sell.scss" />
