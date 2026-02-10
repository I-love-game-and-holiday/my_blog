'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = [
    { name: 'Learn', href: '/learn' },
    { name: 'Guides', href: '/guides' },
    { name: 'Blog', href: '/blog' },
    { name: 'Dictionary', href: '/dictionary' },
]

export function SiteHeader() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <header className="sticky top-0 z-(--z-header) w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-(--header-height) items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">tanaka101</span>
                </Link>

                <nav className="flex items-center space-x-6">
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
            </div>
        </header>
    )
}
