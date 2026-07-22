// Placeholder content for launch. Shapes mirror lib/schema.sql so this
// module can be swapped for real API/database calls without touching pages.

export type Event = {
  slug: string
  title: string
  description: string
  eventDate: string // ISO
  location: string
  imageUrl: string | null
  registrationEnabled: boolean
  status: 'published' | 'archived'
}

export type Story = {
  slug: string
  title: string
  excerpt: string
  content: string[] // paragraphs
  featuredImageUrl: string | null
  publishedAt: string // ISO
}

export type Program = {
  number: string
  title: string
  description: string
}

export const impactStats = [
  { value: '2,500+', label: 'Young people trained' },
  { value: '40+', label: 'Workshops & events delivered' },
  { value: '17', label: 'SDGs championed' },
  { value: '120+', label: 'Active volunteers' },
]

export const programs: Program[] = [
  {
    number: '01',
    title: 'Youth Skills Development',
    description:
      'Practical, employment-focused training that helps young people move from classrooms into real work: communication, freelancing fundamentals, and professional readiness.',
  },
  {
    number: '02',
    title: 'Digital Literacy',
    description:
      'Hands-on digital foundations for students and young professionals: online tools, digital safety, and the skills needed to participate in the modern economy.',
  },
  {
    number: '03',
    title: 'Climate Action & Sustainability',
    description:
      'From LCOY conferences to community campaigns, we put young voices at the center of climate conversations in Khyber Pakhtunkhwa and beyond.',
  },
  {
    number: '04',
    title: 'Youth Leadership',
    description:
      'Structured opportunities for young people to organize, speak, and lead — building the confidence and networks that turn participants into changemakers.',
  },
  {
    number: '05',
    title: 'Workshops & Community Programs',
    description:
      'Short, focused sessions delivered with schools, universities, and partners — designed to be accessible, local, and immediately useful.',
  },
]

export const events: Event[] = [
  {
    slug: 'youth-skills-bootcamp-2026',
    title: 'Youth Skills Bootcamp 2026',
    description:
      'A three-day intensive bootcamp on freelancing, digital tools, and professional communication for students in Peshawar. Certificates awarded on completion.',
    eventDate: '2026-08-14T09:00:00+05:00',
    location: 'Peshawar',
    imageUrl: '/images/group-photo.jpg',
    registrationEnabled: true,
    status: 'published',
  },
  {
    slug: 'climate-leadership-workshop-2026',
    title: 'Climate Leadership Workshop',
    description:
      'A one-day workshop connecting young climate advocates with mentors, covering SDG frameworks, community organizing, and campaign design.',
    eventDate: '2026-09-05T10:00:00+05:00',
    location: 'Islamabad',
    imageUrl: '/images/sdg-team.jpg',
    registrationEnabled: true,
    status: 'published',
  },
  {
    slug: 'lcoy-khyber-pakhtunkhwa-2024',
    title: 'LCOY Khyber Pakhtunkhwa 2024',
    description:
      'The Local Conference of Youth brought together hundreds of young climate advocates in Peshawar. Skillistan served as a lead organizing partner.',
    eventDate: '2024-07-29T09:00:00+05:00',
    location: 'Peshawar',
    imageUrl: '/images/lcoy-certificate.jpg',
    registrationEnabled: false,
    status: 'archived',
  },
  {
    slug: 'sdg-awareness-drive-2024',
    title: 'SDG Awareness Drive',
    description:
      'A campus campaign introducing the 17 Sustainable Development Goals to university students through interactive sessions and team challenges.',
    eventDate: '2024-05-10T10:00:00+05:00',
    location: 'Peshawar',
    imageUrl: '/images/sdg-team.jpg',
    registrationEnabled: false,
    status: 'archived',
  },
]

export const stories: Story[] = [
  {
    slug: 'skillistan-recognized-at-lcoy-kp',
    title: 'Skillistan recognized at LCOY Khyber Pakhtunkhwa',
    excerpt:
      'Skillistan received formal recognition as a lead organizing partner at the Local Conference of Youth, a milestone for youth-led climate action in the region.',
    content: [
      'At the Local Conference of Youth (LCOY) in Khyber Pakhtunkhwa, Skillistan was formally recognized for its exceptional contribution as a lead organizing partner. The award reflects months of coordination between volunteers, partner organizations, and local institutions.',
      'LCOY is a youth-driven event under the umbrella of YOUNGO, the official youth constituency of the UNFCCC. Bringing it to Peshawar meant creating a platform where young people from across the province could shape the climate conversation directly.',
      'For our team, the recognition matters less than what it represents: proof that youth-led organizations in Pakistan can convene serious, credible platforms for climate action, and that young people will show up when given the chance.',
    ],
    featuredImageUrl: '/images/lcoy-certificate.jpg',
    publishedAt: '2024-08-05T00:00:00+05:00',
  },
  {
    slug: 'a-plant-for-every-promise',
    title: 'A plant for every promise',
    excerpt:
      'Why we hand every speaker and partner a living plant instead of a plaque — a small ritual that captures how Skillistan thinks about growth.',
    content: [
      'At Skillistan events, guests of honor rarely leave with a framed plaque. They leave with a potted plant. It began as a practical choice, a sustainable alternative to shields and trophies, but it has become one of our defining rituals.',
      'A plant asks something of you. It has to be watered, placed in the light, and given time. That is exactly how we think about skills development: not a certificate handed over in a single ceremony, but something living that the recipient has to keep growing.',
      'Hundreds of plants later, the ritual has followed us to conferences, workshops, and campus sessions. Some of our partners now send us photos of their plants, years on. That, more than any award, is the impact we are after.',
    ],
    featuredImageUrl: '/images/plant-gift.jpg',
    publishedAt: '2024-09-12T00:00:00+05:00',
  },
  {
    slug: 'certificates-and-what-comes-after',
    title: 'Certificates, and what comes after',
    excerpt:
      'Dozens of students completed our latest training cohort. Here is what the certificate ceremony looked like, and why the real work starts the day after.',
    content: [
      'On the steps of our partner campus in Peshawar, dozens of students lined up with freshly printed certificates after completing a Skillistan training cohort. The photographs from that day are some of our favorites, but the ceremony is never the point.',
      'Every cohort ends with a simple question: what will you do with this in the next ninety days? Participants leave with a concrete next step: a freelance profile to publish, a community session to lead, a project to start.',
      'Follow-ups with alumni tell us the model works. Graduates have gone on to lead their own campus societies, land first freelance clients, and return as volunteer trainers for the next cohort. The certificate is a beginning, not an ending.',
    ],
    featuredImageUrl: '/images/group-photo.jpg',
    publishedAt: '2024-10-20T00:00:00+05:00',
  },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(date: string | Date | null) {
  if (!date) return ''
  return dateFormatter.format(new Date(date))
}

export function getUpcomingEvents() {
  return events.filter((e) => e.status === 'published')
}

export function getPastEvents() {
  return events.filter((e) => e.status === 'archived')
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug)
}

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug)
}
