<template>
  <KCard
    aria-hidden="true"
    class="service-card-skeleton"
  >
    <div class="service-card-skeleton__row">
      <KSkeletonBox
        height="1"
        width="50"
      />
      <KSkeletonBox
        height="2"
        width="25"
      />
    </div>
    <KSkeletonBox
      class="service-card-skeleton__title"
      height="2"
      width="50"
    />
    <KSkeletonBox
      height="1"
      width="100"
    />
    <KSkeletonBox
      height="1"
      width="75"
    />
    <div class="service-card-skeleton__footer">
      <KSkeletonBox
        height="2"
        width="50"
      />
      <span class="service-card-skeleton__avatar" />
    </div>
  </KCard>
</template>

<script setup lang="ts">
import { KCard, KSkeletonBox } from '@kong/kongponents'
</script>

<style lang="scss" scoped>
.service-card-skeleton {
  min-height: 232px;

  :deep(.card-content) {
    display: flex;
    flex-direction: column;
    gap: $kui-space-50;
  }

  &__row {
    display: flex;
    gap: $kui-space-50;
    justify-content: space-between;
  }

  &__title {
    margin-top: $kui-space-20;
  }

  &__footer {
    align-items: flex-end;
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }

  &__avatar {
    background-color: $color-chip-background;
    border-radius: $kui-border-radius-circle;
    height: 36px;
    width: 36px;
  }
}
</style>
