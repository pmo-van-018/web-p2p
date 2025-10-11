/* eslint-disable no-console */
import AUTH_API from '@/api/auth'
import { LOGIN_TYPE_ROLE } from '@/config/constant'
import { getForwardedHeader } from '@/helper/header';

export const actions = {
  async challenge ({ commit }, loginType) {
    try {
      const apiChallenge = {
        [LOGIN_TYPE_ROLE.USER]: AUTH_API.CHALLENGE_USER,
        [LOGIN_TYPE_ROLE.OPERATION]: AUTH_API.CHALLENGE_MERCHANT,
        [LOGIN_TYPE_ROLE.ADMIN]: AUTH_API.CHALLENGE_ADMIN
      }[loginType];
      return await this.$axios.$post(apiChallenge || apiChallenge[LOGIN_TYPE_ROLE.USER]);
    } catch (e) {
      console.log(e)
    }
  },
  async login ({ commit }, payload) {
    try {
      return await this.$axios.$post(`${AUTH_API.LOGIN_USER}`, payload, {
        headers: getForwardedHeader()
      });
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async logout ({ commit }, payload) {
    try {
      return await this.$axios.$post(`${AUTH_API.LOGOUT}`, payload);
    } catch (e) {
      console.log(e)
    }
  },
  async loginOperation ({ commit }, payload) {
    try {
      return await this.$axios.$post(`${AUTH_API.LOGIN_MERCHANT}`, payload, {
        headers: getForwardedHeader()
      });
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async loginAdmin ({ commit }, payload) {
    try {
      return await this.$axios.$post(`${AUTH_API.LOGIN_ADMIN}`, payload, {
        headers: getForwardedHeader()
      });
    } catch (e) {
      console.error(e)
      throw e
    }
  }
};
