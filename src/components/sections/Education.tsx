import { Card, CardContent } from "@/components/ui/card"
import SectionHeading from "@/components/SectionHeading"
import educationImage from "@/assets/grad.png"

export default function Education() {
  return (
    <section id="education" className="bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-4 py-24 md:flex-row">
        <div className="relative flex shrink-0 items-center justify-center">
          <div className="absolute size-64 rounded-full bg-[#ffe2c0] blur-xl" />
          <img src={educationImage} alt="" className="relative h-[360px] w-auto" />
        </div>
        <div className="relative">
          <div className="absolute -right-10 -bottom-10 size-80 rounded-full bg-peech blur-3xl" />
          <Card className="relative max-w-md rounded-3xl border-white bg-gradient-to-r from-transparent to-white py-10 shadow-none">
            <CardContent className="space-y-5 px-10">
              <SectionHeading>My Education:</SectionHeading>
              <div className="space-y-1">
                <p>University of Colorado Boulder | 2016-2020</p>
                <p>B.S. in Computer Science</p>
                <p className="font-bold text-lavender-lighter">Dean's List:</p>
                <p>FALL 2016 | FALL 2017 | FALL 2019</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
