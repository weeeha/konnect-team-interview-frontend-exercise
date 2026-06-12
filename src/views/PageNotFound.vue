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
  gap: 0.8rem;
  margin: 0 auto;
  max-width: $content-max-width;
  padding: 9.6rem $page-padding;
  text-align: center;

  &__title {
    color: $color-text-primary;
    font-size: 2.6rem;
    font-weight: 700;
    margin: 0;
  }

  &__text {
    color: $color-text-secondary;
    font-size: 1.5rem;
    margin: 0;
  }

  &__link {
    color: $color-link;
    font-size: 1.5rem;
    font-weight: 500;
    margin-top: 0.8rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
