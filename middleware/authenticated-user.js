import { USER_ROLE } from '@/config/constant.js';
export default function ({ store, redirect, route }) {
  if (store.state.user.user === null || store.state.user.user.type !== USER_ROLE.USER) {
    return redirect('/');
  }
  if (route.path === '/user' || route.path === '/user/') {
    return redirect('/user/orders?status=pending')
  }
}
