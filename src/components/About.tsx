'use client'

import { Target, Users, Lightbulb, Rocket } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'

const focusIcons = [Target, Users, Lightbulb, Rocket]

export default function About() {
  const { resume } = useResume()

  return (
    <section id="about" className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="gradient-text">About Me</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          {resume.title} focused on reliable operations and measurable results
        </p>

        {/* Summary */}
        <div className="bg-slate-800 rounded-2xl p-8 mb-12 card-hover border border-slate-700">
          <p className="text-lg text-gray-300 leading-relaxed">{resume.summary}</p>
        </div>

        {resume.focusAreas?.length ? (
          <>
            <h3 className="text-2xl font-bold text-center mb-8">Professional Focus</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resume.focusAreas.map((item, index) => {
                const Icon = focusIcons[index % focusIcons.length]
                return (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700 text-center"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </>
        ) : null}

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {(resume.stats || []).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
