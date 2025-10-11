<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    :title="$t('policy_conditional.title')"
    modal-class="modal-mobile-bottom"
  >
    <div class="policy-conditional">
      <div class="policy-conditional__img">
        <img src="/assets/images/common/policy-condition/warning.svg" alt="icon warning policy">
      </div>
      <div class="policy-conditional__content">
        <ul class="policy-conditional__note">
          <li class="policy-conditional__item">
            Trước khi thực hiện giao dịch, vui lòng dành thời gian đọc kỹ <a class="policy-conditional__link" :href="linkUrlRedirect" target="_blank">Điều khoản sử dụng</a> của ANOTRADE.
          </li>
          <li class="policy-conditional__item">
            ANOTRADE cam kết bảo vệ quyền lợi của bạn. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng nếu có bất kỳ thắc mắc nào.
          </li>
          <li class="policy-conditional__item">
            Bằng cách xác nhận, bạn đồng ý với tất cả các điều khoản và điều kiện được nêu trong <a class="policy-conditional__link" :href="linkUrlRedirect" target="_blank">Điều khoản sử dụng</a>.
          </li>
        </ul>
      </div>
      <form-checkbox
        class="policy-conditional__skip"
        aria-describedby="selected"
        aria-controls="selected"
        @input="isSkip = $event"
      >
        {{ $t('modal.system_note.skip') }}
      </form-checkbox>
      <div class="policy-conditional__action">
        <base-button variants="contained" full-width color="primary" @click="onConfirm">
          {{ $t('home.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { IS_SKIP_POLICY_CONDITION_DEVICE } from '~/config/constant';
import { MODAL } from '~/resources/modal';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('@/components/common/base-button/index.vue'),
    FormCheckbox: () => import('~/components/common/forms/form-checkbox/index.vue')
  },
  data () {
    return {
      modalId: MODAL.WARNING_POLICY_CONDITION_ORDER,
      isSkip: false
    }
  },
  computed: {
    linkUrlRedirect () {
      return `${this.$config.STATIC_DOMAIN}/terms` || ''
    }
  },
  methods: {
    onConfirm () {
      if (this.isSkip) {
        const isSkipPolicyCondition = JSON.parse(
          localStorage.getItem(IS_SKIP_POLICY_CONDITION_DEVICE)
        )
        if (!isSkipPolicyCondition) {
          localStorage.setItem(IS_SKIP_POLICY_CONDITION_DEVICE, '1')
        }
      }
      this.$bvModal.hide(this.modalId)
      this.$emit('on-confirm')
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-policy-condition-order.scss"></style>
