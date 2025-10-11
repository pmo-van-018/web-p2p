<template>
  <div class="ui-settings">
    <loading v-if="isLoading" />
    <div class="ui-settings__header">
      <span class="ui-settings__header--title">
        {{ $t('system_admin.title.ui_setting') }}
      </span>
      <span class="ui-settings__header--desc">
        {{ $t('system_admin.desc.ui_setting') }}
      </span>
    </div>
    <div class="ui-settings__content">
      <section class="ui-settings__section">
        <div class="section__header">
          <div class="header-wrapper">
            <div class="title">
              <img src="/assets/images/components/desktop/system-admin/setting-landing-banner.svg" alt="setting-landing-banner">
              <span>{{ $t('system_admin.section.landing.title') }}</span>
            </div>
            <div class="desc">
              {{ $t('system_admin.section.landing.sub_title') }}
            </div>
          </div>
        </div>
        <div class="section__content">
          <div class="info">
            <span class="title">{{ $t('system_admin.section.desktop') }}</span>
            <span>{{ $t('system_admin.section.landing.desktop_desc') }}</span>
            <span class="edit" @click="openModalUpload(PAGE.LANDING, MODE.DESKTOP)"><span class="icon-edit" />{{ $t('system_admin.section.edit') }}</span>
          </div>
          <div class="preview">
            <div class="preview__wrapper">
              <span>{{ $t('system_admin.section.upload_background') }}</span>
              <div class="banner-img">
                <img :src="banners.landing.desktop.background" alt="desktop-background-banner">
              </div>
            </div>
            <div class="preview__wrapper">
              <span>{{ $t('system_admin.section.upload_animation') }}</span>
              <div class="img-wrapper">
                <div v-for="(animation, index) in banners.landing.desktop.animations" :key="index" class="banner-img">
                  <img :src="animation" alt="animation">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section__content">
          <div class="info">
            <span class="title">{{ $t('system_admin.section.mobile') }}</span>
            <span>{{ $t('system_admin.section.landing.mobile_desc') }}</span>
            <span class="edit" @click="openModalUpload(PAGE.LANDING, MODE.MOBILE)"><span class="icon-edit" />{{ $t('system_admin.section.edit') }}</span>
          </div>
          <div class="preview">
            <div class="preview__wrapper background">
              <span>{{ $t('system_admin.section.upload_background') }}</span>
              <div class="banner-img mobile">
                <img :src="banners.landing.mobile.background" alt="desktop-background-banner">
              </div>
            </div>
            <div class="preview__wrapper animation">
              <span>{{ $t('system_admin.section.upload_animation') }}</span>
              <div class="img-wrapper">
                <div v-for="(animation, index) in banners.landing.mobile.animations" :key="index" class="banner-img">
                  <img :src="animation" alt="animation">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="ui-settings__content">
      <section class="ui-settings__section">
        <div class="section__header">
          <div class="header-wrapper">
            <div class="title">
              <img src="/assets/images/components/desktop/system-admin/setting-landing-banner.svg" alt="setting-landing-banner">
              <span>{{ $t('system_admin.section.marketplace.title') }}</span>
            </div>
            <div class="desc">
              {{ $t('system_admin.section.marketplace.sub_title') }}
            </div>
          </div>
        </div>
        <div class="section__content">
          <div class="info">
            <span class="title">{{ $t('system_admin.section.desktop') }}</span>
            <span>{{ $t('system_admin.section.marketplace.desktop_desc') }}</span>
            <span class="edit" @click="openModalUpload(PAGE.MARKETPLACE, MODE.DESKTOP)"><span class="icon-edit" />{{ $t('system_admin.section.edit') }}</span>
          </div>
          <div class="preview">
            <div class="preview__wrapper">
              <span>{{ $t('system_admin.section.upload_background') }}</span>
              <div class="banner-img">
                <img :src="banners.marketplace.desktop.background" alt="desktop-background-banner">
              </div>
            </div>
          </div>
        </div>
        <div class="section__content">
          <div class="info">
            <span class="title">{{ $t('system_admin.section.mobile') }}</span>
            <span>{{ $t('system_admin.section.marketplace.mobile_desc') }}</span>
            <span class="edit" @click="openModalUpload(PAGE.MARKETPLACE, MODE.MOBILE)"><span class="icon-edit" />{{ $t('system_admin.section.edit') }}</span>
          </div>
          <div class="preview">
            <div class="preview__wrapper background">
              <span>{{ $t('system_admin.section.upload_background') }}</span>
              <div class="banner-img mobile">
                <img :src="banners.marketplace.mobile.background" alt="desktop-background-banner">
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <modal-upload-banner :page="upload.page" :mode="upload.mode" @on-upload="updateMetaData" />
  </div>
</template>

<script>
import MASTER_DATA_API from '@/api/master-data.js';
import { GET_ALL } from '@/api/resource'
import { MODAL } from '@/resources/modal';
import { MODE, PAGE } from '@/constants/upload-file';
import { mapState } from 'vuex';
export default {
  components: {
    ModalUploadBanner: () => import('~/components/common/modal/modal-upload-banner.vue')
  },
  data () {
    return {
      isLoading: false,
      onEdit: false,
      PAGE,
      MODE,
      upload: {
        page: '',
        mode: ''
      },
      defaultBanners: {
        landing: {
          desktop: {
            background: '/assets/images/components/desktop/landing/banner/background-header.png',
            animations: [
              '/assets/images/components/desktop/landing/banner/first.png',
              '/assets/images/components/desktop/landing/banner/second.png',
              '/assets/images/components/desktop/landing/banner/three.png'
            ]
          },
          mobile: {
            background: '/assets/images/components/mobile/landing/banner/background-header.png',
            animations: [
              '/assets/images/components/mobile/landing/banner/first.png',
              '/assets/images/components/mobile/landing/banner/second.png',
              '/assets/images/components/mobile/landing/banner/three.png'
            ]
          }
        },
        marketplace: {
          desktop: {
            background: '/assets/images/components/desktop/home/hero-banner-event.png'
          },
          mobile: {
            background: '/assets/images/components/mobile/home/hero-banner-event.png'
          }
        }
      },
      currentBanners: null
    }
  },
  computed: {
    ...mapState('modal-response', ['show']),
    banners () {
      return {
        landing: {
          desktop: {
            background: this.currentBanners?.landing?.desktop?.background || this.defaultBanners?.landing?.desktop?.background,
            animations: this.currentBanners?.landing?.desktop?.animations || this.defaultBanners?.landing?.desktop?.animations
          },
          mobile: {
            background: this.currentBanners?.landing?.mobile?.background || this.defaultBanners?.landing?.mobile?.background,
            animations: this.currentBanners?.landing?.mobile?.animations || this.defaultBanners?.landing?.mobile?.animations
          }
        },
        marketplace: {
          desktop: {
            background: this.currentBanners?.marketplace?.desktop?.background || this.defaultBanners?.marketplace?.desktop?.background
          },
          mobile: {
            background: this.currentBanners?.marketplace?.mobile?.background || this.defaultBanners?.marketplace?.mobile?.background
          }
        }
      }
    }
  },
  watch: {
    show (value) {
      if (!value && this.onEdit) {
        this.$bvModal.show(MODAL.UPLOAD_BANNER)
      }
    }
  },
  created () {
    this.getBanners()
  },
  methods: {
    async getBanners () {
      const { data } = await this.$axios.$get(GET_ALL)
      this.mergeData(data.metadata)
    },
    openModalUpload (page, mode) {
      this.onEdit = true
      this.upload.page = page
      this.upload.mode = mode
      this.$bvModal.show(MODAL.UPLOAD_BANNER)
    },
    async updateMetaData (data) {
      this.onEdit = false
      this.currentBanners[this.upload.page][this.upload.mode] = data
      await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, {
        metadata: this.currentBanners
      })
      this.getBanners()
    },
    mergeData (data) {
      this.currentBanners = {
        landing: {
          desktop: {
            background: data?.landing?.desktop?.background,
            animations: data?.landing?.desktop?.animations
          },
          mobile: {
            background: data?.landing?.mobile?.background,
            animations: data?.landing?.mobile?.animations
          }
        },
        marketplace: {
          desktop: {
            background: data?.marketplace?.desktop?.background
          },
          mobile: {
            background: data?.marketplace?.mobile?.background
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/system-admin/ui-settings.scss" />
