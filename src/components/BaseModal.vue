<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="base-modal"
        @click.self="emit('close')"
        @keydown.esc="emit('close')"
      >
        <div
          ref="dialogElement"
          :aria-labelledby="titleId"
          aria-modal="true"
          class="base-modal__dialog"
          data-testid="modal"
          role="dialog"
          tabindex="-1"
        >
          <header class="base-modal__header">
            <h2
              :id="titleId"
              class="base-modal__title"
            >
              {{ title }}
            </h2>
            <button
              aria-label="Close dialog"
              class="base-modal__close"
              data-testid="modal-close"
              type="button"
              @click="emit('close')"
            >
              <IconClose />
            </button>
          </header>
          <div class="base-modal__body">
            <slot />
          </div>
          <footer
            v-if="$slots.footer"
            class="base-modal__footer"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, useId, watch } from 'vue'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const titleId = useId()
const dialogElement = ref<HTMLElement | null>(null)
let previouslyFocusedElement: HTMLElement | null = null

// Move focus into the dialog while open (restored on close) and prevent
// the page behind the backdrop from scrolling
watch(() => props.open, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) {
    previouslyFocusedElement = document.activeElement as HTMLElement | null
    await nextTick()
    dialogElement.value?.focus()
  } else {
    previouslyFocusedElement?.focus()
    previouslyFocusedElement = null
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.base-modal {
  align-items: center;
  background-color: rgb(9 34 81 / 50%);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: $page-padding;
  position: fixed;
  z-index: 100;

  &__dialog {
    background-color: $color-surface;
    border-radius: 0.4rem;
    box-shadow: $shadow-modal;
    max-width: 48rem;
    outline: none;
    width: 100%;
  }

  &__header {
    align-items: center;
    display: flex;
    gap: 1.6rem;
    justify-content: space-between;
    padding: 2.4rem 2.8rem 0;
  }

  &__title {
    color: $color-text-primary;
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  &__close {
    background: none;
    border: none;
    border-radius: 0.4rem;
    color: $color-text-secondary;
    cursor: pointer;
    display: inline-flex;
    padding: 0.4rem;

    &:hover {
      color: $color-text-primary;
    }

    &:focus-visible {
      outline: 2px solid $color-pill-text;
    }
  }

  &__body {
    color: $color-text-secondary;
    font-size: 1.4rem;
    line-height: 2.2rem;
    padding: 1.6rem 2.8rem 2.4rem;
  }

  &__footer {
    display: flex;
    gap: 1.2rem;
    justify-content: flex-end;
    padding: 0 2.8rem 2.4rem;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;

  .base-modal__dialog {
    transition: transform 0.15s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .base-modal__dialog {
    transform: translateY(0.8rem);
  }
}
</style>
