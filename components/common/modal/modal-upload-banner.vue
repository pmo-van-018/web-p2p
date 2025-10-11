<template>
  <ModalCommon
    :id="MODAL.UPLOAD_BANNER"
    :ref="MODAL.UPLOAD_BANNER"
    :title="title"
    @show-modal="showModal"
    @hide-modal="close"
  >
    <div class="upload-banner">
      <section class="upload-banner__section">
        <div v-if="showStepTitle" class="header">
          <span class="step">1</span>
          <span class="title">{{ $t('system_admin.modal.background_image') }}</span>
        </div>
        <div class="content background">
          <template v-if="banner.background">
            <div class="uploaded-img">
              <span class="icon-cancel" @click="banner.background = ''"/>
              <img :src="createImageUrl(banner.background)" alt="background">
            </div>
          </template>
          <template v-else>
            <div class="empty" @click="$refs.inputBackgroundFile.click()">
              <img src="/assets/images/common/empty-background.svg" alt="background">
              <p>{{ $t('system_admin.modal.upload_library') }}</p>
              <span>{{ fileFormatRecommend }}</span>
              <input
                ref="inputBackgroundFile"
                type="file"
                hidden
                name="background"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                @change="onChooseFile"
              >
            </div>
          </template>
        </div>
      </section>
      <section v-if="includeAnimation" class="upload-banner__section">
        <div class="header">
          <span class="step">2</span>
          <span class="title">{{ $t('system_admin.modal.animation_image') }}</span>
        </div>
        <div class="content multi-file">
          <div class="animations">
            <div v-for="index in Array.from(Array(3).keys())" :key="index" class="animation">
              <div v-if="banner[`animation${index+1}`]" class="uploaded-img">
                <span class="icon-cancel" @click="banner[`animation${index+1}`] = ''" />
                <img :src="createImageUrl(banner[`animation${index+1}`])" :alt="`animation${index+1}`">
              </div>
              <div v-else class="empty" @click="$refs[`animation${index+1}`]?.click()">
                <img src="/assets/images/common/empty-anim.svg" alt="background">
                <p>{{ $t(`system_admin.modal.animation_${index+1}`) }}</p>
              </div>
            </div>
            <input
              ref="animation1"
              type="file"
              hidden
              name="animation1"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              @change="onChooseFile"
            >
            <input
              ref="animation2"
              type="file"
              hidden
              name="animation2"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              @change="onChooseFile"
            >
            <input
              ref="animation3"
              type="file"
              hidden
              name="animation3"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              @change="onChooseFile"
            >
          </div>
          <p>{{ $t('system_admin.modal.animation_file_format') }}</p>
        </div>
      </section>
    </div>
    <div class="upload-banner__action">
      <base-button
          variants="contained"
          full-width
          color="info"
          :disabled="!enableReset"
          @click="reset"
      >
        {{ $t('home.delete') }}
      </base-button>
      <base-button
          variants="contained"
          full-width
          :loading="isLoading"
          :disabled="!enableSubmit"
          color="primary"
          @click="submit"
      >
        {{ $t('common.apply') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal';
import MASTER_DATA_API from '@/api/master-data';
import axios from 'axios';
import { formatFile } from '@/helper/file';
import { RESPONSE_ICON } from '@/resources/message';
import { mapActions } from 'vuex';
import {
  REGEX_VALID_FILE_BANNER,
  MODE,
  PAGE,
  FILE_SIZE_LIMIT_BANNER
} from '@/constants/upload-file';
export default {
  components: {
    ModalCommon,
    BaseButton: () => import('@/components/common/base-button/index.vue')
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    page: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isError: false,
      isLoading: false,
      banner: {
        background: '',
        animation1: '',
        animation2: '',
        animation3: ''
      },
      upload: {}
    };
  },
  computed: {
    MODAL () {
      return MODAL
    },
    includeAnimation () {
      return this.page === PAGE.LANDING
    },
    title () {
      return this.includeAnimation ? this.$t('modal.title.upload_landing_banner') : this.$t('modal.title.upload_marketplace_banner')
    },
    fileFormatRecommend () {
      return this.$t('system_admin.modal.background_file_format', {
        size: this.mode === MODE.DESKTOP ? this.fileSizeLimitPC : this.fileSizeLimitMB,
        mode: this.mode === MODE.DESKTOP ? this.$t('system_admin.section.desktop').toLowerCase() : this.$t('system_admin.section.mobile').toLowerCase()
      })
    },
    fileSizeLimitPC () {
      return this.page === PAGE.LANDING ? '1920x840' : '1920x240'
    },
    fileSizeLimitMB () {
      return this.page === PAGE.LANDING ? '750x1188' : '750x180'
    },
    showStepTitle () {
      return this.includeAnimation
    },
    enableSubmit () {
      return this.includeAnimation ? Object.keys(this.banner).every(key => this.banner[key]) : this.banner.background
    },
    enableReset () {
      return this.includeAnimation ? Object.keys(this.banner).some(key => this.banner[key]) : this.banner.background
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    showModal () {
      this.isError = false
    },
    close () {
      this.$bvModal.hide(MODAL.UPLOAD_BANNER)
      if (!this.isError) {
        this.reset()
      }
    },
    reset () {
      this.isError = false
      this.banner = {
        background: '',
        animation1: '',
        animation2: '',
        animation3: ''
      }
    },
    async submit () {
      if (this.enableSubmit && !this.isLoading) {
        try {
          this.isLoading = true
          const invalidFormat = this.validateFileFormat()
          if (invalidFormat) {
            this.isError = true
            this.showResponseModal({
              title: '',
              content: this.$t('modal.content.upload_image_failed'),
              description: this.$t('modal.message.image_format_invalid'),
              icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
              show: true
            })
            return
          }
          const invalidSize = this.validateFileSize()
          if (invalidSize) {
            this.isError = true
            this.showResponseModal({
              title: '',
              content: this.$t('modal.content.upload_image_failed'),
              description: this.$t('modal.message.image_exceed_limit', { limit: 5 }),
              icon: RESPONSE_ICON.CONNECT_ERROR_WALLET,
              show: true
            })
            return
          }
          const results = await Promise.all([
            this.onUploadImage(this.banner.background),
            this.onUploadImage(this.banner.animation1),
            this.onUploadImage(this.banner.animation2),
            this.onUploadImage(this.banner.animation3)
          ])
          this.isError = false
          this.$emit('on-upload', {
            background: results[0],
            animations: this.includeAnimation ? results.slice(1) : []
          })
          this.showResponseModal({
            title: this.$t('system_admin.modal.system_notification_title'),
            content: this.$t('system_admin.modal.upload_image_success'),
            type: 'success',
            icon: RESPONSE_ICON.UPLOAD_IMAGE_SUCCESS,
            show: true
          })
          this.close()
        } catch (e) {
          this.isError = true
          console.error(e)
        } finally {
          this.isLoading = false
        }
      }
    },
    async onUploadImage (file) {
      if (!file) {
        return '_'
      }
      file = formatFile(file);
      const { preSignedUrl, redirectUrl, fields } = await this.createPreSignUrl(file.name)
      if (preSignedUrl) {
        const uploaded = await this.uploadImage(preSignedUrl, { ...fields, file })
        return uploaded ? redirectUrl : '';
      }
      return '';
    },
    async createPreSignUrl (fileName) {
      const { data } = await this.$axios.$post(MASTER_DATA_API.PRESIGNED_URL, { fileName });
      if (data) {
        const { fields } = data;
        return {
          preSignedUrl: data.preSingedUrl,
          redirectUrl: data.redirectUrl,
          fields
        };
      }
      return {}
    },
    async uploadImage (url, fields) {
      try {
        const formData = new FormData();
        for (const key in fields) {
          formData.append(key, fields[key]);
        }
        await axios.post(url, formData);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    onChooseFile (e) {
      this.banner[e.target.name] = e.target.files[0]
    },
    createImageUrl (file) {
      return file ? window.URL.createObjectURL(file) : ''
    },
    validateFileFormat () {
      return (
        (this.banner.background?.name && !REGEX_VALID_FILE_BANNER.test(this.banner.background?.name)) ||
        (this.banner.animation1?.name && !REGEX_VALID_FILE_BANNER.test(this.banner.animation1?.name)) ||
        (this.banner.animation2?.name && !REGEX_VALID_FILE_BANNER.test(this.banner.animation2?.name)) ||
        (this.banner.animation3?.name && !REGEX_VALID_FILE_BANNER.test(this.banner.animation3?.name))
      )
    },
    validateFileSize () {
      return (this.banner.background?.size && this.banner.background.size > FILE_SIZE_LIMIT_BANNER) ||
        (this.banner.animation1?.size && this.banner.animation1.size > FILE_SIZE_LIMIT_BANNER) ||
        (this.banner.animation2?.size && this.banner.animation2.size > FILE_SIZE_LIMIT_BANNER) ||
        (this.banner.animation3?.size && this.banner.animation3.size > FILE_SIZE_LIMIT_BANNER);
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/desktop/modal/modal-upload-banner.scss"></style>
