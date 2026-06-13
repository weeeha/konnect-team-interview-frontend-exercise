<template>
  <AppNavBar />
  <main>
    <RouterView v-slot="{ Component }">
      <!-- Keep the catalog alive so search/pagination state survives
           navigating into a service and back -->
      <KeepAlive include="PageHome">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import AppNavBar from '@/components/AppNavBar.vue'
</script>

<style lang="scss">
// Unscoped application-level styles
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  background-color: $color-page-background;
  color: $color-text-primary;
  font-family: $kui-font-family-text;
  font-size: $kui-font-size-40;
  -webkit-font-smoothing: antialiased;
  font-weight: $kui-font-weight-regular;
  line-height: $kui-line-height-40;
  margin: 0;
}

img {
  display: block;
}
</style>
