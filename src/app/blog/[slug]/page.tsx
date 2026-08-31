// src/app/blog/[slug]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {getPostBySlug, urlFor} from '@/lib/sanity'

export const revalidate = 60

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          {post.image ? (
            <Image
              src={urlFor(post.image).width(1600).height(900).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1756136720412-b03a99998672?fm=jpg&q=70&w=2200&auto=format&fit=crop"
              alt=""
            />
          )}
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / <span>{post.title}</span>
          </div>
          {post.category && (
            <span className="eyebrow" style={{color: 'var(--adrenaline-orange)'}}>{post.category}</span>
          )}
          <h1>{post.title}</h1>
          <p className="page-hero-sub body-lg">{formatDate(post.publishedAt)}</p>
        </div>
      </section>

      <section className="blog-detail">
        <div className="container blog-detail-grid">
          <article className="prose max-w-none">
            {post.body ? (
              <PortableText value={post.body} />
            ) : (
              <p>Full write-up coming soon.</p>
            )}
          </article>

          {post.relatedExperience && (
            <aside className="blog-related-card">
              <p className="blog-related-label">Related experience</p>
              <Link href={`/experiences/${post.relatedExperience.slug.current}`} className="blog-related-link">
                {post.relatedExperience.heroImage && (
                  <div className="blog-related-img">
                    <Image
                      src={urlFor(post.relatedExperience.heroImage).width(500).height(350).url()}
                      alt={post.relatedExperience.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3>{post.relatedExperience.title}</h3>
                {post.relatedExperience.price && (
                  <p className="blog-related-price">From LKR {post.relatedExperience.price.toLocaleString()}</p>
                )}
                <span className="blog-related-cta">View Experience →</span>
              </Link>
            </aside>
          )}
        </div>
      </section>
    </main>
  )
}
