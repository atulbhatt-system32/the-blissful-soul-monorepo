import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-[#2C1E36] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-[#2C1E36]/30 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-[#C5A059]/20" />
      
      <div className="relative z-10 text-center md:text-left">
        <Heading level="h2" className="text-2xl md:text-3xl font-serif text-white mb-3 tracking-tight">
          Already have an account?
        </Heading>
        <Text className="text-white/60 text-base md:text-lg font-sans">
          Sign in for a better experience and faster checkout.
        </Text>
      </div>
      
      <div className="relative z-10 flex-shrink-0">
        <LocalizedClientLink href="/account">
          <Button 
            variant="secondary" 
            className="h-14 px-10 rounded-full bg-[#C5A059] text-[#2C1E36] border-none font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl shadow-[#C5A059]/10 active:scale-95" 
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
