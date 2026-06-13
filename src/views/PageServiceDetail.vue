<template>
  <section class="service-detail">
    <RouterLink
      class="service-detail__back-link"
      data-testid="back-link"
      :to="{ name: 'home' }"
    >
      <ArrowLeftIcon
        decorative
        :size="16"
      />
      Back to Service Hub
    </RouterLink>

    <KCard
      v-if="loading"
      aria-busy="true"
      class="service-detail__panel service-detail__panel--loading"
      data-testid="loading-state"
    >
      <KSkeletonBox
        height="1"
        width="25"
      />
      <KSkeletonBox
        height="2"
        width="50"
      />
      <KSkeletonBox
        height="1"
        width="75"
      />
    </KCard>

    <KEmptyState
      v-else-if="error"
      class="service-detail__panel service-detail__panel--notice"
      data-testid="error-state"
      icon-variant="error"
      message="We couldn't load this service. Check your connection and try again."
      title="Something went wrong"
    >
      <template #action>
        <KButton
          appearance="primary"
          data-testid="retry-button"
          @click="refetch"
        >
          Try again
        </KButton>
      </template>
    </KEmptyState>

    <KEmptyState
      v-else-if="notFound"
      :action-button-visible="false"
      class="service-detail__panel service-detail__panel--notice"
      data-testid="not-found-state"
      message="The service you are looking for doesn't exist or may have been removed."
      title="Service not found"
    />

    <template v-else-if="service">
      <KCard
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
      </KCard>

      <KCard class="service-detail__panel">
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
            <KBadge
              appearance="info"
              class="version-list__type-chip"
            >
              {{ service.type }}
            </KBadge>
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
      </KCard>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { KBadge, KButton, KCard, KSkeletonBox } from '@kong/kongponents'
import { ArrowLeftIcon } from '@kong/icons'
import DeveloperAvatarStack from '@/components/DeveloperAvatarStack.vue'
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
  gap: $kui-space-80;
  margin: 0 auto;
  max-width: 960px;
  padding: $kui-space-90 $page-padding $kui-space-100;

  &__back-link {
    align-items: center;
    align-self: flex-start;
    border-radius: $kui-border-radius-20;
    color: $color-link;
    display: inline-flex;
    font-size: $kui-font-size-30;
    font-weight: $kui-font-weight-medium;
    gap: $kui-space-40;
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
    border: none;
    box-shadow: $shadow-card;

    :deep(.card-content) {
      padding: $kui-space-90 30px;
    }

    &--loading :deep(.card-content) {
      display: flex;
      flex-direction: column;
      gap: $kui-space-60;
    }

    &--notice {
      padding: $kui-space-130 $kui-space-80;
    }
  }

  &__status-row {
    align-items: center;
    display: flex;
    gap: $kui-space-50;
    justify-content: space-between;
  }

  &__title {
    color: $color-text-primary;
    font-size: 26px;
    font-weight: $kui-font-weight-bold;
    margin: $kui-space-60 0 0;
  }

  &__description {
    color: $color-text-secondary;
    font-size: 15px;
    line-height: $kui-line-height-30;
    margin: 10px 0 0;
  }

  &__metrics {
    margin-top: $kui-space-80;
  }

  &__section-title {
    color: $color-text-primary;
    font-size: $kui-font-size-50;
    font-weight: $kui-font-weight-semibold;
    margin: 0 0 $kui-space-50;
  }

  &__notice-text {
    color: $color-text-secondary;
    font-size: $kui-font-size-30;
    margin: 0;
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
    gap: $kui-space-40 $kui-space-80;
    grid-template-columns: minmax(0, 1fr) auto minmax(160px, auto) auto;
    padding: $kui-space-60 0;

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
    gap: $kui-space-20 $kui-space-60;
  }

  &__name {
    color: $color-text-primary;
    font-family: $kui-font-family-code;
    font-size: $kui-font-size-30;
    font-weight: $kui-font-weight-semibold;
  }

  &__description {
    color: $color-text-secondary;
    font-size: 13px;
    line-height: $kui-line-height-30;
    margin: 0;
  }

  // Recolour Kong's badge to the mock's soft-blue type chip
  &__type-chip.k-badge {
    --kui-color-background-info-weakest: #{$color-pill-background};
    --kui-color-text-info: #{$color-pill-text};

    font-size: $kui-font-size-20;
    font-weight: $kui-font-weight-semibold;
  }

  &__developer {
    align-items: center;
    display: flex;
    gap: 10px;

    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }

  &__developer-name {
    color: $color-text-primary;
    font-size: 13px;
  }

  &__updated {
    color: $color-text-secondary;
    font-size: 13px;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
