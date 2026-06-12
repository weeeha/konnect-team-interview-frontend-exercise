import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ServiceCard from './ServiceCard.vue'
import { makeDeveloper, makeMetrics, makeService, makeVersion } from '@/test/fixtures'
import type { Service } from '@/types/service'

function mountCard(service: Service) {
  return mount(ServiceCard, {
    props: { service },
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('ServiceCard', () => {
  it('renders the name, description, versions count and metrics', () => {
    const wrapper = mountCard(makeService({
      name: 'My Test Service',
      description: 'Provides ownership currency details',
      versions: [makeVersion({ id: 'v1' }), makeVersion({ id: 'v2', name: '2.0.0' })],
      metrics: makeMetrics({ latency: 0.83, uptime: 0.9998, requests: 23000, errors: 0.0374 }),
    }))

    expect(wrapper.findTestId('service-name').text()).toBe('My Test Service')
    expect(wrapper.findTestId('service-description').text()).toBe('Provides ownership currency details')
    expect(wrapper.findTestId('service-versions').text()).toBe('2 versions')

    const metrics = wrapper.findTestId('service-metrics').text()
    expect(metrics).toContain('0.83ms')
    expect(metrics).toContain('99.98%')
    expect(metrics).toContain('23k')
    expect(metrics).toContain('3.74%')
  })

  it('links to the service detail page', () => {
    const wrapper = mountCard(makeService({ id: 'abc-123' }))

    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({
      name: 'service-detail',
      params: { id: 'abc-123' },
    })
  })

  it('uses the singular label for a single version', () => {
    const wrapper = mountCard(makeService({ versions: [makeVersion()] }))

    expect(wrapper.findTestId('service-versions').text()).toBe('1 version')
  })

  it('shows "Published to portal" with developer avatars when published', () => {
    const wrapper = mountCard(makeService({
      published: true,
      configured: true,
      versions: [
        makeVersion({ id: 'v1', developer: makeDeveloper({ id: 'dev-1' }) }),
        makeVersion({ id: 'v2', developer: makeDeveloper({ id: 'dev-2' }) }),
      ],
    }))

    expect(wrapper.findTestId('service-status').text()).toBe('Published to portal')
    expect(wrapper.findTestId('developer-avatars').exists()).toBe(true)
  })

  it('shows "Unpublished" without avatars when configured but not published', () => {
    const wrapper = mountCard(makeService({ published: false, configured: true }))

    expect(wrapper.findTestId('service-status').text()).toBe('Unpublished')
    expect(wrapper.findTestId('developer-avatars').exists()).toBe(false)
  })

  it('shows "In progress" without metrics or versions pill when not configured', () => {
    const wrapper = mountCard(makeService({
      published: false,
      configured: false,
      versions: [],
      metrics: undefined,
    }))

    expect(wrapper.findTestId('service-status').text()).toBe('In progress')
    expect(wrapper.findTestId('service-versions').exists()).toBe(false)
    expect(wrapper.findTestId('service-metrics').text()).toContain('Not configured with runtime yet')
  })

  it('deduplicates developers across versions', () => {
    const developer = makeDeveloper({ id: 'dev-1' })
    const wrapper = mountCard(makeService({
      versions: [
        makeVersion({ id: 'v1', developer }),
        makeVersion({ id: 'v2', developer }),
      ],
    }))

    expect(wrapper.findAll('.avatar-stack__avatar')).toHaveLength(1)
  })
})
