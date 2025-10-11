<template>
  <modal-common
    :id="MODAL.SELECT_STAFF_TYPE"
    :ref="MODAL.SELECT_STAFF_TYPE"
    :title="$t('staffs.form_create.title')"
    :modal-class="'modal-small modal-mobile-bottom'"
  >
    <div class="modal-content">
      <div class="role-select">
        <div class="role-select__card" :class="{ 'card-selected': selectedOperaterBoolean }" @click="selectedOperater()">
          <div class="d-flex flex-column align-items-center">
            <img class="role-avatar" :src="require('~imageRoot/common/operation/operator-enable.svg')" alt="avatar-icon" width="105" height="105">
            <span class="role-description">{{ $t('role_management.label.merchant_operator') }} </span>
          </div>
        </div>
        <div class="role-select__card" :class="{ 'card-selected': selectedSupporterBoolean }" @click="selectedSupporter()">
          <div class="d-flex flex-column align-items-center">
            <img class="role-avatar" :src="require('~imageRoot/common/operation/supporter-enable.svg')" alt="avatar-icon" width="105" height="105">
            <span class="role-description">{{ $t('role_management.label.merchant_supporter') }} </span>
          </div>
        </div>
      </div>
      <base-button
        variants="contained"
        color="primary"
        @click="nextStepCreateStaff()"
      >
        {{ $t('role_management.modal.continue') }}
      </base-button>
    </div>
  </modal-common>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { USER_ROLE } from '@/config/constant';
export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      selectedSupporterBoolean: false,
      selectedOperaterBoolean: true,
      USER_ROLE
    };
  },
  methods: {
    selectedSupporter () {
      this.selectedSupporterBoolean = true;
      this.selectedOperaterBoolean = false;
    },
    selectedOperater () {
      this.selectedOperaterBoolean = true;
      this.selectedSupporterBoolean = false;
    },
    nextStepCreateStaff () {
      this.$emit('on-select-role', this.selectedOperaterBoolean ? USER_ROLE.MERCHANT_OPERATOR : USER_ROLE.MERCHANT_SUPPORTER)
      this.selectedOperaterBoolean = true;
      this.selectedSupporterBoolean = false;
      this.$bvModal.hide(MODAL.SELECT_STAFF_TYPE);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-select-role.scss" />
