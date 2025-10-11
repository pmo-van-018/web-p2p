<template>
  <div class="create-ad">
    <loading v-if="isLoadingFormPost" />
    <div class="create-ad__header manager">
      <span
        class="icon-chevron-right1 cursor-pointer"
        @click="$router.go(-1)"
      />

      {{ $t("role_management.edit_post") }}
    </div>
    <div class="create-ad__content">
      <FormAd
        v-if="!isLoadingFormPost"
        is-manager
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
    <ModalAddBank v-if="adEditInfo.type === ORDER_TYPE.SELL" />
    <ModalAdConfirm
      :ad-info="adEditConfirm"
      is-edit
      is-manager
      :ad-clone="adEditClone"
      :benchmark-price="benchmarkPrice"
      :percent="percent"
      @on-confirm="onConfirm"
    />
    <ModalAdResult :ad-info="adEditResponsive" is-edit is-manager />
  </div>
</template>

<script>
import POST_API from '@/api/post.js';
import FormAd from '@/components/common/forms/form-ad.vue';
import ModalAdConfirm from '@/components/common/modal/modal-ad-confirm.vue';
import ModalAdResult from '@/components/common/modal/modal-ad-result.vue';
import ModalAddBank from '@/components/common/modal/modal-add-bank.vue';
import postingInitMixin from '@/mixins/merchant/posting-init';
import { MODAL } from '@/resources/modal.js';
import { ORDER_TYPE } from '@/resources/order-type.js';

export default {
  layout: 'management',
  components: { FormAd, ModalAddBank, ModalAdConfirm, ModalAdResult },
  mixins: [postingInitMixin],
  data () {
    return {
      ORDER_TYPE,
      adEditInfo: {},
      adEditConfirm: {},
      adEditClone: {},
      adEditResponsive: {},
      isLoading: true
    };
  },
  computed: {
    isLoadingFormPost () {
      return (
        this.isLoading || this.isLoadingCommonMaster || this.isPaymentLoading
      );
    }
  },
  async created () {
    await Promise.all([
      this.getPostingDetail(),
      this.getListPayment(),
      this.getFees(),
      this.getBalance()
    ]);
  },
  methods: {
    async getPostingDetail () {
      try {
        this.isLoading = true
        const id = this.$route.params.id;
        const res = await this.$axios.$get(POST_API.MANAGER_GET_DETAIL(id));
        if (res?.data) {
          this.adEditInfo = res.data;
          this.adEditClone = res.data;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
    },
    onSubmit (value) {
      this.adEditConfirm = value;
      this.$bvModal.show(MODAL.AD_CONFIRM);
    },
    onConfirm (value) {
      this.adEditResponsive = value;
      this.$bvModal.show(MODAL.AD_RESULT);
    }
  }
};
</script>

<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/create-ad/index.scss" />
