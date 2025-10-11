// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
// eslint-disable-next-line import/no-absolute-path
// const errorImage = require('/static/assets/images/default.jpg');

Vue.use(VueLazyload, {
  attempt: 1
  // error: errorImage
})
