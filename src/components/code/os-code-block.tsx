'use client'

import { useRef } from 'react'
import { CodeBlockWrapper, CodeBlockContent } from './code-block-wrapper'
import { CopyButton } from './copy-button'
import { OsTabsProvider, OsTabButtons, OsTabsPanel, useOsTabs } from './os-tabs'

interface CommandItem {
    mac: string
    windows: string
    description?: string
}

interface OsCommandTabsProps {
    commands: CommandItem[]
}

export function OsCommandTabs({ commands }: OsCommandTabsProps) {
    return (
        <OsTabsProvider>
            <CodeBlockWrapper>
                <OsTabButtons />
                <CodeBlockContent>
                    <div className="code-block-dark">
                        {commands.map((command, index) => (
                            <div key={index} className={index > 0 ? 'border-t border-border' : ''}>
                                {command.description && (
                                    <div className="px-4 pt-3 text-xs text-muted-foreground">
                                        {command.description}
                                    </div>
                                )}
                                <pre className="p-4 overflow-x-auto">
                                    <code className="text-sm text-green-400 font-mono">
                                        <OsTabsPanel
                                            mac={command.mac}
                                            windows={command.windows}
                                        />
                                    </code>
                                </pre>
                            </div>
                        ))}
                    </div>
                </CodeBlockContent>
            </CodeBlockWrapper>
        </OsTabsProvider>
    )
}

interface OsCodeBlockProps {
    mac: string
    windows: string
    title?: string
}

function OsCodeBlockInner({ mac, windows, title }: OsCodeBlockProps) {
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
                    <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-green-400 font-mono whitespace-pre">
                            <OsTabsPanel mac={mac} windows={windows} />
                        </code>
                    </pre>
                </div>
            </CodeBlockContent>
        </CodeBlockWrapper>
    )
}

export function OsCodeBlock(props: OsCodeBlockProps) {
    return (
        <OsTabsProvider>
            <OsCodeBlockInner {...props} />
        </OsTabsProvider>
    )
}
