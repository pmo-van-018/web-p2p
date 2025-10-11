<template>
  <modal-common
    :id="modalName"
    :ref="modalName"
    :title="$t(`shift_management.approve_${approveType}.title`)"
    @hide-modal="closed"
  >
    <div class="approve-shift">
      <div class="approve-shift__icon">
        <img :src="`/assets/images/common/merchant-manager/shift-manager/${icon}`" :alt="approveType">
      </div>
      <div :class="`approve-shift__description ${approveType === 'all' || message ? 'font-t16b' : 'font-t14b'} ${shiftStatus}`">
        <template v-if="message">
          {{ message }}
        </template>
        <template v-else-if="approveType === 'all'">
          {{ $t('shift_management.approve_all.description') }}
        </template>
        <template v-else-if="shift">
          <span>
            {{ $t('shift_management.approve_single.description') }}
          </span>
          <br>
          {{ shift.nickName }}
        </template>
      </div>
      <template v-if="showShiftInfo">
        <div class="approve-shift__info">
          <div class="approve-shift__info-label">
            {{ $t('shift_management.filter.check_in_date') }}
          </div>
          <div class="approve-shift__info-value">
            {{ shift.checkInAt | formatDateTime }}
          </div>
        </div>
        <div class="approve-shift__info">
          <div class="approve-shift__info-label">
            {{ $t('shift_management.filter.check_out_date') }}
          </div>
          <div class="approve-shift__info-value">
            {{ shift.checkOutAt | formatDateTime }}
          </div>
        </div>
      </template>
      <div v-if="!message" class="approve-shift_action w-100">
        <base-button
          variants="contained"
          full-width
          color="primary"
          @click="submit"
        >
          {{ $t('action.approve') }}
        </base-button>
      </div>
    </div>
  </modal-common>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal'
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    approveType: {
      type: String,
      default: 'single' // single | all
    },
    shift: {
      type: Object,
      default: () => {}
    },
    message: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    isSuccess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalName: MODAL.MODAL_APPROVE_SHIFT
    }
  },
  computed: {
    shiftStatus () {
      return !this.message ? '' : this.isSuccess ? 'success' : 'error'
    },
    showShiftInfo () {
      return this.approveType === 'single' && this.shift && !this.message
    },
    icon () {
      return `approve-shift-${this.approveType}${this.shiftStatus ? '-' + this.shiftStatus : ''}.png`
    }
  },
  methods: {
    closed () {
      this.$emit('on-close')
    },
    submit () {
      this.$emit('on-submit')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/role-management/modal-approve-shift.scss" />
