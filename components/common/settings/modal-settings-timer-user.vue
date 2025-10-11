<template>
  <ModalCommon
    :id="MODAL.SETTING_TIMER_USER"
    :ref="MODAL.SETTING_TIMER_USER"
    modal-class="modal-small modal-mobile-bottom"
    :title="$t('merchant.settings.timer_user.modal.title')"
    @hide-modal="hideModal"
    @show-modal="onShowModal"
  >
    <div class="modal-content pt-md-3 grey-900 font-t14r">
      <p class="grey-400 mt-3 pb-1">
        {{ $t('merchant.settings.timer_user.modal.description') }}
      </p>
      <div class="pb-1">
        <p class="font-t16m mb-1">
          {{ $t('merchant.settings.timer_user.modal.time_buy.title') }}
        </p>
        <p class="grey-400 mb-1 mb-md-3">
          {{ $t('merchant.settings.timer_user.modal.time_buy.description') }}
        </p>
        <b-form-checkbox
          v-for="(time) in timeBuyOptions"
          :key="time.value"
          v-model="selectedUserToMerchantTimeBuys"
          :value="time.value"
          class="c-primary-checkbox"
          name="user-to-merchant-time-buys"
        >
          {{ time.title }}
        </b-form-checkbox>
      </div>

      <div class="pb-1">
        <p class="font-t16m mb-1">
          {{ $t('merchant.settings.timer_user.modal.time_sell.title') }}
        </p>
        <p class="grey-400 mb-1 mb-md-3">
          {{ $t('merchant.settings.timer_user.modal.time_sell.description') }}
        </p>
        <b-form-checkbox
          v-for="(time) in timeSellOptions"
          :key="time.value"
          v-model="selectedUserToMerchantTimeSells"
          :value="time.value"
          class="c-primary-checkbox"
          name="user-to-merchant-time-sells"
        >
          {{ time.title }}
        </b-form-checkbox>
      </div>

      <base-button
        variants="contained"
        color="primary"
        :disabled="isDisabledSubmit"
        @click="submit"
      >
        {{ $t('merchant.settings.timer_user.modal.button') }}
      </base-button>
    </div>
    <loading v-if="isLoading" />
  </ModalCommon>
</template>

<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { SETTING_TIMER_BUY_OPTIONS, SETTING_TIMER_SELL_OPTIONS } from '@/resources/calendar.js'
import MASTER_DATA_API from '@/api/master-data.js';
import sortBy from 'lodash/sortBy'

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    userToMerchantTimeBuys: {
      type: Array,
      default: () => []
    },
    userToMerchantTimeSells: {
      type: Array,
      default: () => []
    },
    onSuccess: {
      type: Function,
      default () {
        return 'Default function'
      }
    }
  },
  data () {
    return {
      MODAL,
      isLoading: false,
      SETTING_TIMER_BUY_OPTIONS,
      SETTING_TIMER_SELL_OPTIONS,
      selectedUserToMerchantTimeBuys: this.userToMerchantTimeBuys || [],
      selectedUserToMerchantTimeSells: this.userToMerchantTimeSells || []
    }
  },
  computed: {
    isDisabledSubmit () {
      return !this.selectedUserToMerchantTimeBuys?.length || !this.selectedUserToMerchantTimeSells?.length;
    },
    timeBuyOptions () {
      return this.SETTING_TIMER_BUY_OPTIONS
    },
    timeSellOptions () {
      return this.SETTING_TIMER_SELL_OPTIONS
    }
  },
  methods: {
    onShowModal () {
      this.selectedUserToMerchantTimeBuys = this.userToMerchantTimeBuys || []
      this.selectedUserToMerchantTimeSells = this.userToMerchantTimeSells || []
    },
    close () {
      this.$bvModal.hide(MODAL.SETTING_TIMER_USER);
    },
    convertData (data) {
      return sortBy(data?.map(time => Number(time)));
    },
    hideModal () {
      this.selectedUserToMerchantTimeBuys = this.userToMerchantTimeBuys;
      this.selectedUserToMerchantTimeSells = this.userToMerchantTimeSells;
    },
    async submit () {
      try {
        this.isLoading = true;
        const payload = {
          userToMerchantTimeBuys: this.convertData(this.selectedUserToMerchantTimeBuys),
          userToMerchantTimeSells: this.convertData(this.selectedUserToMerchantTimeSells)
        }
        // Request to update
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, payload);
        // The case the result is successful
        if (!result.errors?.length) {
          this.$emit('on-success', payload);
        }
        // Close the popup
        this.close();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
