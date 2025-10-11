<template>
  <ModalCommon
    :id="modalId"
    :ref="MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT"
    :title="title"
    modal-class="modal-small"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto mt-3">
        <img :src="icon" :alt="title" :width="user ? 170 : 200" :height="user ? 170 : 200">
      </div>

      <div v-if="user" class="user-info">
        <div class="row-info">
          <div class="label">{{ $t('role_management.label.wallet_address') }}</div>
          <div class="value wallet-address">
            <span class="wallet-address__name">
              {{ walletAddress }}
            </span>

            <copy-button
              :id="`wallet-address-copy-${user?.id}-in-popup`"
              :value="user?.walletAddress"
              :text-guide="$t('role_management.label.copy_wallet_address')"
            />
          </div>
        </div>

        <div class="row-info">
          <span class="label">{{ $t('role_management.label.nickname') }}</span>
          <span class="value">
            {{ nickName }}
          </span>
        </div>

        <div v-if="isShowContractFrom" class="row-info">
          <span class="label">{{ $t('role_management.label.contract_from') }}</span>
          <span class="value">
            {{ user?.contractFrom | formatDateTime(DATE_TIME_FORMAT.DATE_VIEW) }}
          </span>
        </div>

        <div class="row-info">
          <span class="label">{{ $t('role_management.label.status') }}</span>
          <span
            class="status font-t12m grey-400"
            :class="status.className"
          >
            {{ status.text }}
          </span>
        </div>
      </div>
    </div>
  </ModalCommon>
</template>

<script>
import { MODAL } from '@/resources/modal';
import { DATE_TIME_FORMAT } from '@/config/constant';
import roleManagementMixin from '@/mixins/role-management';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    postfix: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: () => this.$t('merchant_managers.form_create.title_success')
    },
    description: {
      type: String,
      default: () => this.$t('merchant_managers.form_create.description_success')
    },
    icon: {
      type: String,
      require: true
    },
    user: {
      type: Object,
      default: null
    },
    isShowContractFrom: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
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
    nickName () {
      const nickName = this.user?.nickName || ''
      if (nickName.length <= 25 || this.$device.isDesktop) {
        return nickName
      }
      return nickName.substring(0, 22) + '...'
    },
    status () {
      const text = this.$_roleManagementMixin_getLabelStatus(this.user);
      const className = this.$_roleManagementMixin_getClassStatus(this.user);
      return {
        text,
        className
      };
    },
    modalId () {
      return `${MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT}${this.postfix}`;
    }
  },
  methods: {
    hideModal () {
      this.$emit('on-close');
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-success.scss"></style>
