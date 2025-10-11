<template>
  <div class="attachment-item">
    <div class="attachment-item__icon">
      <svg>
        <use xlink:href="#icon-file-attachment" />
      </svg>
    </div>
    <a
      :href="fileUrl"
      :download="fileName"
      target="_blank"
      class="attachment-item__text"
    >{{ fileName }}</a>
  </div>
</template>
<script>
import downloadFileChatMixin from '~/mixins/chat/download-file.js'
export default {
  mixins: [downloadFileChatMixin]
}
</script>
<style lang="scss" scoped>
.attachment-item {
  background-color: $white;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  &__text {
    @include font-t12r;
    color: #000000;
    @include ellipsis-multiline;
  }
}
</style>
