import { lazy, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"

const ModelViewer = lazy(() => import("@/components/ModelViewer"))

const roles = ["Software Engineer", "Web developer", "Front end designer"]

export default function Landing() {
  return (
    <section
      id="top"
      className="bg-[linear-gradient(-45deg,#ffcbc4,#cbcbff)] pt-16"
    >
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col items-center justify-center gap-8 px-4 py-12 md:flex-row md:gap-4">
        <Card className="w-full max-w-md gap-4 rounded-3xl border-white bg-gradient-to-r from-white to-transparent py-10 shadow-none">
          <CardContent className="space-y-4 px-10">
            <h1 className="font-secondary text-4xl leading-tight text-lavender-light sm:text-5xl">
              Hi! I'm <br />
              Duaa Alahmed
            </h1>
            <ul className="space-y-1 text-lg">
              {roles.map((role) => (
                <li key={role}>- {role}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="h-[420px] w-full max-w-sm sm:h-[520px]">
          <Suspense fallback={null}>
            <ModelViewer />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
