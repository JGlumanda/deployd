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
    <div
      className="markdown-bio"
      style={{
        ...style,
        lineHeight: 1.6,
      }}
    >
      <style>
        {`
          .markdown-bio h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: var(--color-heading);
            font-family: var(--font-heading);
          }

          .markdown-bio h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: var(--color-heading);
            font-family: var(--font-heading);
          }

          .markdown-bio h3 {
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: var(--color-heading);
            font-family: var(--font-heading);
          }

          .markdown-bio p {
            margin: 0.5rem 0;
            color: var(--color-text);
            font-family: var(--font-body);
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            align-items: center;
          }

          .markdown-bio a {
            color: var(--color-accent);
            text-decoration: none;
            border-bottom: 1px solid var(--color-accent);
          }

          /* Remove underline for links that contain images */
          .markdown-bio a:has(img) {
            border-bottom: none;
          }

          .markdown-bio a:hover {
            opacity: 0.8;
          }

          .markdown-bio img {
            maxWidth: 100%;
            height: auto;
            borderRadius: var(--radius-sm);
            margin: 0.125rem;
            display: inline-block;
            vertical-align: middle;
          }

          .markdown-bio code {
            background: var(--color-accent-soft);
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.9em;
            font-family: var(--font-mono);
            color: var(--color-heading);
          }

          .markdown-bio pre {
            background: var(--color-bg-alt);
            padding: 12px;
            border-radius: 6px;
            overflow: auto;
            border: 1px solid var(--color-border);
          }

          .markdown-bio pre code {
            background: none;
            padding: 0;
            border-radius: 0;
          }

          .markdown-bio ul, .markdown-bio ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
            color: var(--color-text);
          }

          .markdown-bio li {
            margin: 0.25rem 0;
          }

          .markdown-bio blockquote {
            margin: 0.5rem 0;
            padding-left: 1rem;
            border-left: 3px solid var(--color-accent);
            color: var(--color-text-muted);
            font-style: italic;
          }

          .markdown-bio table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5rem 0;
            font-size: 0.9rem;
          }

          .markdown-bio th {
            padding: 8px 12px;
            text-align: left;
            background: var(--color-accent-soft);
            border: 1px solid var(--color-border);
            font-weight: 600;
            color: var(--color-heading);
          }

          .markdown-bio td {
            padding: 8px 12px;
            border: 1px solid var(--color-border);
            color: var(--color-text);
          }

          .markdown-bio hr {
            margin: 1rem 0;
            border: none;
            border-top: 1px solid var(--color-border);
          }

          .markdown-bio div[align="center"] {
            text-align: center;
            margin: 0.5rem 0;
          }
        `}
      </style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
