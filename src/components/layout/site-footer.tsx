import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="border-t border-border">
            <div className="container py-8">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span>
                        &copy; {new Date().getFullYear()}{' '}
                        <Link
                            href="/about"
                            className="hover:text-foreground transition-colors"
                        >
                            tanaka101
                        </Link>
                    </span>
                    <Link
                        href="/privacy"
                        className="hover:text-foreground transition-colors"
                    >
                        プライバシーポリシー
                    </Link>
                    <Link
                        href="https://x.com/tanaka101com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                    >
                        X (Twitter)
                    </Link>
                </div>
            </div>
        </footer>
    )
}
