<template>
  <div class="post-item-detail-buy">
    <CryptoInput
      ref="buy-input"
      :key="`crypto_${key}`"
      v-model="vndValue"
      class="input-crypto"
      class-option="error--outline"
      :placeholder="placeholder"
      :min-value="minOrderAmount"
      :max-value="maxOrderAmount"
      :error-max-value="errorMaxValueText"
      :error-min-value="errorMinValueText"
      type="tel"
      :label="$t('home.label-buy')"
      :unit="item.fiatName"
      :limit-input="CRYPTO_INPUT_MAX_LENGTH"
      :allow-decimal="false"
      :allow-leading-zeroes="false"
      :label-require="$t('input.crypto-label-required')"
      @input="$_postDetailMixin_inputVnd"
    />
    <CryptoInput
      ref="get-input"
      :key="`fiat_${key}`"
      v-model="cryptoValue"
      class="input-crypto"
      class-option="error--outline"
      placeholder="0.00"
      type="tel"
      :label="$t('home.label-get')"
      :unit="item.assetName"
      :min-value="null"
      :max-value="CRYPTO_INPUT_MAX_VALUE"
      :limit-input="cryptoInputMaxLength"
      :label-require="$t('input.crypto-label-required')"
      :allow-decimal="true"
      :allow-leading-zeroes="false"
      buy-all
      @buyAllCrypto="$_postDetailMixin_buyAll"
      @input="$_postDetailMixin_inputCrypto"
      @blur="$_postDetailMixin_blurCrypto"
    />
    <div class="content-btn">
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
        color="success"
        :full-width="true"
        :disabled="!isFormValid || isSubmitLoading"
        @click="$_postDetailMixin_onOpenConfirmPolicyConditionBuyOrder"
      >
        {{ $t('home.buy') }} {{ item.assetName?.toUpperCase() }}
      </base-button>
    </div>
    <client-only>
      <modal-policy-condition-order @on-confirm="$_postDetailMixin_approvedTransaction" />
    </client-only>
  </div>
</template>
<script>
import CryptoInput from '@/components/common/home/crypto-input.vue'
import postDetailMixin from '@/mixins/home/post-detail';
export default {
  components: {
    CryptoInput,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalPolicyConditionOrder: () => import('~/components/common/modal/modal-policy-condition-order.vue')
  },
  mixins: [postDetailMixin],
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    vndValue () {
      this.$refs['buy-input'].checkValid()
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/list-posts/post-item-detail-buy.scss" />
