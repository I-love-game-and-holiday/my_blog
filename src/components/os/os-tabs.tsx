'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type OsType = 'mac' | 'windows'

interface OsTab {
    os: OsType
    label: string
    icon: ReactNode
}

export const osTabs: OsTab[] = [
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

interface OsTabsContextValue {
    activeOs: OsType
    setActiveOs: (os: OsType) => void
}

const OsTabsContext = createContext<OsTabsContextValue | null>(null)

export function useOsTabs() {
    const context = useContext(OsTabsContext)
    if (!context) {
        throw new Error('useOsTabs must be used within OsTabsProvider')
    }
    return context
}

interface OsTabsProviderProps {
    children: ReactNode
    defaultOs?: OsType
}

export function OsTabsProvider({ children, defaultOs = 'mac' }: OsTabsProviderProps) {
    const [activeOs, setActiveOs] = useState<OsType>(defaultOs)

    return (
        <OsTabsContext.Provider value={{ activeOs, setActiveOs }}>
            {children}
        </OsTabsContext.Provider>
    )
}

interface OsTabButtonsProps {
    rightContent?: ReactNode
}

export function OsTabButtons({ rightContent }: OsTabButtonsProps) {
    const { activeOs, setActiveOs } = useOsTabs()

    return (
        <div className="os-tabs-header">
            <div className="flex">
                {osTabs.map((tab) => (
                    <button
                        key={tab.os}
                        onClick={() => setActiveOs(tab.os)}
                        className={`os-tabs-button ${
                            activeOs === tab.os
                                ? 'os-tabs-button-active'
                                : 'os-tabs-button-inactive'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            {rightContent}
        </div>
    )
}

interface OsTabsPanelProps {
    mac: ReactNode
    windows: ReactNode
}

export function OsTabsPanel({ mac, windows }: OsTabsPanelProps) {
    const { activeOs } = useOsTabs()
    return <>{activeOs === 'mac' ? mac : windows}</>
}
