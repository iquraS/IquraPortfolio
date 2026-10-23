'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, Github, Star } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'

interface Repository {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
}

export default function GitHubProjects() {
  const { resume } = useResume()
  const username = resume.githubUsername
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  useEffect(() => {
    if (!username) return

    const controller = new AbortController()
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(response => {
        if (!response.ok) throw new Error('GitHub API request failed')
        return response.json() as Promise<Repository[]>
      })
      .then(items => {
        setRepositories(items.filter(repository => repository.name.toLowerCase() !== username.toLowerCase()))
        setStatus('loaded')
      })
      .catch(error => {
        if (error.name !== 'AbortError') setStatus('failed')
      })

    return () => controller.abort()
  }, [username])

  if (!username) return null

  return (
    <section id="github-projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Open source</p>
            <h2 className="text-3xl font-bold">GitHub Projects</h2>
          </div>
          <a
            href={`https://github.com/${encodeURIComponent(username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <Github className="w-5 h-5" />
            <span>View profile</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {status === 'loading' && <p className="text-gray-400">Loading public repositories...</p>}
        {status === 'failed' && <p className="text-gray-400">Repositories are temporarily unavailable. Visit the GitHub profile to see projects.</p>}
        {status === 'loaded' && repositories.length === 0 && <p className="text-gray-400">No public repositories found.</p>}

        {repositories.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.map(repository => (
              <a
                key={repository.id}
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-slate-700 bg-slate-800/70 p-5 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold break-all">{repository.name}</h3>
                  <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
                </div>
                <p className="text-sm text-gray-400 min-h-10">{repository.description || 'No description provided.'}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  {repository.language && <span>{repository.language}</span>}
                  <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5" />{repository.stargazers_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}