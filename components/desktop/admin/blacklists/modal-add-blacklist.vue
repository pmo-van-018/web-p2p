<template>
  <ModalCommon
    :id="MODAL.ADD_BLACK_LIST"
    :ref="MODAL.ADD_BLACK_LIST"
    :title="$t('blacklist.modal.add_title')"
    @hide-modal="hideModal"
  >
    <div class="add-blacklist">
      <div class="add-blacklist__container">
        <div class="add-blacklist__inner">
          <div class="add-blacklist__icon">
            <img src="/assets/images/common/blacklist/add-blacklist.svg" alt="icon blacklist" width="120" height="120">
          </div>
        </div>
        <div class="add-blacklist__inner">
          <p class="add-blacklist__text text-center m-0">{{ $t('blacklist.modal.description') }}</p>
        </div>
        <div class="add-blacklist__inner">
          <base-input-label
            ref="walletAddress"
            v-model="walletAddress"
            name="walletAddress"
            class="input mb-0"
            class-name="wallet-address-input"
            type="text"
            required="required"
            :label="$t('blacklist.label.wallet_address')"
            :placeholder="$t('blacklist.placeholder.wallet_address')"
            :label-require="$t('role_management.label.wallet_address')"
            is-wallet-address
            :error-wallet-address="$t('role_management.validation.error_wallet_address')"
            @error="handleErrorValidation"
          />
        </div>
        <div class="add-blacklist__inner">
          <div class="add-blacklist__action">
            <base-button
              variants="contained"
              color="info"
              full-width
              @click="close"
            >
              {{ $t('action.aborted') }}
            </base-button>
            <base-button
              variants="contained"
              color="primary"
              full-width
              :disabled="disabledSubmit"
              :loading="isLoading"
              @click="handleSubmit"
            >
              {{ $t('action.confirm') }}
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js'
import { mapActions, mapState } from 'vuex'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { BLACKLIST_API } from '@/api/blacklist';
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
    hasError () {
      return Object.values(this.errorValidation).includes(true);
    },
    disabledSubmit () {
      const emptyRequiredFields = !this.walletAddress
      return this.hasError || emptyRequiredFields;
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.ADD_BLACK_LIST);
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
        const result = await this.$axios.$post(BLACKLIST_API.ADD_WALLET_ADDRESS, {
          walletAddress: this.walletAddress
        });
        if (!result?.errors?.length) {
          this.$emit('on-refresh')
          this.close()
          this.showResponseModal({
            title: this.$t('blacklist.modal.add_title'),
            icon: RESPONSE_ICON.ADD_BLACK_LIST_SUCCESS,
            description: '',
            content: this.$t('blacklist.modal.message.add_success'),
            type: 'success',
            show: true
          });
          return;
        }
        const keyError = result?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } catch (error) {
        const keyError = error.response?.data?.errors?.[0]?.key || 'error_system'
        this.handleError(keyError)
      } finally {
        this.isLoading = false;
      }
    },
    handleError (keyError) {
      const modalConfig = {
        title: this.$t('blacklist.modal.add_title'),
        icon: RESPONSE_ICON.ADD_BLACK_LIST_FAILED,
        description: this.$t(`modal.message.${keyError}`),
        content: this.$t('blacklist.modal.message.add_failure'),
        confirmAction: this.$t('action.confirm'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        show: true
      };
      if (keyError === 'THE_WALLET_ADDRESS_IS_IN_THE_BLACKLIST') {
        modalConfig.title = this.$t('merchant_managers.add_wallet_title')
        modalConfig.description = this.$t(`modal.message.${keyError}`)
        modalConfig.confirmAction = this.$t('action.confirm');
        modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
      }

      this.showResponseModal(modalConfig);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/admin/blacklists/add-modal-blacklist.scss" />
