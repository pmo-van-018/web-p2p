<template>
  <section class="card-item">
    <div :class="['card-item__container', { 'card-item__container--last': isLastItem }]">
      <div class="card-item__head">
        <div class="card-item__wallet">
          <span class="card-item__address">
            {{ item?.walletAddress | formatHash }}
          </span>

          <copy-button
            :id="`wallet-address-copy-${item?.id}`"
            class="card-item__icon"
            :value="item?.walletAddress"
            :text-guide="$t('role_management.label.copy_wallet_address')"
          />
        </div>
        <span class="card-item__icon icon-edit" @click="$emit('on-update', item)" />
      </div>
      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.nickname') }}</div>
        <div :class="['card-item__value', { 'underline': isOperator }]" @click="gotoDashboardOperetor">{{ item.nickName }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.post_online') }}</div>
        <div class="card-item__value">{{ postShownCount }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.pending_orders') }}</div>
        <div class="card-item__value">{{ OrderWaitingCount }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.type') }}</div>
        <div class="card-item__value">{{ roleName }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.merchant') }}</div>
        <div class="card-item__value">{{ item.merchantManagerNickName }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.created_at') }}</div>
        <div class="card-item__value">{{ item.createdAt | formatDateTime }}</div>
      </div>

      <div class="card-item__content">
        <div class="card-item__text">{{ $t('staff.key.updated_at') }}</div>
        <div class="card-item__value">{{ item.updatedAt | formatDateTime }}</div>
      </div>

      <div :class="['card-item__status', statusClass]">
        <div class="card-item__status-inner">{{ statusText }}</div>
      </div>
    </div>
  </section>
</template>
<script>
import { USER_ROLE, USER_STATUS } from '@/config/constant';
import roleManagementMixin from '@/mixins/role-management';

export default {
  components: {
    CopyButton: () => import('~/components/common/copy-button.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isLastItem: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusText () {
      return this.item.status === USER_STATUS.ACTIVE ? this.$t('staff.active')
        : this.$t('staff.inactive')
    },
    statusClass () {
      return this.item.status === USER_STATUS.ACTIVE ? 'active' : null
    },
    OrderWaitingCount () {
      if (this.isOperator) {
        return (this.item.statistic?.orderAppealCount || 0) + (this.item.statistic?.orderWaitingCount || 0) + (this.item.statistic?.orderWaitingUserCount || 0)
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
      return this.$_roleManagementMixin_getLabelType(this.item);
    },
    isOperator () {
      return this.item.type === USER_ROLE.MERCHANT_OPERATOR
    }
  },
  methods: {
    gotoDashboardOperetor () {
      if (this.isOperator) {
        this.$router.push(`/staffs/${this.item.id}/dashboard`);
      }
    }
  }
}
</script>
<style lang="scss" scoped src="../../../../static/assets/scss/components/mobile/admin/staffs/item.scss">
</style>
