<template>
  <span
    class="service-versions-pill"
    data-testid="service-versions"
  >
    {{ count }} {{ count === 1 ? 'version' : 'versions' }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<style lang="scss" scoped>
.service-versions-pill {
  background-color: $color-pill-background;
  border-radius: 10rem;
  color: $color-pill-text;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 2rem;
  padding: 0.4rem 1.6rem;
  white-space: nowrap;
}
</style>
