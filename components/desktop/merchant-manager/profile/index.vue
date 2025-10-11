<template>
  <div class="profile-information">
    <div class="profile-information__container">
      <div class="profile-information__head">
        <div class="information-head">
          <div class="information-head__icon" @click="onGoBack">
            <span class="information-head__icon-left icon-chevron-right1" />
          </div>
          <div class="information-head__content">{{ $t('role_management.information_profile') }}</div>
        </div>
      </div>
      <div class="profile-information__body">
        <div class="information">
          <div class="information__container">
            <div class="information__head">
              <div class="information__head-inner">
                <div
                  class="information__avatar"
                  @click="handleOpenEditAvatar"
                >
                  <img
                    v-if="avatar"
                    :src="avatar"
                    alt="avatar"
                  >
                  <span v-else>{{ avatarChar }}</span>
                  <span v-if="isMerchantManager" class="information__edit-avatar">
                    <span class="icon-edit" />
                  </span>
                </div>
                <div class="information__info">
                  <div class="information__name">{{ nickName }}</div>
                  <div class="information__date-time">
                    <div class="information__date"><span>{{ $t('role_management.label.contract_from') }}:</span> {{ contractFrom }}</div>
                    <div class="information__date"><span>{{ $t('role_management.label.time_create') }}:</span> {{ createdAt }}</div>
                    <div class="information__date"><span>{{ $t('role_management.label.time_update') }}:</span> {{ updatedAt }}</div>
                    <div v-if="isRoleAdmin" class="information__date"><span>{{ $t('role_management.label.registered_member') }}:</span> {{ registeredMembers }}</div>
                  </div>
                </div>
              </div>
              <div v-if="isDeleteProfile" class="information__head-action">
                <base-button
                  variants="contained"
                  color="info"
                  @click="onDeleteMerchantManager"
                >
                  {{ $t('action.delete_profile') }}
                </base-button>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <div v-if="isAdmin" class="profile-action adjustment">
            <div class="profile-action__container">
              <div class="profile-action__left">
                <div class="profile-action__text">{{ $t('role_management.rate_comleted') }}</div>
              </div>
              <div class="profile-action__adjustment" @click="onOpenAdjustmentRate">{{ $t('role_management.adjustment') }}</div>
            </div>
          </div>
          <div v-if="isEditChangeStatus" class="profile-action">
            <div class="profile-action__container">
              <div class="profile-action__left">
                <div class="profile-action__text">{{ $t('role_management.label.status') }}:</div>
                <div class="profile-action__switch">
                  <switch-checkbox :value="statusAsBoolean" :loading="isSubmitChangeStatusLoading" @click="onChangeStatus" />
                  <div class="profile-action__status" :class="{'active': statusAsBoolean}">{{ statusText }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isAdmin" class="profile-action ml-4">
            <div class="profile-action__container">
              <div class="profile-action__left">
                <div class="profile-action__text">{{ $t('gasless.title') }}:</div>
                <div class="profile-action__switch">
                  <switch-checkbox :value="allowGaslessBoolean" @click="onToggleStatusGasless" />
                </div>
              </div>
              <div class="profile-action__right">
                <CryptoInput
                  v-model="gaslessInputValue"
                  placeholder=""
                  type="tel"
                  unit="USDT"
                  :min-value="null"
                  :max-value="maxvalue"
                  :limit-input="15"
                  :required="false"
                  :allow-decimal="false"
                  :is-show-label="false"
                  :allow-leading-zeroes="false"
                />
                <base-button
                  :loading="isSubmitChangeGaslessStatusLoading"
                  :disabled="isSubmitChangeGaslessStatusLoading"
                  color="primary"
                  variants="text"
                  @click="onChangeGaslessAction"
                >
                  {{ $t('action.save') }}
                </base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <client-only>
      <modal-confirm-change-status
        :title-active="this.$t('merchant_managers.change_status.title_active')"
        :title-inactive="this.$t('merchant_managers.change_status.title_inactive')"
        :description-active="this.$t('merchant_managers.change_status.description_active')"
        :description-inactive="this.$t('merchant_managers.change_status.description_inactive')"
        :is-confirm-active="!statusAsBoolean"
        @on-confirm="onSubmitChangeStatus"
        @on-cancel="onCancelChangeStatus"
      />
      <modal-success-result
        is-show-contract-from
        :icon="require('~imageRoot/common/operation/manager-succeed.svg')"
        :title="$t('merchant_managers.form_edit.title_success')"
        :description="$t('merchant_managers.form_edit.description_success')"
        :user="successfulResult"
      />

      <modal-failure-result
        is-show-old-user
        is-show-contract-from
        :icon="require('~imageRoot/common/operation/manager-failed.svg')"
        :title="$t('merchant_managers.form_edit.title_failure')"
        :default-description="$t('merchant_managers.form_edit.description_failure')"
        :error-result="errorResult"
        :user="profileInformation"
      />
      <modal-delete
        :merchant-manager="profileInformation"
        @on-reset="onResetSuccessResult"
      />
      <modal-change-avatar
        :avatar-list="avatarList"
        :prefix-link="user.prefixAvatarLink"
        @on-submit="updateAvatar"
      />
      <modal-adjustment-rate
        :manager="profileInformation"
        :assets="assets"
        @on-confirm="onAdjustRate"
        @on-cancel="onHideAdjustmentRate"
      />
    </client-only>
  </div>
</template>
<script>
import { ACTIVE_MERCHANT_MANAGER_BY_ID, GET_LIST_AVATAR, INACTIVE_MERCHANT_MANAGER_BY_ID, UPDATE_AVATAR, SET_GASLESS_BY_ID, ADJUST_RATE } from '@/api/merchant-manager';
import { CRYPTO_INPUT_MAX_VALUE, DATE_TIME_FORMAT, DIFF_DATE_FORMAT, USER_ROLE, USER_STATUS } from '@/config/constant';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { MODAL } from '@/resources/modal';
import { getMerchantAvatar } from '@/helper/avatar-util';
import dayjs from 'dayjs';
import { mapActions, mapState } from 'vuex';
import { LIST_STATUS } from '@/resources/role-management';

export default {
  components: {
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    CryptoInput: () => import('@/components/common/home/crypto-input.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue'),
    ModalDelete: () => import('~/components/common/merchant-managers/modal-delete.vue'),
    ModalChangeAvatar: () => import('~/components/common/modal/modal-change-avatar.vue'),
    ModalAdjustmentRate: () => import('~/components/common/role-management/modal-adjustment-rate.vue')
  },
  props: {
    profileInformation: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      statusAsBoolean: false,
      allowGaslessBoolean: false,
      gaslessInputValue: null,
      isSubmitChangeStatusLoading: false,
      isSubmitChangeGaslessStatusLoading: false,
      successfulResult: null,
      errorResult: null,
      avatarList: [],
      maxvalue: CRYPTO_INPUT_MAX_VALUE
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('resources', ['assets']),
    avatar () {
      const avatar = this.isRoleAdmin ? this.profileInformation?.avatar : this.user?.avatar
      return getMerchantAvatar(avatar)
    },
    isAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    isMerchantManager () {
      return this.user?.type === USER_ROLE.MERCHANT_MANAGER
    },
    nickName () {
      return this.profileInformation?.nickName || ''
    },
    isEditChangeStatus () {
      return this.profileInformation?.isChangeStatus || false
    },
    isDeleteProfile () {
      return this.profileInformation?.isDeleteProfile || false
    },
    contractFrom () {
      return dayjs(this.profileInformation?.contractFrom).format(DATE_TIME_FORMAT.DATE_VIEW)
    },
    registeredMembers () {
      return this.profileInformation?.registeredMembers || 0
    },
    createdAt () {
      return dayjs(this.profileInformation?.createdAt).format(DIFF_DATE_FORMAT)
    },
    updatedAt () {
      return dayjs(this.profileInformation?.updatedAt).format(DIFF_DATE_FORMAT)
    },
    avatarChar () {
      return this.nickName ? this.nickName.substring(0, 1) : 'A'
    },
    isActiveStatus () {
      return this.profileInformation?.status === USER_STATUS.ACTIVE
    },
    isRoleAdmin () {
      return this.user?.type === USER_ROLE.SUPER_ADMIN
    },
    statusText () {
      return this.statusAsBoolean
        ? this.$t('role_management.item.active')
        : this.$t('role_management.item.inactive')
    },
    allowGasless () {
      return this.profileInformation?.allowGasless || false
    }
  },
  watch: {
    isActiveStatus: {
      handler (value) {
        this.statusAsBoolean = value
      },
      immediate: true
    },
    allowGasless: {
      handler (value) {
        this.allowGaslessBoolean = value
        this.gaslessInputValue = this.$options.filters.formatCrypto(this.profileInformation?.gaslessTransLimit || 0, 0, 'floor')
      },
      immediate: true
    }
  },
  mounted () {
    if (this.user?.type === USER_ROLE.MERCHANT_MANAGER) {
      this.getAvatarList()
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('user', ['setUser']),
    onToggleStatusGasless () {
      if (this.isSubmitChangeGaslessStatusLoading) {
        return;
      }
      this.allowGaslessBoolean = !this.allowGaslessBoolean
    },
    onChangeStatus () {
      this.$bvModal.show(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
    },
    onOpenAdjustmentRate () {
      this.$bvModal.show(MODAL.ADJUSTMENT_RATE)
    },
    onCancelChangeStatus () {
      this.$bvModal.hide(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
    },
    onHideAdjustmentRate () {
      this.$bvModal.hide(MODAL.ADJUSTMENT_RATE)
    },
    onResetSuccessResult () {
      this.$router.push('/merchant-managers')
    },
    onDeleteMerchantManager () {
      this.$bvModal.show(MODAL.DELETE_MERCHANT_MANAGER)
    },
    onGoBack () {
      if (this.isRoleAdmin) {
        this.$router.push('/merchant-managers')
        return
      }
      this.$router.push('/merchant-manager/dashboard')
    },
    async getAvatarList () {
      try {
        const res = await this.$axios.$get(GET_LIST_AVATAR)
        if (res?.data?.avatars) {
          const avatars = Array.from({ length: 100 }, (_, i) => 'avatar_' + (i + 1))
          this.avatarList = avatars.filter(item => !res.data.avatars.includes(item))
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateAvatar (avatar) {
      try {
        const result = await this.$axios.$put(UPDATE_AVATAR, {
          avatar
        })
        if (result?.errors?.length) {
          const errorKey = result?.errors[0]?.key
          this.showResponseModal({
            title: this.$t('role_management.avatar.error.title'),
            content:
                errorKey === 'AVATAR_IS_USED'
                  ? this.$t('role_management.avatar.error.used')
                  : this.$t('role_management.form_edit.description_failure'),
            icon: '/assets/images/common/response/avatar_used.svg',
            confirmAction: this.$t('action.confirm'),
            confirmActionType: CONFIRM_TYPE.CLOSE,
            show: true,
            thumbClass: 'thumb--sm'
          });
          return
        }
        this.setUser({
          ...this.user,
          avatar
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.getAvatarList()
        this.$bvModal.hide(MODAL.CHANGE_AVATAR);
      }
    },
    handleOpenEditAvatar () {
      if (this.isMerchantManager) {
        this.$bvModal.show(MODAL.CHANGE_AVATAR);
      }
    },
    async onSubmitChangeStatus () {
      if (this.isSubmitChangeStatusLoading && this.isEditChangeStatus) {
        return;
      }
      try {
        let result;
        let status;
        this.isSubmitChangeStatusLoading = true
        this.$bvModal.hide(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
        if (this.statusAsBoolean) {
          result = await this.$axios.$put(INACTIVE_MERCHANT_MANAGER_BY_ID(this.profileInformation.id));
          status = LIST_STATUS.INACTIVE.name
        } else {
          result = await this.$axios.$put(ACTIVE_MERCHANT_MANAGER_BY_ID(this.profileInformation.id));
          status = LIST_STATUS.ACTIVE.name
        }
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
        this.successfulResult = {
          walletAddress: this.profileInformation.walletAddress,
          nickName: this.profileInformation.nickName,
          contractFrom: this.profileInformation.contractFrom,
          status,
          id: this.profileInformation.id
        }
        this.$emit('on-refresh')
        this.$nextTick(() => {
          this.$bvModal.show(MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT)
        })
      } catch (error) {
        this.$bvModal.show(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT)
      } finally {
        this.isSubmitChangeStatusLoading = false
      }
    },
    async onChangeGaslessAction () {
      try {
        this.isSubmitChangeGaslessStatusLoading = true
        const { errors } = await this.$axios.$put(SET_GASLESS_BY_ID(this.profileInformation.id), {
          allowGasless: this.allowGaslessBoolean,
          gaslessTransLimit: this.$options.filters.formatMarkToNumber(this.gaslessInputValue)
        })
        if (!errors) {
          this.showResponseModal({
            title: this.$t('modal.title.system'),
            content: this.$t('gasless.succeed'),
            description: '',
            icon: RESPONSE_ICON.GASLESS_SUCCEED,
            type: 'success',
            show: true
          });
          this.$emit('on-refresh')
          return;
        }
        this.showResponseModal({
          title: this.$t('modal.title.system'),
          content: this.$t('gasless.failed'),
          description: '',
          icon: RESPONSE_ICON.GASLESS_FAILED,
          show: true
        });
      } catch (error) {
        console.error(error)
      } finally {
        this.isSubmitChangeGaslessStatusLoading = false
      }
    },
    async onAdjustRate (payload) {
      try {
        const { errors } = await this.$axios.$post(ADJUST_RATE(this.profileInformation.id), payload)
        if (!errors) {
          const oldRate = this.profileInformation?.publicViewAdjustments;
          this.showResponseModal({
            content: this.$t('role_management.adjustment_success'),
            description: `
<div class="d-flex align-items-center w-100 flex-column" style="gap: 8px;">
  <div class='d-flex flex-column' style="gap: 8px; font-family: 'Roboto Condensed', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
    <div class='d-flex align-items-center' style="gap: 8px;">
      <div style="color: #73788B;">
        Số lượng hoàn tất:
      </div>
      <div style="color: #303646">
        ${oldRate?.totalOrderCompleted || 0}
      </div>
      <span class="icon-arrow-right"> </span>
      <div style="color: #FA5F07">
        ${payload.totalOrderCompleted}
      </div>
    </div>
    <div class='d-flex align-items-center' style="gap: 8px;">
      <div style="color: #73788B;">
        Tỉ lệ hoàn tất:
      </div>
      <div style="color: #303646">
        ${(oldRate?.totalRateCompleted * 100) || 0}%
      </div>
      <span class="icon-arrow-right"> </span>
      <div style="color: #FA5F07">
        ${payload.totalRateCompleted}%
      </div>
    </div>
  </div>
</div>`,
            icon: RESPONSE_ICON.UPDATE_RATE_SUCCESS,
            type: 'success',
            show: true
          });
          this.$emit('on-refresh')
          return;
        }
        this.showResponseModal({
          content: this.$t('role_management.adjustment_failed'),
          description: '',
          icon: RESPONSE_ICON.UPDATE_RATE_FAILED,
          show: true
        });
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/profile/index.scss">
</style>
