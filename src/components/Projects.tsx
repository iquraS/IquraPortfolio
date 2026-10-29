'use client'

import { Rocket, Shield, BarChart3 } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'

const iconOptions = [Rocket, Rocket, BarChart3, Shield, Rocket, Shield]

export default function Projects() {
  const { resume } = useResume()

  return (
    <section id="projects" className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="gradient-text">Key Projects & Achievements</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Selected work demonstrating quality, operational execution, and continuous improvement
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resume.projects.map((project, index) => {
            const IconComponent = iconOptions[index % iconOptions.length]
            return (
              <div
                key={index}
                className="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-slate-700 rounded text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
