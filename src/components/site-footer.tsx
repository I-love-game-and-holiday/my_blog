import Link from 'next/link'

export function SiteFooter() {
    return (
        <footer className="border-t border-border">
            <div className="container py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        {new Date().getFullYear()} tanaka101
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="https://x.com/utu_engineer_"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            X (Twitter)
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
