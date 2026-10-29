export interface ResumeData {
  name: string
  title: string
  tagline: string
  summary: string
  location: string
  email: string
  phone: string
  linkedin?: string
  github?: string
  githubUsername?: string
  skills: SkillCategory[]
  experience: Experience[]
  projects: Project[]
  aiInitiatives?: AIInitiative[]
  education?: Education[]
  stats?: { value: string; label: string }[]
  focusAreas?: { title: string; description: string }[]
  certifications?: string[]
}

export interface SkillCategory {
  title: string
  skills: string[]
  color: string
}

export interface Experience {
  period: string
  title: string
  company: string
  location: string
  highlights: string[]
  color: string
}

export interface Project {
  title: string
  description: string
  tech: string[]
  link?: string
}

export interface AIInitiative {
  title: string
  description: string
  impact: string
  tags: string[]
  status: string
}

export interface Education {
  degree: string
  school: string
  year: string
}
