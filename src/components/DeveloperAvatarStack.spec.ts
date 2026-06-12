import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeveloperAvatarStack from './DeveloperAvatarStack.vue'
import { makeDeveloper } from '@/test/fixtures'

describe('DeveloperAvatarStack', () => {
  it('renders nothing when there are no developers', () => {
    const wrapper = mount(DeveloperAvatarStack, { props: { developers: [] } })

    expect(wrapper.findTestId('developer-avatars').exists()).toBe(false)
  })

  it('shows all avatars without an overflow chip when within the limit', () => {
    const developers = [makeDeveloper({ id: 'a' }), makeDeveloper({ id: 'b' })]
    const wrapper = mount(DeveloperAvatarStack, { props: { developers } })

    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.findTestId('developer-avatars-overflow').exists()).toBe(false)
  })

  it('collapses extra developers into a "+N" chip', () => {
    const developers = ['a', 'b', 'c', 'd', 'e'].map((id) => makeDeveloper({ id }))
    const wrapper = mount(DeveloperAvatarStack, { props: { developers } })

    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.findTestId('developer-avatars-overflow').text()).toBe('+3')
  })

  it('falls back to initials when an avatar image fails to load', async () => {
    const developers = [makeDeveloper({ id: 'a', name: 'Ada Lovelace' })]
    const wrapper = mount(DeveloperAvatarStack, { props: { developers } })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.avatar-stack__avatar--initials').text()).toBe('AL')
  })
})
