<template>
  <ModalCommon
    :id="MODAL.SETTING_NOTIFICATION"
    :ref="MODAL.SETTING_NOTIFICATION"
    :title="getTitle"
  >
    <div class="setting-notification">
      <div class="setting-notification__des">{{ $t('notification.modalSetting.setting_enable') }}</div>
      <div class="setting-notification__selector">
        <b-form-group>
          <template v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="selected"
              :options="settingOptions"
              :aria-describedby="ariaDescribedby"
              stacked
            />
            <!-- <b-form-checkbox
              v-model="allSelected"
              :indeterminate="indeterminate"
              aria-describedby="settingOptions"
              aria-controls="settingOptions"
              class="select-all setting-notification__checkbox"
              @change="toggleAll"
            >
              {{ $t('notification.modalSetting.all') }}
            </b-form-checkbox> -->
          </template>
        </b-form-group>
      </div>
      <div class="setting-notification__cta">
        <base-button full-width variants="outlined" color="info" @click="closePopup">
          {{ $t('notification.modalSetting.btn-cancel') }}
        </base-button>
        <base-button full-width variants="contained" color="primary" @click="onUpdateSettingNotification">
          {{ $t('notification.modalSetting.btn-save') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue'
import { MODAL } from '@/resources/modal.js'
import USER_API from '@/api/user'
import { mapState, mapActions } from 'vuex'
import includes from 'lodash/includes';
import { NOTIFICATION_TYPE } from '@/constants/notification';
import { OPERATION_API } from '@/api/operation';
import { USER_ROLE } from '@/config/constant';
import { ADMIN_API } from '@/api/admin';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  data () {
    return {
      settingOptions: [
        {
          text: this.$t('notification.modalSetting.transaction'),
          value: 1
        },
        {
          text: this.$t('notification.modalSetting.system'),
          value: 2
        }
      ],
      selected: [],
      allSelected: false,
      indeterminate: false,
      MODAL
    }
  },
  computed: {
    ...mapState('user', ['user']),
    getTitle () {
      return this.$t('notification.modalSetting.title')
    },
    allowNotification () {
      return this.user?.allowNotification || []
    }
  },
  watch: {
    selected (newValue, oldValue) {
      if (newValue.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newValue.length === this.settingOptions.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    },
    allowNotification: {
      handler () {
        if (includes(this.allowNotification, NOTIFICATION_TYPE.ALL)) {
          this.selected = this.settingOptions.map(item => item.value)
        } else {
          this.selected = this.allowNotification
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user', ['getInfoUser']),
    ...mapActions(['getCurrentOperationInfo', 'getCurrentAdminInfo']),
    closePopup () {
      this.$bvModal.hide(MODAL.SETTING_NOTIFICATION);
    },
    toggleAll (checked) {
      this.selected = checked ? this.settingOptions.map((item) => { return item.value }) : []
    },
    async onUpdateSettingNotification () {
      switch (this.user?.type) {
        case USER_ROLE.SUPER_ADMIN:
        case USER_ROLE.ADMIN_SUPPORTER:
          await this.updateSettingAdminNotification();
          break;
        case USER_ROLE.MERCHANT_MANAGER:
        case USER_ROLE.MERCHANT_OPERATOR:
        case USER_ROLE.MERCHANT_SUPPORTER:
          await this.updateSettingOperationNotification();
          break;
        default:
          await this.updateSettingUserNotification();
          break;
      }
    },
    async updateSettingAdminNotification () {
      try {
        await this.$axios.$put(ADMIN_API.UPDATE, {
          allowNotification: this.allSelected ? [NOTIFICATION_TYPE.ALL] : this.selected
        })
        await this.getCurrentAdminInfo();
      } catch (error) {
        console.error(error);
      } finally {
        this.closePopup();
      }
    },
    async updateSettingOperationNotification () {
      try {
        await this.$axios.$put(OPERATION_API.UPDATE_INFO, {
          allowNotification: this.allSelected ? [NOTIFICATION_TYPE.ALL] : this.selected
        })
        await this.getCurrentOperationInfo(this.$axios)
      } catch (error) {
        console.error(error);
      } finally {
        this.closePopup();
      }
    },
    async updateSettingUserNotification () {
      try {
        await this.$axios.$put(USER_API.UPDATE_ALLOW_NOTIFICATION, {
          allowNotification: this.allSelected ? [NOTIFICATION_TYPE.ALL] : this.selected
        })
        await this.getInfoUser()
      } catch (error) {
        console.error(error);
      } finally {
        this.closePopup();
      }
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/modal/modal-setting-notification.scss"></style>
