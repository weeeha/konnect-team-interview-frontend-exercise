<template>
  <RouterLink
    class="service-card"
    data-testid="service-card"
    :to="{ name: 'service-detail', params: { id: service.id } }"
  >
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
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  background-color: $color-surface;
  border-radius: 0.2rem;
  box-shadow: $shadow-card;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 23.2rem;
  padding: 2.4rem 2.8rem 2.2rem;
  text-decoration: none;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: $shadow-card-hover;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-pill-text;
    outline-offset: 2px;
  }

  &__header {
    align-items: center;
    display: flex;
    gap: 1.2rem;
    justify-content: space-between;
    min-height: 2.8rem;
  }

  &__name {
    color: $color-text-primary;
    font-size: 2rem;
    font-weight: 600;
    line-height: 2.4rem;
    margin: 1.6rem 0 0;
  }

  &__description {
    -webkit-box-orient: vertical;
    color: $color-text-secondary;
    display: -webkit-box;
    font-size: 1.3rem;
    -webkit-line-clamp: 2;
    line-height: 2rem;
    margin: 1rem 0 0;
    overflow: hidden;
  }

  &__footer {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    margin-top: auto;
    padding-top: 2rem;

    // Pin the avatars to the right edge; they wrap below on narrow cards
    > :last-child:not(:first-child) {
      margin-left: auto;
    }
  }
}
</style>
