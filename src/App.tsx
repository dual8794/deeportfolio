import About from "@/components/sections/About"
import Education from "@/components/sections/Education"
import Footer from "@/components/sections/Footer"
import Landing from "@/components/sections/Landing"
import Navbar from "@/components/sections/Navbar"
import Projects from "@/components/sections/Projects"

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Landing />
        <About />
        <Projects />
        <Education />
      </main>
      <Footer />
    </>
  )
}

export default App
