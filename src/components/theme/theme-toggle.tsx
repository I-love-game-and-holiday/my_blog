'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                aria-label="テーマを切り替え"
            >
                <Sun className="h-5 w-5 text-foreground/60" />
            </button>
        )
    }

    const cycleTheme = () => {
        if (theme === 'system') {
            setTheme('light')
        } else if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('system')
        }
    }

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="テーマを切り替え"
            title={theme === 'system' ? 'システム設定' : theme === 'light' ? 'ライト' : 'ダーク'}
        >
            {theme === 'system' && <Monitor className="h-5 w-5 text-foreground/60" />}
            {theme === 'light' && <Sun className="h-5 w-5 text-foreground/60" />}
            {theme === 'dark' && <Moon className="h-5 w-5 text-foreground/60" />}
        </button>
    )
}
