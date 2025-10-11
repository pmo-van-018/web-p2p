<template>
  <div class="settings">
    <loading v-if="isLoading" />
    <div class="settings__header">
      <span class="settings__header-title">
        {{ $t('system_admin.title.system_setting') }}
      </span>
    </div>
    <div class="settings__content">
      <SettingItem
        :title="$t('merchant.settings.bank.title')"
        :description="$t('merchant.settings.bank.description')"
        :icon="ICON.bank"
        modal="SETTING_PAYMENT"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(masterDataCommon?.supportedBanks?.length)" />
        <span v-if="!masterDataCommon?.supportedBanks?.length" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <div v-else class="bank-list">
          <div v-for="(bankName, index) in supportedBanks" :key="index || bankName" class="bank-item">
            <img :src="getBank(bankName)?.icon" alt="" class="bank-img">
            {{ getBank(bankName)?.name }}{{ supportedBanks.length - 1 > index ? ', ' : '' }}
          </div>
          <div v-if="masterDataCommon?.supportedBanks?.length > countBankSupportedVisible" class="bank-list__more">
            {{ $t('merchant.settings.more_bank', { count: countOtherBank }) }}
          </div>
        </div>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.timer_merchant.title')"
        :description="$t('merchant.settings.timer_merchant.description')"
        :icon="ICON.calendar"
        modal="SETTING_TIMER_MERCHANT"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(!isEmptyMerchantToUserTime)" />
        <span v-if="isEmptyMerchantToUserTime" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <span v-else>
          {{ $t('merchant.settings.sell') }}: {{ getTimeAsStr(masterDataCommon.merchantToUserTimeSell) }}
          <br>
          {{ $t('merchant.settings.buy') }}: {{ getTimeAsStr(masterDataCommon.merchantToUserTimeBuy) }}
        </span>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.timer_user.title')"
        :description="$t('merchant.settings.timer_user.description')"
        :icon="ICON.calendar_edit"
        modal="SETTING_TIMER_USER"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(!isEmptyUserToMerchantTime)" />
        <span v-if="isEmptyUserToMerchantTime" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <span v-else>
          {{ $t('merchant.settings.buy') }}: {{ getArray(masterDataCommon.userToMerchantTimeBuys).map(item => getTimeAsStr(item)).join(', ') }}
          <br>
          {{ $t('merchant.settings.sell') }}: {{ getArray(masterDataCommon.userToMerchantTimeSells).map(item => getTimeAsStr(item)).join(', ') }}
        </span>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.transation_type.title')"
        :description="$t('merchant.settings.transation_type.description')"
        :icon="ICON.tag"
        modal="SETTING_TYPE_TRANS"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(masterDataCommon?.assetNetworkTypes?.length)" />
        <span v-if="!masterDataCommon?.assetNetworkTypes?.length" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <div v-else class="bank-list bank-list--column">
          <div v-for="(assetType, index) in assetNetworkTypeMapped" :key="`bank_item_${index}`" class="bank-item bank-item--large">
            <img :src="getAssetType(assetType)?.icon" alt="" class="bank-img">
            {{ getAssetType(assetType)?.value }}{{ totalAssetNetworkTypes - 1 > index ? ', ' : '' }}
          </div>
        </div>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.limit_fee_time.title')"
        :description="$t('merchant.settings.limit_fee_time.description')"
        :icon="ICON.minus"
        modal="SETTING_LIMIT_FEE_TIME"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(isShowLimitFeeTime)" />
        <span v-if="!isShowLimitFeeTime" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <div v-else class="limit-fee-time">
          <span v-for="(item, index) in limitFeeTimeValues" :key="item.label" class="limit-fee-time__item">
            <span>{{ item.label }}: </span>
            <span v-if="item.isHtml" v-html="item.value" />
            <span v-else>{{ item.value }}</span>
            <span class="limit-fee-time__comma">{{ item.noComma || index % 2 !== 0 ? '' : ' | ' }}</span>
            <br v-if="index % 2 !== 0">
          </span>
        </div>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.maintenance.title')"
        :description="$t('merchant.settings.maintenance.description')"
        :icon="ICON.maintenance"
        modal="SETTING_SET_MAINTENANCE_SYSTEM"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(isShowMaintenanceSetting)" />
        <template v-if="isShowMaintenanceSetting">
          <maintenance-list
            :wallet-maintenance="masterDataCommon.walletMaintenance"
            :asset-maintenance="masterDataCommon.assetMaintenance"
          />
        </template>
        <template v-else>
          <span class="grey-400">
            {{ $t('merchant.settings.empty') }}
          </span>
        </template>
      </SettingItem>

      <SettingItem
        :title="$t('merchant.settings.other.title')"
        :description="$t('merchant.settings.other.description')"
        :icon="ICON.other_setting"
        modal="SETTING_OTHERS"
      >
        <span class="mr-md-2 pr-1" :class="getIconClassBySuccess(isShowSettingOther)" />
        <span v-if="!isShowSettingOther" class="grey-400">
          {{ $t('merchant.settings.empty') }}
        </span>
        <div v-else class="limit-fee-time">
          <span v-for="(item, index) in settingOtherValues" :key="item.label" class="limit-fee-time__item">
            <span>{{ item.label }}: </span>
            <span>{{ item.value }}</span>
            <span class="limit-fee-time__comma">{{ item.noComma ? '' : ', ' }}</span>
            <br v-if="index % 2 !== 0">
          </span>
        </div>
      </SettingItem>

      <ModalSettingPayment :supported-banks="masterDataCommon?.supportedBanks" @on-success="setSupportedBanks" />

      <ModalSettingTimerMerchant
        :merchant-to-user-time-sell="masterDataCommon.merchantToUserTimeSell"
        :merchant-to-user-time-buy="masterDataCommon.merchantToUserTimeBuy"
        :merchant-to-user-time-sells="masterDataCommon.merchantToUserTimeSells"
        :merchant-to-user-time-buys="masterDataCommon.merchantToUserTimeBuys"
        @on-success="setMerchantToUserTime"
      />

      <ModalSettingTimerUser
        :user-to-merchant-time-buys="masterDataCommon.userToMerchantTimeBuys"
        :user-to-merchant-time-sells="masterDataCommon.userToMerchantTimeSells"
        @on-success="setUserToMerchantTime"
      />

      <ModalSettingTypeTrans
        :asset-network-types="masterDataCommon.assetNetworkTypes"
        :asset-network-maintanance="masterDataCommon.assetMaintenance"
        @on-success="setAssetNetworkTypes"
      />

      <ModalSettingLimitFeeTime
        :master-data-common="masterDataCommon"
        @on-success="setDateMasterCommon"
      />
      <modal-setting-maintenance
        :wallet-maintenance="masterDataCommon.walletMaintenance"
        :asset-maintenance="masterDataCommon.assetMaintenance"
        @on-success="fetchData"
      />
      <modal-setting-other
        :master-data-common="masterDataCommon"
        @on-success="setDateMasterCommon"
      />
    </div>
  </div>
</template>

<script>
import { ICON_SETTING } from '@/config/constant.js';
import SettingItem from '@/components/common/settings/item';
import MASTER_DATA_API from '@/api/master-data.js';
import { BANK } from '@/resources/bank.js';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import BigNumber from 'bignumber.js'
import take from 'lodash/take'
import { ASSET_TYPE } from '~/resources/asset-type';

export default {
  components: {
    ModalSettingPayment: () => import('@/components/common/settings/modal-settings-payment.vue'),
    ModalSettingTimerMerchant: () => import('@/components/common/settings/modal-settings-timer-merchant.vue'),
    ModalSettingTimerUser: () => import('@/components/common/settings/modal-settings-timer-user.vue'),
    ModalSettingTypeTrans: () => import('@/components/common/settings/modal-settings-type-trans.vue'),
    ModalSettingLimitFeeTime: () => import('@/components/common/settings/modal-settings-limit-fee-time.vue'),
    ModalSettingMaintenance: () => import('@/components/common/settings/settings-maintenance/index.vue'),
    ModalSettingOther: () => import('@/components/common/settings/modal-settings-other.vue'),
    MaintenanceList: () => import('@/components/common/settings/maintenance/list.vue'),
    SettingItem
  },
  filters: {
    arrayToText (list) {
      if (!isArray(list)) {
        return '';
      }
      return list.join(', ');
    }
  },
  data () {
    return {
      BANK,
      ICON: ICON_SETTING,
      isLoading: false,
      masterDataCommon: {},
      masterDataLevels: [],
      countBankSupportedVisible: 3
    }
  },
  computed: {
    totalAssetNetworkTypes () {
      return this.assetNetworkTypeMapped?.length;
    },
    isEmptyMerchantToUserTime () {
      return !this.masterDataCommon?.merchantToUserTimeSells?.length ||
          !this.masterDataCommon?.merchantToUserTimeBuys?.length;
    },
    isEmptyUserToMerchantTime () {
      return !this.masterDataCommon?.userToMerchantTimeSells?.length ||
          !this.masterDataCommon?.userToMerchantTimeBuys?.length;
    },
    isShowMaintenanceSetting () {
      return this.masterDataCommon?.walletMaintenance?.length || this.masterDataCommon?.assetMaintenance?.length
    },
    isShowLimitFeeTime () {
      return [
        this.masterDataCommon?.minOrderLimit,
        this.masterDataCommon?.maxOrderLimit,
        this.masterDataCommon?.minPostLimit,
        this.masterDataCommon?.maxPostLimit,
        this.masterDataCommon?.fee,
        this.masterDataCommon?.penaltyFee,
        this.masterDataCommon?.userAskMerchantTime,
        this.masterDataCommon?.userAskCSTime,
        this.masterDataCommon?.evidenceProvisionTimeLimit,
        this.masterDataCommon?.cryptoSendingWaitTimeLimit
      ].some(item => item !== null && item !== undefined);
    },
    isShowSettingOther () {
      return [
        this.masterDataCommon?.userPaymentMethodsLimit,
        this.masterDataCommon?.managerPaymentMethodsLimit,
        this.masterDataCommon?.appealReceivedBySupporterLimit,
        this.masterDataCommon?.appealReceivedByAdminSupporterLimit,
        this.masterDataCommon?.supportRequestsReceivingLimit
      ].some(item => item !== null && item !== undefined);
    },
    limitFeeTimeValues () {
      const {
        minOrderLimit,
        maxOrderLimit,
        minPostLimit,
        maxPostLimit,
        fee,
        penaltyFee,
        userAskMerchantTime,
        userAskCSTime,
        evidenceProvisionTimeLimit,
        cryptoSendingWaitTimeLimit
      } = this.masterDataCommon;

      const data = [
        {
          label: this.$t('merchant.settings.limit_fee_time.label.order_limit'),
          value: `
            <span class="limit-fee-time__money">${this.getMoneyText(minOrderLimit)}</span>
            -
            <span class="limit-fee-time__money">${this.getMoneyText(maxOrderLimit)}</span>
          `,
          isHtml: true,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.post_limit'),
          value: `
            <span class="limit-fee-time__money">${this.getMoneyText(minPostLimit)}</span>
            -
            <span class="limit-fee-time__money">${this.getMoneyText(maxPostLimit)}</span>
          `,
          isHtml: true,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.fee'),
          value: this.getPercent(fee),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.penalty_fee'),
          value: this.getPercent(penaltyFee),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.user_ask_merchant_time'),
          value: this.getTimeAsStr(userAskMerchantTime),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.user_ask_cs_time'),
          value: this.getTimeAsStr(userAskCSTime),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.submit_evidence_time'),
          value: this.getTimeAsStr(evidenceProvisionTimeLimit),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.limit_fee_time.label.crypto_transaction_time'),
          value: this.getTimeAsStr(cryptoSendingWaitTimeLimit),
          isHtml: false,
          noComma: true
        }
      ];

      return data;
    },
    settingOtherValues () {
      const {
        userPaymentMethodsLimit,
        managerPaymentMethodsLimit,
        appealReceivedBySupporterLimit,
        appealReceivedByAdminSupporterLimit,
        supportRequestsReceivingLimit
      } = this.masterDataCommon;
      return [
        {
          label: this.$t('merchant.settings.other.label.user_payment_limit'),
          value: this.getNumberFormat(userPaymentMethodsLimit),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.other.label.manager_payment_limit'),
          value: this.getNumberFormat(managerPaymentMethodsLimit),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.other.label.received_by_supporter_limit'),
          value: this.getNumberFormat(appealReceivedBySupporterLimit),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.other.label.received_by_admin_supporter_limit'),
          value: this.getNumberFormat(appealReceivedByAdminSupporterLimit),
          isHtml: false,
          noComma: false
        },
        {
          label: this.$t('merchant.settings.other.label.support_requests_receiving_limit'),
          value: this.getNumberFormat(supportRequestsReceivingLimit),
          isHtml: false,
          noComma: true
        }
      ];
    },
    supportedBanks () {
      if (this.masterDataCommon?.supportedBanks?.length <= this.countBankSupportedVisible) {
        return this.masterDataCommon?.supportedBanks
      }
      return take(this.masterDataCommon?.supportedBanks, this.countBankSupportedVisible);
    },
    countOtherBank () {
      if (this.masterDataCommon?.supportedBanks?.length <= this.countBankSupportedVisible) {
        return 0
      }
      return this.masterDataCommon?.supportedBanks?.length - this.countBankSupportedVisible
    },
    assetNetworkTypeMapped () {
      if (!this.masterDataCommon?.assetNetworkTypes?.length) {
        return []
      }
      return this.masterDataCommon?.assetNetworkTypes?.map((assetType) => {
        return this.getAssetType(assetType) ? assetType : null
      }).filter(type => type)
    }
  },
  mounted () {
    this.fetchData();
  },
  methods: {
    async fetchData () {
      try {
        this.isLoading = true
        const res = await this.$axios.$get(MASTER_DATA_API.GET_SETTINGS);
        if (!isEmpty(res?.data)) {
          this.masterDataCommon = res.data.masterDataCommon;
          this.masterDataLevels = res.data.masterDataLevels;
          this.isLoading = false;
        }
      } catch (error) {
        this.isLoading = false;
      }
    },
    getArray (list) {
      if (!isArray(list)) {
        return [];
      }
      return list;
    },
    getIconClassBySuccess (success) {
      if (success) {
        return 'icon-success';
      }
      return 'icon-close-circle1';
    },
    getBank (bankName, index) {
      return BANK.find(item => item.bankName === bankName);
    },
    getAssetType (assetType) {
      return ASSET_TYPE.find(item => item.value === assetType);
    },
    getTimeAsStr (minute) {
      if (!minute) {
        return '';
      }
      return `${minute} ${this.$t('datetime_unit.minute')}`;
    },
    getMoneyText (value) {
      return `₫ ${this.$options.filters.formatMoney(value)}`;
    },
    getNumberFormat (value) {
      return value < 10 ? `0${value}` : value
    },
    getPercent (value) {
      return `${new BigNumber(Number(value || 0)).multipliedBy(100).toString()}%`;
    },
    setSupportedBanks (supportedBanks) {
      if (isEmpty(supportedBanks)) {
        return;
      }
      this.masterDataCommon = {
        ...this.masterDataCommon,
        supportedBanks
      };
    },
    setMerchantToUserTime ({ merchantToUserTimeSell, merchantToUserTimeBuy } = {}) {
      if (!merchantToUserTimeSell || !merchantToUserTimeBuy) {
        return;
      }
      this.masterDataCommon = {
        ...this.masterDataCommon,
        merchantToUserTimeSell,
        merchantToUserTimeBuy
      };
    },
    setUserToMerchantTime ({ userToMerchantTimeBuys, userToMerchantTimeSells } = {}) {
      if (isEmpty(userToMerchantTimeBuys) || isEmpty(userToMerchantTimeSells)) {
        return;
      }
      this.masterDataCommon = {
        ...this.masterDataCommon,
        userToMerchantTimeBuys,
        userToMerchantTimeSells
      };
    },
    setAssetNetworkTypes (assetNetworkTypes) {
      if (isEmpty(assetNetworkTypes)) {
        return;
      }
      this.masterDataCommon = {
        ...this.masterDataCommon,
        assetNetworkTypes
      };
    },
    setDateMasterCommon (data) {
      if (isEmpty(data)) {
        return;
      }
      this.masterDataCommon = {
        ...this.masterDataCommon,
        ...data
      };
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/settings/index.scss" />
<style>
.settings__header-title {
  color: #51525C;
}
</style>
