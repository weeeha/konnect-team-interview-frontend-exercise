<template>
  <RouterLink
    class="service-card"
    data-testid="service-card"
    :to="{ name: 'service-detail', params: { id: service.id } }"
  >
    <KCard class="service-card__surface">
      <div class="service-card__header">
        <ServiceStatusBadge :status="status" />
        <ServiceVersionsPill
          v-if="service.versions.length"
          :count="service.versions.length"
        />
      </div>
      <h2
        class="service-card__name"
        data-testid="service-name"
      >
        {{ service.name }}
      </h2>
      <p
        v-if="service.description"
        class="service-card__description"
        data-testid="service-description"
      >
        {{ service.description }}
      </p>
      <div class="service-card__footer">
        <ServiceMetricsList :metrics="service.metrics" />
        <DeveloperAvatarStack
          v-if="service.published"
          :developers="developers"
        />
      </div>
    </KCard>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { KCard } from '@kong/kongponents'
import DeveloperAvatarStack from '@/components/DeveloperAvatarStack.vue'
import ServiceMetricsList from '@/components/ServiceMetricsList.vue'
import ServiceStatusBadge from '@/components/ServiceStatusBadge.vue'
import ServiceVersionsPill from '@/components/ServiceVersionsPill.vue'
import { getServiceStatus, type Service, type ServiceDeveloper } from '@/types/service'

const props = defineProps<{
  service: Service
}>()

const status = computed(() => getServiceStatus(props.service))

// A developer may own several versions; only show each one once
const developers = computed<ServiceDeveloper[]>(() => {
  const byId = new Map<string, ServiceDeveloper>()

  for (const version of props.service.versions) {
    if (version.developer && !byId.has(version.developer.id)) {
      byId.set(version.developer.id, version.developer)
    }
  }

  return [...byId.values()]
})
</script>

<style lang="scss" scoped>
.service-card {
  border-radius: $kui-border-radius-10;
  display: flex;
  text-decoration: none;
  transition: transform 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-pill-text;
    outline-offset: 2px;
  }

  // Use KCard as the card surface, restyled to the mock's softer elevation
  &__surface {
    border: none;
    box-shadow: $shadow-card;
    transition: box-shadow 0.2s ease;
    width: 100%;

    :deep(.card-content) {
      display: flex;
      flex-direction: column;
      min-height: 232px;
      padding: $kui-space-80 $kui-space-90 $kui-space-70;
    }
  }

  &:hover &__surface {
    box-shadow: $shadow-card-hover;
  }

  &__header {
    align-items: center;
    display: flex;
    gap: $kui-space-50;
    justify-content: space-between;
    min-height: 28px;
  }

  &__name {
    color: $color-text-primary;
    font-size: $kui-font-size-60;
    font-weight: $kui-font-weight-semibold;
    line-height: $kui-line-height-40;
    margin: $kui-space-60 0 0;
  }

  &__description {
    -webkit-box-orient: vertical;
    color: $color-text-secondary;
    display: -webkit-box;
    font-size: 13px;
    -webkit-line-clamp: 2;
    line-height: $kui-line-height-30;
    margin: 10px 0 0;
    overflow: hidden;
  }

  &__footer {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: $kui-space-50;
    margin-top: auto;
    padding-top: $kui-space-70;

    // Pin the avatars to the right edge; they wrap below on narrow cards
    > :last-child:not(:first-child) {
      margin-left: auto;
    }
  }
}
</style>
