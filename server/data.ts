import { faker } from '@faker-js/faker'
import type { Service, ServiceDeveloper, ServiceMetrics, ServiceVersion } from '../src/types/service'

// The first page of the catalog mirrors the design mock verbatim; the rest of
// the dataset is generated with a fixed seed so search results, pagination
// ("1 to 9 of 42 services") and detail pages are stable across restarts.

faker.seed(20260612)

const daysAgo = (days: number): string => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

// Photographic avatars to match the mock (initials fallback covers offline use)
const avatarUrl = (image: number): string => `https://i.pravatar.cc/72?img=${image}`

const katherine: ServiceDeveloper = {
  id: 'dev-katherine-ellis',
  name: 'Katherine Ellis',
  email: 'katherine.ellis@konghq.com',
  avatar: avatarUrl(47),
}

const sirius: ServiceDeveloper = {
  id: 'dev-sirius-marshall',
  name: 'Sirius Marshall',
  email: 'sirius.marshall@konghq.com',
  avatar: avatarUrl(13),
}

const harriet: ServiceDeveloper = {
  id: 'dev-harriet-fisher',
  name: 'Harriet Fisher',
  email: 'harriet.fisher@konghq.com',
  avatar: avatarUrl(32),
}

const dianne: ServiceDeveloper = {
  id: 'dev-dianne-baker',
  name: 'Dianne Baker',
  email: 'dianne.baker@konghq.com',
  avatar: avatarUrl(25),
}

const marcus: ServiceDeveloper = {
  id: 'dev-marcus-chen',
  name: 'Marcus Chen',
  email: 'marcus.chen@konghq.com',
  avatar: avatarUrl(59),
}

const elena: ServiceDeveloper = {
  id: 'dev-elena-russo',
  name: 'Elena Russo',
  email: 'elena.russo@konghq.com',
  avatar: avatarUrl(20),
}

// Every configured card in the mock shows these exact numbers
const mockMetrics: ServiceMetrics = {
  latency: 0.83,
  uptime: 0.9998,
  requests: 23000,
  errors: 0.0374,
}

interface VersionSpec {
  name: string
  description: string
  daysOld: number
  developer?: ServiceDeveloper
}

const makeVersions = (specs: VersionSpec[]): ServiceVersion[] =>
  specs.map(({ name, description, daysOld, developer }) => ({
    id: faker.string.uuid(),
    name,
    description,
    developer,
    updated_at: daysAgo(daysOld),
  }))

// The nine services shown on the mock's first page, in order
const mockScreenServices: Service[] = [
  {
    id: 'b3b6e493-4bd6-4a89-a798-1c2b1b7e8a01',
    name: 'My Test Service',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: true,
    configured: true,
    versions: makeVersions([
      { name: '1.0.0', description: 'Initial public release', daysOld: 12, developer: katherine },
    ]),
    metrics: mockMetrics,
  },
  {
    id: '0d0b6d12-4042-4cf8-aa53-1c2b1b7e8a02',
    name: 'Account inquiry',
    description: 'Provides account details, balances, and information about transactions',
    type: 'REST',
    published: true,
    configured: true,
    versions: makeVersions([
      { name: '2.1.0', description: 'Adds balance breakdown by currency', daysOld: 6, developer: sirius },
      { name: '1.4.2', description: 'Transaction listing performance fixes', daysOld: 48, developer: harriet },
    ]),
    metrics: mockMetrics,
  },
  {
    id: '7e2d54d1-3f9e-4f1b-9c0a-1c2b1b7e8a03',
    name: 'FX Rates',
    description: 'Retrieves the current foreign currency exchange',
    type: 'REST',
    published: true,
    configured: true,
    versions: makeVersions([
      { name: '5.0.1', description: 'Streaming quotes hotfix', daysOld: 2, developer: harriet },
      { name: '5.0.0', description: 'Streaming quotes over websockets', daysOld: 9, developer: dianne },
      { name: '4.2.0', description: 'Adds 14 new currency pairs', daysOld: 36, developer: marcus },
      { name: '4.1.3', description: 'Rounding precision corrections', daysOld: 77, developer: elena },
      { name: '4.1.0', description: 'Historical rates endpoint', daysOld: 120, developer: katherine },
    ]),
    metrics: mockMetrics,
  },
  {
    id: 'c9f1f2e3-a1b2-4c3d-8e4f-1c2b1b7e8a04',
    name: 'Collect Money',
    description: 'Enables collections for corporate entities',
    type: 'HTTP',
    published: false,
    configured: false,
    versions: [],
  },
  {
    id: '4a5b6c7d-8e9f-4a1b-9c2d-1c2b1b7e8a05',
    name: 'Account ownership',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: false,
    configured: true,
    versions: makeVersions([
      { name: '0.9.0', description: 'Beta ownership graph', daysOld: 18 },
      { name: '0.8.1', description: 'Schema validation fixes', daysOld: 41 },
    ]),
    metrics: mockMetrics,
  },
  {
    id: '2f3e4d5c-6b7a-4980-8d1e-1c2b1b7e8a06',
    name: 'Kong website service',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: true,
    configured: true,
    versions: makeVersions([
      { name: '3.2.0', description: 'CDN cache warming', daysOld: 4, developer: marcus },
      { name: '3.1.0', description: 'Edge rendering rollout', daysOld: 29, developer: marcus },
    ]),
    metrics: mockMetrics,
  },
  {
    id: '9c8b7a6d-5e4f-4321-8a0b-1c2b1b7e8a07',
    name: 'Money flow',
    description: 'Enables collections for corporate entities',
    type: 'HTTP',
    published: false,
    configured: false,
    versions: [],
  },
  {
    id: '1a2b3c4d-5e6f-4789-9a0b-1c2b1b7e8a08',
    name: 'Checkout',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: false,
    configured: true,
    versions: makeVersions([
      { name: '2.0.0', description: 'One-click payments', daysOld: 15 },
      { name: '1.9.4', description: 'Cart session hardening', daysOld: 52 },
    ]),
    metrics: mockMetrics,
  },
  {
    id: '8d7c6b5a-4f3e-4210-9b8a-1c2b1b7e8a09',
    name: 'Program',
    description: 'Provides ownership currency details about the accounts',
    type: 'REST',
    published: false,
    configured: true,
    versions: makeVersions([
      { name: '1.2.0', description: 'Scheduled program runs', daysOld: 22 },
      { name: '1.1.0', description: 'Program templates', daysOld: 67 },
    ]),
    metrics: mockMetrics,
  },
]

// ---------------------------------------------------------------------------
// Seeded filler so the catalog totals the mock's "42 services"
// ---------------------------------------------------------------------------

const TOTAL_SERVICES = 42

const fakeDevelopers: ServiceDeveloper[] = Array.from({ length: 10 }, () => {
  const sex = faker.number.int({ min: 1, max: 100 }) >= 95 ? 'female' : 'male'
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName(sex)

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    avatar: faker.image.avatar(),
  }
})

const generatedServices: Service[] = Array.from({ length: TOTAL_SERVICES - mockScreenServices.length }, () => {
  const published = faker.datatype.boolean({ probability: 0.75 })
  const configured = published || faker.datatype.boolean({ probability: 0.75 })
  const versionCount = configured ? faker.number.int({ min: published ? 1 : 0, max: 5 }) : 0

  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.datatype.boolean({ probability: 0.95 })
      ? (faker.datatype.boolean() ? faker.commerce.productDescription() : faker.company.catchPhrase())
      : '',
    type: faker.datatype.boolean({ probability: 0.75 }) ? 'REST' : 'HTTP',
    published,
    configured,
    versions: Array.from({ length: versionCount }, () => ({
      id: faker.string.uuid(),
      name: faker.system.semver(),
      description: faker.datatype.boolean({ probability: 0.8 })
        ? faker.company.catchPhrase()
        : faker.commerce.productDescription(),
      developer: published ? faker.helpers.arrayElement(fakeDevelopers) : undefined,
      updated_at: daysAgo(faker.number.int({ min: 1, max: 180 })),
    })),
    metrics: configured
      ? {
        latency: faker.number.float({ min: 0.3, max: 0.99, multipleOf: 0.01 }),
        uptime: faker.number.float({ min: 0.895, max: 0.998, multipleOf: 0.0001 }),
        requests: faker.number.int({ min: 800, max: 1500000 }),
        errors: faker.number.float({ min: 0.001, max: 0.089, multipleOf: 0.0001 }),
      }
      : undefined,
  }
})

// NOTE: For the search functionality created in `/server/app.ts` arrays may
// ONLY be the value of a top-level property
export default {
  services: [...mockScreenServices, ...generatedServices],
}
