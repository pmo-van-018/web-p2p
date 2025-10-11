<template>
  <div class="images-file">
    <div class="images-file__container">
      <div class="images-file__list">
        <div v-for="(item, index) in images" :key="`image-upload-${index}`" class="images-file__item">
          <img
            :src="item.image"
            class="images-file__image"
            alt="image"
          >
          <svg class="images-file__close" @click="onRemoveFileImage(item)">
            <use xlink:href="#icon-close-circle" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onRemoveFileImage (item) {
      this.$emit('on-remove', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.images-file {
  &__list {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__close {
    cursor: pointer;
    position: absolute;
    top: 2px;
    right: 2px;
    width: 24px;
    height: 24px;
    z-index: 1;
    display: none;
  }
  &__item {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    &:hover {
      .images-file__close {
        display: block;
      }
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba($grey-600, .5);
      }
    }
  }
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
