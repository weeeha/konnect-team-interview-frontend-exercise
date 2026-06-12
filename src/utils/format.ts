/**
 * Presentation helpers for service metrics and dates.
 * Kept as pure functions so they are trivial to unit test.
 */

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

/** `317133` -> `317k`, `1500000` -> `1.5m` (lowercase suffix to match the mock) */
export function formatCompactNumber(value: number): string {
  return compactNumberFormatter.format(value).toLowerCase()
}

/** `0.9643` -> `96.43%` */
export function formatPercent(fraction: number, fractionDigits = 2): string {
  return `${(fraction * 100).toFixed(fractionDigits)}%`
}

/** `0.83` -> `0.83ms` */
export function formatLatency(milliseconds: number): string {
  return `${milliseconds}ms`
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

const RELATIVE_TIME_DIVISIONS: Array<{ amount: number, unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
]

/** ISO date string -> `3 days ago` (or empty string for unparsable input) */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  let duration = (date.getTime() - now.getTime()) / 1000

  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return ''
}
