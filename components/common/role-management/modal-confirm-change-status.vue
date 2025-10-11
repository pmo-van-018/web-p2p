<template>
  <ModalCommon
    :id="modalId"
    :ref="MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT"
    modal-class="modal-small"
    :title="dataText?.title"
    :no-close-on-backdrop="true"
    @on-close="handleClickCancel"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="dataText?.image" alt="Icon Inactive" width="170" height="170">
      </div>

      <div class="wrapper">
        <div class="description">
          {{ dataText?.description }}
        </div>
      </div>

      <div class="button-group">
        <base-button
          v-if="isConfirmActive"
          variants="outlined"
          color="info"
          @click="handleClickCancel"
        >
          {{ $t('role_management.modal.cancel') }}
        </base-button>

        <base-button
          variants="contained"
          color="primary"
          @click="handleClickConfirm"
        >
          {{ $t('role_management.modal.confirm') }}
        </base-button>

        <base-button
          v-if="!isConfirmActive"
          variants="outlined"
          color="info"
          @click="handleClickCancel"
        >
          {{ $t('role_management.modal.cancel') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
import { DATE_TIME_FORMAT } from '@/config/constant';
import roleManagementMixin from '@/mixins/role-management';
export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    postfix: {
      type: String,
      default: ''
    },
    titleActive: {
      type: String,
      default: () => this.$t('merchant_managers.change_status.title_active')
    },
    titleInactive: {
      type: String,
      default: () => this.$t('merchant_managers.change_status.title_inactive')
    },
    imageActive: {
      type: String,
      default: '/assets/images/common/operation/active.svg'
    },
    imageInactive: {
      type: String,
      default: '/assets/images/common/operation/inactive.svg'
    },
    descriptionActive: {
      type: String,
      default: () => this.$t('merchant_managers.change_status.description_active')
    },
    descriptionInactive: {
      type: String,
      default: () => this.$t('merchant_managers.change_status.description_inactive')
    },
    isConfirmActive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      MODAL,
      DATE_TIME_FORMAT
    };
  },
  computed: {
    walletAddress () {
      if (this.$device.isDesktop) {
        return this.user?.walletAddress;
      }
      return this.$options.filters.formatHash(this.user?.walletAddress);
    },
    status () {
      const text = this.$_roleManagementMixin_getLabelStatus(this.user);
      const className = this.$_roleManagementMixin_getClassStatus(this.user);
      return { text, className };
    },
    dataText () {
      const iconActiveClass = 'icon-user-tick';
      const iconInactiveClass = 'icon-user-minus';
      const iconClassData = {
        [iconActiveClass]: {
          main: iconActiveClass,
          children: ['path1', 'path2', 'path3', 'path4']
        },
        [iconInactiveClass]: {
          main: iconInactiveClass,
          children: ['path1', 'path2', 'path3']
        }
      };
      return {
        title: this.isConfirmActive ? this.titleActive : this.titleInactive,
        description: this.isConfirmActive ? this.descriptionActive : this.descriptionInactive,
        icon: this.isConfirmActive ? iconClassData[iconActiveClass] : iconClassData[iconInactiveClass],
        image: this.isConfirmActive ? this.imageActive : this.imageInactive
      };
    },
    modalId () {
      return `${MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT}${this.postfix}`;
    }
  },
  methods: {
    handleClickCancel () {
      this.$emit('on-cancel');
    },
    handleClickConfirm () {
      this.$emit('on-confirm');
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-confirm-change-status.scss"></style>
