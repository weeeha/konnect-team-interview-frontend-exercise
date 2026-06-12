<template>
  <svg
    aria-hidden="true"
    :class="['icon-arrow', `icon-arrow--${direction}`]"
    fill="currentColor"
    height="9"
    viewBox="0 0 15 9"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.1543 4.49609L10.3574 0.699219V3.8457H0.0566406V5.14648H10.3574V8.29297L14.1543 4.49609Z" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  direction?: 'left' | 'right'
}>(), {
  direction: 'right',
})
</script>

<style lang="scss" scoped>
.icon-arrow--left {
  transform: rotate(180deg);
}
</style>
