<template>
  <div class="empty-attachment">
    <svg>
      <use xlink:href="#empty-attachment" />
    </svg>
    <div class="empty-attachment__text"><slot /></div>
  </div>
</template>
<style lang="scss" scoped>
.empty-attachment {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  svg {
    width: 124px;
    height: 124px;
    object-fit: contain;
  }
  &__text {
    @include font-t16m;
    color: $grey-400;
  }
}
</style>
