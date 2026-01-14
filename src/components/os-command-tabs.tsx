'use client'

import { useState, type ReactNode } from 'react'

type OsType = 'mac' | 'windows'

interface OsTab {
    os: OsType
    label: string
    icon: ReactNode
}

const osTabs: OsTab[] = [
    {
        os: 'mac',
        label: 'Mac (zsh)',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
        ),
    },
    {
        os: 'windows',
        label: 'Windows (PowerShell)',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z" />
            </svg>
        ),
    },
]

interface CommandItem {
    mac: string
    windows: string
    description?: string
}

interface OsCommandTabsProps {
    commands: CommandItem[]
}

export function OsCommandTabs({ commands }: OsCommandTabsProps) {
    const [activeOs, setActiveOs] = useState<OsType>('mac')

    return (
        <div className="my-6 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <div className="flex border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                {osTabs.map((tab) => (
                    <button
                        key={tab.os}
                        onClick={() => setActiveOs(tab.os)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                            activeOs === tab.os
                                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 -mb-px'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
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
                                {activeOs === 'mac' ? command.mac : command.windows}
                            </code>
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface OsCodeBlockProps {
    mac: string
    windows: string
    title?: string
}

export function OsCodeBlock({ mac, windows, title }: OsCodeBlockProps) {
    const [activeOs, setActiveOs] = useState<OsType>('mac')

    return (
        <div className="my-6 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                <div className="flex">
                    {osTabs.map((tab) => (
                        <button
                            key={tab.os}
                            onClick={() => setActiveOs(tab.os)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                                activeOs === tab.os
                                    ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 -mb-px'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
                {title && (
                    <span className="pr-4 text-xs text-gray-500 dark:text-gray-400">{title}</span>
                )}
            </div>
            <div className="bg-gray-900 dark:bg-gray-950">
                <pre className="p-4 overflow-x-auto">
                    <code className="text-sm text-green-400 font-mono whitespace-pre">
                        {activeOs === 'mac' ? mac : windows}
                    </code>
                </pre>
            </div>
        </div>
    )
}
