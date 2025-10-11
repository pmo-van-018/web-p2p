<template>
  <b-modal
    :id="MODAL.POST_DETAIL_SELL"
    modal-class="modal-custom post-detail"
    centered
    hide-header
    hide-footer
    @show="onResetDataShownModal"
  >
    <div class="header">
      <span class="title sell">{{ $t("common.sell") }} </span>
      <span class="title crypto">{{ item.assetName }} </span>
      <span class="title network">({{ item.assetNetwork }})</span>
      <span class="icon-cancel" @click="$_postDetailMixin_cancelTransaction" />
    </div>
    <div v-if="item && manager" class="content-detail">
      <div class="content-seller">
        <div class="content-person">
          <div class="content-avatar content-avatar--bg" :style="{backgroundColor: backgroundAvatar }">
            <div class="status" :class="isOnline ? 'online' : 'offline'" />
            <img v-if="avatar" class="avatar-img" :src="avatar" alt="avatar">
            <p v-else class="text-avatar">{{ avatarChar }}</p>
          </div>
          <p class="text-seller">{{ manager.nickName }}</p>
        </div>
        <p class="text-status">
          {{ manager.monthOrderCount }} {{ $t("home.command") }} |
          {{ finishRate }}%
        </p>
      </div>
      <p class="text-price">{{ $t("home.price") }}</p>
      <div class="content-price sell-price">
        <span class="price mr-1">{{ item.fiatSymbol }}</span>
        <p class="price">{{ price | formatCrypto(decimalLimit, 'ceil') }}</p>
      </div>
      <div class="content-buy">
        <div class="content-amount">
          <div class="content-limit">
            <p class="text-limit">{{ $t("home.available") }}</p>
            <p class="text-money">
              {{ item.availableAmount | formatCrypto }} {{ item.assetName }}
            </p>
          </div>
          <div class="content-limit">
            <p class="text-limit">{{ $t("home.limit") }}</p>
            <p class="text-money d-block">
              <span>{{ item.fiatSymbol }}</span>{{ item.minOrderAmount | formatMoney }}<span> - </span>
              <span>{{ item.fiatSymbol }}</span>{{ item.maxOrderAmount | formatMoney }}
            </p>
          </div>
        </div>
      </div>
      <div class="position-relative">
        <CryptoInput
          ref="get-input"
          :key="`asset_${key}`"
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
      </div>
      <CryptoInput
        ref="buy-input"
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
      <div class="bank-select">
        <div class="label">{{ $t('home.account_name') }}</div>
        <div v-if="payments.length === 0" class="btn-add-bank" @click="$_postDetailMixin_openModalAddBank()">{{ $t('add_bank_modal.title') }}</div>
        <BankSelector v-else :enable-add="isEndUser" />
      </div>
      <base-button
        :disabled="!isFormValid || isSubmitLoading"
        variants="contained"
        color="danger"
        @click="$_postDetailMixin_onOpenConfirmPolicyConditionSellOrder"
      >
        {{ $t("home.sell") }} {{ item.assetName?.toUpperCase() }}
      </base-button>
      <div class="timeout">
        <div class="timeout-title">{{ $t('home.pay-time') }}</div>
        <div class="timeout-value">{{ item.paymentTimeLimit }} {{ $t('home.minute') }}</div>
      </div>
      <p class="text-title-note">{{ $t("home.title-note") }}</p>
      <div class="text-title-note__detail font-t14r">
        <p v-for="(notify, index) in notifies" :key="index" class="mb-1">{{ notify }}</p>
      </div>
    </div>
    <client-only>
      <modal-policy-condition-order @on-confirm="$_postDetailMixin_approvedTransactionSell" />
    </client-only>
  </b-modal>
</template>
<script>
import { ORDER_TYPE } from '@/resources/order-type.js';
import CryptoInput from '@/components/common/home/crypto-input.vue';
import postDetailMixin from '@/mixins/home/post-detail.js';
import { MODAL } from '@/resources/modal.js';
import { mapActions, mapState } from 'vuex';
import BankSelector from '@/components/common/bank-selector.vue';
import { getUniqColor } from '~/helper';

export default {
  components: {
    CryptoInput,
    BankSelector,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalPolicyConditionOrder: () => import('~/components/common/modal/modal-policy-condition-order.vue')
  },
  mixins: [postDetailMixin],
  props: {
    cfToken: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      item: {},
      ORDER_TYPE,
      MODAL
    };
  },
  computed: {
    ...mapState('payments', ['payments']),
    ...mapState('user', ['user', 'balance']),
    ...mapState('resources', ['assets']),
    notifies () {
      if (!this.item.note) {
        return [this.$t('home.note-null')]
      }
      return this.item.note.split('\n');
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.item?.assetName && item.network === this.item?.assetNetwork)
    },
    backgroundAvatar () {
      return getUniqColor(this.item.merchant?.id || 0)
    }
  },
  methods: {
    ...mapActions('payments', ['setSelectedPayment']),
    show (post) {
      this.$bvModal.show(MODAL.POST_DETAIL_SELL);
      this.item = post;
    },
    close () {
      this.$bvModal.hide(MODAL.POST_DETAIL_SELL);
    },
    onResetDataShownModal () {
      if (this.payments?.length) {
        this.setSelectedPayment(this.payments[0])
      } else {
        this.setSelectedPayment({})
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/mobile/list-post/post-detail.scss"></style>
