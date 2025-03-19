import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { Link2 } from "lucide-react"

// Define the Link interface
interface LinkItem {
  label: string
  url: string
  bgColorClass?: string
  textColorClass?: string
}

// Define the props interface for the component
interface MoreLinksModalProps {
  isOpen: boolean
  onClose: (value: boolean) => void
  links: LinkItem[]
}

// Add this modal component to your imports or create it as a new component
const MoreLinksModal = ({ isOpen, onClose, links }: MoreLinksModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-[#0D0B26] border border-gray-800/70 text-white p-0 rounded-xl overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-800/50">
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F7984A]/20 text-[#F7984A]">
                <Link2 size={16} />
              </div>
              <span>All links</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {links.map((link: LinkItem, index: number) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                className={`px-4 py-2.5 rounded-md text-sm font-medium flex items-center justify-center border-[0.5px] border-gray-800/70 hover:border-[#F7984A]/30 transition-all duration-300 ${link.bgColorClass || "hover:bg-[#F7984A]/5"} ${link.textColorClass || "text-gray-300 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MoreLinksModal

