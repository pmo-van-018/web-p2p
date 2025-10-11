<template>
  <modal-common
    :id="modalId"
    :ref="MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT"
    :title="dataText?.title"
    modal-class="modal-small"
  >
    <div class="modal-content">
      <span :class="dataText?.icon?.main">
        <span v-for="child in dataText?.icon?.children" :key="child" :class="child" />
      </span>

      <div class="description grey-600">
        {{ dataText?.description }}
      </div>

      <div class="button-group">
        <base-button
          v-if="isConfirmActive"
          variants="contained"
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
          variants="contained"
          color="info"
          @click="handleClickCancel"
        >
          {{ $t('role_management.modal.cancel') }}
        </base-button>
      </div>
    </div>
  </modal-common>
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
    title: {
      type: Object,
      default: () => ({
        active: this.$t('merchant_managers.change_status.title_active'),
        inActive: this.$t('merchant_managers.change_status.title_inactive')
      })
    },
    description: {
      type: Object,
      default: () => ({
        active: this.$t('merchant_managers.change_status.description_active'),
        inActive: this.$t('merchant_managers.change_status.description_inactive')
      })
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
        title: this.isConfirmActive ? this.title.active : this.title.inActive,
        description: this.isConfirmActive ? this.description.active : this.description.inActive,
        icon: this.isConfirmActive ? iconClassData[iconActiveClass] : iconClassData[iconInactiveClass]
      };
    },
    modalId () {
      return `${MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT}`;
    }
  },
  methods: {
    handleClickCancel () {
      this.$bvModal.hide(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
      this.$emit('on-cancel')
    },
    handleClickConfirm () {
      this.$emit('on-confirm')
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-confirm-change-status.scss"></style>
