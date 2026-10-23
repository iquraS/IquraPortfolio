import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Timeline from '@/components/Timeline'
import AIInitiatives from '@/components/AIInitiatives'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'
import ChatBot from '@/components/ChatBot'
import GitHubProjects from '@/components/GitHubProjects'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Timeline />
      <AIInitiatives />
      <Projects />
      <GitHubProjects />
      <Contact />
      <ChatBot />
    </main>
  )
}
