<template>
  <header class="app-nav">
    <RouterLink
      aria-label="Konnect home"
      class="app-nav__logo"
      to="/"
    >
      <IconLogo />
    </RouterLink>
    <nav
      aria-label="Main"
      class="app-nav__menu"
    >
      <a
        class="app-nav__item"
        href="#"
        @click.prevent
      >
        <OrganizationIcon
          decorative
          :size="20"
        />
        <span class="app-nav__item-label">Organization</span>
      </a>
      <a
        class="app-nav__item"
        href="#"
        @click.prevent
      >
        <CogIcon
          decorative
          :size="20"
        />
        <span class="app-nav__item-label">Settings</span>
      </a>
    </nav>
    <div class="app-nav__user">
      <ProfileIcon
        decorative
        :size="20"
      />
      <span class="app-nav__user-name">Katherine Ellis</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CogIcon, OrganizationIcon, ProfileIcon } from '@kong/icons'
import IconLogo from '@/components/icons/IconLogo.vue'
</script>

<style lang="scss" scoped>
.app-nav {
  align-items: center;
  background: linear-gradient(180deg, $color-nav-gradient-top 0%, $color-nav-gradient-bottom 100%);
  display: flex;
  height: $nav-height;
  padding-left: $page-padding;

  &__logo {
    border-radius: $kui-border-radius-20;
    display: inline-flex;
    flex-shrink: 0;
    margin-right: auto;

    &:focus-visible {
      outline: 2px solid rgb(255 255 255 / 60%);
      outline-offset: 4px;
    }
  }

  &__menu {
    align-items: center;
    display: flex;
    gap: $kui-space-100;
    margin-right: $kui-space-100;
  }

  &__item {
    align-items: center;
    border-radius: $kui-border-radius-20;
    color: $kui-color-text-inverse;
    display: inline-flex;
    font-size: $kui-font-size-40;
    font-weight: $kui-font-weight-medium;
    gap: $kui-space-50;
    text-decoration: none;

    &:hover {
      opacity: 0.85;
    }

    &:focus-visible {
      outline: 2px solid rgb(255 255 255 / 60%);
      outline-offset: 4px;
    }
  }

  &__user {
    align-items: center;
    align-self: stretch;
    background-color: $color-nav-user-panel;
    color: $kui-color-text-inverse;
    display: flex;
    flex-shrink: 0;
    font-size: $kui-font-size-40;
    gap: 14px;
    padding: 0 $kui-space-90 0 $kui-space-80;
  }

  @media (max-width: $breakpoint-md) {
    &__menu {
      gap: $kui-space-80;
      margin-right: $kui-space-80;
    }

    &__item-label,
    &__user-name {
      // Keep icons only on small screens
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    &__user {
      padding: 0 $kui-space-70;
    }
  }
}
</style>
