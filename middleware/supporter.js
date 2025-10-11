import { USER_ROLE } from '@/config/constant.js';
export default function ({ store, redirect }) {
  if (store.state.user.user === null || store.state.user.user.type !== USER_ROLE.MERCHANT_SUPPORTER) {
    return redirect('/');
  }
}
