import type { MDXComponents } from 'mdx/types'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-blog'

type NextraMDXComponents = ReturnType<typeof getDocsMDXComponents>

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const nextraComponents = getDocsMDXComponents(components as NextraMDXComponents)
  return {
    ...nextraComponents,
    ...components,
  } as MDXComponents
}

