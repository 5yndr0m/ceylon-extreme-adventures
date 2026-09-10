// src/app/blog/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import {getAllPosts, urlFor} from '@/lib/sanity'

export const revalidate = 60 // ISR: re-fetch from Sanity at most once a minute

type PostSummary = {
  _id: string
  title: string
  slug: {current: string}
  category?: string
  excerpt?: string
  publishedAt: string
  image?: any
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})
}

export default async function BlogPage() {
  const posts: PostSummary[] = await getAllPosts()

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-bg">
          <img
            src="https://cdn.sanity.io/images/b5qf24u0/production/77c883843ebb49fb08120a5c1f2d535d35eb167a-1920x1080.jpg?w=2200&auto=format"
            alt="Group celebrating at the top of Kotaganga Ella"
          />
          <div className="overlay"></div>
        </div>
        <div className="container page-hero-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <span>Blog</span>
          </div>
          <span className="eyebrow" style={{color: 'var(--adrenaline-orange)'}}>Trip planning &amp; stories</span>
          <h1>Notes From The Trail</h1>
          <p className="page-hero-sub body-lg">
            Trip-planning guides, company news, and beginner&apos;s advice from the guides who run these routes every week.
          </p>
        </div>
      </section>

      <section className="blog-list">
        <div className="container">
          {posts.length === 0 ? (
            <p style={{color: 'var(--stone-gray)'}}>
              No posts published yet — check back soon, or browse our <Link href="/experiences" style={{textDecoration: 'underline'}}>experiences</Link> in the meantime.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug.current}`} className="blog-card">
                  <div className="blog-card-img">
                    {post.image ? (
                      <Image
                        src={urlFor(post.image).width(700).height(460).url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="blog-card-img-fallback" />
                    )}
                  </div>
                  <div className="blog-card-body">
                    {post.category && <span className="tag">{post.category}</span>}
                    <h3>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className="blog-card-date">{formatDate(post.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
