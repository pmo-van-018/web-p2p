<template>
  <ModalCommon
    :id="MODAL.SET_POSTING_STATUS"
    :ref="MODAL.SET_POSTING_STATUS"
    modal-class="modal-small modal-posting"
    :title="title"
  >
    <div class="modal-content modal-status">
      <div class="modal-status__container">
        <img class="modal-status__img" :src="icon" alt="Icon">
        <p class="modal-status__desc">{{ description }}</p>
        <div v-if="isShowInfo" class="modal-status__information w-100">
          <div class="posting-info">
            <div class="posting-info__container">
              <div class="posting-info__inner">
                <div class="posting-info__content">
                  <div class="posting-info__label">{{ $t('form_post.modal.label.ad_type') }}</div>
                  <div class="posting-info__text">
                    <div class="posting-info__type">
                      <span class="font-t14m" :class="getColor">{{ $t('home.' + postType) }}</span> <b>{{ cryptoName }}</b>({{ cryptoNetwork }})
                    </div>
                  </div>
                </div>
                <div class="posting-info__content text-right">
                  <div class="posting-info__label">{{ $t('postings.table.price_title') }}</div>
                  <div class="posting-info__price" :class="getColor">
                    {{ fiatSymbol }} {{ price | formatCrypto(getPrecisionAsset, 'ceil') }}
                  </div>
                </div>
              </div>
              <div class="posting-info__inner">
                <div class="posting-info__content">
                  <div class="posting-info__label">{{ $t('form_post.modal.label.available_amount') }}</div>
                  <div class="posting-info__text posting-info__text--bold">{{ (availableAmount || 0 ) | formatCrypto }} {{ cryptoName }}</div>
                </div>
                <div class="posting-info__content text-right">
                  <div class="posting-info__label">{{ $t('form_post.modal.label.transaction_limit') }}</div>
                  <div class="posting-info__text posting-info__text--bold">
                    <div class="sub-text"><span>{{ fiatSymbol }}</span> {{ (lowerFiatLimit || 0) | formatMoney }} - <span>{{ fiatSymbol }}</span> {{ (upperFiatLimit || 0) | formatMoney }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <base-button
          variants="contained"
          color="primary"
          :loading="isLoading"
          :disabled="isLoading"
          full-width
          @click="$emit('handle-click')"
        >
          {{ $t('postings.modal.button') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL, MODAL_POSTING } from '@/resources/modal.js';
import { mapState } from 'vuex'
import { POST_TYPE } from '@/config/constant';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      MODAL
    };
  },
  computed: {
    ...mapState('merchant-posting', ['currentPosting']),
    ...mapState('resources', ['assets']),
    getPrecisionAsset () {
      return this.assets.find(item => item.name === this.cryptoName && item.network === this.cryptoNetwork)?.precision
    },
    status () {
      return this.currentPosting?.status?.toLowerCase() || ''
    },
    isLoading () {
      return this.currentPosting?.isLoading || false
    },
    postType () {
      return this.currentPosting?.type?.toLowerCase() || ''
    },
    fiatSymbol () {
      return this.currentPosting?.fiatSymbol || ''
    },
    getColor () {
      return this.currentPosting?.type === POST_TYPE.SELL ? 'sell-color' : 'buy-color'
    },
    cryptoName () {
      return this.currentPosting?.cryptoName || ''
    },
    cryptoNetwork () {
      return this.currentPosting?.cryptoNetwork || ''
    },
    availableAmount () {
      return this.currentPosting?.availableAmount || ''
    },
    price () {
      return this.currentPosting?.price || ''
    },
    lowerFiatLimit () {
      return this.currentPosting?.lowerFiatLimit || ''
    },
    upperFiatLimit () {
      return this.currentPosting?.upperFiatLimit || ''
    },
    isShowInfo () {
      return this.currentPosting?.isShowInfo || false
    },
    title () {
      return this.$t(MODAL_POSTING[this.status]?.title)
    },
    icon () {
      return MODAL_POSTING[this.status]?.icon
    },
    description () {
      return this.$t(MODAL_POSTING[this.status]?.desc)
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/modal/modal-set-posting-status.scss">
</style>
