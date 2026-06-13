<template>
  <section class="page-not-found">
    <h1 class="page-not-found__title">
      Page not found
    </h1>
    <p class="page-not-found__text">
      The page you are looking for doesn't exist.
    </p>
    <RouterLink
      class="page-not-found__link"
      :to="{ name: 'home' }"
    >
      Back to Service Hub
    </RouterLink>
  </section>
</template>

<style lang="scss" scoped>
.page-not-found {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
  margin: 0 auto;
  max-width: $content-max-width;
  padding: $kui-space-150 $page-padding;
  text-align: center;

  &__title {
    color: $color-text-primary;
    font-size: 26px;
    font-weight: $kui-font-weight-bold;
    margin: 0;
  }

  &__text {
    color: $color-text-secondary;
    font-size: 15px;
    margin: 0;
  }

  &__link {
    color: $color-link;
    font-size: 15px;
    font-weight: $kui-font-weight-medium;
    margin-top: $kui-space-40;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
