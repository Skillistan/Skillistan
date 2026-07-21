import Image from 'next/image'
import Link from 'next/link'
import { formatDate, type Story } from '@/lib/content'

export function StoryCard({
  story,
}: {
  story: {
    slug: string
    title: string
    excerpt: string
    featuredImageUrl: string | null
    publishedAt: string | Date | null
  }
}) {
  return (
    <article className="group flex flex-col">
      <Link href={`/stories/${story.slug}`} className="flex flex-col">
        {story.featuredImageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={story.featuredImageUrl || '/placeholder.svg'}
              alt={story.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          {formatDate(story.publishedAt)}
        </p>
        <h3 className="mt-1.5 font-heading text-lg font-bold text-balance underline-offset-4 group-hover:underline">
          {story.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {story.excerpt}
        </p>
      </Link>
    </article>
  )
}
