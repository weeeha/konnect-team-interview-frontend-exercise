/**
 * Domain types for the Service Hub catalog.
 * Shape mirrors the payload returned by `GET /api/services`.
 */

export type ServiceType = 'REST' | 'HTTP'

export interface ServiceDeveloper {
  id: string
  name: string
  email: string
  avatar: string
}

export interface ServiceVersion {
  id: string
  name: string
  description: string
  /** Only present when the parent service is published */
  developer?: ServiceDeveloper
  updated_at: string
}

export interface ServiceMetrics {
  /** Average latency in milliseconds, e.g. `0.83` */
  latency: number
  /** Uptime as a fraction, e.g. `0.9998` */
  uptime: number
  /** Total number of requests, e.g. `317133` */
  requests: number
  /** Error rate as a fraction, e.g. `0.0374` */
  errors: number
}

export interface Service {
  id: string
  name: string
  description: string
  type: ServiceType
  published: boolean
  configured: boolean
  versions: ServiceVersion[]
  /** Only present when the service is configured with a runtime */
  metrics?: ServiceMetrics
}

/** UI status derived from the `configured` / `published` flags */
export const ServiceStatus = {
  Published: 'published',
  Unpublished: 'unpublished',
  InProgress: 'in_progress',
} as const

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus]

export function getServiceStatus(service: Pick<Service, 'configured' | 'published'>): ServiceStatus {
  if (!service.configured) {
    return ServiceStatus.InProgress
  }

  return service.published ? ServiceStatus.Published : ServiceStatus.Unpublished
}
