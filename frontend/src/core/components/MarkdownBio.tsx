import { useEffect, useState } from 'react'
import { marked } from 'marked'

interface MarkdownBioProps {
  content: string
  style?: React.CSSProperties
}

export function MarkdownBio({ content, style }: MarkdownBioProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    // Avoid cascading renders by using async parsing
    const parseMarkdown = async () => {
      // Configure marked with a custom renderer that allows HTML pass-through
      const renderer = new marked.Renderer()

      // Override html token renderer to pass through HTML as-is (not escaped)
      renderer.html = ({ text }) => text

      // Convert markdown to HTML with GitHub Flavored Markdown and custom renderer
      const rendered = await marked.parse(content, {
        gfm: true,
        breaks: true,
        renderer: renderer,
      })

      setHtml(rendered)
    }

    parseMarkdown()
  }, [content])

  return (
    <div className="markdown-bio" style={style}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
