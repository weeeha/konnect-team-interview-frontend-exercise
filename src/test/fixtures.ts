import type { Service, ServiceDeveloper, ServiceMetrics, ServiceVersion } from '@/types/service'

/**
 * Typed test-data factories. Each factory returns a sensible default that
 * individual tests override only where the scenario requires it.
 */

export function makeDeveloper(overrides: Partial<ServiceDeveloper> = {}): ServiceDeveloper {
  return {
    id: 'dev-1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    avatar: 'https://example.com/avatar.png',
    ...overrides,
  }
}

export function makeVersion(overrides: Partial<ServiceVersion> = {}): ServiceVersion {
  return {
    id: 'version-1',
    name: '1.0.0',
    description: 'Initial release',
    developer: makeDeveloper(),
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function makeMetrics(overrides: Partial<ServiceMetrics> = {}): ServiceMetrics {
  return {
    latency: 0.83,
    uptime: 0.9998,
    requests: 23000,
    errors: 0.0374,
    ...overrides,
  }
}

export function makeService(overrides: Partial<Service> = {}): Service {
  return {
    id: 'service-1',
    name: 'My Test Service',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: true,
    configured: true,
    versions: [makeVersion()],
    metrics: makeMetrics(),
    ...overrides,
  }
}

/** `count` distinct published+configured services */
export function makeServices(count: number): Service[] {
  return Array.from({ length: count }, (_, index) =>
    makeService({
      id: `service-${index + 1}`,
      name: `Service ${index + 1}`,
    }),
  )
}
