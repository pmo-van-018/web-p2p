<template>
  <ModalCommon
    :id="MODAL.SETTING_TYPE_TRANS"
    :ref="MODAL.SETTING_TYPE_TRANS"
    modal-class="modal-small modal-mobile-bottom"
    :title="$t('merchant.settings.transation_type.modal.title')"
    @hide-modal="hideModal"
  >
    <div class="modal-content pt-md-3 font-t14r">
      <p class="mt-3 mb-3 grey-400">{{ $t('merchant.settings.transation_type.modal.description') }}</p>
      <div class="transation-type-list mb-3">
        <!-- The "all" checkbox -->
        <b-form-checkbox
          :checked="allSelected"
          class="grey-400 transation-type-item c-primary-checkbox font-t12r"
          name="transation-type-checkbox-all"
          @change="selectAllAssetNetworkTypes"
        >
          {{ $t('merchant.settings.transation_type.modal.select_all') }}
        </b-form-checkbox>
        <hr class="divide">
        <!-- List of the type transactions checkboxes -->
        <b-form-checkbox
          v-for="(type) in assetTypeOptions"
          :key="type.value"
          v-model="selectedAssetNetworkTypes"
          :disabled="isDisableSelected(type.value)"
          :value="type.value"
          class="transation-type-item c-primary-checkbox"
          name="transation-type"
        >
          <img :src="type.icon" :alt="type.name" class="transation-type-img mr-1">
          {{ type.name }}
        </b-form-checkbox>
      </div>
      <base-button
        variants="contained"
        color="primary"
        :disabled="!selectedAssetNetworkTypes?.length"
        @click="submit"
      >
        {{ $t('merchant.settings.transation_type.modal.button') }}
      </base-button>
    </div>
    <loading v-if="isLoading" />
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import { ASSET_TYPE } from '@/resources/asset-type.js';
import MASTER_DATA_API from '@/api/master-data.js';

export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    assetNetworkTypes: {
      type: Array,
      default: () => []
    },
    assetNetworkMaintanance: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      MODAL,
      assetTypeOptions: ASSET_TYPE,
      allSelected: this.assetNetworkTypes?.length === ASSET_TYPE.length,
      isLoading: false,
      selectedAssetNetworkTypes: this.assetNetworkTypes || []
    }
  },
  computed: {
    orderedAssetNetworkTypes () {
      return ASSET_TYPE.map((asset) => {
        return this.selectedAssetNetworkTypes.find(assetName => assetName === asset.value)
      }).filter(item => item)
    }
  },
  watch: {
    assetNetworkTypes (newAssetNetworkTypes) {
      this.selectedAssetNetworkTypes = newAssetNetworkTypes;
      this.allSelected = newAssetNetworkTypes?.length === ASSET_TYPE.length;
    },
    selectedAssetNetworkTypes (newSelectedAssetNetworkTypes) {
      this.allSelected = false;
      if (newSelectedAssetNetworkTypes?.length === ASSET_TYPE.length) {
        this.allSelected = true;
      }
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.SETTING_TYPE_TRANS);
    },
    hideModal () {
      this.allSelected = this.assetNetworkTypes?.length === ASSET_TYPE.length;
      this.selectedAssetNetworkTypes = this.assetNetworkTypes;
    },
    selectAllAssetNetworkTypes (allSelected) {
      this.selectedAssetNetworkTypes = [];
      this.allSelected = allSelected;

      if (allSelected) {
        this.selectedAssetNetworkTypes = ASSET_TYPE.map(item => item?.value).filter(item => !this.isDisableSelected(item));
      }
    },
    async submit () {
      try {
        this.isLoading = true;
        // Request to update
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, {
          assetNetworkTypes: this.orderedAssetNetworkTypes
        });
        // The case the result is successful
        if (!result.errors?.length) {
          this.$emit('on-success', this.orderedAssetNetworkTypes);
        }
        // Close the popup
        this.close();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    isDisableSelected (assetName) {
      return this.assetNetworkMaintanance?.includes(assetName);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-type-trans.scss"></style>
