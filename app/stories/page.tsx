import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { StoryCard } from '@/components/story-card'
import { formatDate } from '@/lib/content'
import db from '@/lib/db'

export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Stories, updates, and recaps from Skillistan: youth empowerment and climate action from the field in Pakistan.',
}

export default async function StoriesPage() {
  // Fetch published stories dynamically from the database
  const stories = await db.story.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  })

  const [featured, ...rest] = stories

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 md:px-6 md:pt-20 md:pb-16">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Stories
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl">
          Notes from the field.
        </h1>
      </section>

      {/* Featured story */}
      {featured ? (
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <Link
            href={`/stories/${featured.slug}`}
            className="group grid gap-8 border border-border bg-card p-5 transition-colors hover:border-foreground/40 md:grid-cols-2 md:items-center md:p-8"
          >
            {featured.featuredImageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={featured.featuredImageUrl}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div>
              <p className="text-xs font-medium tracking-widest text-primary uppercase">
                Featured · {formatDate(featured.publishedAt)}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-balance underline-offset-4 group-hover:underline md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-sm">
                {featured.excerpt}
              </p>
              <span className="mt-6 inline-block text-sm font-medium text-primary">
                Read the story →
              </span>
            </div>
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="border border-dashed border-border bg-card/45 p-12">
            <p className="font-heading text-lg font-bold">No stories listed yet</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We are working on bringing you the latest updates from our camp sessions and climate workshops. Check back soon!
            </p>
          </div>
        </section>
      )}

      {/* Remaining stories grid */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
          <div className="grid gap-8 md:grid-cols-3">
            {rest.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
