<template>
  <ModalCommon
    :id="MODAL.AD_CONFIRM"
    :ref="MODAL.AD_CONFIRM"
    :title="adInfo.title"
    @show-modal="onOpenModalAdConfirm"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/post/adv.svg')" alt="icon adv" width="120">
      </div>
      <div class="d-flex justify-content-between">
        <div class="row-info">
          <div class="label">{{ $t('form_post.modal.label.ad_type') }}</div>
          <div class="value value--type font-t14m">
            <span :class="adType.toLowerCase()">{{ $t('home.'+adType.toLowerCase()) }}</span>
            <span>{{ asset }}</span>
          </div>
        </div>
        <div class="row-info">
          <div class="label">{{ $t('form_post.modal.label.price') }}</div>
          <div class="font-t20b" :class="adType.toLowerCase()"><span class="text-underline mr-1">đ</span>{{ price }}</div>
        </div>
      </div>
      <div class="divider" />
      <div class="row-group row-limit">
        <div class="d-flex justify-content-between flex-grow-1">
          <div class="row-info">
            <div class="label">{{ $t('form_post.modal.label.available_amount') }}</div>
            <div class="value">{{ amount }} {{ asset }}</div>
          </div>
          <div class="row-info">
            <div class="label">{{ $t('form_post.modal.label.transaction_limit') }}</div>
            <div class="value d-block"><span>đ</span> {{ minFiat }} - <span>đ</span> {{ maxFiat }}</div>
          </div>
        </div>
      </div>
      <div class="divider" />
      <div v-if="adType.toLowerCase() === 'sell'" class="row-info payment-info">
        <div class="label">{{ $t('form_post.modal.label.payment_method') }}</div>
        <!-- TODO: Need integrate data -->
        <div class="payment-detail">
          <div class="row-info">
            <span>{{ $t('merchant.payments.label.bank_name') }}</span>
            <div class="d-flex">
              <img :src="selectedBank.icon" :alt="selectedBank.bankName">
              <span class="value ml-2">{{ selectedBank.name }}</span>
            </div>
          </div>
          <div class="row-info">
            <span>{{ $t('merchant.payments.label.bank_number') }}</span>
            <span class="value">{{ selectedBank.bankNumber }}</span>
          </div>
          <div class="row-info">
            <span>{{ $t('merchant.payments.label.bank_account') }}</span>
            <span class="value">{{ selectedBank.bankHolder }}</span>
          </div>
          <div class="row-info">
            <span>{{ $t('merchant.payments.label.bank_branch') }}</span>
            <span class="value">{{ selectedBank.bankRemark }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <div class="row-info w-50">
          <div class="label">{{ $t('form_post.modal.label.transaction_time') }}</div>
          <div class="value">{{ time }} {{ $t('form_post.label.minute') }}</div>
        </div>
        <div class="row-info">
          <div class="label">{{ $t('form_post.modal.label.status') }}</div>
          <div class="value value--info ">
            {{ $t('form_post.status.'+status) }}
            <span v-b-tooltip class="icon-info info-block__icon" :title="tooltipStatus" />
          </div>
        </div>
      </div>
      <base-button
        variants="contained"
        color="primary"
        full-width
        :disabled="isDisabledConfirm"
        :loading="isConfirmLoading"
        @click="onConfirm"
      >
        {{ $t('add_bank_modal.btn') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import POST_API from '@/api/post.js';
import { mapState, mapActions } from 'vuex';
import { BANK } from '@/resources/bank';
import { RESPONSE_ICON } from '@/resources/message'
import { POST_TYPE } from '@/config/constant';
import { differenceObject } from '@/helper/difference';
import { POST_STATUS } from '@/constants/posts'

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    isManager: {
      type: Boolean,
      default: false
    },
    adInfo: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    adClone: {
      type: Object,
      default: () => ({})
    },
    benchmarkPrice: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      MODAL,
      isConfirmLoading: false,
      POST_STATUS
    }
  },
  computed: {
    ...mapState('payments', ['payments']),
    ...mapState('resources', ['assets', 'fiats']),
    hasResources () {
      return !!this.assets?.length && !!this.fiats?.length
    },
    adType () {
      return this.adInfo.postType || ''
    },
    asset () {
      return this.adInfo.assetId ? this.assets.find(item => item.id === this.adInfo.assetId).symbol : ''
    },
    assetTokenName () {
      const asset = this.assets.find(item => item.id === this.adInfo?.assetId)
      return asset ? `${asset.name} (${asset.network})` : ''
    },
    price () {
      return this.adInfo.priceAfter || ''
    },
    amount () {
      return this.adInfo.availableAmount || ''
    },
    maxFiat () {
      return this.adInfo.upperFiatLimit || ''
    },
    minFiat () {
      return this.adInfo.lowerFiatLimit || ''
    },
    time () {
      return this.adInfo.userToMerchantTime || ''
    },
    status () {
      return this.adInfo.showAd ? 'online' : 'offline'
    },
    tooltipStatus () {
      return this.adInfo.showAd ? this.$t('form_post.modal.tooltip.status') : this.$t('form_post.modal.tooltip.status_offline')
    },
    selectedBank () {
      const bank = this.payments.find(e => e.id === this.adInfo?.paymentMethodId)
      if (bank) {
        const bankInfo = BANK.find(e => e.bankName === bank.bankName)
        bank.name = bankInfo?.name
        bank.icon = bankInfo?.icon
      }
      return bank || {}
    },
    isDisabledConfirm () {
      return this.isConfirmLoading && !this.isEdit
    }
  },
  methods: {
    ...mapActions('post', ['setPostClone']),
    ...mapActions('resources', ['getResources']),
    ...mapActions('modal-message', ['initModal']),
    ...mapActions('modal-response', ['showResponseModal']),
    async onConfirm () {
      try {
        this.isConfirmLoading = true
        const formData = {
          ...this.adInfo,
          type: this.adInfo.postType,
          price: this.$options.filters.formatMarkToNumber(this.adInfo.fixedPriceBeforeFee.toString()),
          availableAmount: this.$options.filters.formatMarkToNumber(this.adInfo.availableAmount.toString()),
          lowerFiatLimit: this.$options.filters.formatMarkToNumber(this.adInfo.lowerFiatLimit.toString()),
          upperFiatLimit: this.$options.filters.formatMarkToNumber(this.adInfo.upperFiatLimit.toString())
        }
        delete formData.title
        delete formData.priceAfter;
        const postInitFormat = {
          ...this.adClone,
          merchantNote: this.adClone?.note,
          paymentMethodId: this.adClone?.paymentMethodId,
          showAd: POST_STATUS[this.adClone?.status],
          availableAmount: this.$options.filters.formatMarkToNumber(this.adClone?.availableAmount?.toString())
        }
        const formUpdate = differenceObject(formData, postInitFormat)
        delete formUpdate?.assetId
        delete formUpdate?.fiatId
        if (!formUpdate || Object.keys(formUpdate).length === 0) {
          this.$emit('on-confirm', this.adClone)
          this.$bvModal.hide(MODAL.AD_CONFIRM)
          this.setPostClone(null);
          this.isConfirmLoading = false
          return
        }
        let res = null
        const payload = this.isEdit ? formUpdate : formData
        if (this.benchmarkPrice) {
          payload.benchmarkPrice = this.benchmarkPrice
          payload.benchmarkPercent = this.percent || 100
        }
        let postId = null
        if (this.isEdit) {
          postId = this.isManager ? this.$route.params.id : this.$route.query.id
          res = await this.$axios.$put(this.isManager ? POST_API.MANAGER_UPDATE : POST_API.UPDATE, {
            ...payload,
            id: postId
          })
        } else {
          res = await this.$axios.$post(POST_API.CREATE, payload)
          postId = res?.data?.id
        }
        if (res.errors?.length) {
          this.handleError(res.errors[0])
        } else {
          this.$emit('on-confirm', { ...formData, ...formUpdate, id: postId })
          this.$bvModal.hide(MODAL.AD_CONFIRM)
        }
        this.setPostClone(null);
        this.isConfirmLoading = false
      } catch (error) {
        this.handleError(error.response?.data?.errors[0])
      }
    },
    async onOpenModalAdConfirm () {
      if (!this.hasResources) {
        await this.getResources()
      }
    },
    setKeyErrorPost (key) {
      const keyErrorsCryptoAmountWithPostType = {
        [POST_TYPE.BUY]: {
          CRYPTO_AMOUNT_IS_SMALLER_THAN_UPPER_ORDER_LIMIT: 'BUY_CRYPTO_AMOUNT_IS_SMALLER_THAN_UPPER_ORDER_LIMIT',
          CRYPTO_AMOUNT_IS_SMALLER_THAN_LOWER_ORDER_LIMIT: 'BUY_CRYPTO_AMOUNT_IS_SMALLER_THAN_LOWER_ORDER_LIMIT',
          CRYPTO_AMOUNT_EXCEEDS_THE_SYSTEM_LIMIT: 'BUY_CRYPTO_AMOUNT_EXCEEDS_THE_SYSTEM_LIMIT'
        },
        [POST_TYPE.SELL]: {
          CRYPTO_AMOUNT_IS_SMALLER_THAN_UPPER_ORDER_LIMIT: 'SELL_CRYPTO_AMOUNT_IS_SMALLER_THAN_UPPER_ORDER_LIMIT',
          CRYPTO_AMOUNT_IS_SMALLER_THAN_LOWER_ORDER_LIMIT: 'SELL_CRYPTO_AMOUNT_IS_SMALLER_THAN_LOWER_ORDER_LIMIT',
          CRYPTO_AMOUNT_EXCEEDS_THE_SYSTEM_LIMIT: 'SELL_CRYPTO_AMOUNT_EXCEEDS_THE_SYSTEM_LIMIT'
        }
      }
      return keyErrorsCryptoAmountWithPostType[this.adType]?.[key] || key
    },
    handleError (error) {
      this.$bvModal.hide(MODAL.AD_CONFIRM)
      const keyError = error?.key || '';
      const messageError = error?.message || '';
      this.showResponseModal({
        title: '',
        content: this.$t(`modal.message.merchant_postings_${this.isEdit ? 'update' : 'create'}_failed`),
        ...(keyError === 'TOKEN_IS_NO_LONGER_SUPPORTED' ? {
          description: this.$t('modal.message.TOKEN_IS_NO_LONGER_SUPPORTED', {
            token: this.assetTokenName
          }),
          forceReload: true
        } : {
          description: this.setKeyErrorPost(keyError)
            ? this.$t(`modal.message.${this.setKeyErrorPost(keyError)}`)
            : this.$t(`modal.message.${messageError}`),
          forceReload: false
        }),
        icon: RESPONSE_ICON.POST_FAILED,
        show: true
      })
      this.isConfirmLoading = false
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-ad-confirm.scss"></style>
