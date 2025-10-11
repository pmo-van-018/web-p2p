import Vue from 'vue';
import { io } from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';

export default ({ store, $config }) => {
  if (store.state?.user?.user) {
    const socket = io($config.WS_URL, {
      withCredentials: true,
      path: '/api/socket.io'
    });
    Vue.use(VueSocketIOExt, socket, { store });
  }
}
