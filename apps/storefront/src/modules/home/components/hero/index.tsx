import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-4xl md:text-6xl text-[#2C1E36] font-serif mb-4"
          >
            The Blissful Soul
          </Heading>
          <Heading
            level="h2"
            className="text-lg md:text-xl text-[#C5A059] font-sans uppercase tracking-[0.3em] font-bold"
          >
            Healing, Crystals & Spiritual Guidance
          </Heading>
        </span>
      </div>
    </div>
  )
}

export default Hero
