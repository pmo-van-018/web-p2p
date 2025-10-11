<template>
  <ModalCommon
    :id="MODAL.SETTING_TIMER_MERCHANT"
    :ref="MODAL.SETTING_TIMER_MERCHANT"
    :title="$t('merchant.settings.timer_merchant.modal.title')"
    modal-class="modal-small modal-mobile-bottom"
    @show-modal="onShowModal"
  >
    <div class="modal-content pt-md-3 grey-900 font-t14r">
      <p class="grey-400 mt-3 pb-1">{{ $t('merchant.settings.timer_merchant.modal.description') }}</p>

      <!-- The limit time to sell -->
      <div class="pb-md-1">
        <p class="font-t16m mb-1">{{ $t('merchant.settings.timer_merchant.modal.time_sell.title') }}</p>
        <p class="grey-400 mb-1">{{ $t('merchant.settings.timer_merchant.modal.time_sell.description') }}</p>
        <b-form-group v-slot="{ ariaDescribedby }" class="mb-1 mb-md-3">
          <b-form-radio
            v-for="(time) in sellTimeOptions"
            :key="time.value"
            v-model="selectedMerchantToUserTimeSell"
            :value="time.value"
            :aria-describedby="ariaDescribedby"
            class="c-primary-radio"
            name="time-sell"
          >
            {{ time.title }}
          </b-form-radio>
        </b-form-group>
      </div>

      <!-- The limit time to buy -->
      <div class="pb-md-1">
        <p class="font-t16m mb-1">{{ $t('merchant.settings.timer_merchant.modal.time_buy.title') }}</p>
        <p class="grey-400 mb-1">{{ $t('merchant.settings.timer_merchant.modal.time_buy.description') }}</p>
        <b-form-group v-slot="{ ariaDescribedby }" class="mb-2 mb-md-3">
          <b-form-radio
            v-for="(time) in buyTimeOptions"
            :key="time.value"
            v-model="selectedMerchantToUserTimeBuy"
            :value="time.value"
            :aria-describedby="ariaDescribedby"
            class="c-primary-radio"
            name="time-buy"
          >
            {{ time.title }}
          </b-form-radio>
        </b-form-group>
      </div>
      <base-button
        variants="contained"
        color="primary"
        @click="submit"
      >
        {{ $t('merchant.settings.timer_merchant.modal.button') }}
      </base-button>
    </div>
    <loading v-if="isLoading" />
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { SETTING_TIMER_SELL_OPTIONS } from '@/resources/calendar.js';
import MASTER_DATA_API from '@/api/master-data.js';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    merchantToUserTimeBuys: {
      type: Array,
      default: () => []
    },
    merchantToUserTimeSells: {
      type: Array,
      default: () => []
    },
    merchantToUserTimeBuy: {
      type: Number,
      default: 0
    },
    merchantToUserTimeSell: {
      type: Number,
      default: 0
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
      selectedMerchantToUserTimeSell: this.merchantToUserTimeSell || this.defaultTimeOption,
      selectedMerchantToUserTimeBuy: this.merchantToUserTimeBuy || this.defaultTimeOption
    }
  },
  computed: {
    defaultTimeOption () {
      return SETTING_TIMER_SELL_OPTIONS?.[0]?.value;
    },
    buyTimeOptions () {
      return this.merchantToUserTimeBuys.map(e => ({
        value: e,
        title: `${e} phút`
      }))
    },
    sellTimeOptions () {
      return this.merchantToUserTimeSells.map(e => ({
        value: e,
        title: `${e} phút`
      }))
    }
  },
  methods: {
    onShowModal () {
      this.selectedMerchantToUserTimeSell = this.merchantToUserTimeSell || this.defaultTimeOption
      this.selectedMerchantToUserTimeBuy = this.merchantToUserTimeBuy || this.defaultTimeOption
    },
    close () {
      this.$bvModal.hide(MODAL.SETTING_TIMER_MERCHANT);
    },
    async submit () {
      try {
        this.isLoading = true;
        const payload = {
          merchantToUserTimeSell: Number(this.selectedMerchantToUserTimeSell),
          merchantToUserTimeBuy: Number(this.selectedMerchantToUserTimeBuy)
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
