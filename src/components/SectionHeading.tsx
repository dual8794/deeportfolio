import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
}

export default function SectionHeading({ children, className }: Props) {
  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="font-secondary text-3xl text-lavender sm:text-4xl">{children}</h2>
      <Separator className="max-w-xs bg-yellow" />
    </div>
  )
}
