<template>
  <div class="skeleton-loader">
    <div class="skeleton-loader__container">
      <div class="skeleton-loader__head">
        <div class="py-4 w-100">
          <div>
            <b-skeleton class="tool-bar-loader__skeleton" height="32px" width="30%" animation="fade" />
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="20%" animation="fade" />
            <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="30%" animation="fade" />
          </div>
        </div>
      </div>
      <div class="skeleton-loader__body">
        <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="100%" animation="fade" />
        <div class="skeleton-loader__steps">
          <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="168px" animation="fade" />
          <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="200px" animation="fade" />
          <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="54px" animation="fade" />
        </div>

        <div class="skeleton-loader__info">
          <b-skeleton class="tool-bar-loader__skeleton mb-3" height="24px" width="120px" animation="fade" />
          <div class="skeleton-loader__info-order">
            <div class="d-flex flex-column">
              <b-skeleton class="tool-bar-loader__skeleton" height="12px" width="90px" animation="fade" />
              <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="150px" animation="fade" />
            </div>
            <div class="d-flex flex-column">
              <b-skeleton class="tool-bar-loader__skeleton" height="12px" width="90px" animation="fade" />
              <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="150px" animation="fade" />
            </div>
            <div class="d-flex flex-column">
              <b-skeleton class="tool-bar-loader__skeleton" height="12px" width="90px" animation="fade" />
              <b-skeleton class="tool-bar-loader__skeleton" height="20px" width="150px" animation="fade" />
            </div>
          </div>
        </div>

        <div class="skeleton-loader__inner">
          <div class="skeleton-loader__payment-info">
            <b-skeleton-img no-aspect height="150px" />
            <b-skeleton-img no-aspect height="150px" />
          </div>
          <b-skeleton-img no-aspect height="150px" />
        </div>

        <div class="skeleton-loader__actions">
          <b-skeleton height="40px" width="180px" type="button" animation="fade" />
          <b-skeleton height="40px" width="180px" type="button" animation="fade" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped src="static/assets/scss/components/desktop/user-order-detail/loader.scss">
</style>
