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
        <IconOrganization />
        <span class="app-nav__item-label">Organization</span>
      </a>
      <a
        class="app-nav__item"
        href="#"
        @click.prevent
      >
        <IconSettings />
        <span class="app-nav__item-label">Settings</span>
      </a>
    </nav>
    <div class="app-nav__user">
      <IconUser />
      <span class="app-nav__user-name">Katherine Ellis</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import IconOrganization from '@/components/icons/IconOrganization.vue'
import IconSettings from '@/components/icons/IconSettings.vue'
import IconUser from '@/components/icons/IconUser.vue'
</script>

<style lang="scss" scoped>
.app-nav {
  align-items: center;
  background: linear-gradient(180deg, $color-nav-gradient-top 0%, $color-nav-gradient-bottom 100%);
  display: flex;
  height: $nav-height;
  padding-left: $page-padding;

  &__logo {
    border-radius: 0.4rem;
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
    gap: 4rem;
    margin-right: 4rem;
  }

  &__item {
    align-items: center;
    border-radius: 0.4rem;
    color: #fff;
    display: inline-flex;
    font-size: 1.6rem;
    font-weight: 500;
    gap: 1.2rem;
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
    color: #fff;
    display: flex;
    flex-shrink: 0;
    font-size: 1.6rem;
    gap: 1.4rem;
    padding: 0 3rem 0 2.4rem;
  }

  @media (max-width: $breakpoint-md) {
    &__menu {
      gap: 2.4rem;
      margin-right: 2.4rem;
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
      padding: 0 2rem;
    }
  }
}
</style>
