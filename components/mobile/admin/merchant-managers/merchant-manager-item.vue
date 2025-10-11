<template>
  <div class="role-management-item font-t10m grey-400">
    <div class="role-management-item__top d-flex justify-content-between align-align-items-start pb-1 mb-2">
      <div class="role-management-item__top-left flex-row">
        <span class="wallet-address">
          <span class="wallet-address__text">
            {{ merchantManager?.walletAddress | formatHash }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${merchantManager?.id}`"
            :value="merchantManager?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </span>
      </div>

      <div class="role-management-item__top-right d-flex justify-content-end align-items-start">
        <van-popover
          v-model="showActionsPopover"
          trigger="click"
          placement="bottom-end"
        >
          <template #reference>
            <span class="icon-edit-dots" />
          </template>
          <template #default>
            <p
              v-for="(action) in actions"
              :key="action?.text"
              class="role-management-item__action-item"
              @click="action?.func?.(merchantManager)"
            >
              {{ action.text }}
            </p>
          </template>
        </van-popover>
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.nickname') }}</span>
      <div
        class="role-management-item__text font-t12m underline"
        @click="goToDashboard(merchantManager)"
      >
        {{ merchantManager?.nickName }}
      </div>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.number_members') }}</span>
      <span class="role-management-item__text ">
        {{ merchantManager?.registeredMembers }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.contract_from') }}</span>
      <span class="role-management-item__text ">
        {{ merchantManager?.contractFrom | formatDateTime(DATE_TIME_FORMAT.DATE_ONLY) }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_create') }}</span>
      <span class="role-management-item__text ">
        {{ merchantManager?.createdAt | formatDateTime }}
      </span>
    </div>

    <div class="role-management-item__row d-flex justify-content-between align-items-center mb-2">
      <span>{{ $t('role_management.label.time_update') }}</span>
      <span class="role-management-item__text ">
        {{ merchantManager?.updatedAt | formatDateTime }}
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
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant';
import VanPopover from 'vant/lib/popover'
import 'vant/lib/popover/style'

export default {
  components: {
    VanPopover,
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    merchantManager: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      DATE_TIME_FORMAT,
      status: USER_STATUS[this.merchantManager.status],
      showActionsPopover: false,
      actions: [
        {
          func: this.handleEdit,
          text: this.$t('role_management.edit')
        },
        {
          func: this.handleClickListStaffs,
          text: this.$t('merchant_managers.staff_list'),
          className: 'staff-list'
        }
      ]
    }
  },
  computed: {
    statusAsBoolean () {
      return this.merchantManager?.status === USER_STATUS.ACTIVE;
    },
    statusAsStr () {
      return this.$_roleManagementMixin_getLabelStatus(this.merchantManager);
    },
    classStatus () {
      return this.$_roleManagementMixin_getClassStatus(this.merchantManager);
    }
  },
  methods: {
    handleEdit (merchantManager) {
      this.showActionsPopover = false;
      this.$emit('on-edit', merchantManager);
    },
    handleClickListStaffs (merchantManager) {
      const id = merchantManager?.id;
      if (!id) {
        return;
      }
      this.$router.push(`/merchant-managers/${id}/staffs`);
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/role-management/item.scss" />
