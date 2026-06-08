import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CoursesTemplate from "@modules/courses/templates"
import { getCategoryByHandle } from "@lib/data/categories"
import { getCoursePageData } from "@lib/data/strapi"

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore our spiritual courses.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    limit?: string
    view?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function CoursesPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, limit, view, q } = searchParams
  const courseData = await getCoursePageData()

  // Dynamically fetch the category ID based on the "courses" handle
  // This is production safe and doesn't hardcode any IDs!
  let categoryId = undefined
  try {
    const category = await getCategoryByHandle(["courses"])
    if (category?.id) {
      categoryId = category.id
    }
  } catch (e) {
    console.warn("Courses category not found, showing all products as fallback.")
  }

  return (
    <CoursesTemplate
      sortBy={sortBy}
      page={page}
      limit={limit}
      view={view}
      q={q}
      countryCode={params.countryCode}
      categoryId={categoryId}
      courseData={courseData}
    />
  )
}
