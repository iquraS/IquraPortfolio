import { Bot, Brain, MessageSquare, GitBranch, Sparkles, Zap } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'

export default function AIInitiatives({ includePortfolioProject = false }: { includePortfolioProject?: boolean }) {
  const { resume } = useResume()
  const projects = includePortfolioProject
    ? [{
        title: 'Portfolio Built with AI and VS Code',
        description: `Portfolio for ${resume.name}, built with AI assistance and VS Code.`,
        impact: 'Portfolio project',
        tags: ['AI', 'VS Code', 'Web Development'],
        status: 'Active',
      }]
    : resume.aiInitiatives ?? []

  if (projects.length === 0) return null
  const icons = [Bot, Brain, MessageSquare, GitBranch, Zap]

  return (
    <section id="ai" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-semibold">AI Innovation</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">AI-Powered Initiatives</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Driving the adoption of AI and LLMs to transform engineering workflows, 
            automate repetitive tasks, and accelerate delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const Icon = icons[index % icons.length]
            return (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700 relative overflow-hidden group"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                {/* Status Badge */}
                <div className="absolute top-0 right-0">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Production' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-purple-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                {/* Impact */}
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-semibold">{project.impact}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-slate-700 rounded text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {/* AI Philosophy */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20">
          <h3 className="text-2xl font-bold mb-4 text-center">My AI Philosophy</h3>
          <p className="text-gray-300 text-center max-w-3xl mx-auto">
            AI isn&apos;t about replacing engineers—it&apos;s about amplifying their capabilities. 
            I focus on practical AI applications that eliminate toil, accelerate feedback loops, 
            and let teams focus on high-value creative problem-solving. The best AI implementations 
            are the ones your team barely notices because they just make everything easier.
          </p>
        </div>
      </div>
    </section>
  )
}
