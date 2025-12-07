import type { MDXComponents } from 'mdx/types'
import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components'
import { TOC } from './app/_components/toc'

const defaultComponents = getNextraComponents({
  wrapper({ children, toc }) {
    // tocがundefinedの場合は空配列を渡す
    const headings = toc || []
    return (
      <>
        <div style={{ flexGrow: 1, padding: 20 }}>{children}</div>
        <TOC toc={headings} />
      </>
    )
  }
})

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  ...defaultComponents,
  ...components
})

