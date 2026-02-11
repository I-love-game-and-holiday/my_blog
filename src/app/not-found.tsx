import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ページが見つかりません',
    description: 'お探しのページは存在しないか、移動した可能性があります。',
}

export default function NotFound() {
    return (
        <div className="container flex flex-col items-center justify-center py-section-static text-center">
            <p className="text-7xl font-bold text-muted-foreground/50">
                404
            </p>
            <h1 className="mt-4 text-xl font-semibold">
                ページが見つかりません
            </h1>
            <p className="mt-2 text-muted-foreground">
                お探しのページは存在しないか、移動した可能性があります。
            </p>
            <Link
                href="/"
                className="mt-8 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
                トップページへ戻る
            </Link>
        </div>
    )
}
