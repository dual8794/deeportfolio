import { useState } from "react"
import { IconFileTypePdf } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import icon from "@/assets/icon.png"

const links = [
  { id: "about", label: "About me" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact me" },
]

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<string>()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4">
        <a href="#top" className="flex items-center gap-3">
          <img src={icon} width={30} height={30} alt="" />
          <span className="font-semibold">Duaa Alahmed</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "text-sm transition-colors hover:text-lavender",
                activeTab === link.id && "font-bold text-lavender"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button className="bg-lavender-light hover:bg-lavender">
          <IconFileTypePdf />
          Download CV
        </Button>
      </nav>
    </header>
  )
}
