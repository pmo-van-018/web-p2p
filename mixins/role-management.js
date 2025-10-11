import isArray from 'lodash/isArray';
import { MODAL } from '@/resources/modal';
import { LIST_STATUS } from '@/resources/role-management';
import { USER_ROLE, USER_ROLE_STRING } from '@/config/constant.js'

export default {
  data () {
    return {
      MODAL,
      selectedStaff: null
    };
  },
  methods: {
    $_roleManagementMixin_getLabelStatus (user) {
      if (!user?.status) {
        return '';
      }
      if (user?.deletedAt) {
        return this.$t('role_management.item.deleted');
      }
      return this.$t(`role_management.item.${user.status.toLowerCase()}`);
    },
    $_roleManagementMixin_getClassStatus (user) {
      if (!user?.status) {
        return '';
      }
      if (user?.deletedAt) {
        return 'deleted-status';
      }
      return `${user.status?.toLowerCase()}-status`;
    },
    $_roleManagementMixin_getLabelType (user) {
      const roleNames = {
        [USER_ROLE.MERCHANT_OPERATOR]: 'Giao dịch viên',
        [USER_ROLE.MERCHANT_SUPPORTER]: 'Hỗ trợ viên',
        [USER_ROLE.MERCHANT_MANAGER]: 'Thương gia',
        [USER_ROLE.SUPER_ADMIN]: 'Quản trị viên'
      };
      return roleNames[user?.type] || '';
    },
    $_roleManagementMixin_getStatus (statusAsBoolean) {
      const id = statusAsBoolean ? LIST_STATUS.ACTIVE.id : LIST_STATUS.INACTIVE.id;
      const name = statusAsBoolean ? LIST_STATUS.ACTIVE.name : LIST_STATUS.INACTIVE.name;
      const text = this.$_roleManagementMixin_getLabelStatus({ status: name });
      const className = this.$_roleManagementMixin_getClassStatus({ status: name });
      return { text, className, id, name };
    },
    $_roleManagementMixin_getModalClassCustom (isVisible) {
      if (isVisible) {
        return '';
      }
      return 'hidden';
    },
    $_roleManagementMixin_hasFormError (errorValidation) {
      return Object.values(errorValidation).includes(true);
    },
    $_roleManagementMixin_getChildModalId (name, postfix) {
      return `${name}${postfix}`;
    },
    $_roleManagementMixin_showChildModal (name, postfix) {
      this.$bvModal.show(this.$_roleManagementMixin_getChildModalId(name, postfix));
    },
    $_roleManagementMixin_hideChildModal (name, postfix) {
      this.$bvModal.hide(this.$_roleManagementMixin_getChildModalId(name, postfix));
    },
    $_roleManagementMixin_getNicknameByWalletAddress (walletAddress) {
      if (!walletAddress) {
        return;
      }
      return `V${walletAddress.substring(walletAddress.length - 14)}`;
    },
    $_roleManagementMixin_getTableFields (data) {
      if (!isArray(data)) {
        return [];
      }
      const fields = data.map(field => ({
        ...field,
        label: this.$t(field?.label),
        subLabel: this.$t(field?.subLabel)
      }));
      return fields;
    },
    $_roleManagementMixin_getMerchantType (data) {

    },
    goToDashboard (item) {
      const id = item?.id;
      if (!id) {
        return;
      }
      this.$router.push(`/merchant-managers/dashboard/${id}`);
    },
    goToProfile (item) {
      const id = item?.id;
      if (!id) {
        return;
      }
      this.$router.push(`/merchant-managers/profile/${id}`);
    },
    $_roleManagementMixin_getIconByStaffRole (type, statusAsBoolean) {
      const baseUrl = '/assets/images/common/operation/';
      if (type === USER_ROLE.MERCHANT_OPERATOR) {
        return statusAsBoolean ? baseUrl.concat('operator-enable.svg') : baseUrl.concat('operator-disable.svg')
      } else if (type === USER_ROLE.MERCHANT_SUPPORTER) {
        return statusAsBoolean ? baseUrl.concat('supporter-enable.svg') : baseUrl.concat('supporter-disable.svg')
      }
      return null
    },
    $_roleManagementMixin_convertRoleToText (type) {
      return USER_ROLE_STRING[type];
    },
    $_formatWalletHash (walletAddress) {
      return this.$options.filters.formatHash(walletAddress)
    }
  }
};
