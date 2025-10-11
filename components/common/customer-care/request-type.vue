<template>
  <div class="request-type">
    <div class="request-type__container">
      <div class="request-type__list">
        <div
          v-for="(type, index) in types"
          :key="`request-type_${index}`"
          class="request-type__item"
          @click="$emit('on-select', type)"
        >
          <span>{{ $t(type.text) }}</span>
          <img :src="`/assets/images/common/customer-care/${type.img}.svg`" :alt="type.img">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { REQUEST_TYPE } from '@/resources/customer-care';

export default {
  data () {
    return {
      types: REQUEST_TYPE
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/customer-care/request-type.scss">
</style>
