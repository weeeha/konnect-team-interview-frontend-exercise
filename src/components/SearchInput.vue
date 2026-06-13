<template>
  <KInput
    class="search-input"
    data-testid="search-input"
    :model-value="modelValue"
    :placeholder="placeholder"
    type="search"
    @update:model-value="emit('update:modelValue', String($event))"
  >
    <template #before>
      <SearchIcon
        class="search-input__icon"
        decorative
        :size="16"
      />
    </template>
  </KInput>
</template>

<script setup lang="ts">
import { KInput } from '@kong/kongponents'
import { SearchIcon } from '@kong/icons'

withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Search',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
</script>

<style lang="scss" scoped>
.search-input {
  width: 210px;

  &__icon {
    color: $color-text-muted;
  }
}
</style>
