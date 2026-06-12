import { readonly, ref, watch, type DeepReadonly, type Ref } from 'vue'

/**
 * Returns a read-only ref that mirrors `source`, but only updates after
 * `source` has stopped changing for `delay` milliseconds.
 * Useful to avoid firing an API request on every keystroke.
 */
export default function useDebouncedRef<T>(source: Ref<T>, delay = 250): DeepReadonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  return readonly(debounced)
}
