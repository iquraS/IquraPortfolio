'use client'

import { useResume } from '@/lib/resumeContext'

export default function Skills() {
  const { resume } = useResume()

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="gradient-text">Skills & Expertise</span>
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Practical strengths across quality, operations, data, and communication
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resume.skills.map((category, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-6 card-hover border border-slate-700"
            >
              <div className={`h-1 w-20 rounded-full bg-gradient-to-r ${category.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300 hover:bg-slate-600 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {resume.certifications?.length ? (
          <div className="mt-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold mb-6 text-center">Certifications</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              {resume.certifications.map((certification, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="text-blue-400" aria-hidden="true">•</span>
                  <span>{certification}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
