<template>
  <div class="content-page">
    <div class="content-page__inner">
      <div class="content-page__left-content">
        <div class="content-page__version">
          {{ $t("home.landing.header.text_version") }}
        </div>
        <slot />
        <p class="content-page__subtitle">{{ $t("home.landing.header.content") }}</p>
      </div>
      <div class="content-page__scroll">
        <div class="content-page__scroll-icon" />
        <div class="content-page__scroll-inner">
          <div class="content-page__scroll-text">{{ $t("home.landing.header.scroll-text") }}</div>
          <div class="content-page__scroll-subtitle">{{ $t("home.landing.header.scroll-subtitle") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/desktop/landing/home/header/content-page.scss">
</style>
