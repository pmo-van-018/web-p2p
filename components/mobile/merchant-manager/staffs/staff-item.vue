<template>
  <div class="role-management-item font-t10m grey-400">
    <div class="role-management-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="role-management-item__top-left flex-row">
        <span class="wallet-address">
          <span class="wallet-address__text" :class="{ disabled: isDeletedAt }">
            {{ staff?.walletAddress | formatHash }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${staff?.id}`"
            :value="staff?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </span>
      </div>

      <div v-if="!isDeletedAt" class="role-management-item__top-right d-flex justify-content-end align-items-start">
        <div class="actions">
          <span
            :id="'staff-icon-edit' + staff?.id"
            v-b-tooltip.focus
            tabindex="0"
            class="icon-edit"
            @click="handleEdit(staff)"
          />
          <b-tooltip :target="'staff-icon-edit' + staff?.id" triggers="focus" placement="top">
            {{ $t('role_management.item.edit') }}
          </b-tooltip>
        </div>
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDeletedAt }">
      <span>{{ $t('role_management.label.nickname') }}</span>
      <div
        class="role-management-item__text font-t12m"
        :class="[{ 'underline': isOperator }]"
        @click="gotoDashboardOperetor"
      >
        {{ staff?.nickName }}
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDeletedAt }">
      <span>{{ $t('role_management.label.post_show_count') }}</span>
      <span class="role-management-item__text ">
        {{ totalPostShowCount }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDisabledRowOrder }">
      <span>{{ $t('role_management.label.post_hide_count') }}</span>
      <template v-if="staff?.status === USER_STATUS.ACTIVE">
        <span class="role-management-item__text ">
          {{ totalOrderWaitingAndAppeal }}
        </span>
      </template>
      <template v-else>
        <div v-if="hasWaitingOrAppealCountOrder" class="role-management-item__view-orders" @click="$router.push(`/merchant-manager/staffs/${staff.id}/orders`)">
          <span class="role-management-item__number ">
            {{ totalOrderWaitingAndAppeal }}
          </span>
          <span class="icon-note-order" />
        </div>
        <span v-else class="role-management-item__text">{{ emptyOrder }}</span>
      </template>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDeletedAt }">
      <span>{{ $t('role_management.label.type') }}</span>
      <span class="role-management-item__text ">
        {{ roleName }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDeletedAt }">
      <span>{{ $t('role_management.label.time_create') }}</span>
      <span class="role-management-item__text ">
        {{ staff?.createdAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2" :class="{ disabled: isDeletedAt }">
      <span>{{ $t('role_management.label.time_update') }}</span>
      <span class="role-management-item__text ">
        {{ staff?.updatedAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex align-items-start mb-2" :class="{ disabled: isDeletedAt }">
      <span
        class="role-management-item__status font-t12m grey-400"
        :class="classStatus"
      >
        {{ statusAsStr }}
      </span>
    </div>
    <div v-if="isOperator" class="view-balance" @click="onOpenViewBalanceStaff(staff)">
      <svg>
        <use xlink:href="#balance" />
      </svg>
      <span class="view-balance__text">{{ $t('role_management.view_balance') }}</span>
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
      status: USER_STATUS[this.staff.status],
      USER_STATUS
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
    isDeletedAt () {
      return !!this.staff?.deletedAt
    },
    isDisabledRowOrder () {
      return !this.hasWaitingOrAppealCountOrder && this.isDeletedAt
    },
    orderWaitingCount () {
      return this.staff?.statistic?.orderWaitingCount || 0
    },
    orderAppealCount () {
      return this.staff?.statistic?.orderAppealCount || 0
    },
    emptyOrder () {
      if (this.isOperator) {
        return 0
      }
      return '-'
    },
    orderWaitingUserCount () {
      return this.staff?.statistic?.orderWaitingUserCount || 0
    },
    totalOrderWaitingAndAppeal () {
      if (this.isOperator) {
        return this.orderWaitingCount + this.orderAppealCount + this.orderWaitingUserCount
      }
      return '-'
    },
    totalPostShowCount () {
      if (this.isOperator) {
        return this.staff?.statistic?.postShownCount || 0
      }
      return '-'
    },
    hasWaitingOrAppealCountOrder () {
      return this.orderAppealCount > 0 || this.orderWaitingCount > 0 || this.orderWaitingUserCount > 0
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
    onOpenViewBalanceStaff (staff) {
      this.$emit('on-view-balance', staff);
    },
    gotoDashboardOperetor () {
      if (this.isOperator) {
        this.$router.push(`/merchant-manager/staffs/dashboard/${this.staff.id}`);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "static/assets/scss/components/mobile/role-management/item.scss";
  @import "static/assets/scss/components/mobile/merchant-manager/staffs/staff-item.scss";
</style>
