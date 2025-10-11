import { USER_ROLE } from '@/config/constant.js';
export default function ({ store, redirect }) {
  if (store.state.user.user === null || !USER_ROLE.ADMIN_SUPPORTER === store.state.user?.user?.type) {
    return redirect('/');
  }
}
