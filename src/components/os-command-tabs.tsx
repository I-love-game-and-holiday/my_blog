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
            <div className="my-6 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <OsTabButtons />
                <div className="bg-gray-900 dark:bg-gray-950">
                    {commands.map((command, index) => (
                        <div key={index} className={index > 0 ? 'border-t border-gray-700' : ''}>
                            {command.description && (
                                <div className="px-4 pt-3 text-xs text-gray-400">
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
            <div className="my-6 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <OsTabButtons
                    rightContent={
                        title && (
                            <span className="pr-4 text-xs text-gray-500 dark:text-gray-400">
                                {title}
                            </span>
                        )
                    }
                />
                <div className="bg-gray-900 dark:bg-gray-950">
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
