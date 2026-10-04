function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-sm uppercase tracking-widest text-indigo-400">Portfolio</p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Hi, welcome to deeportfolio
        </h1>
        <p className="text-lg text-slate-400">
          Built with React, TypeScript, Vite and Tailwind CSS. Edit{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">src/App.tsx</code>{' '}
          to get started.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-indigo-500 px-5 py-2.5 font-medium text-white hover:bg-indigo-400 transition-colors"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium hover:border-slate-500 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  )
}

export default App
