import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SectionHeading from "@/components/SectionHeading"
import { cn } from "@/lib/utils"
import projectsImage from "@/assets/programing.png"
import suhailImage from "@/assets/Project-2.svg"
import seerahImage from "@/assets/Project-1.svg"

type Project = {
  title: string
  description: string
  image: string
  status: "Completed" | "In progress"
}

const categories: { name: string; projects: Project[] }[] = [
  {
    name: "Web Development",
    projects: [
      {
        title: "Suhail - Misbar Ultimate webapp",
        description: "Worked on the frontend and the backend",
        image: suhailImage,
        status: "Completed",
      },
      {
        title: "Seerah - Webapp",
        description: "Worked on the frontend",
        image: seerahImage,
        status: "In progress",
      },
    ],
  },
  { name: "UI/UX", projects: [] },
  { name: "Graphic Design", projects: [] },
  { name: "Data Analysis", projects: [] },
]

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden pt-0">
      <img
        src={project.image}
        alt=""
        className="aspect-[11/7] w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
        <Badge
          variant="secondary"
          className={cn(
            "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
            project.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          )}
        >
          {project.status}
        </Badge>
      </CardHeader>
      <CardContent />
      <CardFooter>
        <Button className="w-full bg-yellow text-white hover:bg-yellow-dark">
          Learn more
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="bg-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-10 px-4 py-24">
        <div className="relative flex w-full max-w-lg justify-center">
          <div className="absolute inset-0 m-auto size-80 rounded-full bg-peech-light blur-3xl sm:size-[28rem]" />
          <img src={projectsImage} alt="" className="relative w-full max-w-[520px]" />
        </div>
        <div className="w-full max-w-xl space-y-3">
          <SectionHeading>My projects:</SectionHeading>
          <p>Here is a list of projects that I worked on</p>
        </div>
        <Tabs defaultValue="Web Development" className="w-full items-center">
          <TabsList variant="line" className="flex-wrap">
            {categories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="px-3 text-grey after:bg-yellow data-[state=active]:text-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-8 w-full">
              {category.projects.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {category.projects.map((project) => (
                    <ProjectCard key={project.title} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Projects coming soon.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
