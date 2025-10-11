<template>
  <div class="create-ad">
    <loading v-if="isLoadingFormPost" />
    <div class="create-ad__header">
      {{ $t("update_post.title") }}
    </div>
    <div class="nav nav-tabs">
      <span class="ad-type-nav nav-item" :class="{active: adEditInfo.type === ORDER_TYPE.SELL}">{{ $t("create_ad.sell") }}</span>
      <span class="ad-type-nav nav-item" :class="{active: adEditInfo.type === ORDER_TYPE.BUY}">{{ $t("create_ad.buy") }}</span>
    </div>
    <div class="create-ad__content">
      <FormAd
        v-if="!isLoadingFormPost"
        is-edit
        :ad-type="adEditInfo.type"
        :ad-edit-info="adEditInfo"
        :common-master-data="commonMasterData"
        :level-fee="levelFee"
        :balance="balance"
        @on-submit="onSubmit"
        @on-update-balance="getBalance"
        @on-get-benchmark-price="onGetBenchmarkPrice"
        @on-change-percent="onChangePercent"
      />
    </div>
    <ModalAddBank />
    <ModalAdConfirm
      :ad-info="adEditConfirm"
      is-edit
      :benchmark-price="benchmarkPrice"
      :percent="percent"
      :ad-clone="adEditClone"
      @on-confirm="onConfirm"
    />
    <ModalAdResult :ad-info="adEditReponsive" is-edit />
  </div>
</template>

<script>
import ModalAddBank from '@/components/common/modal/modal-add-bank.vue';
import ModalAdConfirm from '@/components/common/modal/modal-ad-confirm.vue';
import ModalAdResult from '@/components/common/modal/modal-ad-result.vue';
import FormAd from '@/components/common/forms/form-ad.vue';
import { MODAL } from '@/resources/modal.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import POST_API from '@/api/post.js';
import postingInitMixin from '@/mixins/merchant/posting-init';

export default {
  components: { FormAd, ModalAddBank, ModalAdConfirm, ModalAdResult },
  mixins: [postingInitMixin],
  data () {
    return {
      ORDER_TYPE,
      adEditInfo: {},
      adEditClone: {},
      adEditConfirm: {},
      adEditReponsive: {},
      isLoading: true
    };
  },
  computed: {
    isLoadingFormPost () {
      return this.isLoading || this.isLoadingCommonMaster || this.isPaymentLoading
    }
  },
  async created () {
    await Promise.all([this.getPostingDetail(), this.getListPayment(), this.getFees(), this.getBalance()])
  },
  methods: {
    async getPostingDetail () {
      try {
        this.isLoading = true
        const id = this.$route.query.id;
        const res = await this.$axios.$get(POST_API.GET_DETAIL(id));
        if (res?.data) {
          this.adEditInfo = res.data;
          this.adEditClone = res.data;
          this.isLoading = false
        }
      } catch (error) {
        this.isLoading = false
      }
    },
    onSubmit (value) {
      this.adEditConfirm = value;
      this.$bvModal.show(MODAL.AD_CONFIRM);
    },
    onConfirm (value) {
      this.adEditReponsive = value;
      this.$bvModal.show(MODAL.AD_RESULT);
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/create-ad/index.scss" />
