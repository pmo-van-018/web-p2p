<template>
  <div id="gift-box" ref="giftBox" class="gift-box" @mousedown="dragMouseDown">
    <div class="gift-box__wrapper">
      <svg class="gift-box__close" @click="$emit('close')">
        <use xlink:href="#icon-close-circle" />
      </svg>
      <img class="gift-box__gift-img close" :src="require('~imageRoot/common/referral-code/gift-box/gift.png')" alt="gift box">
      <img class="gift-box__gift-img open" :src="require('~imageRoot/common/referral-code/gift-box/gift-open.png')" alt="gift box">
      <div class="gift-box__action" @click.self="onShowModal">Mã giới thiệu</div>
      <img class="gift-box__confetti" :src="require('~imageRoot/common/referral-code/gift-box/confetti.png')" alt="gift box">
      <img class="gift-box__coin" :src="require('~imageRoot/common/referral-code/gift-box/coin.png')" alt="gift box">
      <img class="gift-box__megaphone" :src="require('~imageRoot/common/referral-code/gift-box/megaphone.png')" alt="gift box">
    </div>
  </div>
</template>

<script>
import { MODAL } from '~/resources/modal'

export default {
  data () {
    return {
      startDragTime: 0,
      stopDragTime: 0,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      pos4: 0
    };
  },
  mounted () {
    const elm = document.getElementById('gift-box');
    elm.addEventListener('touchstart', this.dragMouseDown, false);
  },
  methods: {
    onShowModal () {
      this.$bvModal.show(MODAL.REFERRAL_CODE)
    },
    dragMouseDown (e) {
      this.startDragTime = Date.now();
      e = e || window.event;
      if (e.type === 'touchstart') {
        this.pos3 = e.touches[0].clientX;
        this.pos4 = e.touches[0].clientY;
        document.ontouchmove = this.elementDrag;
        document.ontouchend = this.closeDragElement;
      } else {
        e.preventDefault();
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = this.closeDragElement;
        document.onmousemove = this.elementDrag;
      }
    },
    elementDrag (e) {
      e = e || window.event;
      const spaceX = this.$device.isMobileOrTablet ? 120 : 160;
      const spaceY = this.$device.isMobileOrTablet ? 120 : 150;
      if (e.type === 'touchmove') {
        this.pos1 = this.pos3 - e.touches[0].clientX;
        this.pos2 = this.pos4 - e.touches[0].clientY;
        this.pos3 = e.touches[0].clientX;
        this.pos4 = e.touches[0].clientY;
      } else {
        e.preventDefault();
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
      }
      const top = this.getCurrentLocation(
        this.$refs.giftBox.offsetTop - this.pos2,
        -7,
        window.innerHeight - spaceY
      );
      const left = this.getCurrentLocation(
        this.$refs.giftBox.offsetLeft - this.pos1,
        0,
        window.innerWidth - spaceX
      );
      this.$refs.giftBox.style.top = top + 'px';
      this.$refs.giftBox.style.left = left + 'px';
    },
    closeDragElement (e) {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchmove = null;
      document.ontouchstart = null;
      this.stopDragTime = Date.now();
    },
    getCurrentLocation (val, min, max) {
      if (val <= min) {
        return min;
      }
      if (val >= max) {
        return max;
      }
      return val;
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/gift-box/index.scss">
</style>
