<template>
  <ModalCommon
    :id="MODAL.ADD_WALLET"
    :ref="MODAL.ADD_WALLET"
    :title="$t('merchant_managers.add_wallet_title')"
    modal-class="modal-small modal-mobile-bottom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconStaff" alt="icon avatar" width="120" height="120">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <p class="statement">Thêm địa chỉ ví khác của bạn để sử dụng</p>
      <b-form-group
        v-slot="{ ariaDescribedby }"
      >
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
      </b-form-group>
      <div class="btn-group">
        <base-button
          variants="contained"
          color="info"
          @click="close()"
        >
          Huỷ bỏ
        </base-button>
        <base-button
          variants="contained"
          color="primary"
          :disabled="disabledSubmit"
          :loading="isLoading"
          @click="handleSubmit"
        >
          Xác nhận
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import isEmpty from 'lodash/isEmpty'
import { MODAL } from '@/resources/modal.js'
import { mapActions, mapState } from 'vuex'
import { USER_ROLE } from '@/config/constant'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { ADD_WALLET_ADDRESS, ADMIN_ADD_WALLET_ADDRESS } from '~/api/wallet-address'
export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    managerId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      MODAL,
      walletAddress: null,
      isLoading: false,
      errorValidation: {
        walletAddress: false
      }
    }
  },
  computed: {
    ...mapState('user', ['user']),
    isRoleMerchantManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER
    },
    hasError () {
      return Object.values(this.errorValidation).includes(true);
    },
    disabledSubmit () {
      const emptyRequiredFields = !this.walletAddress
      return this.hasError || emptyRequiredFields;
    },
    getIconStaff () {
      return '/assets/images/common/operation/add-wallet.svg'
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.ADD_WALLET);
    },
    hideModal () {
      this.walletAddress = null;
      this.errorValidation = {
        walletAddress: false
      };
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
    async handleSubmit () {
      try {
        this.isLoading = true;
        let result;
        if (this.isRoleMerchantManager) {
          result = await this.$axios.$post(ADD_WALLET_ADDRESS, {
            walletAddress: this.walletAddress
          });
        } else {
          result = await this.$axios.$post(ADMIN_ADD_WALLET_ADDRESS, {
            walletAddress: this.walletAddress,
            managerId: this.managerId
          });
        }
        if (isEmpty(result?.errors)) {
          this.$emit('on-refresh-wallet')
          this.close()
          this.showResponseModal({
            title: this.$t('merchant_managers.wallet_address.add_wallet_succeed'),
            icon: RESPONSE_ICON.ADD_WALLET_SUCCEED,
            description: '',
            content: '',
            type: 'success',
            show: true
          });
          return;
        }
        this.handleError(result?.errors[0]?.key)
      } catch (error) {
        const keyError = error.response?.data?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } finally {
        this.isLoading = false;
      }
    },
    handleError (errorKey) {
      const modalConfig = {
        title: this.$t('merchant_managers.wallet_address.add_wallet_failed'),
        icon: RESPONSE_ICON.ADD_WALLET_FAILED,
        description: '',
        content: '',
        show: true
      };

      switch (errorKey) {
        case 'WALLET_ADDRESS_IS_EXISTED':
        case 'THE_WALLET_ADDRESS_IS_IN_THE_BLACKLIST':
          modalConfig.title = this.$t('merchant_managers.add_wallet_title')
          modalConfig.description = this.$t(`modal.message.${errorKey}`)
          modalConfig.confirmAction = this.$t('action.confirm');
          modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
          break;
        default:
          break;
      }

      this.showResponseModal(modalConfig);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-add-wallet.scss" />
