export async function extractResumeText(file: File) {
  const fileName = file.name.toLowerCase()
  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) return file.text()
  if (!fileName.endsWith('.docx')) {
    throw new Error('Choose a DOCX, TXT, or Markdown file. For PDF resumes, copy the text and paste it below.')
  }

  const archive = await file.arrayBuffer()
  const view = new DataView(archive)
  const decoder = new TextDecoder()
  let endOffset = -1

  for (let offset = archive.byteLength - 22; offset >= Math.max(0, archive.byteLength - 65_557); offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      endOffset = offset
      break
    }
  }
  if (endOffset < 0) throw new Error('This DOCX file could not be read.')

  const entryCount = view.getUint16(endOffset + 10, true)
  let entryOffset = view.getUint32(endOffset + 16, true)
  let documentOffset = -1
  let compressedSize = 0
  let compressionMethod = 0

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(entryOffset, true) !== 0x02014b50) break
    const method = view.getUint16(entryOffset + 10, true)
    const size = view.getUint32(entryOffset + 20, true)
    const nameLength = view.getUint16(entryOffset + 28, true)
    const extraLength = view.getUint16(entryOffset + 30, true)
    const commentLength = view.getUint16(entryOffset + 32, true)
    const localHeaderOffset = view.getUint32(entryOffset + 42, true)
    const name = decoder.decode(new Uint8Array(archive, entryOffset + 46, nameLength))

    if (name === 'word/document.xml') {
      const localNameLength = view.getUint16(localHeaderOffset + 26, true)
      const localExtraLength = view.getUint16(localHeaderOffset + 28, true)
      documentOffset = localHeaderOffset + 30 + localNameLength + localExtraLength
      compressedSize = size
      compressionMethod = method
      break
    }
    entryOffset += 46 + nameLength + extraLength + commentLength
  }

  if (documentOffset < 0) throw new Error('The DOCX file does not contain readable document text.')
  const documentBytes = archive.slice(documentOffset, documentOffset + compressedSize)
  let xml: string

  if (compressionMethod === 0) {
    xml = decoder.decode(documentBytes)
  } else if (compressionMethod === 8) {
    const stream = new Blob([documentBytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
    xml = await new Response(stream).text()
  } else {
    throw new Error('This DOCX compression format is not supported by this browser.')
  }

  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.querySelector('parsererror')) throw new Error('The DOCX document text could not be decoded.')
  return Array.from(document.getElementsByTagName('w:p'))
    .map(paragraph => paragraph.textContent?.trim() ?? '')
    .filter(Boolean)
    .join('\n')
}

export function suggestResumeFields(text: string) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const email = text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] ?? ''
  const phone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? ''
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i)?.[0] ?? ''
  const githubUsername = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+)/i)?.[1] ?? ''
  const headingPattern = /^(professional )?(summary|profile|objective|technical skills|core skills|skills|core competencies|professional experience|work experience|experience|employment history|selected projects|projects|education|certifications):?$/i
  const getSection = (headings: string[]) => {
    const headingIndex = lines.findIndex(line => headings.includes(line.replace(/:$/, '').toLowerCase()))
    if (headingIndex < 0) return []
    const sectionLines: string[] = []
    for (const line of lines.slice(headingIndex + 1)) {
      if (headingPattern.test(line)) break
      sectionLines.push(line)
    }
    return sectionLines
  }
  const name = lines.find(line => line.length <= 70
    && !/resume|curriculum vitae|https?:\/\/|@|linkedin|github/i.test(line)
    && !/^\+?[\d\s().-]+$/.test(line)
    && !headingPattern.test(line)) ?? ''
  const explicitTitle = text.match(/^(?:professional )?(?:title|role)\s*:\s*(.+)$/im)?.[1]?.trim() ?? ''
  const nameIndex = lines.indexOf(name)
  const followingHeading = lines.findIndex((line, index) => index > nameIndex && headingPattern.test(line))
  const headerLines = lines.slice(nameIndex + 1, followingHeading < 0 ? undefined : followingHeading)
  const title = explicitTitle || (headerLines.find(line => line.length <= 90
    && !/@|https?:\/\/|linkedin|github/i.test(line)
    && !/^\+?[\d\s().-]+$/.test(line)
    && !/^(location|based in|email|phone|mobile)\s*:/i.test(line)
    && !/[.!?](?:\s|$)/.test(line)
    && !headingPattern.test(line)) ?? '')
  const summary = getSection(['professional summary', 'summary', 'profile', 'objective']).join(' ')
  const location = text.match(/^(?:location|based in)\s*:\s*(.+)$/im)?.[1]?.trim() ?? ''
  const skills = getSection(['technical skills', 'core skills', 'skills', 'core competencies'])
    .flatMap(line => line.replace(/^[•●▪*-]\s*/, '').replace(/^[^:]{1,45}:\s*/, '').split(/[,|;]/))
    .map(skill => skill.trim())
    .filter(Boolean)
    .slice(0, 50)

  return {
    name,
    title,
    summary,
    location,
    email,
    phone,
    linkedin,
    githubUsername,
    skills: skills.length
      ? [{ title: 'Skills', skills, color: 'from-blue-500 to-cyan-500' }]
      : [],
  }
}