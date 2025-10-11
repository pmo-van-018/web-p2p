<template>
  <ModalCommon
    :id="MODAL.DELETE_MERCHANT_MANAGER"
    :ref="MODAL.DELETE_MERCHANT_MANAGER"
    :title="$t('merchant_managers.form_delete.title')"
    :modal-class="'modal-small ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/operation/delete.svg')" alt="Icon Delete" width="112">
      </div>

      <div class="description grey-600">
        {{ this.$t('merchant_managers.form_delete.description_main') }}
      </div>

      <div class="warning-group">
        <div class="d-flex align-items-center warning-group__head">
          <div class="warning-icon">
            <span class="icon-question" />
          </div>
          <div class="warning-group__title">{{ $t('staff.note') }}</div>
        </div>
        <div class="warning-info">
          <div class="info-block">
            <p class="step">1.</p>
            <p class="text">
              {{ this.$t('merchant_managers.form_delete.description_sub_1') }}
            </p>
          </div>
          <div class="info-block">
            <p class="step">2.</p>
            <p class="text">
              {{ this.$t('merchant_managers.form_delete.description_sub_2') }}
            </p>
          </div>
          <div class="info-block">
            <p class="step">3.</p>
            <p class="text">
              {{ this.$t('merchant_managers.form_delete.description_sub_3') }}
            </p>
          </div>
          <div class="info-block">
            <p class="step">4.</p>
            <p class="text">
              {{ this.$t('merchant_managers.form_delete.description_sub_4') }}
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
          {{ $t('merchant_managers.form_delete.confirm') }}
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
      :title="$t('merchant_managers.form_delete.title_success')"
      :description="$t('merchant_managers.form_delete.description_success')"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/staff-inactive-failed.svg')"
      :title="$t('merchant_managers.form_delete.title_failure')"
      :default-description="$t('merchant_managers.form_delete.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { DELETE_MERCHANT_MANAGER_BY_ID } from '@/api/merchant-manager';
import roleManagementMixin from '@/mixins/role-management';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    merchantManager: {
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
      return `_delete_${this.merchantManager?.id || ''}`;
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.DELETE_MERCHANT_MANAGER);
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
        const result = await this.$axios.$delete(DELETE_MERCHANT_MANAGER_BY_ID?.(this.merchantManager?.id));

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
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-delete.scss"></style>
