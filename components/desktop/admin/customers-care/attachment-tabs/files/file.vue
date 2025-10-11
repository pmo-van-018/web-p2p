<template>
  <div class="file-item">
    <div class="file-item__icon">
      <svg>
        <use xlink:href="#icon-file" />
      </svg>
    </div>
    <div class="file-item__inner">
      <a class="file-item__name" :href="fileUrl" :download="fileName" target="_blank">
        {{ fileName }}
      </a>
    </div>
  </div>
</template>
<script>
import downloadFileChatMixin from '~/mixins/chat/download-file.js'
export default {
  mixins: [downloadFileChatMixin]
}
</script>
<style lang="scss" scoped>
.file-item {
  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  &__item {
    display: flex;
    gap: 8px;
    cursor: pointer;
  }
  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  &__name {
    color: #000;
    @include font-t14r;
    @include ellipsis-multiline;
  }
  &__size {
    @include font-t12r;
    color: $grey-400;
  }
}
</style>
