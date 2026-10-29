'use client'

import { Building2, TrendingUp, Code, Briefcase } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'

const iconOptions = [TrendingUp, Code, Code, Building2, Briefcase]

export default function Timeline() {
  const { resume } = useResume()

  return (
    <section id="timeline" className="py-20 px-4 bg-slate-800/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="gradient-text">Career Journey</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          {resume.experience.length} roles across quality, operations, and research
        </p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block timeline-line" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {resume.experience.map((item, index) => {
              const IconComponent = iconOptions[index % iconOptions.length]
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                    <div className="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700">
                      <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${item.color} mb-4`} />
                      <span className="text-sm text-blue-400 font-semibold">{item.period}</span>
                      <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {item.company} • {item.location}
                      </p>
                      <ul className="space-y-2">
                        {item.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Timeline Node */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg z-10`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-5/12" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Education</h3>
          <div className="space-y-4">
            {resume.education?.map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 inline-block border border-slate-700 mx-2">
                <p className="text-xl font-semibold">{item.degree}</p>
                <p className="text-gray-400">{item.school} | {item.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
