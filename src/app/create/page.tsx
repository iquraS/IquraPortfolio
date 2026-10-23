'use client'

import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Github, Upload } from 'lucide-react'
import type { ResumeData } from '@/lib/resumeTypes'
import { extractResumeText, suggestResumeFields } from '@/lib/extractResumeText'

const emptyArrays = {
  skills: '[]',
  experience: '[]',
  projects: '[]',
  education: '[]',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function readJsonArray<T>(value: string): T[] {
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(isRecord) as T[] : []
  } catch {
    return []
  }
}

export default function CreateProfilePage() {
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fields, setFields] = useState({
    name: '',
    title: '',
    tagline: '',
    summary: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    githubUsername: '',
  })
  const [collections, setCollections] = useState(emptyArrays)
  const [error, setError] = useState('')
  const [downloadReady, setDownloadReady] = useState(false)

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields(current => ({ ...current, [key]: value }))
    setDownloadReady(false)
  }

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setFileName(file.name)
    try {
      const text = await extractResumeText(file)
      const suggestions = suggestResumeFields(text)
      setResumeText(text)
      setFields(current => ({
        ...current,
        name: current.name || suggestions.name,
        title: current.title || suggestions.title,
        summary: current.summary || suggestions.summary,
        location: current.location || suggestions.location,
        email: current.email || suggestions.email,
        phone: current.phone || suggestions.phone,
        linkedin: current.linkedin || suggestions.linkedin,
        githubUsername: current.githubUsername || suggestions.githubUsername,
      }))
      if (suggestions.skills.length) {
        setCollections(current => ({
          ...current,
          skills: current.skills === '[]' ? JSON.stringify(suggestions.skills, null, 2) : current.skills,
        }))
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The resume could not be read.')
    }
  }

  const generateProfile = () => {
    setError('')
    try {
      const skills = JSON.parse(collections.skills)
      const experience = JSON.parse(collections.experience)
      const projects = JSON.parse(collections.projects)
      const education = JSON.parse(collections.education)
      if (!fields.name.trim() || !fields.title.trim() || !fields.summary.trim() || !fields.email.trim()) {
        throw new Error('Name, title, summary, and email are required.')
      }
      if (![skills, experience, projects, education].every(Array.isArray)) {
        throw new Error('Skills, experience, projects, and education must each be JSON arrays.')
      }
      const validSkills = skills.every((item: unknown) => isRecord(item)
        && typeof item.title === 'string'
        && isStringArray(item.skills)
        && typeof item.color === 'string')
      const validExperience = experience.every((item: unknown) => isRecord(item)
        && ['period', 'title', 'company', 'location', 'color'].every(key => typeof item[key] === 'string')
        && isStringArray(item.highlights))
      const validProjects = projects.every((item: unknown) => isRecord(item)
        && typeof item.title === 'string'
        && typeof item.description === 'string'
        && isStringArray(item.tech)
        && (item.link === undefined || typeof item.link === 'string'))
      const validEducation = education.every((item: unknown) => isRecord(item)
        && ['degree', 'school', 'year'].every(key => typeof item[key] === 'string'))
      if (!validSkills || !validExperience || !validProjects || !validEducation) {
        throw new Error('Check each collection: skills need title/skills/color; experience needs period/title/company/location/highlights/color; projects need title/description/tech; education needs degree/school/year.')
      }

      const profile: ResumeData = {
        ...fields,
        github: fields.githubUsername ? `github.com/${fields.githubUsername}` : undefined,
        skills,
        experience,
        projects,
        education,
      }
      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${fields.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'profile'}.json`
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setDownloadReady(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Check the profile fields and JSON arrays.')
    }
  }

  const previewSkills = readJsonArray<Record<string, unknown>>(collections.skills)
  const previewExperience = readJsonArray<Record<string, unknown>>(collections.experience)
  const previewProjects = readJsonArray<Record<string, unknown>>(collections.projects)
  const previewEducation = readJsonArray<Record<string, unknown>>(collections.education)
  const collectionsHaveValidJson = Object.values(collections).every(value => {
    try {
      return Array.isArray(JSON.parse(value))
    } catch {
      return false
    }
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" /> Portfolio
        </Link>
        <header className="border-b border-slate-800 pb-6 mb-8">
          <p className="text-sm uppercase tracking-widest text-cyan-300 mb-2">Profile setup</p>
          <h1 className="text-3xl font-semibold">Create a portfolio profile</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Import resume text, review the suggested details, then export a profile JSON. Files are processed in this browser and are not uploaded.
          </p>
        </header>

        <section className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 mb-10">
          <div>
            <h2 className="font-semibold mb-3">1. Import resume</h2>
            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-slate-600 bg-slate-900 p-6 text-center hover:border-cyan-400">
              <Upload className="w-6 h-6 text-cyan-300" />
              <span className="font-medium">Choose DOCX, TXT, or Markdown</span>
              <span className="text-sm text-gray-500">PDF: copy its text and paste into the text area</span>
              <input type="file" accept=".docx,.txt,.md,text/plain,text/markdown" className="sr-only" onChange={handleFile} />
            </label>
            {fileName && <p className="mt-2 text-sm text-gray-400 inline-flex items-center gap-2"><FileText className="w-4 h-4" />{fileName}</p>}
            <label className="block mt-5 text-sm text-gray-300" htmlFor="resume-text">Resume text</label>
            <textarea
              id="resume-text"
              value={resumeText}
              onChange={event => setResumeText(event.target.value)}
              placeholder="Paste resume text here. Contact and skill suggestions are detected locally."
              className="mt-2 w-full h-56 resize-y border border-slate-700 bg-slate-900 p-3 text-sm text-gray-200 placeholder:text-gray-600 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                const suggestions = suggestResumeFields(resumeText)
                setFields(current => ({
                  ...current,
                  name: current.name || suggestions.name,
                  title: current.title || suggestions.title,
                  summary: current.summary || suggestions.summary,
                  location: current.location || suggestions.location,
                  email: current.email || suggestions.email,
                  phone: current.phone || suggestions.phone,
                  linkedin: current.linkedin || suggestions.linkedin,
                  githubUsername: current.githubUsername || suggestions.githubUsername,
                }))
                if (suggestions.skills.length) {
                  setCollections(current => ({ ...current, skills: JSON.stringify(suggestions.skills, null, 2) }))
                }
              }}
              className="mt-3 border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Suggest fields from text
            </button>
          </div>

          <div>
            <h2 className="font-semibold mb-3">2. Review profile details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ['name', 'Name'], ['title', 'Professional title'], ['tagline', 'Tagline'], ['location', 'Location'],
                ['email', 'Email'], ['phone', 'Phone'], ['linkedin', 'LinkedIn URL'], ['githubUsername', 'GitHub username'],
              ] as const).map(([key, label]) => (
                <label key={key} className="block text-sm text-gray-300">
                  {label}
                  <input
                    value={fields[key]}
                    onChange={event => updateField(key, event.target.value)}
                    className="mt-1 w-full border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </label>
              ))}
              <label className="block text-sm text-gray-300 sm:col-span-2">
                Professional summary
                <textarea
                  value={fields.summary}
                  onChange={event => updateField('summary', event.target.value)}
                  rows={4}
                  className="mt-1 w-full resize-y border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 pt-8">
          <h2 className="font-semibold mb-2">3. Review experience and projects</h2>
          <p className="text-sm text-gray-400 mb-5">Edit each field as a JSON array. Keep only information supported by the resume.</p>
          <div className="grid lg:grid-cols-2 gap-5">
            {Object.entries(collections).map(([key, value]) => (
              <label key={key} className="block text-sm text-gray-300 capitalize">
                {key}
                <textarea
                  value={value}
                  onChange={event => {
                    setCollections(current => ({ ...current, [key]: event.target.value }))
                    setDownloadReady(false)
                  }}
                  rows={8}
                  spellCheck={false}
                  className="mt-1 w-full resize-y border border-slate-700 bg-slate-900 p-3 font-mono text-xs text-gray-200 focus:border-cyan-400 focus:outline-none"
                />
              </label>
            ))}
          </div>
          <section aria-label="Live portfolio preview" className="mt-10 border border-slate-700 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-cyan-300">Live preview</p>
                <h3 className="font-semibold mt-1">Portfolio draft</h3>
              </div>
              <span className="text-xs text-gray-500">Updates as you edit</span>
            </div>
            {!collectionsHaveValidJson && (
              <p className="border-b border-amber-900/70 bg-amber-950/30 px-5 py-3 text-sm text-amber-200">
                One or more collection fields contain invalid JSON. Those entries are omitted from this preview.
              </p>
            )}
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 px-6 py-10 sm:px-10">
              <p className="text-xs uppercase tracking-widest text-cyan-300">Portfolio</p>
              <h4 className="mt-3 text-3xl font-bold break-words">{fields.name || 'Your name'}</h4>
              <p className="mt-2 text-xl text-gray-200">{fields.title || 'Professional title'}</p>
              {fields.tagline && <p className="mt-3 max-w-2xl text-gray-400">{fields.tagline}</p>}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                {fields.location && <span>{fields.location}</span>}
                {fields.email && <span>{fields.email}</span>}
                {fields.phone && <span>{fields.phone}</span>}
                {fields.linkedin && <span>{fields.linkedin}</span>}
                {fields.githubUsername && <span>github.com/{fields.githubUsername}</span>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700">
              <div className="p-5 sm:p-6">
                <h4 className="font-semibold mb-3">About</h4>
                <p className="text-sm leading-6 text-gray-400 whitespace-pre-line">
                  {fields.summary || 'Your professional summary will appear here.'}
                </p>
                {previewSkills.length > 0 && (
                  <div className="mt-7">
                    <h4 className="font-semibold mb-3">Skills</h4>
                    {previewSkills.map((category, index) => (
                      <div key={index} className="mb-4">
                        <p className="text-sm text-gray-300">{String(category.title ?? 'Skills')}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(Array.isArray(category.skills) ? category.skills : []).map((skill, skillIndex) => (
                            <span key={skillIndex} className="border border-slate-700 px-2 py-1 text-xs text-gray-400">{String(skill)}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-6">
                {previewExperience.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Experience</h4>
                    {previewExperience.slice(0, 3).map((role, index) => (
                      <article key={index} className="border-l border-cyan-500/50 pl-4 mb-4">
                        <p className="font-medium">{String(role.title ?? 'Role')}</p>
                        <p className="text-sm text-gray-400">{String(role.company ?? '')}{role.period ? ` · ${String(role.period)}` : ''}</p>
                        {Array.isArray(role.highlights) && role.highlights[0] && (
                          <p className="mt-2 text-sm text-gray-500">{String(role.highlights[0])}</p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
                {previewProjects.length > 0 && (
                  <div className={previewExperience.length ? 'mt-7' : ''}>
                    <h4 className="font-semibold mb-3">Projects</h4>
                    {previewProjects.slice(0, 3).map((project, index) => (
                      <article key={index} className="mb-4">
                        <p className="font-medium">{String(project.title ?? 'Project')}</p>
                        <p className="mt-1 text-sm text-gray-400">{String(project.description ?? '')}</p>
                      </article>
                    ))}
                  </div>
                )}
                {previewEducation.length > 0 && (
                  <div className="mt-7">
                    <h4 className="font-semibold mb-3">Education</h4>
                    {previewEducation.slice(0, 2).map((item, index) => (
                      <p key={index} className="mb-2 text-sm text-gray-400">
                        {String(item.degree ?? 'Degree')}{item.school ? ` · ${String(item.school)}` : ''}
                      </p>
                    ))}
                  </div>
                )}
                {!previewExperience.length && !previewProjects.length && !previewEducation.length && !previewSkills.length && (
                  <p className="text-sm text-gray-500">Reviewed skills, experience, projects, and education will appear here.</p>
                )}
              </div>
            </div>
          </section>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button onClick={generateProfile} className="inline-flex items-center gap-2 bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200">
              <Download className="w-4 h-4" /> Download profile JSON
            </button>
            {fields.githubUsername && <span className="inline-flex items-center gap-2 text-sm text-gray-400"><Github className="w-4 h-4" />{fields.githubUsername}</span>}
            {downloadReady && <span className="text-sm text-emerald-300">Profile JSON downloaded.</span>}
          </div>
          {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
          <p className="mt-5 text-xs text-gray-500">To publish, use this JSON as `src/lib/defaultResume.json`, then build and deploy the portfolio.</p>
        </section>
      </div>
    </main>
  )
}