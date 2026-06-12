import { describe, expect, it } from 'vitest'
import { formatCompactNumber, formatLatency, formatPercent, formatRelativeTime } from './format'

describe('formatCompactNumber', () => {
  it.each([
    [23000, '23k'],
    [317133, '317.1k'],
    [1500000, '1.5m'],
    [800, '800'],
    [0, '0'],
  ])('formats %d as "%s"', (input, expected) => {
    expect(formatCompactNumber(input)).toBe(expected)
  })
})

describe('formatPercent', () => {
  it('converts a fraction into a percentage with two decimals', () => {
    expect(formatPercent(0.9998)).toBe('99.98%')
    expect(formatPercent(0.0374)).toBe('3.74%')
  })

  it('supports custom precision', () => {
    expect(formatPercent(0.5, 0)).toBe('50%')
  })
})

describe('formatLatency', () => {
  it('appends the milliseconds unit', () => {
    expect(formatLatency(0.83)).toBe('0.83ms')
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2024-06-15T12:00:00.000Z')

  it.each([
    ['2024-06-15T11:59:30.000Z', '30 seconds ago'],
    ['2024-06-15T11:45:00.000Z', '15 minutes ago'],
    ['2024-06-15T06:00:00.000Z', '6 hours ago'],
    ['2024-06-12T12:00:00.000Z', '3 days ago'],
    ['2024-05-15T12:00:00.000Z', 'last month'],
    ['2023-01-15T12:00:00.000Z', 'last year'],
  ])('formats %s as "%s"', (input, expected) => {
    expect(formatRelativeTime(input, now)).toBe(expected)
  })

  it('returns an empty string for unparsable dates', () => {
    expect(formatRelativeTime('not-a-date', now)).toBe('')
  })
})
