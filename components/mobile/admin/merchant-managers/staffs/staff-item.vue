<template>
  <div class="role-management-item font-t10m grey-400">
    <div class="role-management-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="role-management-item__top-left flex-row">
        <span class="wallet-address">
          <span class="wallet-address__text">
            {{ staff?.walletAddress | formatHash }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${staff?.id}`"
            :value="staff?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </span>
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.nickname') }}</span>
      <div
        class="role-management-item__text font-t12m"
        :class="[{ 'underline': isOperator }]"
        @click="goToDashboardOperator"
      >
        {{ staff?.nickName }}
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.post_show_count') }}</span>
      <span class="role-management-item__text ">
        {{ postShownCount }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.post_hide_count') }}</span>
      <span class="role-management-item__text ">
        {{ OrderWaitingCount }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.type') }}</span>
      <span class="role-management-item__text ">
        {{ roleName }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_create') }}</span>
      <span class="role-management-item__text ">
        {{ staff?.createdAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_update') }}</span>
      <span class="role-management-item__text ">
        {{ staff?.updatedAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex align-items-start">
      <span
        class="role-management-item__status font-t12m grey-400"
        :class="classStatus"
      >
        {{ statusAsStr }}
      </span>
    </div>
  </div>
</template>

<script>
import roleManagementMixin from '@/mixins/role-management';
import { USER_ROLE, USER_STATUS } from '@/config/constant';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    staff: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      status: USER_STATUS[this.staff.status]
    }
  },
  computed: {
    statusAsBoolean () {
      return this.staff?.status === USER_STATUS.ACTIVE;
    },
    statusAsStr () {
      return this.$_roleManagementMixin_getLabelStatus(this.staff);
    },
    classStatus () {
      return this.$_roleManagementMixin_getClassStatus(this.staff);
    },
    OrderWaitingCount () {
      if (this.isOperator) {
        return (this.staff.statistic?.orderAppealCount || 0) + (this.staff.statistic?.orderWaitingCount || 0) + (this.staff.statistic?.orderWaitingUserCount || 0)
      }
      return '-'
    },
    postShownCount () {
      if (this.isOperator) {
        return this.item?.statistic?.postShownCount || 0
      }
      return '-'
    },
    roleName () {
      return this.$_roleManagementMixin_getLabelType(this.staff)
    },
    isOperator () {
      return this.staff?.type === USER_ROLE.MERCHANT_OPERATOR
    }
  },
  methods: {
    handleEdit (staff) {
      this.$emit('on-edit', staff);
    },
    goToDashboardOperator () {
      if (this.isOperator) {
        this.$router.push(`/staffs/${this.staff.id}/dashboard`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "static/assets/scss/components/mobile/role-management/item.scss";
  @import "static/assets/scss/components/mobile/merchant-manager/staffs/staff-item.scss";
</style>
