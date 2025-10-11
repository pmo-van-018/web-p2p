<template>
  <ModalCommon
    :id="modalId"
    :ref="modalId"
    :title="$t('merchant.settings.maintenance.modal.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @show-modal="onShowModal"
    @hide-modal="hideModal"
  >
    <div class="modal-content setting-maintenance">
      <p class="setting-maintenance__desc">{{ $t('merchant.settings.maintenance.modal.description') }}</p>
      <div class="setting-maintenance__inner">
        <div class="setting-maintenance__wrapper">
          <div class="setting-maintenance__head">
            <div class="setting-maintenance__label">1</div>
            <span class="setting-maintenance__text">{{ $t('merchant.settings.maintenance.modal.select_network') }}</span>
          </div>
          <div class="setting-maintenance__form">
            <b-form-checkbox
              v-for="(type, index) in networkOptions"
              :key="`network_${index}`"
              v-model="selectedAssetNetwork"
              :value="type.value"
              class="setting-maintenance__item c-primary-checkbox"
              name="maintenance-network"
            >
              <img :src="type.icon" :alt="type.name" class="setting-maintenance__img mr-1">
              {{ type.name }}
            </b-form-checkbox>
          </div>
        </div>
        <div class="setting-maintenance__wrapper">
          <div class="setting-maintenance__head">
            <div class="setting-maintenance__label">2</div>
            <span class="setting-maintenance__text">{{ $t('merchant.settings.maintenance.modal.select_wallet') }}</span>
          </div>
          <div class="setting-maintenance__form">
            <b-form-checkbox
              v-for="(type, index) in walletOptions"
              :key="`wallet_${index}`"
              v-model="selectedWallets"
              :value="type.value"
              class="setting-maintenance__item c-primary-checkbox"
              name="maintenance-asset"
            >
              <img :src="type.icon" :alt="type.name" class="setting-maintenance__img mr-1">
              {{ type.name }}
            </b-form-checkbox>
          </div>
        </div>
        <base-button
          variants="contained"
          color="primary"
          @click="onOpenConfirmModal"
        >
          {{ $t('merchant.settings.maintenance.modal.button') }}
        </base-button>
      </div>
    </div>
    <loading v-if="isLoading" />
    <confirm-maintenance-modal
      :is-loading="isLoading"
      @hide="isVisibleSettingMaintenance = true"
      @on-submit="submit"
    />
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import MASTER_DATA_API from '@/api/master-data.js';
import { mapActions, mapState } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message';
import { NETWORK_OPTIONS, WALLET_OPTIONS } from '@/resources/maintenance';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ConfirmMaintenanceModal: () => import('~/components/common/settings/settings-maintenance/confirm.vue')
  },
  props: {
    walletMaintenance: {
      type: Array,
      default: () => []
    },
    assetMaintenance: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modalId: MODAL.SETTING_SET_MAINTENANCE_SYSTEM,
      isLoading: false,
      selectedAssetNetwork: [],
      isVisibleSettingMaintenance: true,
      networkOptions: NETWORK_OPTIONS,
      selectedWallets: [],
      walletOptions: WALLET_OPTIONS
    }
  },
  computed: {
    ...mapState('resources', ['allAssets']),
    mappedWalletMaintenanceValues () {
      return this.walletOptions.map((asset) => {
        return this.selectedWallets.find(assetName => assetName === asset.value)
      }).filter(item => item)
    },
    modalClassCustom () {
      return this.isVisibleSettingMaintenance ? null : 'hidden';
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(this.modalId)
    },
    getUniqueNetworks () {
      if (!this.assetMaintenance) {
        return []
      }
      return this.assetMaintenance.reduce((acc, item) => {
        const asset = this.allAssets.find(as => `${as.name} (${as.network})` === item);
        const network = asset?.network;
        if (network && !acc.includes(network)) {
          acc.push(network);
        }
        return acc;
      }, []);
    },
    onShowModal () {
      this.isVisibleSettingMaintenance = true
      this.selectedAssetNetwork = this.getUniqueNetworks()
      this.selectedWallets = this.walletMaintenance || []
    },
    hideModal () {
      this.isVisibleSettingMaintenance = false
    },
    onOpenConfirmModal () {
      this.isVisibleSettingMaintenance = false
      this.$bvModal.show(MODAL.SETTING_CONFIRM_MAINTENANCE_SYSTEM)
    },
    async submit () {
      try {
        this.isLoading = true;
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_MAINTENANCE, {
          walletMaintenance: this.mappedWalletMaintenanceValues,
          networkMaintenance: this.selectedAssetNetwork
        });
        if (!result.errors?.length) {
          this.$emit('on-success');
          this.showResponseModal({
            title: this.$t('modal.message.system_notification'),
            content: this.$t('merchant.settings.maintenance.succeed_content'),
            description: '',
            icon: RESPONSE_ICON.SETTING_SET_MAINTENANCE_SYSTEM_SUCCESS,
            show: true,
            type: 'success'
          })
        }
      } catch (e) {
        this.showResponseModal({
          title: this.$t('modal.message.system_notification'),
          content: this.$t('merchant.settings.maintenance.failed_content'),
          description: '',
          icon: RESPONSE_ICON.SETTING_SET_MAINTENANCE_SYSTEM_FAILED,
          show: true
        })
      } finally {
        this.isLoading = false;
        this.close()
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-maintenance.scss"></style>
