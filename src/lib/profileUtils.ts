import type { ResumeData } from './resumeTypes'

export function getGithubProfileUrl(resume: Pick<ResumeData, 'github' | 'githubUsername'>) {
  if (resume.github) {
    return /^https?:\/\//i.test(resume.github) ? resume.github : `https://${resume.github}`
  }
  return resume.githubUsername
    ? `https://github.com/${encodeURIComponent(resume.githubUsername)}`
    : undefined
}