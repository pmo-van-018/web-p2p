import roleManagementMixin from '@/mixins/role-management';
import { MODAL } from '@/resources/modal.js';
import { ACTIVE_MERCHANT_MANAGER_BY_ID, INACTIVE_MERCHANT_MANAGER_BY_ID } from '@/api/merchant-manager';
import { LIST_STATUS } from '@/resources/role-management';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { mapActions } from 'vuex';

export default {
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
      LIST_STATUS,
      DATE_TIME_FORMAT,
      statusAsBoolean: this.merchantManager?.status === LIST_STATUS.ACTIVE.name,
      isLoading: false,
      successfulResult: null,
      errorResult: null
    };
  },
  computed: {
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
    },
    postfix () {
      return '_change_status_merchant_manager';
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    handleSuccessfulEditing (merchantManager) {
      this.successfulResult = merchantManager;
      this.$_roleManagementMixin_showChildModal(MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleFailedEditing (errorResult) {
      this.errorResult = errorResult;
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleClickStatus () {
      this.$_roleManagementMixin_showChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
    },
    async handleConfirmChangeStatus () {
      this.$_roleManagementMixin_hideChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
      try {
        this.isLoading = true;
        let status;
        let result;
        if (this.statusAsBoolean) {
          result = await this.$axios.$put(INACTIVE_MERCHANT_MANAGER_BY_ID(this.merchantManager?.id));
          status = LIST_STATUS.INACTIVE.name;
        } else {
          result = await this.$axios.$put(ACTIVE_MERCHANT_MANAGER_BY_ID(this.merchantManager?.id));
          status = LIST_STATUS.ACTIVE.name;
        }
        // The case the result is successful
        if (result?.errors?.length) {
          const keyError = result?.errors[0].key
          if (keyError === 'CANNOT_DISABLE_MANAGER_HAS_PENDING_ORDER') {
            this.showResponseModal({
              title: this.$t('modal.title.warning_system'),
              description: this.$t(`modal.message.${keyError}`),
              icon: RESPONSE_ICON.STAFF_INACTIVE_FAILED,
              confirmAction: this.$t('action.confirm'),
              confirmActionType: CONFIRM_TYPE.CLOSE,
              show: true
            });
            return
          }
        }
        this.statusAsBoolean = !this.statusAsBoolean;
        const payload = {
          walletAddress: this.merchantManager.walletAddress,
          nickName: this.merchantManager.nickName,
          contractFrom: this.merchantManager.contractFrom,
          status,
          id: this.merchantManager?.id
        }
        this.handleSuccessfulEditing(payload);
      } catch (e) {
        this.statusAsBoolean = !this.statusAsBoolean;
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    handleCancelChangeStatus () {
      this.$_roleManagementMixin_hideChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
    }
  }
}
