<template>
  <div class="create-ad">
    <loading v-if="isLoadingFormPost" />
    <div class="create-ad__header">
      {{ $t("create_ad.title") }}
    </div>
    <b-tabs lazy>
      <b-tab :active="activePostSell">
        <template #title>
          <span class="ad-type-nav">{{ $t("create_ad.sell") }}</span>
        </template>
        <div class="create-ad__section">
          <FormAd
            v-if="!isLoadingFormPost"
            :is-clone-post="isClonePost"
            :ad-type="ORDER_TYPE.SELL"
            :ad-edit-info="adClonePostSellInfo"
            :common-master-data="commonMasterData"
            :level-fee="levelFee"
            :balance="balance"
            @on-submit="onSubmit"
            @on-update-balance="getBalance"
            @on-get-benchmark-price="onGetBenchmarkPrice"
            @on-change-percent="onChangePercent"
          />
        </div>
      </b-tab>
      <b-tab :active="activePostBuy">
        <template #title>
          <span class="ad-type-nav">{{ $t("create_ad.buy") }}</span>
        </template>
        <div class="create-ad__section">
          <FormAd
            v-if="!isLoadingFormPost"
            :is-clone-post="isClonePost"
            :ad-type="ORDER_TYPE.BUY"
            :ad-edit-info="adClonePostBuyInfo"
            :common-master-data="commonMasterData"
            :level-fee="levelFee"
            :balance="balance"
            @on-submit="onSubmit"
            @on-update-balance="getBalance"
            @on-get-benchmark-price="onGetBenchmarkPrice"
            @on-change-percent="onChangePercent"
          />
        </div>
      </b-tab>
    </b-tabs>
    <ModalAddBank />
    <ModalAdConfirm :ad-info="adInfor" :benchmark-price="benchmarkPrice" :percent="percent" @on-confirm="onConfirm" />
    <ModalAdResult :ad-info="createReponsive" />
  </div>
</template>

<script>
import ModalAddBank from '@/components/common/modal/modal-add-bank.vue';
import ModalAdConfirm from '@/components/common/modal/modal-ad-confirm.vue';
import ModalAdResult from '@/components/common/modal/modal-ad-result.vue';
import FormAd from '@/components/common/forms/form-ad.vue';
import { MODAL } from '@/resources/modal.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapActions, mapState } from 'vuex';
import POST_API from '@/api/post.js';
import postingInitMixin from '@/mixins/merchant/posting-init';
export default {
  components: { FormAd, ModalAddBank, ModalAdConfirm, ModalAdResult },
  mixins: [postingInitMixin],
  data () {
    return {
      ORDER_TYPE,
      adInfor: {},
      createReponsive: {},
      adCloneInfo: {},
      isLoading: false
    }
  },
  computed: {
    ...mapState('post', ['idPostClone']),
    ...mapState('payments', ['isPaymentLoading']),
    isClonePost () {
      return this.idPostClone !== null
    },
    activePostBuy () {
      return this.isClonePost && this.adCloneInfo.type === ORDER_TYPE.BUY
    },
    activePostSell () {
      if (!this.isClonePost && Object.keys(this.adCloneInfo).length === 0) {
        return true
      }
      return this.isClonePost && this.adCloneInfo.type === ORDER_TYPE.SELL
    },
    adClonePostBuyInfo () {
      return this.activePostBuy ? this.adCloneInfo : {}
    },
    adClonePostSellInfo () {
      return this.activePostSell ? this.adCloneInfo : {}
    },
    isLoadingFormPost () {
      return this.isLoading || this.isLoadingCommonMaster || this.isPaymentLoading
    }
  },
  async created () {
    if (this.idPostClone) {
      await this.getPostingDetail();
    }
    await Promise.all([this.getListPayment(), this.getFees(), this.getBalance()])
  },
  beforeDestroy () {
    this.setPostClone(null)
    this.adCloneInfo = {}
  },
  methods: {
    ...mapActions('post', ['setPostClone']),
    ...mapActions('payments', ['getListPayment']),
    async getPostingDetail () {
      try {
        this.isLoading = true
        const id = this.idPostClone;
        const res = await this.$axios.$get(POST_API.GET_DETAIL(id));
        if (res?.data) {
          this.adCloneInfo = res.data;
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false
      }
    },
    onSubmit (value) {
      this.adInfor = value
      this.$bvModal.show(MODAL.AD_CONFIRM)
    },
    onConfirm (value) {
      this.createReponsive = value
      this.$bvModal.show(MODAL.AD_RESULT)
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/create-ad/index.scss" />
