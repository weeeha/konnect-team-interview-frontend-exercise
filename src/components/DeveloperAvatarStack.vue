<template>
  <div
    v-if="developers.length"
    class="avatar-stack"
    data-testid="developer-avatars"
  >
    <span
      v-if="hiddenCount > 0"
      class="avatar-stack__overflow"
      data-testid="developer-avatars-overflow"
    >
      +{{ hiddenCount }}
    </span>
    <template
      v-for="developer in visibleDevelopers"
      :key="developer.id"
    >
      <img
        v-if="!failedAvatarIds.has(developer.id)"
        :alt="developer.name"
        class="avatar-stack__avatar"
        :src="developer.avatar"
        :title="developer.name"
        @error="failedAvatarIds.add(developer.id)"
      >
      <!-- Fallback to initials when the avatar image fails to load -->
      <span
        v-else
        class="avatar-stack__avatar avatar-stack__avatar--initials"
        :title="developer.name"
      >
        {{ getInitials(developer.name) }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { ServiceDeveloper } from '@/types/service'

const props = withDefaults(defineProps<{
  developers: ServiceDeveloper[]
  maxVisible?: number
}>(), {
  maxVisible: 2,
})

const failedAvatarIds = reactive(new Set<string>())

// Show the first `maxVisible` developers; the rest collapse into a "+N" chip
const visibleDevelopers = computed(() => props.developers.slice(0, props.maxVisible).reverse())
const hiddenCount = computed(() => Math.max(0, props.developers.length - props.maxVisible))

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
</script>

<style lang="scss" scoped>
.avatar-stack {
  align-items: center;
  display: flex;

  // Later siblings stack on top, matching the mock (rightmost avatar on top)
  > * + * {
    margin-left: -9px;
  }

  &__avatar {
    background-color: $color-chip-background;
    border-radius: $kui-border-radius-circle;
    flex-shrink: 0;
    height: 36px;
    object-fit: cover;
    width: 36px;

    &--initials {
      align-items: center;
      color: $color-chip-text;
      display: inline-flex;
      font-size: $kui-font-size-20;
      font-weight: $kui-font-weight-semibold;
      justify-content: center;
    }
  }

  &__overflow {
    align-items: center;
    background-color: $color-chip-background;
    border-radius: $kui-border-radius-circle;
    color: $color-chip-text;
    display: inline-flex;
    flex-shrink: 0;
    font-size: $kui-font-size-30;
    font-weight: $kui-font-weight-medium;
    height: 36px;
    justify-content: center;
    width: 36px;
  }
}
</style>
