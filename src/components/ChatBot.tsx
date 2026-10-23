'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useResume } from '@/lib/resumeContext'
import type { ResumeData } from '@/lib/resumeTypes'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getResponse(input: string, resume: ResumeData): string {
  const lowerInput = input.toLowerCase()

  if (/experience|career|history|previous|role|job/.test(lowerInput)) {
    return `${resume.name}'s experience:\n${resume.experience.map(role => `- ${role.title} at ${role.company} (${role.period})`).join('\n')}`
  }
  if (/skill|technology|tech stack/.test(lowerInput)) {
    return `${resume.name}'s skills:\n${resume.skills.map(category => `- ${category.title}: ${category.skills.join(', ')}`).join('\n')}`
  }
  if (/project|ai|initiative/.test(lowerInput)) {
    const projects = [...resume.projects.map(project => project.title), ...(resume.aiInitiatives ?? []).map(project => project.title)]
    return projects.length ? `${resume.name}'s projects:\n${projects.map(project => `- ${project}`).join('\n')}` : `No projects are listed for ${resume.name} yet.`
  }
  if (/education|degree|school|university/.test(lowerInput)) {
    return resume.education?.length
      ? `${resume.name}'s education:\n${resume.education.map(item => `- ${item.degree}, ${item.school} (${item.year})`).join('\n')}`
      : `Education details are not listed for ${resume.name}.`
  }
  if (/contact|email|phone|reach|location/.test(lowerInput)) {
    return `Contact ${resume.name}:\n- Email: ${resume.email}\n- Location: ${resume.location}\n- LinkedIn: ${resume.linkedin}${resume.github ? `\n- GitHub: ${resume.github}` : ''}`
  }
  if (/about|summary|who|tell me/.test(lowerInput)) return resume.summary

  return `Ask me about ${resume.name}'s experience, skills, projects, education, or contact information.`
}

export default function ChatBot() {
  const { resume } = useResume()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm ${resume.name}'s portfolio assistant. Ask me about their experience, skills, projects, or career journey.`,
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsTyping(true)

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

    const response = getResponse(userMessage, resume)
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl hover:shadow-blue-500/25'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Ask About {resume.name}</h3>
                <p className="text-white/70 text-sm">Resume guide</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-slate-700 text-gray-200 rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about experience, AI projects..."
                className="flex-1 bg-slate-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Try: &quot;What projects are listed for {resume.name}?&quot;
            </p>
          </div>
        </div>
      )}
    </>
  )
}
