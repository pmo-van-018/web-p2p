import { io } from 'socket.io-client';
export default ({ store, $config }, inject) => {
  if (store.state?.user?.user) {
    const socket = io($config.WS_URL, {
      withCredentials: true,
      path: '/ws/chat'
    });
    inject('socketChat', socket)
  }
}
