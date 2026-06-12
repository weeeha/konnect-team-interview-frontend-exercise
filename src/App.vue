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
  font-size: 10px;
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
  font-family: Inter, Helvetica, Arial, sans-serif;
  font-size: 1.6rem;
  -webkit-font-smoothing: antialiased;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
}

img {
  display: block;
}
</style>
