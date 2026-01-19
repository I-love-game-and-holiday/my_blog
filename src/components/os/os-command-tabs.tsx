'use client'

import { OsTabsProvider, OsTabButtons, OsTabsPanel } from './os-tabs'

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
            <div className="my-6 rounded-lg border border-border overflow-hidden">
                <OsTabButtons />
                <div className="os-tabs-code-block">
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
            </div>
        </OsTabsProvider>
    )
}

interface OsCodeBlockProps {
    mac: string
    windows: string
    title?: string
}

export function OsCodeBlock({ mac, windows, title }: OsCodeBlockProps) {
    return (
        <OsTabsProvider>
            <div className="my-6 rounded-lg border border-border overflow-hidden">
                <OsTabButtons
                    rightContent={
                        title && (
                            <span className="pr-4 text-xs text-muted-foreground">
                                {title}
                            </span>
                        )
                    }
                />
                <div className="os-tabs-code-block">
                    <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-green-400 font-mono whitespace-pre">
                            <OsTabsPanel mac={mac} windows={windows} />
                        </code>
                    </pre>
                </div>
            </div>
        </OsTabsProvider>
    )
}
