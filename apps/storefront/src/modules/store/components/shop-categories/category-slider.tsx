"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import CategoryTile, { ShopCategoryTile } from "./category-tile"

import "swiper/css"
import "swiper/css/pagination"

/**
 * Mobile layout for the shop page's category tiles: just over three across
 * in a swipeable row. The 2-column grid it replaces left an odd category alone
 * on its own line. Tablet and desktop keep the grid in ./index.tsx.
 */
const CategorySlider = ({ categories }: { categories: ShopCategoryTile[] }) => {
  return (
    <div className="md:hidden">
      <Swiper
        modules={[Pagination]}
        // 3.2 rather than a round number: the cards stay large, and the
        // sliver of the next tile at the edge signals that the row scrolls.
        slidesPerView={3.2}
        spaceBetween={10}
        pagination={{
          clickable: true,
          el: ".shop-categories-pagination",
          renderBullet: (_index, className) =>
            `<span class="${className} swiper-pagination-bullet inline-block transition-all duration-500 ease-in-out cursor-pointer"></span>`,
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!h-auto">
            <CategoryTile tile={category} variant="slider" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Same dots as the trust carousel: navy, with the active one a gold pill */}
      <div className="shop-categories-pagination flex justify-center items-center gap-2 mt-4" />

      <style jsx global>{`
        .shop-categories-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #2c1e36;
          opacity: 0.15;
          border-radius: 50%;
          margin: 0 !important;
        }
        .shop-categories-pagination .swiper-pagination-bullet-active {
          background: #c5a059 !important;
          opacity: 1;
          width: 28px !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  )
}

export default CategorySlider
