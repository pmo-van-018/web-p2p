<template>
  <ModalCommon
    :id="MODAL.DELETE_STAFF"
    :ref="MODAL.DELETE_STAFF"
    :title="$t('staffs.form_delete.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/operation/delete.svg')" alt="Icon Delete" width="112" height="112">
      </div>

      <div class="description grey-600">
        {{ getDescriptionMain }}
      </div>

      <div class="warning-group">
        <div class="d-flex align-items-center warning-group__head">
          <div class="warning-icon">
            <span class="icon-question" />
          </div>
          <div class="warning-group__title">{{ $t('staff.note') }}</div>
        </div>
        <div class="warning-info">
          <div v-for="(note, index) in notes" :key="index" class="info-block">
            <p class="step">{{ index + 1 }}.</p>
            <p class="text">
              {{ note }}
            </p>
          </div>
        </div>
      </div>
      <div class="button-group">
        <base-button
          variants="contained"
          color="primary"
          :disabled="disabledSubmit"
          :loading="isLoading"
          @click="handleSubmit"
        >
          {{ $t('staffs.form_delete.confirm') }}
        </base-button>
        <base-button
          variants="contained"
          color="info"
          :disabled="isLoading"
          @click="close"
        >
          {{ $t('role_management.modal.cancel') }}
        </base-button>
      </div>
    </div>

    <ModalSuccessResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/delete-succeed.svg')"
      :title="$t('staffs.form_delete.title_success')"
      :description="$t('staffs.form_delete.description_success')"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/staff-inactive-failed.svg')"
      :title="$t('staffs.form_delete.title_failure')"
      :default-description="$t('staffs.form_delete.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { DELETE_STAFF_BY_ID } from '@/api/staff';
import roleManagementMixin from '@/mixins/role-management';
import { USER_ROLE_CODE } from '~/config/constant';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      isLoading: false,
      isVisibleDeleteForm: true,
      errorResult: null
    };
  },
  computed: {
    disabledSubmit () {
      return this.isLoading;
    },
    modalClassCustom () {
      if (this.isVisibleDeleteForm) {
        return '';
      }
      return 'hidden';
    },
    postfix () {
      return `_delete_${this.staff?.id || ''}`;
    },
    getDescriptionMain () {
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.form_delete.description_main.merchant_operator')
      }
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.form_delete.description_main.merchant_supporter')
      }
      return ''
    },
    notes () {
      let results = []
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        results = [
          ...results,
          this.$t('staffs.form_delete.description_sub_1.merchant_operator'),
          this.$t('staffs.form_delete.description_sub_3.merchant_operator'),
          this.$t('staffs.form_delete.description_sub_4.merchant_operator')
        ]
      }
      if (USER_ROLE_CODE[this.staff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        results = [
          ...results,
          this.$t('staffs.form_delete.description_sub_1.merchant_supporter'),
          this.$t('staffs.form_delete.description_sub_2.merchant_supporter'),
          this.$t('staffs.form_delete.description_sub_3.merchant_supporter')
        ]
      }
      return results
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.DELETE_STAFF);
    },
    hideModal () {
      this.isVisibleDeleteForm = true;
      this.errorResult = null;
      this.$emit('on-close');
    },
    toggleVisibility () {
      this.isVisibleDeleteForm = !this.isVisibleDeleteForm;
    },
    handleSuccessfulDeleting () {
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleCloseSuccessResult () {
      this.$emit('on-reset');
      this.close();
    },
    handleCloseFailedResult () {
      this.toggleVisibility();
    },
    handleFailedDeleting (errorResult) {
      this.errorResult = errorResult;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    async handleSubmit () {
      try {
        this.isLoading = true;

        // Request to delete
        const result = await this.$axios.$delete(DELETE_STAFF_BY_ID?.(this.staff?.id));

        // The case the result is successful
        if (!result?.errors?.length) {
          this.handleSuccessfulDeleting();
          return;
        }

        // The case the result is failed
        this.handleFailedDeleting(result?.errors[0]?.key);
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key || 'error_system'
        this.handleFailedDeleting(keyError);
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-delete.scss" />
