<template>
  <modal-common
    :id="modalId"
    :ref="modalId"
    :title="title"
    modal-class="modal-small"
    @hide-modal="hideModal"
  >
    <div class="modal-content">
      <div class="ml-auto mr-auto">
        <img :src="icon" :alt="title" width="150" height="150">
      </div>

      <div class="modal-action">
        <div class="modal-action__content">
          <slot></slot>
        </div>
        <div class="modal-action__buttons">
          <base-button
            variants="outlined"
            color="info"
            full-width
            @click="hideModal"
          >
            {{ $t('role_management.modal.cancel') }}
          </base-button>
          <base-button
            variants="contained"
            full-width
            :disabled="isLoading"
            :loading="isLoading"
            color="primary"
            @click="handleClickConfirm"
          >
            {{ $t('role_management.modal.confirm') }}
          </base-button>
        </div>
      </div>
    </div>
  </modal-common>
</template>

<script>
import { MODAL } from '@/resources/modal';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    modalId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      require: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL
    };
  },
  methods: {
    hideModal () {
      this.$bvModal.hide(this.modalId)
    },
    handleClickConfirm () {
      this.$emit('on-submit-action')
    }
  }
}
</script>
<style scoped lang="scss">
.modal-action {
  &__buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  &__content {
    margin: 1rem 0;
  }
}
</style>
