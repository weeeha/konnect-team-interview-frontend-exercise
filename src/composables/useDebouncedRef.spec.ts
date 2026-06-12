import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import useDebouncedRef from './useDebouncedRef'

describe('useDebouncedRef', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mirrors the initial value immediately', () => {
    const source = ref('initial')
    const debounced = useDebouncedRef(source, 250)

    expect(debounced.value).toBe('initial')
  })

  it('only propagates changes after the delay has elapsed', async () => {
    const source = ref('')
    const debounced = useDebouncedRef(source, 250)

    source.value = 'a'
    await nextTick()
    expect(debounced.value).toBe('')

    vi.advanceTimersByTime(249)
    expect(debounced.value).toBe('')

    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('a')
  })

  it('collapses rapid successive changes into the last value', async () => {
    const source = ref('')
    const debounced = useDebouncedRef(source, 250)

    source.value = 'a'
    await nextTick()
    vi.advanceTimersByTime(200)

    source.value = 'ab'
    await nextTick()
    vi.advanceTimersByTime(200)

    source.value = 'abc'
    await nextTick()
    vi.advanceTimersByTime(250)

    expect(debounced.value).toBe('abc')
  })
})
