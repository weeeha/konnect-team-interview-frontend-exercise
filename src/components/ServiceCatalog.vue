<template>
  <section class="service-catalog">
    <div class="service-catalog__header">
      <div class="service-catalog__intro">
        <h1 class="service-catalog__title">
          Service Hub
        </h1>
        <p class="service-catalog__subtitle">
          Organize services, manage and track versioning and API service documentation.
          <KExternalLink
            class="service-catalog__learn-more"
            href="https://docs.konghq.com/konnect/servicehub/"
          >
            Learn more
          </KExternalLink>
        </p>
      </div>
      <div class="service-catalog__actions">
        <SearchInput
          v-model="searchQuery"
          class="service-catalog__search"
          placeholder="Search"
        />
        <KButton
          appearance="primary"
          class="service-catalog__create-button"
          data-testid="create-service-package"
          @click="createDialogOpen = true"
        >
          <AddIcon decorative />
          Service Package
        </KButton>
      </div>
    </div>

    <!-- Initial load and searches show a skeleton grid -->
    <ul
      v-if="loading"
      aria-busy="true"
      aria-label="Loading services"
      class="service-catalog__grid"
      data-testid="loading-state"
    >
      <li
        v-for="index in 9"
        :key="index"
      >
        <ServiceCardSkeleton />
      </li>
    </ul>

    <KEmptyState
      v-else-if="error"
      class="service-catalog__notice"
      data-testid="error-state"
      icon-variant="error"
      message="We couldn't load your services. Check your connection and try again."
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
      v-else-if="!services.length"
      class="service-catalog__notice"
      data-testid="no-results"
      :icon-variant="activeQuery ? 'search' : 'default'"
      :message="activeQuery ? `Your search for “${activeQuery}” did not match any services.` : ''"
      :title="activeQuery ? 'No services found' : 'No services yet'"
    >
      <template
        v-if="activeQuery"
        #action
      >
        <KButton
          appearance="tertiary"
          data-testid="clear-search-button"
          @click="searchQuery = ''"
        >
          Clear search
        </KButton>
      </template>
    </KEmptyState>

    <template v-else>
      <ul
        class="service-catalog__grid"
        data-testid="catalog-grid"
      >
        <li
          v-for="service in pageItems"
          :key="service.id"
        >
          <ServiceCard :service="service" />
        </li>
      </ul>
      <CatalogPagination
        class="service-catalog__pagination"
        :has-next-page="hasNextPage"
        :has-previous-page="hasPreviousPage"
        :range-end="rangeEnd"
        :range-start="rangeStart"
        :total-items="totalItems"
        @next="goToNextPage"
        @previous="goToPreviousPage"
      />
    </template>

    <KModal
      action-button-text="Got it"
      data-testid="modal"
      hide-cancel-button
      title="Create Service Package"
      :visible="createDialogOpen"
      @cancel="createDialogOpen = false"
      @proceed="createDialogOpen = false"
    >
      Creating service packages is not part of this exercise, but this is
      where the creation flow would begin.
    </KModal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { KButton, KEmptyState, KExternalLink, KModal } from '@kong/kongponents'
import { AddIcon } from '@kong/icons'
import CatalogPagination from '@/components/CatalogPagination.vue'
import SearchInput from '@/components/SearchInput.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import ServiceCardSkeleton from '@/components/ServiceCardSkeleton.vue'
import useDebouncedRef from '@/composables/useDebouncedRef'
import usePagination from '@/composables/usePagination'
import useServices from '@/composables/useServices'

const PAGE_SIZE = 9

const searchQuery = ref('')
const debouncedQuery = useDebouncedRef(searchQuery, 250)

const { services, loading, error, refetch } = useServices(debouncedQuery)

const {
  pageItems,
  totalItems,
  rangeStart,
  rangeEnd,
  hasPreviousPage,
  hasNextPage,
  goToPreviousPage,
  goToNextPage,
} = usePagination(services, PAGE_SIZE)

// The query the visible results actually correspond to (not mid-debounce)
const activeQuery = computed(() => debouncedQuery.value.trim())

const createDialogOpen = ref(false)
</script>

<style lang="scss" scoped>
.service-catalog {
  margin: 0 auto;
  max-width: $content-max-width;
  padding: $kui-space-110 $page-padding $kui-space-100;

  &__header {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: $kui-space-70 $kui-space-80;
    justify-content: space-between;
    margin-bottom: $kui-space-90;
  }

  &__title {
    color: $color-text-primary;
    font-size: $kui-font-size-80;
    font-weight: $kui-font-weight-bold;
    line-height: $kui-line-height-70;
    margin: 0;
  }

  &__subtitle {
    color: $color-text-primary;
    font-size: $kui-font-size-40;
    line-height: $kui-line-height-40;
    margin: $kui-space-60 0 0;
  }

  &__learn-more.k-external-link {
    color: $color-link;
    font-weight: $kui-font-weight-regular;
  }

  &__actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: $kui-space-60 $kui-space-80;
  }

  // The mock's create button is a teal pill; reshape Kong's primary button
  &__create-button.k-button {
    border-radius: $kui-border-radius-round;
    font-size: $kui-font-size-40;
    height: 44px;
    padding: 0 $kui-space-80;
  }

  &__grid {
    display: grid;
    gap: $kui-space-100;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    list-style: none;
    margin: 0;
    padding: 0;

    // Cards in the same row share the same height
    > li {
      display: flex;

      > * {
        flex: 1;
      }
    }

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: $breakpoint-sm) {
      gap: $kui-space-70;
      grid-template-columns: 1fr;
    }
  }

  &__pagination {
    margin-top: $kui-space-80;
  }

  &__notice {
    margin: 0 auto;
    padding: $kui-space-130 $kui-space-80;
  }

  @media (max-width: $breakpoint-md) {
    padding-top: $kui-space-80;

    &__search {
      flex-grow: 1;
      width: auto;
    }

    &__actions {
      width: 100%;
    }
  }
}
</style>
