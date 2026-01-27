'use client'

import { useRef } from 'react'
import { CodeBlockWrapper, CodeBlockContent } from './code-block-wrapper'
import { CopyButton } from './copy-button'
import { OsTabsProvider, OsTabButtons, OsTabsPanel, useOsTabs } from './os-tabs'

interface HighlightedCommandItem {
    mac: string
    windows: string
    macHtml: string
    windowsHtml: string
    description?: string
}

interface OsCommandTabsClientProps {
    commands: HighlightedCommandItem[]
}

function OsCommandTabsInner({ commands }: OsCommandTabsClientProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const { activeOs } = useOsTabs()

    const getCodeText = () => {
        return commands.map(cmd => activeOs === 'mac' ? cmd.mac : cmd.windows).join('\n')
    }

    return (
        <CodeBlockWrapper>
            <OsTabButtons rightContent={<CopyButton getText={getCodeText} />} />
            <CodeBlockContent ref={contentRef}>
                <div className="code-block-dark">
                    {commands.map((command, index) => (
                        <div key={index} className={index > 0 ? 'border-t border-border' : ''}>
                            {command.description && (
                                <div className="px-4 pt-3 text-xs text-muted-foreground">
                                    {command.description}
                                </div>
                            )}
                            <OsTabsPanel
                                mac={
                                    <div
                                        className="os-command-code [&>pre]:!my-0 [&>pre]:!bg-transparent [&>pre]:overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: command.macHtml }}
                                    />
                                }
                                windows={
                                    <div
                                        className="os-command-code [&>pre]:!my-0 [&>pre]:!bg-transparent [&>pre]:overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: command.windowsHtml }}
                                    />
                                }
                            />
                        </div>
                    ))}
                </div>
            </CodeBlockContent>
        </CodeBlockWrapper>
    )
}

export function OsCommandTabsClient(props: OsCommandTabsClientProps) {
    return (
        <OsTabsProvider>
            <OsCommandTabsInner {...props} />
        </OsTabsProvider>
    )
}

interface HighlightedOsCodeBlockProps {
    mac: string
    windows: string
    macHtml: string
    windowsHtml: string
    title?: string
}

function OsCodeBlockInner({ mac, windows, macHtml, windowsHtml, title }: HighlightedOsCodeBlockProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const { activeOs } = useOsTabs()

    const getCodeText = () => {
        return activeOs === 'mac' ? mac : windows
    }

    return (
        <CodeBlockWrapper>
            <OsTabButtons
                rightContent={
                    <div className="flex items-center gap-2">
                        {title && (
                            <span className="text-xs text-muted-foreground">
                                {title}
                            </span>
                        )}
                        <CopyButton getText={getCodeText} />
                    </div>
                }
            />
            <CodeBlockContent ref={contentRef}>
                <div className="code-block-dark">
                    <OsTabsPanel
                        mac={
                            <div
                                className="os-command-code [&>pre]:!my-0 [&>pre]:!bg-transparent [&>pre]:overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: macHtml }}
                            />
                        }
                        windows={
                            <div
                                className="os-command-code [&>pre]:!my-0 [&>pre]:!bg-transparent [&>pre]:overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: windowsHtml }}
                            />
                        }
                    />
                </div>
            </CodeBlockContent>
        </CodeBlockWrapper>
    )
}

export function OsCodeBlockClient(props: HighlightedOsCodeBlockProps) {
    return (
        <OsTabsProvider>
            <OsCodeBlockInner {...props} />
        </OsTabsProvider>
    )
}
