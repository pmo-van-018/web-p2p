<template>
  <ModalCommon
    :id="MODAL.TOOLBAR"
    hide-footer
    :title="$t('postings.toolbar')"
    class="modal-toolbar"
  >
    <div class="modal-item font-t14r grey-900 d-flex align-items-center" @click="$emit('on-edit')">
      <span class="modal-item__icon icon-edit mr-1">
      </span>{{ $t('postings.post_item.edit') }}
    </div>
    <div class="modal-item modal-item--close font-t14r grey-900 d-flex align-items-center" @click="$emit('show-modal-close')">
      <span class="modal-item__icon icon-clipboard-close mr-1" />{{ $t('postings.post_item.delete') }}
    </div>
    <div class="modal-item modal-item--clone font-t14r grey-900 d-flex align-items-center" @click="$emit('on-clone-post')">
      <span class=" modal-item__icon icon-duplicated-plus mr-1">
        <span class="path1" /><span class="path2" /><span class="path3" />
      </span>{{ $t('postings.post_item.clone') }}
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';

export default {
  components: {
    ModalCommon
  },
  data () {
    return {
      MODAL
    }
  }
};
</script>
