<template>
  <section class="service-catalog">
    <div class="service-catalog__header">
      <div class="service-catalog__intro">
        <h1 class="service-catalog__title">
          Service Hub
        </h1>
        <p class="service-catalog__subtitle">
          Organize services, manage and track versioning and API service documentation.
          <a
            class="service-catalog__learn-more"
            href="https://docs.konghq.com/konnect/servicehub/"
            rel="noopener noreferrer"
            target="_blank"
          >Learn more</a>
        </p>
      </div>
      <div class="service-catalog__actions">
        <SearchInput
          v-model="searchQuery"
          class="service-catalog__search"
          placeholder="Search"
        />
        <button
          class="service-catalog__create-button"
          data-testid="create-service-package"
          type="button"
          @click="createDialogOpen = true"
        >
          <IconPlus />
          Service Package
        </button>
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

    <div
      v-else-if="error"
      class="service-catalog__notice"
      data-testid="error-state"
    >
      <p class="service-catalog__notice-title">
        Something went wrong
      </p>
      <p class="service-catalog__notice-text">
        We couldn't load your services. Check your connection and try again.
      </p>
      <button
        class="service-catalog__retry-button"
        data-testid="retry-button"
        type="button"
        @click="refetch"
      >
        Try again
      </button>
    </div>

    <div
      v-else-if="!services.length"
      class="service-catalog__notice"
      data-testid="no-results"
    >
      <p class="service-catalog__notice-title">
        {{ activeQuery ? 'No services found' : 'No services yet' }}
      </p>
      <p
        v-if="activeQuery"
        class="service-catalog__notice-text"
      >
        Your search for &ldquo;{{ activeQuery }}&rdquo; did not match any services.
      </p>
      <button
        v-if="activeQuery"
        class="service-catalog__retry-button"
        data-testid="clear-search-button"
        type="button"
        @click="searchQuery = ''"
      >
        Clear search
      </button>
    </div>

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

    <BaseModal
      :open="createDialogOpen"
      title="Create Service Package"
      @close="createDialogOpen = false"
    >
      Creating service packages is not part of this exercise, but this is
      where the creation flow would begin.
      <template #footer>
        <button
          class="service-catalog__create-button"
          type="button"
          @click="createDialogOpen = false"
        >
          Got it
        </button>
      </template>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import CatalogPagination from '@/components/CatalogPagination.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
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
  padding: 4.8rem $page-padding 4rem;

  &__header {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: 2rem 2.4rem;
    justify-content: space-between;
    margin-bottom: 2.8rem;
  }

  &__title {
    color: $color-text-primary;
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 3.6rem;
    margin: 0;
  }

  &__subtitle {
    color: $color-text-primary;
    font-size: 1.6rem;
    line-height: 2.4rem;
    margin: 1.6rem 0 0;
  }

  &__learn-more {
    color: $color-link;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1.6rem 2.4rem;
  }

  &__search {
    width: 21rem;
  }

  &__create-button {
    align-items: center;
    background-color: $color-brand;
    border: none;
    border-radius: 10rem;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 1.6rem;
    font-weight: 600;
    gap: 0.8rem;
    height: 4.4rem;
    justify-content: center;
    padding: 0 2.4rem 0 1.6rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $color-brand-dark;
    }

    &:focus-visible {
      outline: 2px solid $color-brand;
      outline-offset: 2px;
    }
  }

  &__grid {
    display: grid;
    gap: 4rem;
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
      gap: 2rem;
      grid-template-columns: 1fr;
    }
  }

  &__pagination {
    margin-top: 2.4rem;
  }

  &__notice {
    align-items: center;
    background-color: $color-surface;
    border-radius: 0.2rem;
    box-shadow: $shadow-card;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin: 0 auto;
    padding: 6.4rem 2.4rem;
    text-align: center;
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
    transition: border-color 0.2s ease;

    &:hover {
      border-color: $color-text-muted;
    }

    &:focus-visible {
      outline: 2px solid $color-pill-text;
      outline-offset: 2px;
    }
  }

  @media (max-width: $breakpoint-md) {
    padding-top: 2.4rem;

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
