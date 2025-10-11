<template>
  <ModalCommon
    :id="modalId"
    :ref="MODAL.ADJUSTMENT_RATE"
    modal-class="modal-small"
    :title="$t('role_management.adjustment_title')"
    :no-close-on-backdrop="true"
    @hide-modal="hideModal"
    @show-modal="onOpenModal"
    @on-close="handleClickCancel"
  >
    <div class="modal-content">
      <div class="wrapper">
        <div class="info-group">
          <div class="info-group__title">
            {{ $t('role_management.manager_name') }}
          </div>
          <div class="info-group__name">
            {{ manager.nickName }}
          </div>
        </div>
        <div class="info-group">
          <div class="info-group__title">
            {{ $t('role_management.status') }}
          </div>
          <div class="info-group__status" :class="manager.status?.toLowerCase()">
            {{ managerStatus }}
          </div>
        </div>
      </div>
      <b-form-group
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.total_completed')"
      >
        <input
          v-model="totalOrderCompleted"
          :placeholder="$t('role_management.total_completed_input')"
          :aria-describedby="ariaDescribedby"
          type="text"
          @input="filterTotalCompleted"
        >
      </b-form-group>
      <b-form-group
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.rate_completed')"
      >
        <input
          v-model="totalRateCompleted"
          :placeholder="$t('role_management.rate_completed_input')"
          :aria-describedby="ariaDescribedby"
          type="text"
          @input="filterRateCompleted"
        >
      </b-form-group>
      <div class="button-group">
        <button class="button-group__reset" @click="handleClickReset">
          {{ $t('role_management.modal.reset') }}
        </button>
        <base-button
          variants="contained"
          color="primary"
          @click="handleClickConfirm"
        >
          {{ $t('role_management.modal.confirm') }}
        </base-button>
      </div>
    </div>
  </ModalCommon>
</template>

<script>
import { MODAL } from '@/resources/modal.js';
import roleManagementMixin from '@/mixins/role-management';
import { LIST_STATUS, VALIDATION_RULES } from '@/resources/role-management';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    postfix: {
      type: String,
      default: ''
    },
    manager: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      MODAL,
      VALIDATION_RULES,
      totalOrderCompleted: '',
      totalRateCompleted: ''
    };
  },
  computed: {
    modalId () {
      return `${MODAL.ADJUSTMENT_RATE}${this.postfix}`;
    },
    managerStatus () {
      return this.$t(LIST_STATUS[this.manager.status]?.label ?? '');
    }
  },
  methods: {
    handleClickCancel () {
      this.$emit('on-cancel');
    },
    onOpenModal () {
      this.totalOrderCompleted = this.manager?.publicViewAdjustments?.totalOrderCompleted ? this.$options.filters.formatMoney(this.manager?.publicViewAdjustments?.totalOrderCompleted) : '';
      this.totalRateCompleted = this.manager?.publicViewAdjustments?.totalRateCompleted * 100 || '';
    },
    hideModal () {
      this.totalOrderCompleted = '';
      this.totalRateCompleted = '';
    },
    handleClickReset () {
      this.onOpenModal();
    },
    handleClickConfirm () {
      const payload = {
        totalOrderCompleted: Number(this.totalOrderCompleted?.replace(/,/g, '')),
        totalRateCompleted: Number(this.totalRateCompleted)
      };
      this.$emit('on-confirm', payload);
    },
    filterTotalCompleted (event) {
      const value = event.target.value.replace(/[^0-9]/g, '');
      this.totalOrderCompleted = this.$options.filters.formatMoney(value);
    },
    filterRateCompleted (event) {
      const value = Number(event.target.value);
      if (!Number.isNaN(value)) {
        if (value > 100) {
          this.totalRateCompleted = 100;
        } else {
          this.totalRateCompleted = event.target.value;
        }
      }
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-adjustment-rate.scss"></style>
