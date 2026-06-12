<template>
  <section class="service-detail">
    <RouterLink
      class="service-detail__back-link"
      data-testid="back-link"
      :to="{ name: 'home' }"
    >
      <IconArrow direction="left" />
      Back to Service Hub
    </RouterLink>

    <div
      v-if="loading"
      aria-busy="true"
      class="service-detail__panel service-detail__panel--loading"
      data-testid="loading-state"
    >
      <span class="service-detail__skeleton service-detail__skeleton--badge" />
      <span class="service-detail__skeleton service-detail__skeleton--title" />
      <span class="service-detail__skeleton service-detail__skeleton--text" />
    </div>

    <div
      v-else-if="error"
      class="service-detail__panel service-detail__panel--notice"
      data-testid="error-state"
    >
      <p class="service-detail__notice-title">
        Something went wrong
      </p>
      <p class="service-detail__notice-text">
        We couldn't load this service. Check your connection and try again.
      </p>
      <button
        class="service-detail__retry-button"
        data-testid="retry-button"
        type="button"
        @click="refetch"
      >
        Try again
      </button>
    </div>

    <div
      v-else-if="notFound"
      class="service-detail__panel service-detail__panel--notice"
      data-testid="not-found-state"
    >
      <p class="service-detail__notice-title">
        Service not found
      </p>
      <p class="service-detail__notice-text">
        The service you are looking for doesn't exist or may have been removed.
      </p>
    </div>

    <template v-else-if="service">
      <div
        class="service-detail__panel"
        data-testid="service-summary"
      >
        <div class="service-detail__status-row">
          <ServiceStatusBadge :status="status" />
          <ServiceVersionsPill
            v-if="service.versions.length"
            :count="service.versions.length"
          />
        </div>
        <h1
          class="service-detail__title"
          data-testid="service-name"
        >
          {{ service.name }}
        </h1>
        <p
          v-if="service.description"
          class="service-detail__description"
        >
          {{ service.description }}
        </p>
        <ServiceMetricsList
          class="service-detail__metrics"
          :metrics="service.metrics"
        />
      </div>

      <div class="service-detail__panel">
        <h2 class="service-detail__section-title">
          Versions ({{ service.versions.length }})
        </h2>
        <ul
          v-if="service.versions.length"
          class="version-list"
          data-testid="version-list"
        >
          <li
            v-for="version in sortedVersions"
            :key="version.id"
            class="version-list__item"
          >
            <div class="version-list__about">
              <span class="version-list__name">v{{ version.name }}</span>
              <p class="version-list__description">
                {{ version.description }}
              </p>
            </div>
            <span class="version-list__type-chip">{{ service.type }}</span>
            <div class="version-list__developer">
              <template v-if="version.developer">
                <DeveloperAvatarStack :developers="[version.developer]" />
                <span class="version-list__developer-name">{{ version.developer.name }}</span>
              </template>
            </div>
            <time
              class="version-list__updated"
              :datetime="version.updated_at"
            >
              {{ formatRelativeTime(version.updated_at) }}
            </time>
          </li>
        </ul>
        <p
          v-else
          class="service-detail__notice-text"
          data-testid="no-versions"
        >
          This service doesn't have any versions yet.
        </p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DeveloperAvatarStack from '@/components/DeveloperAvatarStack.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import ServiceMetricsList from '@/components/ServiceMetricsList.vue'
import ServiceStatusBadge from '@/components/ServiceStatusBadge.vue'
import ServiceVersionsPill from '@/components/ServiceVersionsPill.vue'
import useService from '@/composables/useService'
import { getServiceStatus, ServiceStatus } from '@/types/service'
import { formatRelativeTime } from '@/utils/format'

const route = useRoute()
const serviceId = computed(() => String(route.params.id ?? ''))

const { service, loading, error, notFound, refetch } = useService(serviceId)

const status = computed(() => (service.value ? getServiceStatus(service.value) : ServiceStatus.InProgress))

// Newest versions first
const sortedVersions = computed(() => {
  if (!service.value) {
    return []
  }

  return [...service.value.versions].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )
})
</script>

<style lang="scss" scoped>
.service-detail {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  margin: 0 auto;
  max-width: 96rem;
  padding: 2.8rem $page-padding 4rem;

  &__back-link {
    align-items: center;
    align-self: flex-start;
    border-radius: 0.4rem;
    color: $color-link;
    display: inline-flex;
    font-size: 1.4rem;
    font-weight: 500;
    gap: 0.8rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid $color-pill-text;
      outline-offset: 2px;
    }
  }

  &__panel {
    background-color: $color-surface;
    border-radius: 0.2rem;
    box-shadow: $shadow-card;
    padding: 2.8rem 3rem;

    &--loading {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }

    &--notice {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      padding: 6.4rem 2.4rem;
      text-align: center;
    }
  }

  &__status-row {
    align-items: center;
    display: flex;
    gap: 1.2rem;
    justify-content: space-between;
  }

  &__title {
    color: $color-text-primary;
    font-size: 2.6rem;
    font-weight: 700;
    margin: 1.4rem 0 0;
  }

  &__description {
    color: $color-text-secondary;
    font-size: 1.5rem;
    line-height: 2.2rem;
    margin: 1rem 0 0;
  }

  &__metrics {
    margin-top: 2.4rem;
  }

  &__section-title {
    color: $color-text-primary;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 1.2rem;
  }

  &__notice-title {
    color: $color-text-primary;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
  }

  &__notice-text {
    color: $color-text-secondary;
    font-size: 1.4rem;
    margin: 0;
  }

  &__retry-button {
    background-color: transparent;
    border: 1px solid $color-border;
    border-radius: 0.4rem;
    color: $color-text-primary;
    cursor: pointer;
    font-family: inherit;
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 1.2rem;
    padding: 0.9rem 2rem;

    &:hover {
      border-color: $color-text-muted;
    }

    &:focus-visible {
      outline: 2px solid $color-pill-text;
      outline-offset: 2px;
    }
  }

  &__skeleton {
    animation: detail-skeleton-pulse 1.6s ease-in-out infinite;
    background-color: $color-chip-background;
    border-radius: 0.4rem;
    display: block;

    &--badge {
      height: 2rem;
      width: 16rem;
    }

    &--title {
      height: 2.8rem;
      width: 40%;
    }

    &--text {
      height: 1.6rem;
      width: 70%;
    }
  }
}

@keyframes detail-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
  }
}

.version-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;

  &__item {
    align-items: center;
    display: grid;
    gap: 0.8rem 2.4rem;
    grid-template-columns: minmax(0, 1fr) auto minmax(16rem, auto) auto;
    padding: 1.6rem 0;

    & + & {
      border-top: 1px solid $color-border;
    }

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr auto;
    }
  }

  &__about {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.6rem;
  }

  &__name {
    color: $color-text-primary;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.4rem;
    font-weight: 600;
  }

  &__description {
    color: $color-text-secondary;
    font-size: 1.3rem;
    line-height: 2rem;
    margin: 0;
  }

  &__type-chip {
    background-color: $color-pill-background;
    border-radius: 0.4rem;
    color: $color-pill-text;
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.3rem 0.8rem;
  }

  &__developer {
    align-items: center;
    display: flex;
    gap: 1rem;

    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }

  &__developer-name {
    color: $color-text-primary;
    font-size: 1.3rem;
  }

  &__updated {
    color: $color-text-secondary;
    font-size: 1.3rem;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
