<template>
  <modal-common
    :id="MODAL.DELETE_ADMIN_SUPPORTER"
    :ref="MODAL.DELETE_ADMIN_SUPPORTER"
    :title="$t('admin_supporter.form_delete.title')"
    :modal-class="'modal-small ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="require('~imageRoot/common/operation/delete.svg')" alt="Icon Delete" width="112">
      </div>

      <div class="description grey-600">
        {{ this.$t('admin_supporter.form_delete.description_main') }}
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
              {{ this.$t('admin_supporter.form_delete.description_sub_1') }}
            </p>
          </div>
          <div class="info-block">
            <p class="step">2.</p>
            <p class="text">
              {{ this.$t('admin_supporter.form_delete.description_sub_2') }}
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
          {{ $t('action.confirm') }}
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

    <modal-success-result
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/delete-succeed.svg')"
      :title="$t('admin_supporter.form_delete.title_success')"
      :description="$t('admin_supporter.form_delete.description_success')"
      @on-close="handleCloseSuccessResult"
    />

    <modal-failure-result
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/staff-inactive-failed.svg')"
      :title="$t('admin_supporter.form_delete.title_failure')"
      :default-description="$t('admin_supporter.form_delete.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </modal-common>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { ACCOUNT_BY_ID } from '@/api/admin-supporter';
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
    adminSupporter: {
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
      return `_delete_${this.adminSupporter?.id || ''}`;
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.DELETE_ADMIN_SUPPORTER);
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
        const result = await this.$axios.$delete(ACCOUNT_BY_ID?.(this.adminSupporter?.id));

        // The case the result is successful
        if (!result?.errors?.length) {
          this.handleSuccessfulDeleting(result.data);
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
