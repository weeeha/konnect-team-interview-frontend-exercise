<template>
  <div
    aria-hidden="true"
    class="service-card-skeleton"
  >
    <div class="service-card-skeleton__row">
      <span class="service-card-skeleton__block service-card-skeleton__block--status" />
      <span class="service-card-skeleton__block service-card-skeleton__block--pill" />
    </div>
    <span class="service-card-skeleton__block service-card-skeleton__block--title" />
    <span class="service-card-skeleton__block service-card-skeleton__block--text" />
    <span class="service-card-skeleton__block service-card-skeleton__block--text-short" />
    <div class="service-card-skeleton__footer">
      <span class="service-card-skeleton__block service-card-skeleton__block--metrics" />
      <span class="service-card-skeleton__block service-card-skeleton__block--avatar" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

.service-card-skeleton {
  background-color: $color-surface;
  border-radius: 0.2rem;
  box-shadow: $shadow-card;
  display: flex;
  flex-direction: column;
  min-height: 23.2rem;
  padding: 2.4rem 2.8rem 2.2rem;

  &__row {
    display: flex;
    justify-content: space-between;
  }

  &__footer {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }

  &__block {
    animation: skeleton-pulse 1.6s ease-in-out infinite;
    background-color: $color-chip-background;
    border-radius: 0.4rem;
    display: block;

    &--status {
      height: 2rem;
      width: 14rem;
    }

    &--pill {
      border-radius: 10rem;
      height: 2.8rem;
      width: 8.8rem;
    }

    &--title {
      height: 2.4rem;
      margin-top: 1.6rem;
      width: 55%;
    }

    &--text {
      height: 1.4rem;
      margin-top: 1.4rem;
      width: 85%;
    }

    &--text-short {
      height: 1.4rem;
      margin-top: 0.8rem;
      width: 60%;
    }

    &--metrics {
      height: 6.4rem;
      width: 16rem;
    }

    &--avatar {
      border-radius: 50%;
      height: 3.6rem;
      width: 3.6rem;
    }
  }
}
</style>
