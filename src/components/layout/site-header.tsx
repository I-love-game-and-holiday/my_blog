'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'

const navigation = [
    { name: 'Learn', href: '/learn' },
    { name: 'Guides', href: '/guides' },
    { name: 'Dictionary', href: '/dictionary' },
    { name: 'Blog', href: '/blog' },
]

/** スマホ用メニューの要素id（開閉ボタンの aria-controls で参照する） */
const MOBILE_MENU_ID = 'mobile-menu'

export function SiteHeader() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // メニューを開いた時点のパス。ブラウザバックなどリンク以外の遷移でも閉じるために使う
    const [menuPathname, setMenuPathname] = useState(pathname)
    const headerRef = useRef<HTMLElement>(null)
    const menuButtonRef = useRef<HTMLButtonElement>(null)

    // ページが変わったらメニューを閉じる（描画中にstateを合わせる。effectで閉じると一瞬開いたまま描画される）
    if (menuPathname !== pathname) {
        setMenuPathname(pathname)
        setIsMenuOpen(false)
    }

    // 開いている間だけ、Escキーとメニュー外のクリックで閉じる
    useEffect(() => {
        if (!isMenuOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            setIsMenuOpen(false)
            menuButtonRef.current?.focus()
        }
        const handlePointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('pointerdown', handlePointerDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [isMenuOpen])

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    // 現在のページと同じリンクを押した時はパスが変わらないため、ここでも閉じる
    const handleNavClick = () => {
        setIsMenuOpen(false)
    }

    return (
        <header ref={headerRef} className="sticky top-0 z-(--z-header) w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-(--header-height) items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-xl">tanaka101</span>
                </Link>

                {/* PC用ナビゲーション（md以上） */}
                <nav aria-label="メインメニュー" className="hidden md:flex items-center space-x-6">
                    <ThemeToggle />
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(item.href) ? 'page' : undefined}
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

                {/* スマホ用の操作ボタン（md未満） */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        ref={menuButtonRef}
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md hover:bg-accent transition-colors"
                        aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                        aria-expanded={isMenuOpen}
                        aria-controls={MOBILE_MENU_ID}
                    >
                        {isMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* スマホ用のドロップダウンメニュー */}
            {isMenuOpen && (
                <nav id={MOBILE_MENU_ID} aria-label="メインメニュー" className="md:hidden border-t border-border bg-background">
                    <div className="container py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                aria-current={isActive(item.href) ? 'page' : undefined}
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
