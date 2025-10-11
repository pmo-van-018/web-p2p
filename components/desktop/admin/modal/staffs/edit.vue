<template>
  <modal-common
    :id="MODAL.EDIT_ADMIN_STAFF"
    :ref="MODAL.EDIT_ADMIN_STAFF"
    :title="$t('staffs.form_edit.title')"
    :modal-class="'modal-small modal-mobile-bottom'"
    @shown-modal="onShownModal"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconStaff" alt="icon avatar">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group v-if="isActived && !disableEdit" v-slot="{ ariaDescribedby }" :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <BaseInputLabel
          ref="walletAddress"
          v-model="walletAddress"
          name="walletAddress"
          class="input mb-0"
          class-name="wallet-address-input"
          type="text"
          required="required"
          :is-show-label="false"
          :aria-describedby="ariaDescribedby"
          :placeholder="$t('role_management.label.wallet_address_input')"
          :label="$t('role_management.label.wallet_address')"
          :label-require="$t('role_management.label.wallet_address')"
          is-wallet-address
          :error-wallet-address="$t('role_management.validation.error_wallet_address')"
          @error="handleErrorValidation"
        />
        <p v-if="statusAsBoolean" class="desc-action-status">
          <span class="desc-action-status__text"> {{ $t('role_management.label.heed') }}</span>
          {{ $t('role_management.label.desc_wallet_active_staff') }}
        </p>
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ staff?.walletAddress || '' }}</p>
      </b-form-group>
      <b-form-group v-if="!disableEdit" v-slot="{ ariaDescribedby }" :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <BaseInputLabel
          ref="nickName"
          v-model="nickName"
          name="nickName"
          class="input mb-0"
          class-name="nickname-input"
          type="text"
          required="required"
          alpha-num
          :is-show-label="false"
          :aria-describedby="ariaDescribedby"
          :placeholder="$t('role_management.label.nickname_input')"
          :label="$t('role_management.label.nickname')"
          :label-require="$t('role_management.label.nickname')"
          :min-length="VALIDATION_RULES.MIN_LENGTH_NICKNAME"
          :max-length="VALIDATION_RULES.MAX_LENGTH_NICKNAME"
          @error="handleErrorValidation"
        />
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ nickName }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.merchant')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ staff?.merchantManagerNickName || '' }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.role_text')">
        <span class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">
          {{ convertRoleToText() }}
        </span>
      </b-form-group>

      <b-form-group v-slot="{ ariaDescribedby }" :label="$t('role_management.label.status')">
        <div class="status-box d-flex align-items-start" :aria-describedby="ariaDescribedby">
          <switch-checkbox :value="statusAsBoolean" @click="onChangeStatusStaff" />
          <span class="status-box__text ml-2 font-t12m grey-400" :class="status?.className">
            {{ status?.text }}
          </span>
        </div>
      </b-form-group>
    </div>
    <div class="button-group">
      <base-button
        variants="contained"
        color="info"
        @click="onDeleteAccount"
      >
        {{ $t('role_management.delete') }}
      </base-button>
      <base-button
        variants="contained"
        color="primary"
        :disabled="disabledSubmit"
        @click="onUpdateStaff"
      >
        {{ $t('role_management.modal.save') }}
      </base-button>
    </div>
  </modal-common>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { LIST_STATUS, VALIDATION_RULES } from '@/resources/role-management';
import roleManagementMixin from '@/mixins/role-management';
import isEmpty from 'lodash/isEmpty';
import { ADMIN_STAFF } from '@/api/admin-staff';
import { mapState } from 'vuex';
import { USER_ROLE, USER_ROLE_CODE, USER_ROLE_STRING, USER_STATUS } from '@/config/constant';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue')
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
      LIST_STATUS,
      walletAddress: '',
      nickName: '',
      merchantManagerNickName: '',
      statusAsBoolean: false,
      errorValidation: {
        walletAddress: false,
        nickName: false
      },
      VALIDATION_RULES,
      isActived: false,
      roleCodes: USER_ROLE_CODE,
      roleCodeSelected: USER_ROLE_CODE[this.staff?.type],
      USER_ROLE_STRING,
      USER_STATUS
    };
  },
  computed: {
    ...mapState('user', ['user']),
    disabledSubmit () {
      if (!this.isActived) {
        const emptyRequiredFields = !this.walletAddress || !this.nickName;
        return this.hasError || emptyRequiredFields;
      }
      return this.statusAsBoolean === (this.staff?.status === LIST_STATUS.ACTIVE.name);
    },
    disableEdit () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
    },
    postfix () {
      return `_edit_${this.staff?.id || ''}`;
    },
    isActiveStatus () {
      return this.staff?.status === LIST_STATUS.ACTIVE.name
    },
    hasError () {
      return this.$_roleManagementMixin_hasFormError(this.errorValidation);
    },
    getIconStaff () {
      return this.$_roleManagementMixin_getIconByStaffRole(this.staff?.type, this.statusAsBoolean)
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_STAFF)
    },
    onDeleteAccount () {
      this.$emit('on-delete')
    },
    onUpdateStaff () {
      this.$emit('on-update-status', {
        statusAsBoolean: this.statusAsBoolean,
        currentStatus: this.status.id,
        walletAddress: this.walletAddress,
        nickName: this.nickName,
        type: this.roleCodeSelected.id
      })
    },
    onChangeStatusStaff () {
      this.statusAsBoolean = !this.statusAsBoolean
      this.onUpdateStaff()
    },
    onShownModal () {
      this.isActived = !this.staff?.activatedAt
      this.walletAddress = this.staff?.walletAddress
      this.nickName = this.staff?.nickName
      this.merchantManagerNickName = this.staff?.merchantManagerNickName
      this.statusAsBoolean = this.staff?.status === LIST_STATUS.ACTIVE.name
      this.roleCodeSelected = USER_ROLE_CODE[this.staff?.type];
    },
    handleErrorValidation (errorValidation) {
      if (!errorValidation?.name) {
        return;
      }

      this.errorValidation = {
        ...this.errorValidation,
        [errorValidation.name]: errorValidation.error
      };
    },
    hideModal () {
      this.walletAddress = null
      this.nickName = null
      this.statusAsBoolean = true
      this.errorValidation = {
        walletAddress: false,
        nickName: false
      };
      this.$emit('on-close')
    },
    convertRoleToText () {
      return this.$_roleManagementMixin_convertRoleToText(this.staff?.type)
    },
    handleFailedCreating (errorResult) {
      this.errorResult = errorResult;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    toggleVisibility () {
      this.isVisibleUpdateForm = !this.isVisibleUpdateForm;
    },
    handleSuccessfulCreating (staff) {
      this.successfulResult = staff;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    async handleSubmit () {
      try {
        this.isLoading = true;

        // Request to update
        const result = await this.$axios.$put(ADMIN_STAFF.UPDATE_STAFF_BY_ID?.(this.staff?.id), {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id,
          id: this.staff?.id,
          type: this.staff?.type
        });

        // The case the result is successful
        if (!isEmpty(result?.data)) {
          this.handleSuccessfulCreating(result.data);
          return;
        }

        // The case the result is failed
        this.handleFailedCreating(result);
      } catch (e) {
        this.handleFailedCreating(e);
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    disabledRole (role) {
      return role !== this.roleCodeSelected;
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-edit.scss" />
