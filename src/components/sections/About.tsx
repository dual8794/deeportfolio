import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import SectionHeading from "@/components/SectionHeading"
import personalImage from "@/assets/Duaa.jpg"

export default function About() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-4 py-24 md:flex-row">
        <Card className="max-w-xl rounded-3xl border-white bg-gradient-to-l from-peech-light to-transparent py-10 shadow-none">
          <CardContent className="space-y-4 px-10">
            <SectionHeading>More about me:</SectionHeading>
            <p className="leading-relaxed">
              Hello there! My name is Duaa. I'm a web developer and an
              illustrator. I have always been interested in art as a kid.
              Drawing was my favorite hobby. Then I was introduced to design at
              an early age and I fell in love. I always thought that when I grow
              up I want to have a job where I can be creative and use these
              skills. I got the chance to do this when I chose Computer Science
              as my major. I was able to learn about web design and apply what I
              learned to real life projects. My portfolio is the most special
              project to me since I was able to show my creative side as an
              artist with illustrations that I made.
            </p>
          </CardContent>
        </Card>
        <div className="relative flex size-64 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-lavender-lighter blur-3xl" />
          <Avatar className="relative size-52">
            <AvatarImage src={personalImage} alt="Duaa Alahmed" className="object-cover" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </section>
  )
}
