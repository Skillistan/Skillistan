import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { StoryCard } from '@/components/story-card'
import { formatDate, getStory, stories } from '@/lib/content'

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) return {}
  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      images: story.featuredImageUrl ? [story.featuredImageUrl] : undefined,
    },
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) notFound()

  const more = stories.filter((s) => s.slug !== story.slug).slice(0, 2)

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 pt-14 pb-16 md:px-6 md:pt-20">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All stories
        </Link>
        <p className="mt-8 text-xs font-medium tracking-widest text-primary uppercase">
          {formatDate(story.publishedAt)}
        </p>
        <h1 className="mt-3 font-heading text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
          {story.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
          {story.excerpt}
        </p>
        {story.featuredImageUrl && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden">
            <Image
              src={story.featuredImageUrl || '/placeholder.svg'}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-10 flex flex-col gap-6 leading-relaxed">
          {story.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            More stories
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:max-w-4xl">
            {more.map((s) => (
              <StoryCard key={s.slug} story={s} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
