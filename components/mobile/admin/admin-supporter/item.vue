<template>
  <div class="role-management-item font-t10m grey-400">
    <div class="role-management-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="role-management-item__top-left flex-row">
        <div
          class="font-t12m grey-900"
        >
          {{ adminSupporter?.nickName }}
        </div>
      </div>

      <div class="role-management-item__top-right d-flex justify-content-end align-items-start">
        <div class="role-management-item__row d-flex align-items-start">
          <span
            class="role-management-item__status font-t12m grey-400"
            :class="classStatus"
          >
            {{ statusAsStr }}
          </span>
        </div>
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.wallet_address') }}</span>
      <span class="wallet-address">
        <span class="wallet-address__text">
          {{ adminSupporter?.walletAddress | formatHash }}
        </span>

        <copy-button
          :id="`wallet-address-copy-${adminSupporter?.id}`"
          :value="adminSupporter?.walletAddress"
          :text-guide="$t('role_management.label.copy_wallet_address')"
        />
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.complaints_support') }}</span>
      <span class="role-management-item__text ">
        {{ adminSupporter?.pickAppealCount || 0 }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.request_support') }}</span>
      <span class="role-management-item__text ">
        {{ adminSupporter?.pickSupportRequestCount || 0 }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_create') }}</span>
      <span class="role-management-item__text ">
        {{ adminSupporter?.createdAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_update') }}</span>
      <span class="role-management-item__text ">
        {{ adminSupporter?.updatedAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex align-items-center justify-content-end">
      <span class="role-management-item__action-edit icon-edit" @click="handleEdit(adminSupporter)"></span>
    </div>
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { USER_STATUS } from '@/config/constant';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    adminSupporter: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      status: USER_STATUS[this.adminSupporter.status]
    }
  },
  computed: {
    statusAsBoolean () {
      return this.adminSupporter?.status === USER_STATUS.ACTIVE;
    },
    statusAsStr () {
      return this.$_roleManagementMixin_getLabelStatus(this.adminSupporter);
    },
    classStatus () {
      return this.$_roleManagementMixin_getClassStatus(this.adminSupporter);
    }
  },
  methods: {
    handleEdit (adminSupporter) {
      this.$emit('on-edit', adminSupporter);
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/item.scss" />
