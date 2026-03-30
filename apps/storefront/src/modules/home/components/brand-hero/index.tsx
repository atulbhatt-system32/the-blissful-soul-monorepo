import React from "react"
import Image from "next/image"
import Link from "next/link"

const BrandHero = () => {
  return (
    <section className="relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden bg-pink-50">
      <Image 
        src="/hero-bg.png" 
        alt="The Blissful Soul Sale" 
        fill 
        style={{ objectFit: 'cover' }} 
        className="z-0"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-yellow-400 text-pink-900 px-6 py-1 md:px-12 md:py-3 mb-4 md:mb-6 transform -skew-x-12 inline-block">
          <h2 className="text-xl md:text-5xl font-serif font-black uppercase italic tracking-tighter skew-x-12">
            Double Dhamaka Sale
          </h2>
        </div>
        <div className="text-pink-900 drop-shadow-lg">
           <h3 className="text-3xl md:text-7xl font-serif font-extrabold uppercase mb-1 leading-none tracking-tighter">
            Buy 2 Get
           </h3>
           <h4 className="text-4xl md:text-8xl font-serif font-black uppercase leading-none tracking-tighter mb-4">
            1 Free
           </h4>
           <span className="text-xs md:text-xl font-serif font-bold opacity-80">*Tax Free</span>
        </div>
      </div>
      
      {/* Dynamic Floating Elements */}
      <div className="absolute right-10 bottom-10 hidden md:block animate-bounce duration-[3000ms]">
         <div className="relative w-40 h-40 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl">
            <Image src="/pyramid.png" alt="Crystal" fill className="object-cover" />
         </div>
      </div>
    </section>
  )
}

export default BrandHero
