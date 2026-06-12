<template>
  <div class="search-input">
    <IconSearch class="search-input__icon" />
    <input
      :aria-label="placeholder"
      class="search-input__field"
      data-testid="search-input"
      :placeholder="placeholder"
      type="search"
      :value="modelValue"
      @input="onInput"
    >
  </div>
</template>

<script setup lang="ts">
import IconSearch from '@/components/icons/IconSearch.vue'

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Search',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<style lang="scss" scoped>
.search-input {
  position: relative;

  &__icon {
    color: $color-text-muted;
    left: 1.2rem;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &__field {
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: 0.4rem;
    color: $color-text-primary;
    font-family: inherit;
    font-size: 1.5rem;
    height: 4.4rem;
    padding: 0 1.2rem 0 4rem;
    width: 100%;

    &::placeholder {
      color: $color-text-secondary;
    }

    &:focus-visible {
      border-color: $color-pill-text;
      outline: 2px solid rgb(88 136 219 / 30%);
      outline-offset: 1px;
    }

    // Hide the native clear button so the control matches the mock
    &::-webkit-search-cancel-button {
      appearance: none;
    }
  }
}
</style>
