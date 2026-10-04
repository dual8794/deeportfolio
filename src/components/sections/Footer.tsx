import {
  IconBrandGithubFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import footerImage from "@/assets/cat.png"

const socials = [
  { label: "GitHub", href: "https://github.com/dual8794", Icon: IconBrandGithubFilled },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/duaa-alahmed/", Icon: IconBrandLinkedin },
  { label: "Instagram", href: "https://www.instagram.com/popura_chi/", Icon: IconBrandInstagram },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-[linear-gradient(-45deg,#ffcbc4,#cbcbff)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-4 py-10 md:flex-row">
        <Card className="max-w-md rounded-3xl border-white bg-white/50 py-10 text-center shadow-none">
          <CardContent className="space-y-4 px-10">
            <h2 className="font-secondary text-3xl text-lavender-light">Get in Touch !</h2>
            <Separator className="mx-auto max-w-48 bg-yellow" />
            <p>For work inquiries or just to say hi, you can find me here:</p>
            <a
              href="mailto:duaahass22@gmail.com"
              className="inline-flex items-center gap-1 hover:text-lavender"
            >
              <IconMail className="size-5 text-grey" /> duaahass22@gmail.com
            </a>
            <div className="flex justify-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <Button
                  key={label}
                  asChild
                  size="icon-lg"
                  className="rounded-xl bg-white text-peech hover:bg-[#f5f5ff]"
                >
                  <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                    <Icon className="size-5" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <img src={footerImage} alt="" width={250} />
      </div>
    </footer>
  )
}
