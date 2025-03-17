import { cn } from "@/lib/utils"

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
        <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
      </div>
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
    </div>
  )
}

export default BackgroundEffects
