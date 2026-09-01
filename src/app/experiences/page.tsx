import {getAllExperiences} from '@/lib/sanity'
import ExperienceCategoryFilter from '@/components/ExperienceCategoryFilter'

export const revalidate = 60

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams?: Promise<{category?: string}> | {category?: string}
}) {
  const resolvedSearchParams = await searchParams
  const initialCategory =
    typeof resolvedSearchParams?.category === 'string' && resolvedSearchParams.category.trim()
      ? resolvedSearchParams.category
      : 'All'

  const experiences = await getAllExperiences()

  return (
    <main className="bg-[#f5f2ea] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-orange-600 text-sm font-semibold tracking-wide uppercase mb-2">
          What We Run
        </p>
        <h1 className="text-4xl font-bold mb-8">All Experiences</h1>

        <ExperienceCategoryFilter experiences={experiences} initialCategory={initialCategory} />
      </section>
    </main>
  )
}
