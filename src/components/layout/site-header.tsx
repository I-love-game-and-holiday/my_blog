'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = [
    { name: 'Learn', href: '/learn' },
    { name: 'Guides', href: '/guides' },
    { name: 'Blog', href: '/blog' },
    { name: 'Dictionary', href: '/dictionary' },
]

export function SiteHeader() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const handleNavClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-(--z-header) w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-(--header-height) items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">tanaka101</span>
                </Link>

                {/* Desktop nav (md and above) */}
                <nav className="hidden md:flex items-center space-x-6">
                    <ThemeToggle />
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                                isActive(item.href)
                                    ? 'text-foreground'
                                    : 'text-foreground/60'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile controls (below md) */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md hover:bg-accent transition-colors"
                        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {isMenuOpen && (
                <nav className="md:hidden border-t border-border bg-background">
                    <div className="container py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-secondary text-foreground'
                                        : 'text-foreground/60 hover:bg-secondary/50 hover:text-foreground'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    )
}
